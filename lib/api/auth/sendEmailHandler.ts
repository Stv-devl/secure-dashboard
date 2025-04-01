import { NextResponse } from 'next/server';
import { prisma } from '../../prisma';
import { sendResetEmail } from '../../utils/fileOperations/sendRestEmail';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { rateLimitMiddleware } from '../middleware/rateLimitMiddleware';
import { corsMiddleware } from '../middleware/corsMiddleware';
import { sendEmailSchema } from '../../shema/sendEmailShema';
import { handleError } from '../../utils/errors/handleError';

export async function sendEmailHandler(req: Request) {
  try {
    const corsResponse = corsMiddleware(req);
    if (corsResponse) return corsResponse;

    const rateLimitResponse = await rateLimitMiddleware({
      limit: 3,
      ttl: 60000,
    });
    if (rateLimitResponse) return rateLimitResponse;

    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const parsed = sendEmailSchema.safeParse(email);
    if (!parsed.success) {
      return handleError(
        400,
        parsed.error.issues[0]?.message || 'Invalid input data'
      );
    }

    const normalizedEmail = parsed.data.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({
        message: 'If an account exists, an email has been sent.',
      });
    }

    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(rawToken, 10);
    const expires = new Date(Date.now() + 30 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: hashedToken,
        expires,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_ORIGIN}/reset-password?token=${rawToken}`;
    await sendResetEmail(email, resetLink);

    return NextResponse.json({ message: 'Email sent' });
  } catch (err) {
    console.error('send email', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

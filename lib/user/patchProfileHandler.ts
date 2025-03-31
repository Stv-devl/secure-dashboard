import { profileSchema } from '../shema/profileShema';
import { handleError } from '../utils/errors/handleError';
import { extractUpdatedFields } from '../utils/fileOperations/extractUpdatedFields';
import { nextAuthValidateCsrf } from '../utils/security/nextAuthValidateCsrf';
import { securityHeaders } from '../utils/security/securityHeaders';
import { validateContentType } from '../utils/security/validateContentType';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

interface HandlerContext {
  requestUserId: string;
  prisma: PrismaClient;
}
interface UserProfile {
  firstname: string;
  lastname: string;
  email: string;
  subscription: string;
  subscriptionId: string;
}

export async function patchProfileHandler(
  request: Request,
  context: HandlerContext
): Promise<NextResponse> {
  try {
    const { requestUserId, prisma } = context;

    if (!nextAuthValidateCsrf(request)) {
      console.log('Invalid CSRF token');
      return handleError(403, 'Invalid CSRF token');
    }

    if (
      !validateContentType(request, ['application/json', 'multipart/form-data'])
    ) {
      return handleError(400, 'Unsupported Content-Type');
    }

    const user = await prisma.user.findUnique({
      where: { id: requestUserId },
      include: {
        profile: true,
        credentials: true,
      },
    });

    if (!user) return handleError(404, 'User not found');

    const formData = await request.formData();
    const updatedFields: Partial<UserProfile> = extractUpdatedFields(formData);

    const parsedData = profileSchema.partial().safeParse(updatedFields);
    if (!parsedData.success) {
      return handleError(400, 'Invalid input data');
    }

    if (Object.keys(updatedFields).length === 0) {
      return handleError(400, 'No changes detected');
    }

    const profileUpdates: Record<string, any> = {};
    let emailUpdate: string | undefined = undefined;

    for (const [key, value] of Object.entries(updatedFields)) {
      if (key === 'email') {
        emailUpdate = value as string;
      } else {
        profileUpdates[key] = value;
      }
    }

    await prisma.$transaction(async (tx: PrismaClient) => {
      if (emailUpdate) {
        await tx.user.update({
          where: { id: requestUserId },
          data: { email: emailUpdate },
        });
      }

      if (Object.keys(profileUpdates).length > 0) {
        await tx.profile.update({
          where: { id: requestUserId },
          data: profileUpdates,
        });
      }
    });

    return NextResponse.json(
      {
        message: 'Profile updated successfully',
        updatedData: updatedFields,
      },
      {
        status: 200,
        headers: securityHeaders,
      }
    );
  } catch (error) {
    console.error('Internal server error:', error);
    return handleError(500, 'Server error');
  }
}

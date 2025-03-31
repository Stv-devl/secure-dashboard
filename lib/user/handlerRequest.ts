import { authMiddleware } from '../api/middleware/authMiddleware';
import { corsMiddleware } from '../api/middleware/corsMiddleware';
import { rateLimitMiddleware } from '../api/middleware/rateLimitMiddleware';
import { handleError } from '../utils/errors/handleError';
import { NextResponse } from 'next/server';
import { patchProfileHandler } from './patchProfileHandler';
import { userHandler } from './userHandler';
import { prisma } from '../prisma';

export const runtime = 'nodejs';

/**
 * Handles incoming requests and routes them to the appropriate handler.
 * @param request - The HTTP request object
 * @returns A Promise resolving to the NextResponse object
 */
export async function handlerRequests(request: Request): Promise<NextResponse> {
  try {
    const corsResponse = corsMiddleware(request);
    if (corsResponse) return corsResponse;

    const rateLimitResponse = await rateLimitMiddleware({
      limit: 10,
      ttl: 10000,
    });
    if (rateLimitResponse) return rateLimitResponse;

    const authResponse = await authMiddleware();
    if (authResponse instanceof NextResponse) return authResponse;

    const { userId } = authResponse;

    const requestUserId = new URL(request.url).searchParams.get('userId');
    if (!requestUserId) return handleError(400, 'User ID is required');

    if (typeof requestUserId !== 'string' || requestUserId.length < 10) {
      return handleError(400, 'Invalid user ID format');
    }

    if (requestUserId !== userId) {
      return handleError(403, 'Forbidden access');
    }

    const context = {
      prisma,
      requestUserId,
    };

    switch (request.method) {
      case 'GET':
        return userHandler(context);
      case 'PATCH':
        return patchProfileHandler(request, context);
      default:
        return handleError(405, `Method ${request.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Internal server error:', error);
    return handleError(500, 'Server error');
  }
}

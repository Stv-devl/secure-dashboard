import { z } from 'zod';

export const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
  token: z.string().min(1, 'Token required'),
  password: z
    .string()
    .min(4, 'The password must contain at least 4 characters'),
});

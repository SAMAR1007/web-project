import { z } from 'zod';

export const registerDTO = z.object({
  body: z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      phoneNumber: z.string().min(7),
      password: z.string().min(6),
      confirmPassword: z.string().min(6),
      role: z.enum(['user', 'admin']).optional(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const loginDTO = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

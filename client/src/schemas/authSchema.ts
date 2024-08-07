/* eslint-disable no-magic-numbers */
import z from 'zod';

export const ROLE = Object.freeze({ USER: 'USER', ADMIN: 'ADMIN' });
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const newUserInputSchema = z.object({
  email: z.string().email({ message: '*Envalid email' }),
  username: z
    .string()
    .min(1, { message: '*Username must contain atleast 1 character!' })
    .max(10, { message: '*Username must contain atmost 10 characters!' }),
  password: z
    .string()
    .min(6, { message: '*Password must contain atleast 6 character(s)!' })
    .max(8, { message: '*Password must contain at most 8 character(s)!' })
    .refine(
      (password) => {
        const digitRegex = /\d/;
        const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
        return digitRegex.test(password) && symbolRegex.test(password);
      },
      { message: '*Password must contain atleast one symbol and digit!' }
    ),
  role: z.enum(getValues(ROLE)).optional(),
  actionType: z.enum(['GENERATE', 'VERIFY']).optional(),
  enteredOTP: z
    .string()
    .length(6, { message: '*OTP must contain exatly 6 characters!' })
    .optional(),
});

export const signInUserInputSchema = z.object({
  username: z
    .string()
    .min(1, { message: '*Username must contain atleast 1 character!' }),
  password: z
    .string()
    .min(6, { message: '*Password must contain atleast 6 character(s)!' })
    .max(8, { message: '*Password must contain at most 8 character(s)!' })
    .refine(
      (password) => {
        const digitRegex = /\d/;
        const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
        return digitRegex.test(password) && symbolRegex.test(password);
      },
      { message: '*Password must contain atleast one symbol and digit!' }
    ),
});

export const resetInputSchema = z.object({
  email: z.string().email({ message: '*Envalid email' }).optional(),
  password: z
    .string()
    .min(6, { message: '*Password must contain atleast 6 character(s)!' })
    .max(8, { message: '*Password must contain at most 8 character(s)!' })
    .refine(
      (password) => {
        const digitRegex = /\d/;
        const symbolRegex = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/;
        return digitRegex.test(password) && symbolRegex.test(password);
      },
      { message: '*Password must contain atleast one symbol and digit!' }
    )
    .optional(),
  action: z.enum(['RESET', 'EMAIL']).optional(),
  authToken: z.string().optional(),
});

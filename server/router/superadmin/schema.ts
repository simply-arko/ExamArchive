/* eslint-disable newline-per-chained-call */
/* eslint-disable no-magic-numbers */
import z from 'zod';

import { ROLE } from '../../constants/constants/auth';

export const addInputSchema = z.object({
  email: z.string().email(),
  username: z.string().min(1).max(20),
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]),
  instituteName: z.string().trim().toLowerCase().min(5).max(200),
});

export const removeInputSchema = z.object({
  email: z.string().email(),
  username: z.string().max(20),
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]),
});

export const addInsitituteNameInputSchema = z.object({
  instituteName: z.string().trim().toLowerCase().min(5).max(200),
});

export const getInputSchema = z.object({
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]),
});

export const updateSchema = z.object({
  role: z.enum([ROLE.ADMIN, ROLE.SUPERADMIN]).optional(),
});

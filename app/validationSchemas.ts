import { z } from 'zod';

export const createSchoolSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  location: z.string()
});

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  surname: z.string().min(1, 'Surname is required.').max(191),
  birthdate: z.date().min(new Date('1900-01-01'), 'Invalid birthdate.').max(new Date(), 'Invalid birthdate.'),
  email: z.string().email('Invalid email.').max(191),
  phone: z.string().max(191),
  schoolid: z.number().int().positive('Invalid school id.')
});

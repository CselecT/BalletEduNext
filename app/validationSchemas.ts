import { z } from 'zod';


export const createSchoolSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  location: z.string()
});

export const createStudentSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  surname: z.string().min(1, 'Surname is required.').max(191),
  schoolid: z.coerce.number().int().positive('Invalid school id.'),
  birthdate: z.string(),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  phone: z.string().max(191),
});

export const createTeacherSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  surname: z.string().min(1, 'Surname is required.').max(191),
  schoolid: z.coerce.number().int().positive('Invalid school id.'),
  birthdate: z.string(),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  phone: z.string().max(191),
});
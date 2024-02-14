import { z } from 'zod';


export const createSchoolSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  location: z.string(),
  password: z.string().min(1, 'Password is required.').max(191),
  username: z.string().min(1, 'Username is required.').max(191),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
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

export const createJurySchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  surname: z.string().min(1, 'Surname is required.').max(191),
  birthdate: z.string(),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
  phone: z.string().max(191),
  password: z.string().min(1, 'Password is required.').max(191),
  username: z.string().min(1, 'Username is required.').max(191),
});

export const createUserSchema = z.object({
  username: z.string().min(1, 'Username is required.').max(191),
  password: z.string().min(1, 'Password is required.').max(191),
  name: z.string().min(1, 'Name is required.').max(191),
  surname: z.string().min(1, 'Surname is required.').max(191),
  role: z.string().min(1, 'Role is required.').max(191),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email."),
});

export const createExamSchema = z.object({
  videolink: z.string().min(1, 'Video Link is required.').max(191),
  schoolid: z.coerce.number().int().positive('Invalid school id.'),
  students: z.array(z.coerce.number().int().positive('Invalid student id.')).min(1, 'At least one student is required.'),
  teacherid: z.number().int().positive('Invalid teacher id.').min(1, 'Teacher is required.'),
  juryid: z.number().int().positive('Invalid teacher id.').min(1, 'Jury is required.'),
  level: z.string().min(1, 'Level is required.'),
  date: z.string(),
});
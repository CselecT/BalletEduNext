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

export const patchSchoolSchema = z.object({
  schoolid: z.coerce.number().int().positive('Invalid school id.').optional(),
  name: z.string().min(1, 'Name is required.').max(191).optional(),
  location: z.string().optional(),
  password: z.string().min(1, 'Password is required.').max(191).optional(),
  username: z.string().min(1, 'Username is required.').max(191).optional(),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.").optional(),
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

export const patchStudentSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191).optional(),
  surname: z.string().min(1, 'Surname is required.').max(191).optional(),
  studentid: z.coerce.number().int().positive('Invalid student id.'),
  birthdate: z.string().optional(),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.").optional(),
  phone: z.string().max(191).optional(),
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

export const patchTeacherSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191).optional(),
  surname: z.string().min(1, 'Surname is required.').max(191).optional(),
  teacherid: z.coerce.number().int().positive('Invalid teacher id.'),
  birthdate: z.string().optional(),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.").optional(),
  phone: z.string().max(191).optional(),
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

export const patchJurySchema = z.object({
  juryid: z.coerce.number().int().positive('Invalid jury id.'),
  name: z.string().min(1, 'Name is required.').max(191).optional(),
  surname: z.string().min(1, 'Surname is required.').max(191).optional(),
  birthdate: z.string().optional(),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.").optional(),
  phone: z.string().max(191).optional(),
  password: z.string().min(1, 'Password is required.').max(191).optional(),
  username: z.string().min(1, 'Username is required.').max(191).optional(),
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

export const patchPasswordSchema = z.object({
  password: z.string().max(191).optional(),
  newPassword: z.string().min(1, 'New Password is required.').max(191),
  confirmPassword: z.string().min(1, 'Confirmation is required.').max(191),
  ignorePassword: z.boolean().optional(),
}).refine(
  (values) => {
    return values.newPassword === values.confirmPassword;
  },
  {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  }
).refine(
  (values) => {
    return values.ignorePassword || values.password;
  },
  {
    message: "Old Password is required!",
    path: ["confirmPassword"],
  }
);

export const patchUserSchema = z.object({
  // userid: z.coerce.number().int().positive('Invalid user id.'),
  username: z.string().min(1, 'Username is required.').max(191).optional(),
  password: z.string().min(1, 'Password is required.').max(191).optional(),
  name: z.string().min(1, 'Name is required.').max(191).optional(),
  surname: z.string().min(1, 'Surname is required.').max(191).optional(),
  role: z.string().min(1, 'Role is required.').max(191),
  email: z.string()
    .min(1, { message: "This field has to be filled." })
    .email("This is not a valid email.").optional(),
  location: z.string().optional(),
  birthdate: z.string().optional(),
  phone: z.string().max(191).optional(),
});

export const createExamSchema = z.object({
  videolink: z.string().max(191).optional(),
  schoolid: z.coerce.number().int().positive('Invalid school id.'),
  students: z.array(z.coerce.number().int().positive('Invalid student id.')).min(1, 'At least one student is required.'),
  teacherid: z.number().int().positive('Invalid teacher id.').min(1, 'Teacher is required.'),
  juryid: z.number().int().positive('Invalid teacher id.').min(1, 'Jury is required.'),
  level: z.string().min(1, 'Level is required.'),
  date: z.string(),
});

export const patchExamSchema = z.object({
  videolink: z.string().min(1, 'Video Link is required.').max(191).optional(),
  schoolid: z.coerce.number().int().positive('Invalid school id.').optional(),
  students: z.array(z.coerce.number().int().positive('Invalid student id.')).min(1, 'At least one student is required.').optional(),
  teacherid: z.number().int().positive('Invalid teacher id.').min(1, 'Teacher is required.').optional(),
  juryid: z.number().int().positive('Invalid teacher id.').min(1, 'Jury is required.').optional(),
  level: z.string().min(1, 'Level is required.').optional(),
  date: z.string().optional(),
  examid: z.coerce.number().int().positive('Invalid exam id.').min(1, 'Exam is required.'),
});

export const patchEvaluationSchema = z.object({
  eval: z.string().optional(),
  evalTranslation: z.string().optional(),
  marking: z.number().optional(),
  evalid: z.coerce.number().int().positive('Invalid evaluation id id.').min(1, 'Evaluation is required.'),
  confirmDate: z.string().optional(),
});

export const evaluationSchema = z.object({
  studentid: z.coerce.number().int().positive('Invalid student id.').min(1, 'Student is required.'),
  eval: z.string().min(1, 'Evaluation is required.').max(250, 'Evaluation cannot be longer than 250 characters'),
  evalTranslation: z.string().optional(),
  marking: z.number().min(0, 'Marking cannot be negative.').max(100, 'Marking cannot be more than 100.')
});

export const evaluateExamSchema = z.object({
  evals: evaluationSchema.array().nonempty(),
  examEval: z.string().min(1, 'Exam Evaluation is required.'),
  examId: z.number(),
});

export const translationSchema = z.object({
  evalid: z.coerce.number().int().positive('Invalid eval id.').min(1, 'Eval is required.'),
  evalTranslation: z.string().min(1, 'Evaluation is required.').max(250, 'Evaluation cannot be longer than 250 characters'),
});

export const translateExamSchema = z.object({
  translations: translationSchema.array().nonempty(),
  examEvalTranslation: z.string().min(1, 'Exam Evaluation is required.'),
  examId: z.number(),
});


export const createEvaluationSchema = z.object({
  eval: z.string().min(1, 'Evaluation is required.').max(250, 'Evaluation cannot be longer than 250 characters'),
  evalTranslation: z.string().optional(),
  marking: z.number().min(0, 'Marking cannot be negative.').max(100, 'Marking cannot be more than 100.'),
  examid: z.coerce.number().int().positive('Invalid exam id.').min(1, 'Exam is required.'),
  studentid: z.coerce.number().int().positive('Invalid student id.').min(1, 'Student is required.'),
});
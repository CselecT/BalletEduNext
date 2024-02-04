import { z } from 'zod';

export const createSchoolSchema = z.object({
  name: z.string().min(1, 'Name is required.').max(191),
  location: z.string()
});

import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});


export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(6,{
    message: "Password is required",
  }),
  name:z.string().min(1,{
    message:"Name is required"
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6,{
    message: "Minimum of 6 characters are required",
  })
});

export const CreateAccSchema = z.object({
  accountId:z.string(),
  username: z.string().min(1, { message: 'Username is required' }).max(255),
  linkedinLink: z.string().optional(),
  githubLink: z
    .string()
    .min(20, { message: 'Github Link should be provided' })
    .max(255),
  profileImage: z
    .string().optional(),
    // .min(1, { message: 'Profile photo is required' })
    // .max(255),
  banner: z.string().optional(),
})

export const ProjectSchema = z.object({
  lang:z.string(),
  pname:z.string().min(1, { message: 'project name is required' }).max(255),
  pdescp: z.string(),
})
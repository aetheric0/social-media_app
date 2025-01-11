import * as z from "zod"

export const SignupValidation = z.object({
    firstName: z.string().min(2, { message: 'First name is required' }),
    lastName: z.string().min(2, { message: 'Last name is required.' }),
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
  })

  export const SigninValidation = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(50),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    })


    export const PostValidation = z.object({
      caption: z.string().min(5, {message: "Minimum 5 characters."}).max(2200, { message: "Maximum 2,200 characters"}),
      file: z.custom<File[]>(),
      location: z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 100 characters."}),
      tags: z.string(),
    });
import * as z from "zod"

export const SignupValidation = z.object({
    firstName: z.string().min(2, { message: 'Too short.' }),
    lastName: z.string().min(2, { message: 'Too short.' }),
    username: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
  })

  export const SigninValidation = z.object({
    username: z.string().min(2).max(50),
    password: z.string().min(8, { message: 'Password must be at least 8 characters.' })
    })
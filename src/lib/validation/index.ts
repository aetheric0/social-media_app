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
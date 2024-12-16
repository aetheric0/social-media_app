import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import {
  Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "../../lib/validation";
import Loader from "../../components/ui/shared/Loader";
import { Link } from "react-router-dom";




const SignupForm = () => {
  const isLoading = false;
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    }
  })

  const createDefaultAvatar = (firstName: string, lastName: string) => {
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}`;

  }

  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    // create the user
    //  const newUser = await createUserAccount(values);
    try {
      const avatarUrl = createDefaultAvatar(values.firstName, values.lastName);
      const newUser = {...values, imageUrl: avatarUrl};
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        newUser
      );
      console.log("User created successfully:", response.data);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  }
  
  
  return (
       <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/images/logo4.png" alt="logo" />

          <h2 className="h3-bold md:h2-bold pt5 sm:pt-12">Create a new account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">To use DevLounge Enter your details</p>

        
        
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
            <FormField 
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name </FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
<FormField 
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name </FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField 
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Username </FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField 
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Email </FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

<FormField 
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel> Password </FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="shad-button_primary">
              {
                isLoading ? (
                  <div className="flex-center gap-2">
                    <Loader /> Loading...
                  </div>
                ): "Sign up"}
              </Button>
              <p className="text-small-regular text-light-2 text-center mt-2"> Already have an account ? <Link to="/sign-in" className="text-primary-500 text-samll-semibold ml-1">Log in</Link></p>
          </form>
        </div>

       </Form>
  )
}

export default SignupForm

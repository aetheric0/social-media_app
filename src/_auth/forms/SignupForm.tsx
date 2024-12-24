import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import TextInput from "./TextInput";
import { Button } from "../../components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "../../lib/validation";
import Loader from "../../components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
//import { useState } from "react";
import { Form } from "../../components/ui/form";
import { useToast } from '../../hooks/use-toast';
import { ToastAction } from "../../components/ui/toast";
import { useCreateAccount } from "../../hooks/useAuthMutations";
import { useUserContext } from "../../context/AuthProvider";


const SignupForm = () => {
  const { toast } = useToast();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateAccount();
  const navigate = useNavigate();

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


  const onSubmit = async (values: z.infer<typeof SignupValidation>) => {
    // create the user
    try {
      const newUser = await createUser(values);
      if (newUser) {
        const token = newUser.data.token;
        localStorage.setItem('token', token);
        toast({title: "User created successfully!"});
        console.log("User created successfully:");
      }

      const isLoggedIn = await checkAuthUser();

      if(isLoggedIn) {
        form.reset();
        navigate('/');
      } else {
        return toast({'title': 'Sign up failed. Please try again.' });
      }

    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status == 409) {
            const errorMessage = error.response.data.message;
            if (errorMessage === 'Username already exists') {
              toast({
                title: 'The username is already taken.', 
                description: 'Please choose a different one.',
                variant: 'destructive',
              });
            } else if (errorMessage === 'Email already exists') {
              toast({
                title: 'The email is already registered.',
              });
            }
          } else {
            toast({
              title: 'Sign up failed. Please try again.',
              action: <ToastAction altText='Try again'>Try again</ToastAction>
            });
          }
        }
      } else {
        toast({
          title: 'Sign up failed. Please try again.',
          action: <ToastAction altText='Try again'>Try again</ToastAction>
        });
          console.error("Error creating user:", error);
      }
     }
  };

  return (
       <Form {...form}>
        <div className="sm:w-420 flex-center flex-col">
          <img src="/assets/images/logo4.png" alt="logo" />

          <h2 className="h3-bold md:h2-bold pt5 sm:pt-12">Create a new account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">To use DevLounge Enter your details</p>

        
        
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
            <TextInput name="firstName" label="First Name" form={form} />
            <TextInput name="lastName" label="Last Name" form={form} />
            <TextInput name="username" label="Username" form={form} />
            <TextInput name="email" label="Email" type="email" form={form} />
            <TextInput name="password" label="Password" type="password" form={form} />

            <Button type="submit" className="shad-button_primary">
              {
                isCreatingUser ? (
                  <div className="flex-center gap-2">
                    <Loader /> Loading...
                  </div>
                ): "Sign up"
              }
            </Button>
              <p className="text-small-regular text-light-2 text-center mt-2"> 
                Already have an account ? 
                <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">
                  Log in
                </Link>
              </p>
          </form>
        </div>

       </Form>
  )
}

export default SignupForm
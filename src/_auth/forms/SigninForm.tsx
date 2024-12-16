import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios";
import {
  Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import Loader from "../../components/ui/shared/Loader";
import { Button } from "../../components/ui/button"
import { useForm } from "react-hook-form"
import { SigninValidation } from "../../lib/validation";
import { Link } from "react-router-dom";


const SigninForm = () => {
  const isLoading = false;
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      username: '',
      password: '',
    }
  })

const onSubmit = async (values: z.infer<typeof SigninValidation>) => {
  // create the user
  //  const newUser = await createUserAccount(values);
  try {
    const user = {...values};
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      user
    );
    console.log("User logged in successfully:", response.data);
  } catch (error) {
    console.error("Error logging in user:", error);
  }
}

  return (
      <Form {...form}>
       <div className="sm:w-420 flex-center flex-col">
         <img src="/assets/images/logo4.png" alt="logo" />

         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12"> Login account</h2>
         <p className="text-light-3 small-medium md:base-regular mt-2">To use DevLounge Enter your details</p>

       
       
         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
           <FormField 
             control={form.control}
             name="username"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Username </FormLabel>
                 <FormControl>
                   <Input type="text" className="shad-input" {...field} />
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
                 <FormLabel>Passwword </FormLabel>
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
                ): "Login"}
              </Button>
              <p className="text-small-regular text-light-2 text-center mt-2"> Need an Account ? <Link to="/sign-up" className="text-primary-500 text-samll-semibold ml-1">Sign up</Link></p>
          </form>
        </div>
      </Form>
    )
  }

export default SigninForm;
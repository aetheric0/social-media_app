import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import TextInput from "./TextInput";
import Loader from "../../components/ui/shared/Loader";
import { Button } from "../../components/ui/button"
import { useForm } from "react-hook-form"
import { SigninValidation } from "../../lib/validation";
import { Link } from "react-router-dom";
import { Form } from "../../components/ui/form";
import { useToast } from '../../hooks/use-toast';
import { ToastAction } from "../../components/ui/toast";
import { useSigninAccount } from "../../hooks/useAuthMutations";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/AuthProvider";


const SigninForm = () => {
  const { toast } = useToast();
  const { mutateAsync: signinAccount, isPending: isSigningIn } = useSigninAccount();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

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
    const session = await signinAccount({
      username: values.username,
      password: values.password,
    });
    if (session) {
      toast({title: 'Logged in'})
      console.log("User logged in successfully:");
    }
    const isLoggedIn = await checkAuthUser();

      if(isLoggedIn) {
        form.reset();
        navigate('/');
      } else {
        return toast({'title': 'Sign up failed. Please try again.' });
      }

  } catch (error) {
    toast({
      title: "Sign in failed. Please try again", 
      variant: 'destructive',
      action: <ToastAction altText='Try again'>Try again</ToastAction>,
    });
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
         <TextInput name="username" label="Username" form={form} />
         <TextInput name="password" label="Password" type="password" form={form} />
         <Button type="submit" className="shad-button_primary">
            {
              isSigningIn ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ): "Login"
            }
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2"> Need an Account ? <Link to="/sign-up" className="text-primary-500 text-samll-semibold ml-1">Sign up</Link></p>
        </form>
        </div>
      </Form>
    )
  }

export default SigninForm;
"use client";
import axios from "axios";
import { CardWrapper } from "@/components/auth/card-wrapper"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { LoginSchema } from "@/schema";
import {  useEffect, useState, useTransition } from "react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {FormError} from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

export const LoginForm = () =>{
    const searchParams = useSearchParams();
    const urlError = searchParams.get("error") ==="OAuthAccountNotLinked"?"Email Already use with different provider":"";
    const session = useSession();
    const router = useRouter();

    const [showTwoFactor,setShowTwoFactor] = useState(false);
    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState <string | undefined>("");
    const [success,setSuccess] = useState <string | undefined>("");
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver:zodResolver(LoginSchema),
        defaultValues:{
            email: "",
            password: "",
        },
    });
    useEffect(()=>{
if(session?.data?.user){
        router.push("/settings")
    }
    },[router,session])
    


    const onSubmit = (values: z.infer<typeof LoginSchema>)=>{
        setError("");
        setSuccess("");
        startTransition(()=>{
            axios.post('/api/auth/login',values).then((response)=>{
                if(response?.data.error){
                    form.reset();
                    setError(response.data.error);
                }
                if(response?.data.success && !response?.data.twoFactor){
                    form.reset();
                    setSuccess(response.data.success);
                }
                if(response?.data.success){
                    form.reset();
                    setSuccess(response.data.success);
                }

                if(response?.data.twoFactor){
                    setShowTwoFactor(true);
                }
            }).catch((error)=>{
                setError(error.response.data.error)
            })


            
        })
    }



    return(
        <CardWrapper 
        headerLabel="Welcome back"
        backButtonHref="/auth/register"
        backButtonLabel="Don't have an account?"
        showSocial >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
                    {showTwoFactor&&(
                         <FormField
                        control={form.control}
                        name="code"
                        render={({field}) => {
                            return (<FormItem>
                                <FormLabel>Two Factor Code:</FormLabel>
                                <FormControl>
                                    <Input {...field}
                                        disabled={isPending}
                                        placeholder="123456"
                                        type="text" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>);
                        }}
                        />
                    )}


                    {!showTwoFactor&&(
                        <>
                        <FormField
                        control={form.control}
                        name="email"
                        render={({field}) => {
                            return (<FormItem>
                                <FormLabel>Email:</FormLabel>
                                <FormControl>
                                    <Input {...field}
                                        disabled={isPending}
                                        placeholder="johndoe@gmail.com"
                                        type="email" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>);
                        }}
                        />
                        <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => {
                            return (<FormItem>
                                <FormLabel>Password:</FormLabel>
                                <FormControl>
                                    <Input {...field}
                                        disabled={isPending}
                                        placeholder="*********" 
                                        type="password"/>
                                </FormControl>
                                <Button
                                size="sm"
                                variant="link"
                                asChild
                                className="px-0 font-normal">
                                    <Link href="/auth/reset">
                                        Forgot Password?
                                    </Link>
                                </Button>
                                <FormMessage />
                            </FormItem>);
                        }}
                        />
                    </>
                    )
                    }
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} type="submit" className="w-full">
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
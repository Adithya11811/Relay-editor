"use client";
import axios from "axios";
import { CardWrapper } from "@/components/auth/card-wrapper"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { NewPasswordSchema } from "@/schema";
import { useState, useTransition } from "react";
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
import { useSearchParams } from "next/navigation";

export const NewPasswordForm = () =>{
    const [isPending,startTransition] = useTransition();
    
    const searchParams = useSearchParams();
    
    const [error,setError] = useState <string | undefined>("");
    
    const [success,setSuccess] = useState <string | undefined>("");
    
    const token = searchParams.get("token");
    
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver:zodResolver(NewPasswordSchema),
        defaultValues:{
            password: "",
        },
    });
    const onSubmit = (values: z.infer<typeof NewPasswordSchema>)=>{
        console.log(values);
        setError("");
        setSuccess("");
        startTransition(()=>{
            axios.post('/api/auth/new-password',{password:values.password,token:token}).then((data)=>{
                console.log(data);
                setSuccess(data.data.success)
                setError(data.data.error)
            }).catch((error)=>{
                setError(error.response.data.error);
            })
        })
    }


    return(
        <CardWrapper 
        headerLabel="Enter a new password"
        backButtonHref="/auth/login"
        backButtonLabel="Back to login"
        >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6">
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => {
                            return (<FormItem>
                                <FormLabel>Password:</FormLabel>
                                <FormControl>
                                    <Input {...field}
                                        disabled={isPending}
                                        placeholder="******"
                                        type="password" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>);
                        }}
                        />

                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                    disabled={isPending} type="submit" className="w-full">
                        Reset Password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
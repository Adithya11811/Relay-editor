"use client";
import axios from "axios";
import { CardWrapper } from "@/components/auth/card-wrapper"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { RegisterSchema } from "@/schema";
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

export const RegisterForm = () =>{
    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState <string | undefined>("");
    const [success,setSuccess] = useState <string | undefined>("");
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver:zodResolver(RegisterSchema),
        defaultValues:{
            email: "",
            password: "",
            name:"",
        },
    });
    const onSubmit = (values: z.infer<typeof RegisterSchema>)=>{
        setError("");
        setSuccess("");
        startTransition(()=>{
            axios.post('/api/auth/register',values).then((data)=>{
                console.log(data);
                setSuccess(data.data.success)
            }).catch((error)=>{
                setError(error.response.data.error)
            })
        })
    }


    return(
        <CardWrapper 
        headerLabel="Create an account"
        backButtonHref="/auth/login"
        backButtonLabel="Already have an account?"
        showSocial >
            <Form {...form}>
                <form 
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2">
                    <div className="space-y-4">
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
                        name="name"
                        render={({field}) => {
                            return (<FormItem>
                                <FormLabel>Name:</FormLabel>
                                <FormControl>
                                    <Input {...field}
                                        disabled={isPending}
                                        placeholder="John Doe" 
                                        type="text"/>
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
                                <FormMessage />
                            </FormItem>);
                        }}
                        />
                        </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button disabled={isPending} type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
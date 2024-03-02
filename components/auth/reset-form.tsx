"use client";
import axios from "axios";
import { CardWrapper } from "@/components/auth/card-wrapper"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import { ResetSchema } from "@/schema";
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

export const ResetForm = () =>{
    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState <string | undefined>("");
    const [success,setSuccess] = useState <string | undefined>("");
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver:zodResolver(ResetSchema),
        defaultValues:{
            email: "",
        },
    });
    const onSubmit = (values: z.infer<typeof ResetSchema>)=>{
        console.log(values);
        setError("");
        setSuccess("");
        startTransition(()=>{
            axios.post('/api/auth/reset',values).then((data)=>{
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
        headerLabel="Forgot Password?"
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

                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                    disabled={isPending} type="submit" className="w-full">
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}
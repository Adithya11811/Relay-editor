"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import axios from "axios";
import {  useSearchParams,useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {BeatLoader} from "react-spinners";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";


export const NewVerificationForm =  () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    console.log(token);
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    
    const onSubmit = useCallback(() => {
        if (success || error) return;
        if (!token) {
            setError("Missing Token");
            return;
        };

        axios.post("/api/auth/new-verification", {token:token})
            .then((response) => {
                setSuccess(response.data.success);
                setError(response.data.error);
                router.push(`/auth/createacc?user=${response.data.account.id}`)
            })
            .catch((error) => {
                console.error(error);
                setError("Something went wrong");
                
            });
    }, [success, error, token, router]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel="Verifying your email"
            backButtonHref="/auth/login"
            backButtonLabel="Back to Login"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && <BeatLoader />}
                {success && <FormSuccess message={success} />}
                {error && <FormError message={error} />}
            </div>
        </CardWrapper>
    );
};

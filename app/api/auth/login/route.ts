import { LoginSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import {signIn} from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";


export async function POST(request:NextRequest){
    const reqBody = await request.json();
    const validatedFields = LoginSchema.safeParse(reqBody);
    if(!validatedFields.success){
        return NextResponse.json({
            error:"Invalid Fields!",
            status:403
        })
    }
    const {email,password}=validatedFields.data;
    try{
        await signIn("credentials",{
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
            
        })
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return NextResponse.json({
                        error:"Invalid Credentials",
                        status:401
                    })
                default:
                    return NextResponse.json({
                        error:"Something went wrong!!",
                        status:400
                    })
            }
        }
        throw error;
    }
}
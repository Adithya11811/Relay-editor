import { LoginSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import {signIn} from "@/auth"
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { m } from "framer-motion";

export async function POST(request:NextRequest){
    const reqBody = await request.json();
    const validatedFields = LoginSchema.safeParse(reqBody);
    if(!validatedFields.success){
        return NextResponse.json({
            error:"Invalid Fields!"
        },{
            status:403
        })
    }
    const {email,password}=validatedFields.data;
    const existingUser = await getUserByEmail(email);
    if(!existingUser || !existingUser.password || !existingUser.email){
        return NextResponse.json({
            error:"Email does not exist"
        },{
            status:400
        })
    }
    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )
        return NextResponse.json({
            success:"Confirmation email sent"
        },{
            status:200
        })
    }
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
                        
                    },{
                        status:401
                    })
                default:
                    return NextResponse.json({
                        error:"Something went wrong!!",
                        
                    },{
                        status:400
                    })
            }
        }
        throw error;
    }
}
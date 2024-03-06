"use server";

import { ResetSchema } from "@/schema";
import { getUserByEmail } from "@/data/user";
import { NextRequest, NextResponse } from "next/server";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
export async function POST(request:NextRequest){
    const reqBody = await request.json();
    const validatedFields = ResetSchema.safeParse(reqBody);
    console.log(validatedFields)
    if(!validatedFields.success){
        return NextResponse.json({
            error:"Invalid email"
        },{
            status:400
        })
    }
    const {email} = validatedFields.data;
    console.log(email)
    const existingUser = await getUserByEmail(email);

    if(!existingUser){
        return NextResponse.json({
            error:"Email not found"
        },
        {
            status:400
        }
        )
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email,passwordResetToken.token);



    return NextResponse.json({
        success:"Reset email sent!",
    },{
        status:200
    })
} 
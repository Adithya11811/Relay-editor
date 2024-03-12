import { RegisterSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";


export async function POST(request:NextRequest){
    const reqBody = await request.json();
    const validatedFields = RegisterSchema.safeParse(reqBody);
    if(!validatedFields.success){
        return NextResponse.json({
            error:"Invalid Fields!",
            
        },{
            status:403
        })
    }
    const {email,password,name} = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password,10);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return NextResponse.json({
            error:"Email already in use",
            
        },{
            status:409
        })
    }

    const createdUser = await db.user.create({
        data:{
            name:name,
            email,
            password:hashedPassword
        }
    });
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
    )

    if(!createdUser){
        return NextResponse.json({
            error:"Something went wrong!!",
            
        },{
            status:500
        })
    }

    return NextResponse.json({
        success:"Confirmation email sent",
        
    },{
        status:200
    })
}
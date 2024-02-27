import { RegisterSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(request:NextRequest){
    const reqBody = await request.json();
    const validatedFields = RegisterSchema.safeParse(reqBody);
    if(!validatedFields.success){
        return NextResponse.json({
            error:"Invalid Fields!",
            status:403
        })
    }
    const {email,password,name} = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password,10);

    const existingUser = await db.user.findUnique({
        where:{
            email,
        }
    });

    if(existingUser){
        return NextResponse.json({
            error:"Email already in use",
            status:409
        })
    }

    const createdUser = await db.user.create({
        data:{
            name,
            email,
            password:hashedPassword
        }
    });


    if(!createdUser){
        return NextResponse.json({
            error:"Something went wrong!!",
            status:500
        })
    }

    return NextResponse.json({
        message:"Registration Successful",
        status:200
    })
}
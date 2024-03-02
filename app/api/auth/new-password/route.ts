"use server";

import { NextRequest, NextResponse } from "next/server";
import { getPasswordResetToken } from "@/data/password-reset-token";
import bcryptjs from "bcryptjs";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
export async function POST(request:NextRequest){

    const reqBody = await request.json();
    const password = reqBody.password;
    const token = reqBody.token;
    if(!token){
        return NextResponse.json({
            error:"Missing Token"
        },{
            status:400
        })
    }
    console.log(token);

    const existingToken = await getPasswordResetToken(token);
    if(!existingToken){
        return NextResponse.json({
            error:"Invalid token"
        },{
            status:400
        })
    }
    const hasExpired = new Date(existingToken.expires)<new Date();
    if(hasExpired){
        return NextResponse.json({
            error:"token has expired"
        },{
            status:401
        })
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser){
        return NextResponse.json({
            error:"Email not found"
        },{
            status:400
        })
    }
    const hashedPassword = await bcryptjs.hash(password,10);
    await db.user.update({
        where:{id:existingUser.id},
        data:{password:hashedPassword}
    })

    await db.passwordResetToken.delete({
        where:{id:existingToken.id}
    })
    return NextResponse.json({
        success:"Password reset successfully"
    },{
        status:200
    })
}
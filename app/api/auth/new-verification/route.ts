"use server";

import {db} from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificatonTokenByToken } from "@/data/verification-token";
import { NextResponse,NextRequest } from "next/server";

export async function POST(req:NextRequest){

    const {token} = await req.json();
    console.log(token)
    const existingToken = await getVerificatonTokenByToken(token);
    console.log(existingToken);
    if(!existingToken){
        return NextResponse.json({
            error:"Token does not exist!",
            status:403
        });
    }
    const hasExpired = new Date(existingToken.expires)<new Date();
    if(hasExpired){
        return NextResponse.json({
            error:"Token has expired",
            status:403
        });
    }
    const existingUser = await getUserByEmail(existingToken.email);
    if(!existingUser){
        return NextResponse.json({
            error:"Email does not exist",
            status:403
        })
    }
    const updatedUser = await db.user.update({
        where:{
            id:existingUser.id
        },
        data:{
            emailVerified: new Date(),
            email:existingToken.email
        }
    });
    if(!updatedUser){
        return NextResponse.json({
            error:"Something went wrong",
            status:400
        });
    }
    const isDeleted = await db.verificationToken.delete({
        where:{
            id:existingToken.id
        }
    });
    console.log(isDeleted)
    if(!isDeleted){
        return ;
    }
    const createdAccount =await db.account.create({
        data:{
            userId:updatedUser.id,
            provider:"relay-editor",
            type:"credentials",
        }
    })

    return NextResponse.json({
        success:"Verified successfully",
        account:createdAccount
    },{
        status:200
    })

}
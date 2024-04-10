import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    const {username,account,project} = await request.json();

    if(account.id!==project.creator){
        return NextResponse.json({
            error:"Cannot send the invitation as you are not owner of project"
        },{
            status:400
        })
    }
    const invitedAccount = await db.account.findFirst({
        where:{
            username:username
        }
    })
    if(!invitedAccount){
        return NextResponse.json({
            error:"Account with username does not exist"
        },{
            status:400
        })
    }
    const invited = await db.invitation.create({
        data:{
            senderId:account.id,
            recipientId:invitedAccount.id,
            projectId:project.projectId,
            status:"Not Accepted"
        }
    })
    if(!invited){
        return NextResponse.json({
            error:"Something went wrong"
        },{
            status:400
        })
    }
    return NextResponse.json({
        message:"Invitation Sent successfully"
    },{
        status:200
    })


}
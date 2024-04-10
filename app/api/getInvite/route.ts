import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request:NextRequest){
    const {id} = await request.json();

    const invitations = await db.invitation.findMany({
        where:{
            recipientId:id
        }
    })
    if(invitations.length===0){
        return NextResponse.json({
            message:"No invitations"
        },{status:200})
    }
    let invitedProjects = []
    let senders = []
    let x =0 
    for(const invite of invitations){
        const invitedProject = await db.project.findFirst({
            where:{
                projectId:invite.projectId
            }
        })

        invitedProjects[x] = invitedProject?.projectName
        const sender = await db.account.findFirst({
            where:{
                id:invite.senderId
            }
        })
        senders[x]=sender?.username
        x++;
    }


    return NextResponse.json({
        invitations,
        invitedProjects,
        senders
    })
}
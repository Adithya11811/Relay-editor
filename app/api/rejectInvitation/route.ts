import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function POST(request:NextRequest) {
    const {id} = await request.json();
    const deleted = await db.invitation.delete({
        where:{
            id:id
        }
    })
    return NextResponse.json({
        message:"Declined Successfully"
    },{
        status:200
    })
}
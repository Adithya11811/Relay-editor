"use server";

import { signOut } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest){
    console.log(request.body)
    await signOut();
    return NextResponse.json({
        success:"logout successful"
    })
}
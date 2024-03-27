import { ProjectSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, unlink } from "fs/promises"; // Use promises version of fs
import path from 'path';
import { db } from "@/lib/db";


export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const validatedFields = ProjectSchema.safeParse(reqBody);
    const cwd = process.cwd();
    if (!validatedFields.success) {
        return NextResponse.json({
            error: "Invalid Fields"
        }, {
            status: 404
        });
    }
    
    const { pname, pdescp, extension,accountId } = validatedFields.data;
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL! , process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const filePath = path.resolve(cwd, `temp/${Date.now()}.${extension}`);
    try {
        // Writing data to the file with placeholder text based on extension
        let placeholderText = '';
        switch (extension) {
            case 'py':
                placeholderText = '#Write your Python code here';
                break;
            case 'js':
                placeholderText = '// Write your JavaScript code here';
                break;
            default:
                placeholderText = '// Write your code here';
        }
        await writeFile(filePath, placeholderText);

        const bucket = "CodeFiles";
        const { data, error } = await supabase.storage.from(bucket).upload(`${Date.now()}.${extension}`,placeholderText);
        if (error) {
            return NextResponse.json({
                error: "File Upload Failed"
            }, {
                status: 400
            });
        }
        let projectType=""
        switch(extension){
            case 'py':projectType="python";break;
            case 'js':projectType="javascript";break;
            case 'ts':projectType="typescript";break;
            case 'cpp':projectType="c++";break;
            case 'c':projectType="c";break;
        }
        const projectName = pname+"."+extension
        console.log(data);
        const uploadFileInfo = await db.project.create({
            data:{
                projectDescription:pdescp,
                creator: accountId,
                projectName: projectName,
                projectId: data.id!,
                projectURL:data.path,
                projectType:projectType
            }
        })
        if(!uploadFileInfo){
            return NextResponse.json({
                error:"Somethingwent wrong"
            },{
                status:400
            })
        }
        await unlink(filePath);
        return NextResponse.json({
            message: "File uploaded successfully",
            data
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}

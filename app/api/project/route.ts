import { ProjectSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, unlink } from "fs/promises"; // Use promises version of fs
import path from 'path';
import { db } from "@/lib/db";
enum ProjectType {
  Python = 'python',
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  Cpp = 'cpp',
  C = 'c',
}


export async function POST(request:NextRequest){
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
    let bucket:string|undefined ;
    const {data,error} = await supabase.storage.createBucket(accountId)
    if(error?.message === "The resource already exists"){
        bucket = accountId
    }else{
        bucket = data?.name;
    }
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
    const folderPath = path.resolve(cwd,"temp");
    let res;
    try{
        await writeFile(`${folderPath}/main.${extension}`,placeholderText);
        const {data,error} = await supabase.storage.from(bucket!).upload(`${Date.now()}.${extension}`,placeholderText)
        res=data;
    }catch(error){
        return NextResponse.json({
            message:"Unable to create Project"
        },{
            status:400
        })
    }
    let projectType = ProjectType.JavaScript;
    switch(extension){
            case 'py': projectType = ProjectType.Python; break;
            case 'js': projectType = ProjectType.JavaScript; break;
            case 'ts': projectType = ProjectType.TypeScript; break;
            case 'cpp': projectType = ProjectType.Cpp; break;
            case 'c': projectType = ProjectType.C; break;
    }
    await unlink(`${folderPath}/main.${extension}`)
    console.log(res)
    const createdProject  = await db.project.create({
        data:{
            projectId:res?.id!,
            projectType:projectType,
            projectName:pname,
            projectDescription:pdescp,
            creator:accountId
        }
    });
    const directoryCreated = await db.directory.create({
        data:{
            name:pname,
            projectId:createdProject.projectId,
            parent:createdProject.projectId,
        }
    });
    const fileCreated = await db.files.create({
        data:{
            name:`main.${extension}`,
            belongs_to:directoryCreated.id,
            fileUrl: res?.path!
        }
    });
    if(!createdProject||!directoryCreated||!fileCreated){
        return NextResponse.json({
            error:"Project Creation Failed"
        },{
            status:4000
        })
    }
    return NextResponse.json({
        message:"Project Successfully Created",
        file:fileCreated,
        project:createdProject,
        directory:directoryCreated,
        bucket:bucket
    },{
        status:200
    });
}

import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { unlink, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(request:NextRequest){
    const {project,file_name,extension} = await request.json();
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    let bucket = project.creator;


    // Define placeholder text based on file extension
    let placeholderText = '';
    switch (extension) {
        case 'py':
            placeholderText = '# Write your Python code here';
            break;
        case 'js':
            placeholderText = '// Write your JavaScript code here';
            break;
        default:
            placeholderText = '// Write your code here';
    }


    const cwd = process.cwd();
    const folderPath = path.resolve(cwd, "temp");

    let res;
    try {
        // Write placeholder text to a temporary file
        await writeFile(`${folderPath}/main.${extension}`, placeholderText);

        // Upload the file to Supabase storage
        const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket!).upload(`${Date.now()}.${extension}`, placeholderText);
        if (uploadError) {
            throw new Error("Unable to upload file");
        }
            res = uploadData;
        } catch (error) {
            return NextResponse.json({
                message: "Unable to create file"
            }, {
                status: 400
             });
    }
     try {
        // Delete the temporary file
        await unlink(`${folderPath}/main.${extension}`);

        // Create a file entry in the database
        const fileCreated = await db.files.create({
            data: {
                name:`${file_name}.${extension}`,
                belongs_to: project.projectId, // Adjusted field name
                fileUrl: res?.path!
            }
        });        // Check if project and file creation succeeded
        if ( !fileCreated) {
            throw new Error("File creation failed");
        }

        // Return success response
        return NextResponse.json({
            message: "File successfully created",
            file: fileCreated,
            project: project,
            bucket: project.creator,
            extension:extension
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
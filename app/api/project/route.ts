import { ProjectSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { writeFile, unlink } from "fs/promises"; // Use promises version of fs
import path from 'path';
import { db } from "@/lib/db";

// Define enum for project types
enum ProjectType {
  Python = 'python',
  JavaScript = 'javascript',
  TypeScript = 'typescript',
  Cpp = 'cpp',
  C = 'c',
}

export async function POST(request: NextRequest) {
    const reqBody = await request.json();
    const validatedFields = ProjectSchema.safeParse(reqBody);
    const cwd = process.cwd();

    if (!validatedFields.success) {
        return NextResponse.json({
            error: "Invalid Fields"
        }, {
            status: 400
        });
    }

    const { pname, pdescp, extension, accountId } = validatedFields.data;

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    let bucket: string | undefined;

    const { data, error } = await supabase.storage.createBucket(accountId);

    if (error?.message === "The resource already exists") {
        bucket = accountId;
    } else {
        bucket = data?.name;
    }

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
            message: "Unable to create Project"
        }, {
            status: 400
        });
    }

    // Determine the project type based on file extension
    let projectType: ProjectType = ProjectType.JavaScript;
    switch (extension) {
        case 'py': projectType = ProjectType.Python; break;
        case 'js': projectType = ProjectType.JavaScript; break;
        case 'ts': projectType = ProjectType.TypeScript; break;
        case 'cpp': projectType = ProjectType.Cpp; break;
        case 'c': projectType = ProjectType.C; break;
    }

    try {
        // Delete the temporary file
        await unlink(`${folderPath}/main.${extension}`);

        // Create a project in the database
        const createdProject = await db.project.create({
            data: {
                projectId: res?.id!,
                projectType: projectType,
                projectName: pname,
                projectDescription: pdescp,
                creator: accountId // Adjusted field name
            }
        });

        // Create a file entry in the database
        const fileCreated = await db.files.create({
            data: {
                name: `main.${extension}`,
                belongs_to: createdProject.projectId, // Adjusted field name
                fileUrl: res?.path!
            }
        });

        // Check if project and file creation succeeded
        if (!createdProject || !fileCreated) {
            throw new Error("Project creation failed");
        }

        // Return success response
        return NextResponse.json({
            message: "Project successfully created",
            file: fileCreated,
            project: createdProject,
            bucket: bucket,
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

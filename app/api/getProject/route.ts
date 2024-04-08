import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { projectId } = await request.json();

        const project = await db.project.findFirst({
            where: {
                projectId: projectId
            }
        });

        if (!project) {
            return NextResponse.json({
                error: "Project not found"
            }, {
                status: 404
            });
        }

        const files = await db.files.findMany({
            where: {
                belongs_to: project.projectId
            }
        });

        // Create a Supabase client
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        
        // Download files from Supabase storage
        const fileContents:any = {};
        for (const file of files) {
            const { data, error } = await supabase.storage.from(project.creator).download(file.fileUrl);
            if (error) {
                // Handle error
                console.error("Error downloading file:", error);
                return NextResponse.json({
                    error: "Error downloading file"
                }, {
                    status: 500
                });
            }
            if (data) {
                    // Save file content
                const fileNameWithoutDots = file.name.replace(/\./g, '_'); // Replace dots with underscores
                fileContents[fileNameWithoutDots] =await new Response(data).text();
            }
        }
        let extension;
        switch (project.projectType) {
         case "c":extension='c';break;
         case "typescript":extension='ts';break;
         case "python":extension='py';break;
         case "javascript":extension='js';break;
         case "cpp":extension='cpp';break;
        }
        // Respond with the downloaded file contents
        return NextResponse.json({
            message: "Files downloaded successfully",
            fileContents,
            project,
            files,
            extension
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

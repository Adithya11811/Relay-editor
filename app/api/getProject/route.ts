import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { projectId } = await request.json();

    const project = await db.project.findFirst({
        where: {
            projectId: projectId
        }
    });

    if (!project) {
        return NextResponse.json({
            error: "File not found"
        }, {
            status: 404
        });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    
    try {
        // Download the file from Supabase storage
        const { data, error } = await supabase.storage.from('CodeFiles').download(project.projectURL!);

        if (error) {
            console.error("Error downloading file:", error);
            return NextResponse.json({
                error: "Error downloading file"
            }, {
                status: 500
            });
        }

        if (!data) {
            console.error("No data received after downloading file");
            return NextResponse.json({
                error: "No data received after downloading file"
            }, {
                status: 500
            });
        }
        console.log(data)

        // Convert the binary data to a string (assuming text file)
const fileContent = await new Response(data).text();

console.log(fileContent); // Output the file content to the console for verification

// Return the file content in the response
return NextResponse.json({
    message: "Project fetched successfully",
    project,
    fileContent // Pass the file content to the client
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

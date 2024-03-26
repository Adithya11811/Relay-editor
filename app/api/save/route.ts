import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { code, fileName, projectId } = await request.json();

        // Get the project details from the database
        const project = await db.project.findFirst({
            where: {
                projectId: projectId
            }
        });

        // Check if the project exists
        if (!project) {
            return NextResponse.json({
                error: "Project not found"
            }, {
                status: 400
            });
        }

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

        // Upload the file content to Supabase storage
        const { data, error } = await supabase.storage.from("CodeFiles").upload(project.projectURL, code, { upsert: true });

        // Handle errors during file upload
        if (error) {
            return NextResponse.json({
                error: "Error while saving the file"
            }, {
                status: 500
            });
        }

        // Check if data was returned after file upload
        if (!data) {
            return NextResponse.json({
                error: "Something went wrong"
            }, {
                status: 500
            });
        }

        // Return success response
        return NextResponse.json({
            message: "Saved successfully"
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

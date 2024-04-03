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

        const directories = await db.directory.findMany({
            where: {
                projectId: project.projectId
            }
        });

        const files = await Promise.all(directories.map(async (directory) => {
            return db.files.findMany({
                where: {
                    belongs_to: directory.id
                }
            });
        }));

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
        const fileContents: Record<string, string> = {}; // Define type explicitly

        for (const directoryFiles of files) {
            for (const file of directoryFiles) {
                const { data, error } = await supabase.storage.from(project.creator).download(file.fileUrl!);

                if (error) {
                    return NextResponse.json({
                        error: "Error downloading file"
                    }, {
                        status: 500
                    });
                }

                if (!data) {
                    return NextResponse.json({
                        error: "No data received after downloading file"
                    }, {
                        status: 500
                    });
                }
                const fileName = file.name.replace(/\./g, '_');
                fileContents[fileName] = await new Response(data).text();
            }
        }

        return NextResponse.json({
            message: "Project fetched successfully",
            project,
            files,
            fileContents,
            directories
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

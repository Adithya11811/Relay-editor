import { db } from "@/lib/db";
import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
        const {fileName,code, files, project} = await request.json();

        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    try{
        // Upload the file content to Supabase storage
        for(const file of files){
            if(file.name ==fileName){
                    const { data, error } = await supabase.storage.from(project.creator).upload(file.fileUrl, code, { upsert: true });
                    // Handle errors during file upload
                    if (error) {
                        return NextResponse.json({
                            error: `Error while saving the file ${file.name}`
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
            }
        }

        // Return success response
        return NextResponse.json({
                message: "Saved successfully"
            }, {
                status: 200
            });
    } catch (error) {
        return NextResponse.json({
            error: "Internal Server Error"
        }, {
            status: 500
        });
    }
}
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
    
        const { id } = await request.json();

        // Check if invitation exists
        const invitation = await db.invitation.findFirst({
            where: {
                id: id
            }
        });

        if (!invitation) {
            return NextResponse.json({
                error: "Invitation not found"
            }, {
                status: 404
            });
        }

        // Check if project exists
        const project = await db.project.findUnique({
            where: {
                projectId: invitation.projectId
            }
        });

        if (!project) {
            return NextResponse.json({
                error: "Project not found"
            }, {
                status: 404
            });
        }

        // Create collaborator entry
        const collaborator = await db.collaborators.create({
            data: {
                projectId: invitation.projectId,
                collaborators: invitation.recipientId
            }
        });
        const deleted = await db.invitation.delete({
            where:{
                id:id
            }
        })
        return NextResponse.json({
            message: "Invitation accepted successfully",
            projectId: invitation.projectId
        }, {
            status: 200
        });
    } catch (error) {
        console.error("Error accepting invitation:", error);
        return NextResponse.json({
            error: "Something went wrong"
        }, {
            status: 500
        });
    }
}

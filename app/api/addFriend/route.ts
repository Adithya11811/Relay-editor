import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const { account, id } = await request.json();

    // Find the user's account
    const userAccount = await db.account.findFirst({
        where: {
            userId: id
        }
    });

    // Check if the user is logged in
    if (!userAccount) {
        return NextResponse.json({
            error: "Not logged in"
        }, {
            status: 404
        });
    }

    // Check if the user is already following the account
    if (userAccount.follow.includes(account.id)) {
        return NextResponse.json({
            message: "You are already following this user"
        }, {
            status: 200
        });
    }

    // Update the user's account to add the follow
    const updatedUserAccount = await db.account.update({
        where: {
            userId: id
        },
        data: {
            follow: {
                push: account.id
            }
        }
    });

    // Handle errors in updating user's account
    if (!updatedUserAccount) {
        return NextResponse.json({
            error: "Something went wrong while updating the user's account"
        }, {
            status: 400
        });
    }

    // Update the friend's account to add the user as friend
    const updatedRequestedAccount = await db.account.update({
        where: {
            userId: account.userId
        },
        data: {
            friends: {
                push: userAccount.id
            }
        }
    });

    // Handle errors in updating friend's account
    if (!updatedRequestedAccount) {
        return NextResponse.json({
            error: "Something went wrong while updating the friend's account"
        }, {
            status: 400
        });
    }

    return NextResponse.json({
        message: "Add Friend successful"
    }, {
        status: 200
    });
}

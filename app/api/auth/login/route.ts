import { LoginSchema } from "@/schema";
import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { AuthError } from "next-auth";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { db } from "@/lib/db";


export async function POST(request: NextRequest){
    const reqBody = await request.json();
    const { callbackUrl } = reqBody;

    // Validate request body fields using the LoginSchema
    const validatedFields = LoginSchema.safeParse(reqBody);
    if (!validatedFields.success) {
        return NextResponse.json({
            error: "Invalid Fields!"
        }, {
            status: 403
        });
    }

    const { email, password, code } = validatedFields.data;

    // Check if the user with the provided email exists
    const existingUser = await getUserByEmail(email);
    if (!existingUser || !existingUser.password || !existingUser.email) {
        return NextResponse.json({
            error: "Email does not exist"
        }, {
            status: 400
        });
    }

    // If the user's email is not verified, send a verification email
    if (!existingUser.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(
            verificationToken.email,
            verificationToken.token
        );

        return NextResponse.json({
            success: "Confirmation email sent"
        }, {
            status: 200
        });
    }

    // If two-factor authentication is enabled and a code is provided, verify the code
    if (existingUser.isTwoFactorEnabled && existingUser.email && code) {
        const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
        if (!twoFactorToken || twoFactorToken.token !== code) {
            return NextResponse.json({
                error: "Invalid Code"
            }, {
                status: 403
            });
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();
        if (hasExpired) {
            return NextResponse.json({
                error: "Token expired"
            }, {
                status: 400
            });
        }

        await db.twoFactorToken.delete({
            where: { id: twoFactorToken.id }
        });

        const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (existingConfirmation) {
            await db.twoFactorConfirmation.delete({
                where: { id: existingConfirmation.id }
            });
        }

        await db.twoFactorConfirmation.create({
            data: {
                userId: existingUser.id,
            }
        });
    } else if (existingUser.isTwoFactorEnabled && existingUser.email) {
        // If two-factor authentication is enabled and no code is provided, send a two-factor token email
        const twoFactorToken = await generateTwoFactorToken(existingUser.email);
        await sendTwoFactorTokenEmail(
            twoFactorToken.email,
            twoFactorToken.token
        );

        return NextResponse.json({
            twoFactor: true
        }, {
            status: 200
        });
    }

    try {
        // Sign in the user with provided credentials
        const result = await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })        
        return NextResponse.json(result);
    } catch (error) {
        // Handle authentication errors
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return NextResponse.json({
                        error: "Invalid Credentials"
                    }, {
                        status: 401
                    });
                default:
                    return NextResponse.json({
                        error: "Something went wrong!!"
                    }, {
                        status: 400
                    });
            }
        }
        // If unknown error, throw it
        throw error;
    }
}

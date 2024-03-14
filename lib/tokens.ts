import { getVerificatonTokenByEmail } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import {v4 as uuidv4} from "uuid";
import { db } from "./db";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { getUserById } from "@/data/user";

export const generateVerificationToken = async (email: string) =>
{
    const token = uuidv4();
    //gives time at which the token is to be expired; present time+1hour
    const expires = new Date(new Date().getTime()+3600*1000);

    const existingToken = await getVerificatonTokenByEmail(email);

    if(existingToken){
        await db.verificationToken.delete({
            where:{
                id:existingToken.id,
            },
        });
    }
    const verificationToken = await db.verificationToken.create({
        data:{
            email,
            token,
            expires
        }
    });
    return verificationToken;
}

export const generatePasswordResetToken = async(email:string)=>{
    const token = uuidv4();
    const expires = new Date(new Date().getTime()+3600*1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken){
        await db.passwordResetToken.delete({
            where:{
                id:existingToken.id,
            }
        })
    }
    const passwordResetToken = await db.passwordResetToken.create({
        data:{
            email,token,expires
        }
    });
    return passwordResetToken;
}



export const generateTwoFactorToken = async(email:string)=>{
    const token = crypto.randomInt(100_000,1_000_000).toString();
    const expires = new Date(new Date().getTime() + 900*1000);
    const existingToken = await getPasswordResetTokenByEmail(email);
    if(existingToken){
        await db.twoFactorToken.delete({
            where:{
                id:existingToken.id
            }
        })
    }
    const twoFactorToken = await db.twoFactorToken.create({
        data:{
            email,token,expires
        }
    })
    return twoFactorToken;
}

// Helper functions in separate file (lib/tokens.js)
export async function createAccessToken(user: { id: any; role: any; }) {
  // Implement JWT generation with user information (e.g., ID, role)
  const payload = { userId: user.id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY, // Set expiry time in seconds
  });
  return accessToken;
}




export function generateSecureRandomString(length = 32) {
  // Use cryptographically secure random byte generation
  const randomBytes = crypto.randomBytes(length);

  // Convert bytes to a base64 URL-safe string (avoids encoding issues)
  return randomBytes.toString('base64url').replace(/\+/g, '-').replace(/\//g, '_');
}


export async function createRefreshToken(user: { id: any; }) {
  // Implement secure random string generation for refresh token
  const refreshToken = generateSecureRandomString(); // Replace with secure generation
  // Store refresh token securely in database (e.g., hashed)
  const hashedRefreshToken = await bcryptjs.hash(refreshToken, 10);
  await db.account.update({
    where: { userId: user.id },
    data: { refresh_token: hashedRefreshToken },
  });
  return refreshToken;
}

export async function verifyRefreshToken(refreshToken:string) {
  // Validate and retrieve user ID from refresh token
  const hashedRefreshToken = await db.account.findFirst({
    where: { refresh_token: refreshToken }, // Replace with hashed comparison
  });
  if (!hashedRefreshToken) return null;

  const isValid = bcryptjs.compare(refreshToken, hashedRefreshToken.refresh_token as string );
  if (!isValid) return null;

  // Use user ID to fetch user information for further processing
  const user = await getUserById(hashedRefreshToken.userId);
  return user;
}
'use server'
import { db } from "@/lib/db";


export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });

    return user;
  } catch {
    return null;
  }
};

export const getAccountByUserId = async (userId: string) => {
  try {
    const account = await db.account.findFirst({
      where: { userId:userId }
    });
    return account;
  } catch(e) {
    return e;
  }
};

export const getProjetByAccountId = async (Id: string) => {
  try {
    const account = await db.project.findMany({
      where: { creator: Id },
      orderBy: { updated_at: 'desc' },
    })
    return account
  } catch (e) {
    return e
  }
}

export const getAccountByAccountName = async(name: string) => {
  try {
    const account = await db.account.findFirst({
      where: {
        username: name
      }
    })
    return account
  }catch(e){
    return e
  }
}
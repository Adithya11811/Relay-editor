import { ProjectSchema } from '@/schema'
import { NextRequest, NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { generateVerificationToken } from '@/lib/tokens'
import { sendVerificationEmail } from '@/lib/mail'
import { AuthProvider } from '@/hooks/AuthProvider'

export async function POST(request: NextRequest) {
  const reqBody = await request.json()
  const validatedFields = ProjectSchema.safeParse(reqBody)
  if (!validatedFields.success) {
    return NextResponse.json(
      {
        error: 'Invalid Fields!',
      },
      {
        status: 403,
      }
    )
  }
  const { lang, pname, pdescp } = validatedFields.data
  const userid = AuthProvider()

//   const createdUser = await db.user.create({
//     data: {
//       name: name,
//       email,
//       password: hashedPassword,
//     },
//   })

  const projectdet = await db.program.create({
    data: {
        userid: userid,
        lang:lang,
        pname:pname,
        pdescp:pdescp
    }
  })
}

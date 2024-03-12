import { CreateAccSchema } from '@/schema'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  const reqBody = await request.json()
  const validatedFields = CreateAccSchema.safeParse(reqBody)
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
  const { username, githubLink, linkedinLink, profileImage, banner } = validatedFields.data

  const createdUser = await db.account.create({
    data: {
      githubLink: githubLink,
      profileImage: profileImage,
      linkedinLink: linkedinLink,
      username: username,
      banner: banner,
    },
  })
}

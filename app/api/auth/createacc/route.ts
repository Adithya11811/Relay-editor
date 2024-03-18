import { CreateAccSchema } from '@/schema'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { useCurrentUser } from '@/hooks/use-current-user'

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
  console.log(reqBody);
  const {accountId, username, githubLink, linkedinLink, profileImage, banner } = validatedFields.data

  const createdUser = await db.account.update({
    where:{
      id:accountId
    },data:{
      username,
      githubLink,
      linkedinLink,
      profileImage,
      banner
    }
  })
  if(!createdUser){
    return NextResponse.json({
      error:"Something went wrong"
    },{
      status:404
    })
  }
  return NextResponse.json({
    success:"Account created successfully"
  },{
    status:200
  })
}

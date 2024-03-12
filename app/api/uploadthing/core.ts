import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { AuthProvider } from '@/hooks/AuthProvider'

const f = createUploadthing()

const auth = (req: Request) => ({ id: AuthProvider }) // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  profilePicture: f({image: {maxFileCount: 1, maxFileSize: "4MB"}})
    .middleware(({ req }) => auth(req))
    .onUploadComplete((data) => console.log('file', data)),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
export const runtime = 'nodejs'
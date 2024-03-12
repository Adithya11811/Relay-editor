import { createRouteHandler } from "uploadthing/next";
 
import { ourFileRouter } from "./core";
 
// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    uploadthingId: 'b5bukmb496',
    // This is the URL that Upload
    uploadthingSecret: 
      'sk_live_fba22abc827d5bc78727c892f436168bed298ad56ee923ab64610a702b799a69'
  },
})
export const runtime = 'nodejs'
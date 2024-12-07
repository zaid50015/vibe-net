import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
const f = createUploadthing();
const authenticateUser = async () => {
  try {
    const { userId } = await auth();
    if (!userId) {
      throw new UploadThingError("Unauthorized");
    }
    return { userId };
  } catch (error) {
    throw new UploadThingError("User authentication failed.");
  }
};

export const ourFileRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
  serverImage: f({ image: { maxFileSize: "4MB" , maxFileCount:1} })
    .middleware(() => authenticateUser())
    .onUploadComplete((data) => console.log("file", data)),
    
  messageAttachment: f({
    image: { maxFileSize: "256MB"},
    pdf: { maxFileSize: "256MB"},
  })
    .middleware(() => authenticateUser())
    .onUploadComplete((data) => console.log("file", data)),

  
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

'use server'

import { utapi } from "@/server/uploadthing";




export const imageRemove = async (imageId: string): Promise<{ success: string }> => {
    try {
      await utapi.deleteFiles(imageId); // Deletes the file using the imageId
      return { success: "true" }; // Return success response
    } catch (error) {
      console.log(error); // Log the error for debugging purposes
      return { success: "false" }; // Return failure response
    }
  };
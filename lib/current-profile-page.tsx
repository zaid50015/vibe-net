import { getAuth } from '@clerk/nextjs/server'
import type { NextApiRequest, } from 'next'
import db from "./db";
import { Profile } from "@prisma/client";
//This is a kind of middleware
const currentProfilePageRouter = async (req: NextApiRequest): Promise<Profile | null> => {
    try {
      const { userId } =  getAuth(req);
  
      if (!userId) {
        console.log('No user is authenticated.');
        return null;
      }
  
      const profile = await db.profile.findUnique({
        where: { userId },
      });
  
      return profile || null; // Explicitly return null if no profile is found
    } catch (error) {
      console.error(
        `Error retrieving profile for user: ${(error as Error).message}`
      );
      throw new Error('Failed to retrieve profile. Please try again later.');
    }
  };
export default currentProfilePageRouter;

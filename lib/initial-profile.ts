import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";
import { Profile } from "@prisma/client";
import { redirect } from "next/navigation";



export const initialProfile= async (): Promise< Profile
> => {
  const user = await currentUser();

  if (!user) {
    // If user is not authenticated, redirect to sign-in page
    redirect('/sign-in"');
  }
  // Check if the user already exists in the database by using the Clerk user.id
  //findUnique
  const existingProfile = await db.profile.findUnique({
    where: { userId: user.id }, // Use user.id from Clerk to check the MongoDB profile
  });

  if (existingProfile) {
    console.log("User already exists:", existingProfile);
    return existingProfile; // Return the existing profile
  }

  // Create a new profile if it doesn't exist
  const newProfile = await db.profile.create({
    data: {
      userId: user.id, // Store Clerk's user.id in the MongoDB profile
      name: `${user.firstName || ""} ${user.lastName || ""}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0]?.emailAddress || "No email",
    },
  });
  console.log("New profile created:", newProfile);
  return newProfile;
};

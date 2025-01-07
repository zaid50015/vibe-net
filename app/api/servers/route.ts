import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
export async function POST(request: Request) {
  console.log("Request made");
  try {
    const { name, imageUrl } = await request.json();
    console.log({name,imageUrl})
    const profile = await currentProfile();
    if (!profile) {
      return NextResponse.json({ message: "Unautharized" }, { status: 401 });
    }
    const server = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile.id,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              name: "general",
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              role: MemberRole.ADMIN,
              profileId: profile.id,
            },
          ],
        },
      },
    });
    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("[POST_SERVER]" + error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

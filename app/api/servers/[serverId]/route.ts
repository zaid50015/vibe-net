import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";
//NOTE if request object missing then error
export async function PATCH(req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {
    try {
        const serverId = (await params).serverId;
        const profile = await currentProfile();
        const {name,imageUrl}=await req.json();
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400}
            );
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
               name:name,
               imageUrl:imageUrl
            }
        })
        return NextResponse.json(
            server,
            { status: 200 }
        );

    } catch (error) {
        console.log("[INVITE_CODE]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
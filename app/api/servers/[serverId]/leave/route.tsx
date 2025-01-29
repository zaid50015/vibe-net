import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {
    try {
        const serverId = (await params).serverId;
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }

        else if (!serverId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                //means the whosever has created this server cannot leave it
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }

        })
        return NextResponse.json(
            server,
            { status: 200 }
        );
    } catch (error) {
        console.error("[LEAVE_SERVER]", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
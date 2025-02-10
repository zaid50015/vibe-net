import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(req: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    try {
        const searchParams = req.nextUrl.searchParams
        const serverId = searchParams.get('serverId')
        const { channelId } = (await params);
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }
        if (!channelId) {
            return NextResponse.json(
                { error: "Channel id not present" },
                { status: 400 }
            );
        }
        if (!serverId) {
            return NextResponse.json(
                { error: "Server id not present" },
                { status: 400 }
            );
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR, MemberRole.ADMIN]
                        }
                    }
                },
            },
            data: {
                channels: {
                    deleteMany: {
                        id: channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        });
        return NextResponse.json(
            { message: "Channel deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.log("[DELETE_CHANNEL_ROUTE]", error)
    }
}


export async function PATCH(req: NextRequest,
    { params }: { params: Promise<{ channelId: string }> }
) {
    try {
        const searchParams = req.nextUrl.searchParams
        const serverId = searchParams.get('serverId')
        const { channelId } = (await params);
        const{name,type}=await req.json();
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }
        if (!channelId) {
            return NextResponse.json(
                { error: "Channel id not present" },
                { status: 400 }
            );
        }
        if (!serverId) {
            return NextResponse.json(
                { error: "Server id not present" },
                { status: 400 }
            );
        }
        if(name==="general"){
            return NextResponse.json({ error: "Channel cannot be named 'general" }, { status: 400 });

        }
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.MODERATOR, MemberRole.ADMIN]
                        }
                    }
                },
            },
            data: {
                channels: {
                    update: {
                       where:{
                            id:channelId,
                            name:{
                                not:"general"
                            }
                       },
                       data:{
                            type:type,
                            name :name
                       }
                    }
                }
            }
        });
        return NextResponse.json(
            { message: "Channel deleted" },
            { status: 200 }
        );
    } catch (error) {
        console.log("[DELETE_CHANNEL_ROUTE]", error)
    }
}

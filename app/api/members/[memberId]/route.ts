import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { type NextRequest } from 'next/server'
//NOTE if request object missing then error
export async function PATCH(req: NextRequest,
    { params }: { params: Promise<{ memberId: string }> }
) {
    console.log(NextResponse);
    try {
        const searchParams = req.nextUrl.searchParams
        const serverId = searchParams.get('serverId')
        const { memberId } = (await params);
        const profile = await currentProfile();
        const { role } = await req.json();
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }
        else if (!memberId) {
            return NextResponse.json(
                { error: "Member id not present" },
                { status: 400 }
            );
        }
        else if (!serverId) {
            return NextResponse.json(
                { error: "Server id not present" },
                { status: 400 }
            );
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id
                            },
                        },
                        data: {
                            role,
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
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

export async function DELETE(req: NextRequest,
    { params }: { params: Promise<{ memberId: string }> }
) {
    try {
        const searchParams = req.nextUrl.searchParams
        const serverId = searchParams.get('serverId')
        const { memberId } = (await params);
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }
        else if (!memberId) {
            return NextResponse.json(
                { error: "Member id not present" },
                { status: 400 }
            );
        }
        else if (!serverId) {
            return NextResponse.json(
                { error: "Server id not present" },
                { status: 400 }
            );
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        },
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
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
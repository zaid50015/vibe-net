import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { Channel, Message } from "@prisma/client";
import { tree } from "next/dist/build/templates/app-page";
import { NextRequest, NextResponse } from "next/server"
const MESSAGE_BATCH_SIZE = process.env.MESSAGE_BATCH_SIZE ? parseInt(process.env.MESSAGE_BATCH_SIZE) : 10;
export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const profile = await currentProfile();
        const channelId = searchParams.get('channelId');
        console.log("channeld_id",channelId);
        const cursor = searchParams.get('cursor');
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }
        else if (!channelId) {
            return NextResponse.json({ error: "Channel id does not exits" }, { status: 400 });
        }
        let messages: Message[] = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH_SIZE,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        else {
            messages = await db.message.findMany({
                take: MESSAGE_BATCH_SIZE,
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            })
        }
        let nextCursor = null;
    
        if (messages.length === MESSAGE_BATCH_SIZE) {
            nextCursor = messages[messages.length - 1].id;
        }
        return NextResponse.json({messages,nextCursor}, { status: 200 });
    } catch (error) {
        console.error("[MESSAGE_ROUTE]", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const serverId = searchParams.get('serverId');
        const profile = await currentProfile();
        const{name,type}=await req.json();
        if (!profile) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 400 }
            );
        }
        else if (!serverId) {
            return NextResponse.json({ error: "Server id does not exits" }, { status: 400 });
        }
        else if(name==="general"){
            return NextResponse.json({ error: "Channel cannot be named 'general" }, { status: 400 });

        }
        const server = await db.server.update({
            where:{
                id:serverId,
                members:{
                    some:{
                      profileId:profile.id,
                      role:{
                        in:[MemberRole.ADMIN,MemberRole.MODERATOR]
                      }
                    }
                }
            },
            data:{
                 channels:{
                    create:{
                        profileId:profile.id,
                        type:type,
                        name:name
                    }
                 }
            },
            include:{
                members:{
                    include:{
                        profile:true,
                    }
                }
            }
        })
        return NextResponse.json(server, { status: 200 });
    } catch (error) {
        console.error("[CREATE_SERVER_ROUTE",error);
        return NextResponse.json({error:"Internal server error"},{status:500});
    }
}
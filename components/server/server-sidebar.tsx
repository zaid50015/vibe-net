import currentProfile from "@/lib/current-profile"
import db from "@/lib/db"
import { ChannelType } from "@prisma/client"
import { FC } from "react"
import { ServerHeader } from "@/components/server/server-header"
import { redirect } from 'next/navigation';
interface ServerSideBarProps {
    serverId: string
}

export const ServerSideBar: FC<ServerSideBarProps> = async ({ serverId }) => {
    const profile = await currentProfile();
    const server = await db.server.findUnique({
        where: {
            id: serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc"
                }
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc"
                }
            }
        }
    })
    if(!server){
        redirect('/');
    }
    const textChannels = server?.channels?.filter(
        (channel) => channel.type === ChannelType.TEXT
    ) || [];
    const audioChannels = server?.channels?.filter(
        (channel) => channel.type === ChannelType.AUDIO
    ) || [];
    const videoChannels = server?.channels?.filter(
        (channel) => channel.type === ChannelType.VIDEO
    ) || [];
    const members = server?.members?.filter((member) => member.profileId !== profile?.id) || [];
    const role = server?.members?.find(
        (member) => member.profileId == profile?.id)
        ?.role;
    return (
        <div className="h-full w-full flex flex-col text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role}/>
        </div>
    )
}
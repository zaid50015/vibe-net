import currentProfile from "@/lib/current-profile"
import db from "@/lib/db"
import { ChannelType } from "@prisma/client"
import { FC } from "react"
import { ServerHeader } from "@/components/server/server-header"
import { redirect } from 'next/navigation';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { ServerSearchBar } from "./server-search"
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import ServerSection from "./server-section"
import ServerChannel from "./server-channel"
import ServerMember from "./server-member"
interface ServerSideBarProps {
    serverId: string
}

export const ServerSideBar: FC<ServerSideBarProps> = async ({ serverId }) => {
    const profile = await currentProfile();
    const iconClass = "h-4 w-4 mr-2";
    const channelIcon = {
        [ChannelType.TEXT]: <Hash className={iconClass} />,
        [ChannelType.AUDIO]: <Mic className={iconClass} />,
        [ChannelType.VIDEO]: <Video className={iconClass} />
    }
    const roleIconMap = {
        GUEST: null,
        MODERATOR: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
        ADMIN: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
    };

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
    if (!server) {
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
            <ServerHeader server={server} role={role} />
            <ScrollArea className="flex-1 px-3">
                <div className=" mt-2">
                    <ServerSearchBar data={[
                        {
                            label: "Text Channels",
                            type: "Channels",
                            data: textChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIcon[channel.type]
                            }))
                        },
                        {
                            label: "Video Channels",
                            type: "Channels",
                            data: videoChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIcon[channel.type]
                            }))
                        },
                        {
                            label: "Audio Channels",
                            type: "Channels",
                            data: audioChannels?.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                icon: channelIcon[channel.type]
                            }))
                        },
                        {
                            label: "Members",
                            type: "Members",
                            data: members?.map((member) => ({
                                id: member.id,
                                name: member.profile.name,
                                icon: roleIconMap[member.role]
                            }))
                        },
                    ]} />
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

                {/* Text Channels Section */}
                {!!textChannels?.length && (
                    <Collapsible defaultOpen={true} className="mb-2">
                        <CollapsibleTrigger>
                            <ServerSection
                                sectionType="channels"
                                channelType={ChannelType.TEXT}
                                role={role}
                                label="Text Channels"
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="space-y-[2px]">
                                {textChannels.map((channel) => (
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* Audio Channels Section */}
                {!!audioChannels?.length && (
                    <Collapsible defaultOpen={true} className="mb-2">
                        <CollapsibleTrigger>
                            <ServerSection
                                sectionType="channels"
                                channelType={ChannelType.AUDIO}
                                role={role}
                                label="Voice Channels"
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="space-y-[2px]">
                                {audioChannels.map((channel) => (
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* Video Channels Section */}
                {!!videoChannels?.length && (
                    <Collapsible defaultOpen={true} className="mb-2"> 
                        <CollapsibleTrigger>
                            <ServerSection
                                sectionType="channels"
                                channelType={ChannelType.VIDEO}
                                role={role}
                                label="Video Channels"
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="space-y-[2px]">
                                {videoChannels.map((channel) => (
                                    <ServerChannel
                                        key={channel.id}
                                        channel={channel}
                                        role={role}
                                        server={server}
                                    />
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {/* Members Section */}
                {!!members?.length && (
                    <Collapsible defaultOpen={true} className="mb-2">
                        <CollapsibleTrigger>
                            <ServerSection
                                sectionType="members"
                                role={role}
                                label="Members"
                                server={server}
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="space-y-[2px]">
                                {members.map((member) => (
                                    <ServerMember
                                        key={member.id}
                                        member={member}
                                        server={server}
                                    />
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible>
                )}
            </ScrollArea>
        </div>
    )
}
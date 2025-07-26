"use client";

import { FC, useEffect, useState } from "react";
import { Channel, ChannelType, Member, MemberRole } from "@prisma/client";
import { Hash, Mic, Video, ShieldAlert, ShieldCheck } from "lucide-react";
import { ServerHeader } from "@/components/server/server-header";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";
import { ServerSearchBar } from "./server-search";

interface ServerSideBarProps {
  serverId: string;
}

export const ServerSideBar: FC<ServerSideBarProps> = ({ serverId }) => {
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const iconClass = "h-4 w-4 mr-2";

  const channelIcon = {
    [ChannelType.TEXT]: <Hash className={iconClass} />,
    [ChannelType.AUDIO]: <Mic className={iconClass} />,
    [ChannelType.VIDEO]: <Video className={iconClass} />,
  };

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-3 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-3 text-rose-500" />,
};

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/servers/${serverId}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          console.error("Error:", json.error);
        }
      } catch (error) {
        console.error("Fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [mounted, serverId]);

  if (!mounted) return null;
  if (loading) return <div className="p-4">Loading...</div>;
  if (!data) return <div className="p-4">Server not found.</div>;

  const { server, profile } = data;

  const textChannels = server.channels.filter(
    (channel: any) => channel.type === "TEXT"
  );
  const audioChannels = server.channels.filter(
    (channel: any) => channel.type === "AUDIO"
  );
  const videoChannels = server.channels.filter(
    (channel: any) => channel.type === "VIDEO"
  );
  const members = server.members.filter(
    (m: any) => m.profileId !== profile.id
  );
  const role: MemberRole =
    server.members.find((m: any) => m.profileId === profile.id)?.role || "GUEST";

  return (
    <div className="h-full w-full flex flex-col text-primary dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearchBar
            data={[
              {
                label: "Text Channels",
                type: "Channels",
                data: textChannels?.map((channel: Channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "Channels",
                data: videoChannels?.map((channel:  Channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: "Audio Channels",
                type: "Channels",
                data: audioChannels?.map((channel: Channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: channelIcon[channel.type],
                })),
              },
              {
                label: "Members",
                type: "Members",
                data: members?.map((member:any) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role as keyof typeof roleIconMap],
                })),
              },
            ]}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        {/* Text Channels */}
        {!!textChannels.length && (
          <Collapsible defaultOpen className="mb-2">
            <CollapsibleTrigger className="w-full">
              <ServerSection
                sectionType="channels"
                channelType={ChannelType.TEXT}
                role={role}
                label="Text Channels"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-[2px]">
                {textChannels.map((channel: any) => (
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

        {/* Audio Channels */}
        {!!audioChannels.length && (
          <Collapsible defaultOpen className="mb-2">
            <CollapsibleTrigger className="w-full">
              <ServerSection
                sectionType="channels"
                channelType={ChannelType.AUDIO}
                role={role}
                label="Voice Channels"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-[2px]">
                {audioChannels.map((channel: any) => (
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

        {/* Video Channels */}
        {!!videoChannels.length && (
          <Collapsible defaultOpen className="mb-2">
            <CollapsibleTrigger className="w-full">
              <ServerSection
                sectionType="channels"
                channelType={ChannelType.VIDEO}
                role={role}
                label="Video Channels"
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-[2px]">
                {videoChannels.map((channel: any) => (
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

        {/* Members */}
        {!!members.length && (
          <Collapsible defaultOpen className="mb-2">
            <CollapsibleTrigger className="w-full">
              <ServerSection
                sectionType="members"
                role={role}
                label="Members"
                server={server}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="space-y-[2px]">
                {members.map((member: any) => (
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
  );
};

'use client';
import { cn } from '@/lib/utils';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, MouseEvent, useEffect, useState } from 'react';
import { ActionTollTip } from '../ui/action-tool-tip';
import { ModalType, useModalStore } from '@/hooks/use-modal-store';

interface serverChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel: FC<serverChannelProps> = ({ channel, server, role }) => {
  // Always call hooks unconditionally at the top
  const params = useParams();
  const router = useRouter();
  const { onOpen } = useModalStore();

  const [isClient, setIsClient] = useState(false);
  const Icon = iconMap[channel.type];

  useEffect(() => {
    setIsClient(true);  // Client-side only code
  }, []);

  if (!isClient) {
    return null;  // Prevent SSR content mismatch
  }

 // Without the leading slash the path will be relative to the current path
  const moveToChannel = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel?.id}`);
  };

  const onAction = (action: ModalType, e: MouseEvent) => { 
    e.stopPropagation();
    onOpen(action, { server, channel });
  };

  return (
    <button
      onClick={moveToChannel}
      className={cn(
        'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-shadow mb-1',
        params?.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <Icon className="flex-shrink-0 w-5 h-5 text-zinc-500 dark:text-zinc-400" />
      <p
        className={cn(
          'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
          params?.channelId === channel.id &&
          'text-primary dark:text-zinc-200 dark:group-hover:text-white'
        )}
      >
        {channel.name}
      </p>
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTollTip label="Edit" align='center' side='top'>
            <Edit
              onClick={(e) => onAction("editChannel", e)}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTollTip>
          <ActionTollTip label="Delete">
            <Trash
              onClick={(e) => onAction("deleteChannel", e)}
              className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
            />
          </ActionTollTip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto w-4 h-4 text-zinc-500 dark:text-zinc-500" />
      )}
    </button>
  );
};

export default ServerChannel;
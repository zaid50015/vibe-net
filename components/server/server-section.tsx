'use client';
import { ChevronDown, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChannelType, MemberRole } from '@prisma/client';
import { ServerWithMembersWithProfiles } from '@/app/type';
import { FC, useEffect, useState } from 'react';
import { useModalStore } from '@/hooks/use-modal-store';
import { ActionTollTip } from '../ui/action-tool-tip';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType;
  server?: ServerWithMembersWithProfiles;
}

const ServerSection: FC<ServerSectionProps> = ({
  label,
  sectionType,
  role,
  server,
}) => {
  const { onOpen } = useModalStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);  // Ensure this runs only on the client side
  }, []);

  if (!isClient) {
    return null;  // Prevents rendering during SSR
  }
  return (
    <div className="flex items-center justify-between py-2 ml-auto">
      <div className="flex items-center gap-x-1 cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 px-2 rounded">
        <ChevronDown className="h-4 w-4 text-zinc-500 transition-transform" />
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
      </div>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTollTip label="Create Channel" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen('createChannel', { server })}
          >
            <Plus className="h-3 w-3" />
          </button>
        </ActionTollTip>
      )}
      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTollTip label="Manage Members" side="top">
          <button
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
            onClick={() => onOpen('manageMembers', { server })}
          >
            <Settings className="h-3 w-3 " />
          </button>
        </ActionTollTip>
      )}
    </div>
  );
};

export default ServerSection;
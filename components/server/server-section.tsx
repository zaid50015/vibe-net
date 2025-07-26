'use client';

import { ChevronDown, Plus, Settings } from 'lucide-react';
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
  channelType,
  role,
  server,
}) => {
  const { onOpen } = useModalStore();
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex items-center justify-between py-2 ml-auto">
      {/* Dropdown Trigger */}
      <div
        className="flex items-center gap-x-1 cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ChevronDown
          className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-[-90deg]' : ''
          }`}
        />
        <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          {label}
        </p>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-x-2 ml-auto pr-2">
        {role !== MemberRole.GUEST && sectionType === 'channels' && (
          <ActionTollTip label={`Create ${channelType} channel`} side="top">
            <span
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onOpen('createChannel', { channelType });
              }}
            >
              <Plus className="h-4 w-4" />
            </span>
          </ActionTollTip>
        )}

        {role === MemberRole.ADMIN && sectionType === 'members' && (
          <ActionTollTip label="Manage Members" side="top">
            <span
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onOpen('manageMembers', { server });
              }}
            >
              <Settings className="h-4 w-4" />
            </span>
          </ActionTollTip>
        )}
      </div>
    </div>
  );
};

export default ServerSection;

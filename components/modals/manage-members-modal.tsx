'use client';
import { FC, useState } from 'react';
import qs from 'query-string';
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '../ui/dropdown-menu';
import { MemberRole } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/hooks/use-modal-store';
import { ServerWithMembersWithProfiles } from '@/app/type';
import UserAvatar from '../user-avatar';
import { ActionTollTip } from '../ui/action-tool-tip';

interface MembersModalProps {}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

const MembersModal: FC<MembersModalProps> = ({}) => {
  const router = useRouter();
  const { isOpen, onOpen, onClose, type, data } = useModalStore();
  const [loadingId, setLoadingId] = useState('');

  const isModalOpen = isOpen && type === 'manageMembers';
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.delete(url);
      router.refresh();
      onOpen('manageMembers', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });

      const response = await axios.patch(url, { role });
      router.refresh();
      onOpen('manageMembers', { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId('');
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white dark:bg-gray-800 text-black dark:text-white overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.profile.imageUrl} />
              <ActionTollTip label={member.role}>
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                  
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {member.profile.email}
                </p>
              </div>
              </ActionTollTip>
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">
                              Role
                            </span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, 'GUEST')}
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === 'GUEST' && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, 'MODERATOR')
                                }
                                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-600" />
                        <DropdownMenuItem
                          onClick={() => onKick(member.id)}
                          className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.id && (
                <Loader2 className="animate-spin text-gray-500 dark:text-gray-400 ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
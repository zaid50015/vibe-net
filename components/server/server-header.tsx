'use client'
import { ServerWithMembersWithProfiles } from "@/app/type"
import { MemberRole } from "@prisma/client"
import { FC } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { useModalStore } from "@/hooks/use-modal-store";
import { date } from "zod";

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles
  role?: MemberRole
}
export const ServerHeader: FC<ServerHeaderProps> = ({ server, role }) => {
  const { onOpen } = useModalStore()
  const isAdmin = role === MemberRole.ADMIN
  const isMod = isAdmin || role === MemberRole.MODERATOR
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12 border-netural-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition" >
          {server?.name}
          <ChevronDown className="h-5 w-5 md:ml-auto mr-2" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] ">
        {isMod && (
          <DropdownMenuItem
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen('invite', { server })}
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={() => onOpen("editServer", { server })}
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={()=> onOpen("manageMembers",{server})}
          >
            Manage Members
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMod && (
          <DropdownMenuItem
            className="px-3 py-2 text-sm cursor-pointer"
            onClick={()=>onOpen('createChannel',{server})}
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isMod && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={()=>onOpen("deleteServer",{server})}

          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
            onClick={()=>onOpen("leaveServer",{server})}
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

}
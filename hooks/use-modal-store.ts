import { ChannelType, Server ,Channel} from '@prisma/client';
import { create } from 'zustand'

export type ModalType="createServer"|"invite"|"editServer"|"manageMembers"|"createChannel"|"leaveServer"|"deleteServer" |"deleteChannel"| "editChannel";
interface ModalData{
  server?:Server
  channelType?:ChannelType
  channel?:Channel
}
interface UseModalInterface {
  type: ModalType | null;
  isOpen:boolean;
  data:ModalData;
  onOpen:(type:ModalType,data?:ModalData)=>void;
  onClose: () => void;
}

export const useModalStore = create<UseModalInterface>()((set) => ({
 type:null,
 isOpen:false,
 data:{},
 onOpen:(type,data={})=>set({isOpen:true,type,data}),
 onClose:()=>set({isOpen:false,type:null})
}))

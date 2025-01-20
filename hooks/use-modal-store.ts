import { Server } from '@prisma/client';
import { create } from 'zustand'

export type ModalType="createServer"|"invite";
interface ModalData{
  server?:Server
}
interface UseModalInterface {
  type: ModalType | null;
  isOpen:boolean;
  data:ModalData|null;
  onOpen:(type:ModalType,data?:ModalData)=>void;
  onClose: () => void;
}

export const useModalStore = create<UseModalInterface>()((set) => ({
 type:null,
 isOpen:false,
 data:{},
 onOpen:(type,data={})=>set({isOpen:true,type,data}),
 onClose:()=>set({isOpen:false,type:null,data:{}})
}))

import { create } from 'zustand'

export type ModalType="createServer"
interface UseModalInterface {
  type: ModalType | null;
  isOpen:boolean;
  onOpen:(type:ModalType)=>void;
  onClose: () => void;
}

export const useModalStore = create<UseModalInterface>()((set) => ({
 type:null,
 isOpen:false,
 onOpen:(type)=>set({isOpen:true,type}),
 onClose:()=>set({isOpen:false,type:null})
}))

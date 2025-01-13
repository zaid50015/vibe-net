'use client';
import { Plus } from "lucide-react";
import { ActionTollTip } from "../ui/action-tool-tip";
import { useModalStore } from "@/hooks/use-modal-store";

const NavigationAction=()=>{
  const{onOpen}=useModalStore();
  const handleOpen=():void=>{
    onOpen("createServer");
  }
    return(
        <div >
        <ActionTollTip label="Add a server">
          <div className="group flex items-center" onClick={handleOpen}>
            <div className="flex justify-center items-center h-[48px] w-[48px] mx-2 rounded-[24px] bg-background dark:bg-neutral-700 transition-all group-hover:bg-emerald-500 group-hover:rounded-[16px]">
             <Plus className="text-emerald-500 group-hover:text-white">
                ""
             </Plus>
            </div>
          </div>
          </ActionTollTip>
        </div>

    )
}
export default NavigationAction;
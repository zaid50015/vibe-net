import { Plus } from "lucide-react";
import { ActionTollTip } from "../ui/action-tool-tip";

const NavigationAction=()=>{
    return(
        <div >
        <ActionTollTip label="Add a server">
          <button className="group flex items-center">
            <div className="flex justify-center items-center h-[48px] w-[48px] mx-2 rounded-[24px] bg-background dark:bg-neutral-700 transition-all group-hover:bg-emerald-500 group-hover:rounded-[16px]">
             <Plus className="text-emerald-500 group-hover:text-white">
                ""
             </Plus>
            </div>
          </button>
          </ActionTollTip>
        </div>

    )
}
export default NavigationAction;
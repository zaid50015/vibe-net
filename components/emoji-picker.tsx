import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Smile } from "lucide-react";
import { useTheme } from "next-themes";
import { FC } from "react";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
interface EmojiPickerProps {
    onChange: (emoji: string) => void;
}


const EmojiPicker: FC<EmojiPickerProps> = ({ onChange }) => {
    const {resolvedTheme} = useTheme();

    return (
        <Popover>
            <PopoverTrigger>
                <Smile className="text-zinc-500 cursor-pointer hover:text-zinc-600  dark:text-zinc-400 dark:hover:text-zinc-300" />
            </PopoverTrigger>
            <PopoverContent side="right" sideOffset={40} className="bg-transparent border-none shadow-none drop-shadow-none mb-16">
            <Picker theme={resolvedTheme} data={data} onEmojiSelect={(emoji:any)=>onChange(emoji.native)} />
            </PopoverContent>
        </Popover>
    )
}

export default EmojiPicker
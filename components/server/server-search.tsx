'use client'
import { FC, ReactNode, useEffect } from "react";
import { useState } from "react"
import { Calculator, Calendar, CreditCard, Settings, Smile, User, Search, SearchIcon } from "lucide-react"
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';


interface ServerSearchBarProps {
    data: {
        label: string,
        type: "Channels" | "Members"
        data: {
            id: string,
            name: string,
            icon: ReactNode | any,
        }[] | undefined
    }[]
}

export const ServerSearchBar: FC<ServerSearchBarProps> = ({data}) => {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const params = useParams();
    const onClick = ({
        id,
        type,
    }: {
        id: string;
        type: 'Channels' | 'Members';
    }) => {
        setOpen(false);
        if (type === 'Members')
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);

        if (type === 'Channels')
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
    };
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <button
                className="group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition-all"
                onClick={() => setOpen(true)}
            >
                <SearchIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Search
                </p>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto">
                    <span className="text-xs ">⌘</span>J
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {
                    data.map(({ label, type, data }) => {
                        if (!data?.length) return null;

                        return (
                            <CommandGroup key={label} heading={label}>
                                {data?.map(({ id, icon, name }) => {
                                    return (
                                        <CommandItem
                                            key={id}
                                            onSelect={() => onClick({ id, type })}
                                        >
                                            {icon}
                                            <span>{name}</span>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        );
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )

}
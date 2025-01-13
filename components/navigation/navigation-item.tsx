'use client';

import { FC, useState, useEffect } from "react";
import { ActionTollTip } from "../ui/action-tool-tip";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface NavigationItemsProps {
    id: string;
    name: string;
    imageUrl: string;
}

export const NavigationItems: FC<NavigationItemsProps> = ({
    id,
    name,
    imageUrl
}) => {
    const params = useParams();
    const router = useRouter();
    const handleClick = () => {
        console.log("clicked")
        router.push(`/servers/${id}`);
    };
    return (
        <ActionTollTip 
            label={name}
            side="right"
            align="center"
        >
            <div
                onClick={handleClick}
                className="group relative flex items-center"
            >
                {/* Server selection indicator */}
                <div
                    className={cn(
                        'absolute left-0 bg-primary rounded-r-full transition-all w-[4px] ',
                        params?.serverId !== id && 'group-hover:h-[20px]',
                        params?.serverId === id ? 'h-[36px]' : 'h-[8px]'
                    )}
                />
                {/* Server icon container */}
                <div
                    className={cn(
                        'relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden',
                        params?.serverId === id && 'bg-primary/10 text-primary rounded-[16px]'
                    )}
                >
                    <Image 
                        fill 
                        src={imageUrl} 
                        alt={`${name} server`}
                        sizes="48px"
                        priority={params?.serverId === id}
                    />
                </div>
            </div>
        </ActionTollTip>
    );
};
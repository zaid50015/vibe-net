"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Hash, Mic,  Video } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useModalStore } from "@/hooks/use-modal-store";
import { useState } from "react";
import axios from "axios";
import { ChannelType } from "@prisma/client";
import qs from 'query-string'



const DeleteChannelModal = () => {
    const iconMap = {
        [ChannelType.TEXT]: Hash,
        [ChannelType.AUDIO]: Mic,
        [ChannelType.VIDEO]: Video,
      };
      
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const { isOpen, type, onClose, data, } = useModalStore();
    const { server, channel} = data
    const isModalOpen = isOpen && type == "deleteChannel";
    const Icon = channel?.type? iconMap[channel.type]:Hash;
    const handleClose = (): void => {
        onClose();
        router.refresh();
    }

    const leaveChannel = async () => {
        // /api/channels/[channelId]?serverId=<serverId></serverId>
        try {
            setLoading(true);
            const url =qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                },
            })
            console.log(url)
            await axios.delete(url);
            onClose();
            router.refresh();
            router.push(`/servers/${server?.id}`);
        } catch (error) {
            console.log("[DELETE_CHANNEL_MODAL]", error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className=" bg-white dark:bg-gray-800 overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Delete <Icon className="inline-block h-5 w-5 m-auto"/> "{channel?.name}"</DialogTitle>
                        <DialogDescription className="mt-2">
                            Are you really sure yow want to delete <span className="font-semibold text-indigo-200"><Icon className="inline-block h-4 w-4"/> {channel?.name}?</span> This action cannot be undone
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter >
                        <div className="w-full flex items-center justify-end px-6 py-2 gap-3">
                            <Button variant={"ghost"} className="hover:underline hover:bg-transparent" disabled={loading} onClick={handleClose}> Cancel</Button>
                            <Button variant={"destructive"} disabled={loading} onClick={leaveChannel}>Delete</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteChannelModal;

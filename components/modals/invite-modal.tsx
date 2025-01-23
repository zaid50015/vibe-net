"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Copy, RefreshCw, Settings } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation'
import { useModalStore } from "@/hooks/use-modal-store";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";


const InviteModal = () => {
    const router = useRouter()
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const { isOpen, type, onClose, data, onOpen } = useModalStore();
    const { server } = data
    const origin = useOrigin();
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`
    const isModalOpen = isOpen && type == "invite";
    const handleClose = (): void => {
        onClose();
    }
    const copyInviteUrl = (): void => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1000);
    }
    const generateNewInviteUrl = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen("invite", { server: response.data })
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className=" bg-white dark:bg-gray-800 overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Invite People to {server?.name}</DialogTitle>
                        <DialogDescription>
                            Create an invite link to share with others.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="w-full">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Input
                                    value={inviteUrl}
                                    readOnly
                                    className=" flex-grow bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                                />
                                <Button
                                    variant="secondary"
                                    disabled={loading}
                                    className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    onClick={copyInviteUrl}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                                </Button>
                            </div>
                            <div className="flex justify-between items-center">
                                <Button
                                    disabled={loading}
                                    onClick={generateNewInviteUrl}
                                    variant="ghost"
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-gray-700"
                                >
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Generate a new link
                                </Button>
                            </div>


                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default InviteModal;

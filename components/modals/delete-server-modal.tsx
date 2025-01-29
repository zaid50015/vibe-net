"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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


const DeleteServerModal = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const { isOpen, type, onClose, data, } = useModalStore();
    const { server } = data
    const isModalOpen = isOpen && type == "deleteServer";
    const handleClose = (): void => {
        onClose();
    }
    const leaveServer = async () => {
        try {
            setLoading(true);
            await axios.delete(`/api/servers/${server?.id}`);
            onClose();
            router.push('/');
            router.refresh();
        } catch (error) {
            console.log("[DELETE_SERVER_MODAL]", error)
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
                        <DialogTitle>Leave "{server?.name}"</DialogTitle>
                        <DialogDescription className="mt-2">
                            Are you really sure yow want to delete <span className="font-semibold text-indigo-200">{server?.name}?</span> This action cannot be undone
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter >
                        <div className="w-full flex items-center justify-end px-6 py-2 gap-3">
                            <Button variant={"ghost"} className="hover:underline hover:bg-transparent" disabled={loading} onClick={handleClose}> Cancel</Button>
                            <Button variant={"destructive"} disabled={loading} onClick={leaveServer}>Delete</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DeleteServerModal;

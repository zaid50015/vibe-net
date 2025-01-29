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


const LeaveServerModal = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const { isOpen, type, onClose, data, } = useModalStore();
    const { server } = data
    const isModalOpen = isOpen && type == "leaveServer";
    const handleClose = (): void => {
        onClose();
    }
    const leaveServer = async () => {
        try {
            setLoading(true);
            await axios.patch(`/api/servers/${server?.id}/leave`);
            onClose();
            router.push('/');
            router.refresh();
        } catch (error) {
            console.log("[LEAVE_SERVER_MODAL]", error)
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
                        <DialogDescription>
                            Are you really sure yow want to leave <span className="font-semibold text-indigo-200">{server?.name}?</span> You won't be able to rejoin this server unless invited.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter >
                        <div className="w-full flex items-center justify-end px-6 py-2 gap-3">
                            <Button variant={"ghost"} className="hover:underline hover:bg-transparent" disabled={loading} onClick={handleClose}> Cancel</Button>
                            <Button variant={"destructive"} disabled={loading} onClick={leaveServer}>Leave</Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LeaveServerModal;

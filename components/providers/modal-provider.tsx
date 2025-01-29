"use client";

import { useEffect, useState } from "react";
import CreateServerModal from "@/components/modals/create-server-modal";
import InviteModal from "@/components/modals/invite-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import MembersModal from "../modals/manage-members-modal";
import CreateChannelModal from "../modals/create-channel-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState<boolean | null>(null)
    useEffect(() => {
        setIsMounted(true);
    }, [])
    if (!isMounted) {
        return null;
    }
    return (
        <>
        <CreateServerModal/>
        <InviteModal/>
        <EditServerModal/>
        <MembersModal/>
        <CreateChannelModal/>
        </>
    )
}


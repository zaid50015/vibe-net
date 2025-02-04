"use client";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useModalStore } from "@/hooks/use-modal-store";
import { ChannelType } from "@prisma/client";
import qs from 'query-string';
import { useState } from "react";
const formSchema = z.object({
    name: z.string()
        .min(1, { message: "Server name is required" })
        .max(50, { message: "Server name cannot exceed 50 characters" }).refine((name) => name.toLowerCase() !== "general", {
            message: "Channel name canot be 'general'",
        }),
    type: z.nativeEnum(ChannelType),
});

const CreateChannelModal = () => {
    const params=useParams();
    const[loading,setLoading]=useState(false);
    const { isOpen, type, onClose, data } = useModalStore();
    const isModalOpen = isOpen && type === "createChannel";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: ChannelType.TEXT
        },
    });


    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const url = qs.stringifyUrl({
                  url: `/api/channels`,
                  query: {
                    serverId: params?.serverId,
                  },
                });
                const resp=await axios.post(url,values);
            onClose();
        } catch (error) {
            console.error("[CREATE_CHANNEL]", error);
        }
        finally{
            setLoading(false)
        }
    }

    const handleClose = (): void => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white dark:bg-gray-800 text-black dark:text-white overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        Create a channel
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-gray-500 dark:text-gray-400">
                                            Channel Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="bg-gray-100 dark:bg-gray-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-gray-500 dark:text-gray-400">Channel Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl >
                                                <SelectTrigger className="bg-gray-100 dark:bg-gray-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 outline-none">
                                                    <SelectValue placeholder="Select a verified email to display" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-gray-100 dark:bg-gray-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0 outline-none" >
                                                {Object.values(ChannelType).map((type) => (
                                                    <SelectItem value={type} key={type} className="capitalize">{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <DialogFooter className="px-6 py-4 w-full">
                            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                                {loading?"Creating":"Create"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;

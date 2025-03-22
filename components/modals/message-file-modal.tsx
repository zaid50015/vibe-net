"use client";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import qs from "query-string";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/ui/fileUpload";
import axios from 'axios'
import { useRouter } from 'next/navigation'

import { useModalStore } from "@/hooks/use-modal-store";


const formSchema = z.object({
    fileUrl: z.string().min(1, { message: "Please upload an attachment" }),
});
const MessageFileModal = () => {
    const router = useRouter()
    const { isOpen, type, onClose, data } = useModalStore();
    const isModalOpen = type === "messageFile" && isOpen;
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        },
    });
    const isLoading = form.formState.isSubmitting;
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const url = qs.stringifyUrl({
                url: data?.apiUrl || '',
                query: data?.query,
            });
            await axios.post(url, { ...values, content: values.fileUrl });
            form.reset();
            onClose();
        } catch (error) {
            console.log(`Unknown error occured ${error}`)
        }
    }
    const onClick = () => {
        onClose();
        form.reset();
    }
    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={onClick}>
                <DialogContent className="bg-white text text-black w-full max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">
                            Message Attachment
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-600">
                            Upload a file to send as a message
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-8 px-6">
                                <div className="flex items-center justify-center text-center">
                                    <FormField
                                        control={form.control}
                                        name="fileUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                    Attachment
                                                </FormLabel>
                                                <FormControl>
                                                    <FileUpload
                                                        endpoint="messageAttachment"
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                            <DialogFooter className=" px-6 py-4">
                                <Button variant="primary" disabled={isLoading}>
                                    Upload
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default MessageFileModal;

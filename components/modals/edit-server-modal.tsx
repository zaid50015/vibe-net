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
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FileUpload from "@/components/ui/fileUpload";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModalStore } from "@/hooks/use-modal-store";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string()
        .min(1, { message: "Server name is required" })
        .max(50, { message: "Server name cannot exceed 50 characters" }),
    imageUrl: z.string(),
});

const EditServerModal = () => {
    const router = useRouter();
    const { isOpen, type, onClose,data } = useModalStore();
    const{server}=data
    const isModalOpen = isOpen && type === "editServer";

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const isLoading = form.formState.isSubmitting;
    useEffect(() => {
        if(server){
       form.setValue("name",server.name);
       form.setValue("imageUrl",server.imageUrl);
    }
    }, [server])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const resp = await axios.patch(`/api/servers/${server?.id}`, values);
            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Unknown error occurred", error);
            alert("Failed to create server. Please try again later.");
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
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
                        Edit the server name and image of your server.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="uppercase text-xs font-bold text-gray-500 dark:text-gray-400">
                                                Server Image
                                            </FormLabel>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-gray-500 dark:text-gray-400">
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-gray-100 dark:bg-gray-700 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="px-6 py-4">
                            <Button type="submit" variant="primary" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Edit"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditServerModal;

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
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModalStore } from "@/hooks/use-modal-store";

const formSchema = z.object({
    name: z
        .string()
        .min(1, {
            message: "Server name is Required",
        })
        .max(50, {
            message: "Server Name cannot exceed 50 characters",
        }),
    imageUrl: z.string(),
});
const CreateServerModal = () => {
    const router = useRouter()
    const { isOpen, type, onClose } = useModalStore();
    const isModalOpen = isOpen && type == "createServer";
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });
    const isLoading = form.formState.isSubmitting;
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const resp = await axios.post('/api/servers', values);
            form.reset();
            onClose();
        } catch (error) {
            console.log("[SERVER_MODAL]", +`Unknown error occured ${error}`)
        }
    }
    const handleClose = (): void => {
        form.reset();
        onClose();
    }

    return (
        <>
            <Dialog open={isModalOpen} onOpenChange={handleClose}>
                <DialogContent className=" bg-white text text-black overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold text-center">
                            Customize your server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-600">
                            Add a server name an image to your server which you can change
                            anytime
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
                                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
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
                                            <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                                Server name
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    disabled={isLoading}
                                                    className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                                    placeholder="Enter server name"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className=" px-6 py-4">
                                <Button variant="primary" disabled={isLoading}>
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CreateServerModal;

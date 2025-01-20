import { ServerSideBar } from "@/components/server/server-sidebar";
import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
export default async function ServerIdLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string };
}) {
    const profile = await currentProfile();
    const { redirectToSignIn } = await auth();
    if (!profile) {
        return redirectToSignIn();
    }
    const { serverId } = params;
    const server=await db.server.findUnique({
        where:{
            id:serverId,
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    });
    if(!server){
        return redirect('/');
    }

    return (
        <div className="h-full">
            <div className="hidden md:flex fixed flex-col h-full w-60 inset-y-0 z-20">
               <ServerSideBar serverId={serverId}/>
            </div>
            
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}

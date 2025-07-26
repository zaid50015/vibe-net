import { ServerSideBar } from "@/components/server/server-sidebar";
import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { auth } from '@clerk/nextjs/server'
import { redirect } from "next/navigation";
export default async function ServerIdLayout(
    props: {
        children: React.ReactNode;
        params: Promise<{ serverId: string }>;
    }
) {
    const params = await props.params;

    const {
        children
    } = props;

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
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <ServerSideBar serverId={serverId} />
            </div>
            <main className="h-full md:pl-60">{children}</main>
        </div>
    );
}

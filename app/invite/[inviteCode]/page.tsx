import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function InviteToServer(
    props: {
        params: Promise<{ inviteCode: string }>;
    }
) {
    const params = await props.params;
    const profile = await currentProfile();
    const { redirectToSignIn } = await auth();
    if (!profile) {
        return redirectToSignIn();
    }

    if (!params.inviteCode) {
        return redirect("/");
    }

    const doesServerExists = await db.server.findUnique({
        where: {
            inviteCode: params.inviteCode
        }
    })
    if (!doesServerExists) {
        return redirect("/");
    }
    const existingMember = await db.server.findUnique({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingMember) {
        return redirect(`/servers/${existingMember.id}`)
    }

    const newMember = await db.server.update({
        where: {
            inviteCode: params.inviteCode
        },
        data: {
            members: {
                create: {
                    profileId: profile.id
                }
            }
        }
    })

    if(newMember){
        return redirect(`/servers/${newMember.id}`)

    }
    return redirect('/');
}
import currentProfile from "@/lib/current-profile";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ServerIdPage = async (props: { params: Promise<{ serverId: string }> }) => {
  const params = await props.params;
  const { serverId } = params;
  const profile = await currentProfile();
  const {redirectToSignIn}=await auth();
  if (!profile) {
    return redirectToSignIn();
  }

  const data = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: { name: "general" },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const initialChannel = data?.channels?.[0];

  if (initialChannel && initialChannel.name !== "general") {
    return null;
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel?.id}`);
};

export default ServerIdPage;

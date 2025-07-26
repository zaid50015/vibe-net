import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/app/type";
import currentProfilePageRouter from "@/lib/current-profile-page";
import db from "@/lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method === "POST") {
    try {
      const user = await currentProfilePageRouter(req);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const { channelId, serverId } = req.query;
      const { content, fileUrl } = req.body;
      const server = await db.server.findUnique({
        where: {
          id: serverId as string,
          members: { some: { profileId: user.id } },
        },
        include: {
          members: true,
        },
      });
      if (!server) {
        res.status(404).json({ message: "Server not found" });
        return;
      }
      const member = server.members.find(
        (member) => member.profileId === user.id
      );
      if (!member) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const channel = await db.channel.findUnique({
        where: {
          id: channelId as string,
          serverId: server.id,
        },
      });

      if (!channel) {
        res.status(404).json({ message: "Channel not found" });
        return;
      }
      const message = await db.message.create({
        data: {
          content,
          fileUrl,
          channelId: channelId as string,
          memberId: member.id,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });

      const channelKey = `chat:${channelId}:messages`;
      if (res?.socket?.server?.io) {
        console.log("socket is connect on backend add");
      }
      res?.socket?.server?.io?.emit(channelKey, message);
      return res.status(200).json(message);
    } catch (error) {
      console.log("Messages_POST", error);
      return res.status(500).json({ message: "Internal error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

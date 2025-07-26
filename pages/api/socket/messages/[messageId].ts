import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/app/type";
import currentProfilePageRouter from "@/lib/current-profile-page";
import db from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "PATCH" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await currentProfilePageRouter(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { channelId, serverId, messageId } = req.query;

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
      return res.status(404).json({ message: "Server not found" });
    }
    const member = server.members.find(
      (member) => member.profileId === user.id
    );

    if (!member) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const channel = await db.channel.findUnique({
      where: {
        id: channelId as string,
        serverId: server.id,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    let message = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ message: "Message not allowed" });
    }

    const isOwner = message.memberId === member.id;
    const isAdmin = member.role == MemberRole.ADMIN;
    const isModerator = (member.role = MemberRole.MODERATOR);
    const canModify = isAdmin || isOwner || isModerator;
    let deleteMessage = "";
    if (isOwner) {
      deleteMessage = "Owner";
    } else if (isModerator) {
      deleteMessage = "Moderator";
    } else {
      deleteMessage = "Admin";
    }
    if (!canModify) {
      return res.status(401).json({ error: "Not allowed" });
    }
    if (req.method === "DELETE") {
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
        },
        data: {
          deleted: true,
          fileUrl: null,
          content: "This message was deleted by" + deleteMessage,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else if (req.method == "PATCH" && isOwner) {
      const { content } = req.body;
      message = await db.message.update({
        where: {
          id: messageId as string,
          channelId: channelId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else {
      return res.status(404).json({ message: "Unathorized request" });
    }

    const updateKey = `chat:${channelId}:messages:update`;
    if (res?.socket?.server?.io) {
      console.log("socket is connect on backend");
    }
    res?.socket?.server?.io?.emit(updateKey, message);
    return res.status(200).json(message);
  } catch (error) {
    console.log("Messages_POST", error);
    return res.status(500).json({ message: "Internal error" });
  }
}

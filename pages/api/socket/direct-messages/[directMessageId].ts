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

    const { directMessageId, coneversationId } = req.query;
    if (!directMessageId || !coneversationId) {
      return res.status(400).json({ message: "Invalid request" });
    }
    const conversation = await db.conversation.findFirst({
      where: {
        id: coneversationId as string,
        OR: [
          {
            memberOne:{
              profileId: user.id,
            }
          },
          {
            memberTwo:{
              profileId: user.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation.memberOne.profileId === user.id
        ? conversation.memberOne
        : conversation.memberTwo;

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: coneversationId as string,
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

    if (!directMessage || directMessage.deleted) {
      return res.status(401).json({ message: "Cannot perfrom this action" });
    }
    const deleteMessage = member.profile.name;

    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          deleted: true,
          fileUrl: null,
          content: "This message was deleted by " + deleteMessage,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    } else if (req.method == "PATCH") {
      const { content } = req.body;
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
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

    const updateKey = `chat:${directMessageId}:messages:update`;
    if (res?.socket?.server?.io) {
      console.log("socket is connect on backend");
    }
    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("DIRECT_MESSAG_SOCKET", error);
    return res.status(500).json({ message: "Internal error" });
  }
}

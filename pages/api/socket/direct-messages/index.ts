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
      const { conversationId } = req.query;
      const { content, fileUrl } = req.body;
      if (!conversationId) {
        return res.status(400).json({ message: "Missing parametes" });
      }
      if (!content && !fileUrl) {
        return res
          .status(400)
          .json({ message: "Content or fileUrl is required" });
      }
      const conversation = await db.conversation.findFirst({
        where: {
          id: conversationId as string,
          OR: [
            {
              memberOne: {
                profileId: user.id,
              },
              memberTwo: {
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
      const senderId =
        conversation.memberOne.profileId === user.id
          ? conversation.memberOne.profileId
          : conversation.memberTwo.profileId;
      if (!senderId)
        return res.status(404).json({ message: "Member not found" });
      const message = await db.directMessage.create({
        data: {
          content,
          fileUrl,
          memberId: senderId,
          conversationId: conversationId as string,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
      const channelKey = `chat:${conversationId}:messages`;
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

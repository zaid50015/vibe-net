import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface useSocketQueryProps {
  updateKey: string;
  addKey: string;
  queryKey: string;
}
type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

export const useChatSocket = ({
  updateKey,
  addKey,
  queryKey,
}: useSocketQueryProps) => {
  const { isConnected, socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("use-chat-socker-ran");
    if (!socket) return;

    socket.on(updateKey, (message: MessageWithMemberWithProfile) => {
      console.log("update socket hit.");
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData?.pages || oldData?.pages?.length === 0) {
          return oldData;
        }
        const newData = oldData?.pages?.map((page: any) => {
          return {
            ...page,
            items: page?.items?.map((item: MessageWithMemberWithProfile) => {
              if (message.id == item.id) return message;
              return item;
            }),
          };
        });

        return { ...oldData, pages: newData };
      });
    });

    socket.on(addKey, (message: MessageWithMemberWithProfile) => {
      console.log("add socket hit.");
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }
        const newData = [ ...oldData.pages ];
        newData[0] = { ...newData[0], items: [message, ...newData[0].items] };
        return { ...oldData, pages: newData };
      });
    });
    return () => {
      socket.off(updateKey);
      socket.off(addKey);
    };
  }, [addKey, updateKey, queryKey, socket, queryClient]);
};

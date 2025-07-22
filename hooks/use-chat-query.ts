
import qs from 'query-string';
import { useInfiniteQuery } from '@tanstack/react-query';


import axios from 'axios';
import { useSocket } from '@/components/providers/socket-provider';

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
}

// apiUrl="/api/messages"
//  paramKey="channelId"
// paramValue={channel.id}
//queryKey="chat:{chatId}"
export const useChatQuery = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  // This function is responsible for fetching a page of messages.
  // `pageParam` is the cursor provided by `useInfiniteQuery` for pagination.
  const fetchMessages = async ({ pageParam }: { pageParam?: string }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    try {
        const response = await axios.get(url, {
            headers: {
            'Content-Type': 'application/json',
            },
        });
    
        // Return the data in the format expected by `useInfiniteQuery`.
        console.log("Response_message",response)
        return {
            messages: response.data.messages,
            nextCursor: response.data.nextCursor,
        };
        
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
        
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],

      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      // Refetch every second if the socket is not connected.
      refetchInterval: 1000,
      // It's good practice to set an initial page parameter.
      initialPageParam: undefined,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
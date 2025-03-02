

import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
import { getOrCreateConversation } from '@/lib/conversation';
import currentProfile from '@/lib/current-profile';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect, useParams } from 'next/navigation';
import { FC } from 'react';

interface MemberIdPageProps {
    params: {
      memberId: string;
      serverId: string;
    };
  }
const ConversationPage: FC<MemberIdPageProps> = async({ params }) => {
    const { serverId, memberId } =params
    const profile=await currentProfile();
    const {redirectToSignIn}=await auth();
    if(!profile){
        return redirectToSignIn();
    }
 
    //Here we are checking if the current user is a member of the server and each new server will have new one on one conversation with users
    const currentMember=await db.member.findFirst({
        where:{
            serverId,
            profileId:profile.id
        },
        include:{
            profile:true
        }
    })


if(!currentMember){
    return redirect(`/`);
}


const conversation = await getOrCreateConversation(
    currentMember.id,
    memberId
  );

  if (!conversation) return redirect(`/servers/${serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
        <ChatHeader
          imageUrl={otherMember.profile.imageUrl}
          name={otherMember.profile.name}
          serverId={params.serverId}
          type="conversation"
        />

        <div className="flex-1">Messages</div>

        <ChatInput name={otherMember.profile.name} type={'conversation'} apiUrl={`/api/socket/direct-messages`}  query={{ conversationId: conversation.id }}/>
        </div>
    );
};

export default ConversationPage;
import currentProfile from '@/lib/current-profile';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { FC} from 'react';
import ChatHeader from '@/components/chat/chat-header';
import ChatInput from '@/components/chat/chat-input';
interface ChannelPageProps {
    params: {
        serverId: string;
        channelId: string;
    }
}
const ChannelPage:FC<ChannelPageProps> = async({params}) => {
    const { serverId, channelId } = params;
    const profile = await currentProfile();
    const {redirectToSignIn}=await auth();
    if (!profile) {
        return redirectToSignIn();
    }
    const channel=await db.channel.findUnique({
        where: {
            id: channelId,
            serverId: serverId,
        },
    });
    // check if current user is a member of the server
    const member=await db.member.findFirst({where:{
        serverId:serverId,
        profileId:profile.id,
    }});
    if(!channel||!member){
        redirect('/');
    }
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader serverId={serverId} name={channel.name} type={'channel'}/>
            <div className="flex-1"> Messages</div>
            <ChatInput name={channel.name} type={'channel'} apiUrl={`/api/socket/messages`} query={{channelId,serverId}}/>
        </div>
    );
};

export default ChannelPage;
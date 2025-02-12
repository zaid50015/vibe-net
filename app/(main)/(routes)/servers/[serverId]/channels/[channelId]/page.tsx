import currentProfile from '@/lib/current-profile';
import db from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React, { FC} from 'react';
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
    const member=await db.member.findFirst({where:{
        serverId:serverId,
        profileId:profile.id,
    }});
    if(!channel||!member){
        redirect('/');
    }
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <h1>Server ID: {serverId}</h1>
            <h2>Channel ID: {channelId}</h2>
            <p>Welcome to the channel page!</p>
        </div>
    );
};

export default ChannelPage;
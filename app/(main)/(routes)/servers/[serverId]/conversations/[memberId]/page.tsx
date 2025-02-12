'use client';

import { useParams } from 'next/navigation';


const ConversationPage: React.FC = () => {
    const { serverId, memberId } = useParams<{ serverId: string; memberId: string }>();

    return (
        <div>
            <h1>Server ID: {serverId}</h1>
            <h2>Member ID: {memberId}</h2>
            <p>Welcome to the Conversation page!</p>
        </div>
    );
};

export default ConversationPage;
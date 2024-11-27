import db from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile'
import React from 'react'

const SetUpPage = async() => {
    const profile =await initialProfile();
  
    const servers=await db.server.findFirst({
        where:{
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    });
    console.log(servers)
  return (
    <div>Create a server</div>
  )
}

export default SetUpPage

import InitialModal from '@/components/modals/InitialModal';
import db from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile'
import { redirect } from 'next/navigation';

const SetUpPage = async() => {
   try {
    const profile =await initialProfile();
  
    const server=await db.server.findFirst({
        where:{
            members:{
                some:{
                    profileId:profile.id
                }
            }
        }
    });
    if (server) {
        console.log("reloaded")
        redirect(`/servers/${server.id}`);
    }
   } catch (error) {
      console.log("[CURRENT_PROFILE]" +error)
   }
   
  return (
    <InitialModal/>
  )
}

export default SetUpPage
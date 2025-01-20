import currentProfile from "@/lib/current-profile";
import NavigationAction from "./navigation-action";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavigationItems } from "@/components/navigation/navigation-item";
import { ModeToggle } from "../ui/toggle-theme";
import { UserButton } from "@clerk/nextjs";

const NavigationSideBar = async () => {
  const profile = await currentProfile();
  if (!profile) {
    redirect("/");
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  })
  return (
    <div className="h-full w-full flex flex-col items-center space-y-4 dark:bg-zinc-800 py-3  text-primary bg-slate-100" >
      <NavigationAction />
      <Separator className="h-1 w-10 dark:bg-zinc-700 bg-zinc-300 rounded-md" />
      <ScrollArea className="flex-1 w-full d">
        {
          servers.map((server) => (
            <div key={server.id} className="mb-2">
              <NavigationItems id={server.id} name={server.name} imageUrl={server.imageUrl} />
            </div>
          ))
        }
      </ScrollArea>
      <div className="flex flex-col items-center mt-auto gap-y-3 pb-3">
        <ModeToggle />
        <UserButton appearance={{
          elements: {
            avatarBox: 'h-[48px] w-[48px]',
          },
        }} />
      </div>
    </div>
  )
}

export default NavigationSideBar;
import { Menu,} from "lucide-react";
import { FC } from "react";
import { SheetContent, SheetTrigger,Sheet } from "./ui/sheet";
import { Button } from "./ui/button";
import NavigationSideBar from "./navigation/navigation-sidebar";
import { ServerSideBar } from "./server/server-sidebar";

interface MobileToggleProps {
    serverId: string;
  }
 const MobileToggle:FC<MobileToggleProps>= ({ serverId }) => {
return(
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon"><Menu/></Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSideBar />
        </div>
        <ServerSideBar serverId={serverId} />

      </SheetContent>
      </Sheet>
)


}
export default MobileToggle;

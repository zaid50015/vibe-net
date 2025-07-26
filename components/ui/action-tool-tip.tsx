import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FC } from "react";

interface ActionTollTipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const ActionTollTip: FC<ActionTollTipProps> = ({
  label,
  children,
  side = "right",
  align = "center",
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        {/* Wrap in span to ensure valid DOM node for trigger */}
        <TooltipTrigger asChild>
          <span className="cursor-pointer">{children}</span>
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

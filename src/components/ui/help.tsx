import { FC, ReactNode } from "react";
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HelpProps {
  children: ReactNode;
  className?: string;
}

export const Help: FC<HelpProps> = ({ children, className }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HelpCircle
          className={`h-3 w-3 text-muted-foreground opacity-50 hover:opacity-100${
            className ?? ""
          }`}
        />
      </TooltipTrigger>
      <TooltipContent>
        <p className="max-w-xs">{children}</p>
      </TooltipContent>
    </Tooltip>
  );
};

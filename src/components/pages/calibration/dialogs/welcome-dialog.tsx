import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeDialog: FC<WelcomeDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            Welcome to calibrew!
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4 text-center text-sm text-muted-foreground">
            <p>
              Calibrew helps you dial in your espresso machine by automatically
              recommending optimized settings.
            </p>
            <p className="font-bold">
              To get the perfect extraction, you'll need:
            </p>
            <ul className="list-disc list-inside space-y-2 font-medium">
              <li>an espresso machine (duh)</li>
              <li>an adjustable coffee grinder</li>
              <li>a scale</li>
            </ul>
            <p>Those are necessary for the tool to work.</p>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            Let's Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

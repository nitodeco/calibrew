import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coffee } from "lucide-react";
import { useTranslations } from "next-intl";

interface WelcomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WelcomeDialog: FC<WelcomeDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Coffee className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            {t("Dialogs.Welcome.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-4 text-center text-sm text-muted-foreground">
            <p>{t("Dialogs.Welcome.header")}</p>
            <p className="font-bold">
              {t("Dialogs.Welcome.instructions.title")}
            </p>
            <ul className="list-disc list-inside space-y-2 font-medium">
              <li>{t("Dialogs.Welcome.instructions.step1")}</li>
              <li>{t("Dialogs.Welcome.instructions.step2")}</li>
              <li>{t("Dialogs.Welcome.instructions.step3")}</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            size="lg"
            onClick={() => onOpenChange(false)}
          >
            {t("Dialogs.Welcome.continue")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

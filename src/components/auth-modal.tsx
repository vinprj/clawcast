import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, ArrowRight } from "lucide-react";
import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  onUsernameChange: (username: string) => void;
  onSave: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  username,
  onUsernameChange,
  onSave,
}: AuthModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSave();
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-claw-orange to-claw-purple">
            <User className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl">Set Your Username</DialogTitle>
          <DialogDescription>
            Choose a display name to show on your votes and track your contributions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Enter username..."
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
          />
          <Button
            variant="gradient"
            fullWidth
            isLoading={isSubmitting}
            onClick={handleSubmit}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {username ? "Save Username" : "Continue Anonymously"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

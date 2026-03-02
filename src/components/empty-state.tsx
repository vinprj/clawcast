import { Button } from "@/components/ui/button";
import { Package, Search, Sparkles } from "lucide-react";

interface EmptyStateProps {
  type: "no-skills" | "no-results" | "loading";
  onAction?: () => void;
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const configs = {
    "no-skills": {
      icon: Package,
      title: "No skills loaded yet",
      description: "Initialize the database with top ClawHub skills to get started.",
      action: {
        label: "Initialize Skills",
        icon: Sparkles,
      },
    },
    "no-results": {
      icon: Search,
      title: "No matching skills",
      description: "Try a different search term or browse all skills.",
      action: null,
    },
    "loading": {
      icon: Package,
      title: "Loading skills...",
      description: "Please wait while we fetch the latest data.",
      action: null,
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/50 px-4 py-12 text-center sm:py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/50 sm:h-20 sm:w-20">
        <Icon className="h-8 w-8 text-muted-foreground sm:h-10 sm:w-10" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-foreground sm:text-xl">
        {config.title}
      </h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {config.description}
      </p>
      {config.action && onAction && (
        <Button
          variant="gradient"
          className="mt-6 gap-2"
          onClick={onAction}
          leftIcon={<config.action.icon className="h-4 w-4" />}
        >
          {config.action.label}
        </Button>
      )}
    </div>
  );
}

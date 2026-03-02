import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "card" | "text" | "circle" | "avatar";
  lines?: number;
}

function Skeleton({
  className,
  variant = "default",
  lines = 1,
  ...props
}: SkeletonProps) {
  const baseClasses = "animate-pulse rounded-md bg-muted";

  if (variant === "text" && lines > 1) {
    return (
      <div className={cn("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              baseClasses,
              "h-4 w-full",
              i === lines - 1 && "w-4/5"
            )}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    default: "h-4 w-full",
    card: "h-24 w-full",
    text: "h-4 w-full",
    circle: "h-10 w-10 rounded-full",
    avatar: "h-12 w-12 rounded-full",
  };

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      {...props}
    />
  );
}

// Pre-built skeleton layouts
function SkillCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4">
      <Skeleton variant="circle" className="h-12 w-12 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-10 w-16 shrink-0 rounded-lg" />
    </div>
  );
}

function LeaderboardItemSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/50 bg-card p-4">
      <Skeleton className="h-8 w-8 shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <Skeleton className="h-3 w-1/6" />
        <Skeleton className="h-1 w-full" />
      </div>
      <div className="text-right">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="mt-1 h-3 w-8" />
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="space-y-4 text-center">
      <Skeleton className="mx-auto h-6 w-32 rounded-full" />
      <Skeleton className="mx-auto h-12 w-3/4 max-w-md" />
      <Skeleton className="mx-auto h-4 w-1/2 max-w-sm" />
      <div className="flex justify-center gap-2 pt-4">
        <Skeleton className="h-10 w-32 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export { Skeleton, SkillCardSkeleton, LeaderboardItemSkeleton, HeroSkeleton };

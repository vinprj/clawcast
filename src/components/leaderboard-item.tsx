import { cn } from "@/lib/utils";
import { Medal } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  author: string;
  url: string;
  voteCount: number;
}

interface LeaderboardItemProps {
  skill: Skill;
  index: number;
  maxVotes: number;
}

export function LeaderboardItem({ skill, index, maxVotes }: LeaderboardItemProps) {
  const isTop3 = index < 3;
  const progressPct = Math.round(((skill.voteCount || 0) / maxVotes) * 100);

  const rankStyles = [
    "border-claw-gold/30 bg-claw-gold/5",
    "border-claw-silver/30 bg-claw-silver/5", 
    "border-claw-bronze/30 bg-claw-bronze/5",
  ];

  const progressColors = [
    "from-claw-gold to-amber-300",
    "from-claw-silver to-slate-300",
    "from-claw-bronze to-amber-400",
    "from-claw-orange to-amber-500",
  ];

  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 transition-all duration-300 hover:translate-x-1 hover:border-border hover:shadow-lg hover:shadow-black/20 sm:gap-4 sm:p-4",
        isTop3 && rankStyles[index]
      )}
    >
      {/* Rank */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center sm:h-12 sm:w-12">
        {index === 0 && <Medal className="h-7 w-7 text-claw-gold sm:h-8 sm:w-8" />}
        {index === 1 && <Medal className="h-7 w-7 text-claw-silver sm:h-8 sm:w-8" />}
        {index === 2 && <Medal className="h-7 w-7 text-claw-bronze sm:h-8 sm:w-8" />}
        {index > 2 && (
          <span className="text-sm font-bold text-muted-foreground sm:text-base">
            {index + 1}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
          {skill.name}
        </h3>
        <p className="text-xs text-muted-foreground sm:text-sm">
          by {skill.author}
        </p>
        
        {/* Progress bar */}
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out",
              progressColors[Math.min(index, 3)]
            )}
            style={{ width: `${Math.max(progressPct, 4)}%` }}
          />
        </div>
      </div>

      {/* Votes */}
      <div className="shrink-0 text-right">
        <span
          className={cn(
            "block text-lg font-bold sm:text-xl",
            index === 0 && "text-claw-gold",
            index === 1 && "text-claw-silver",
            index === 2 && "text-claw-bronze",
            index > 2 && "text-foreground"
          )}
        >
          {skill.voteCount || 0}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
          votes
        </span>
      </div>
    </a>
  );
}

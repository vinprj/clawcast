import { Button } from "@/components/ui/button";
import { cn, formatNumber } from "@/lib/utils";
import { ArrowUp, ExternalLink, Star, User } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  description: string;
  author: string;
  stars: number;
  url: string;
  voteCount: number;
}

interface SkillCardProps {
  skill: Skill;
  index: number;
  hasVoted: boolean;
  isVoting: boolean;
  onVote: () => void;
}

export function SkillCard({ skill, index, hasVoted, isVoting, onVote }: SkillCardProps) {
  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-xl hover:shadow-black/20 sm:gap-4 sm:p-4">
      {/* Rank */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary/50 text-xs font-bold text-muted-foreground sm:h-12 sm:w-12 sm:text-sm">
        #{index + 1}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
            {skill.name}
          </h3>
          <a
            href={skill.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>
        </div>
        
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:mt-1 sm:text-sm">
          {skill.description}
        </p>
        
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[100px] sm:max-w-[150px]">{skill.author}</span>
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3" />
            {formatNumber(skill.stars)}
          </span>
        </div>
      </div>

      {/* Vote Button */}
      <Button
        variant={hasVoted ? "default" : "secondary"}
        size="sm"
        onClick={onVote}
        disabled={isVoting}
        isLoading={isVoting}
        className={cn(
          "h-auto min-h-[44px] shrink-0 flex-col gap-0.5 rounded-lg px-3 py-2 transition-all duration-200 sm:px-4",
          hasVoted 
            ? "bg-claw-orange text-white shadow-lg shadow-claw-orange/25 hover:bg-claw-orange-hover" 
            : "hover:border-claw-orange/50 hover:text-claw-orange"
        )}
      >
        <ArrowUp className={cn("h-4 w-4", hasVoted && "fill-current")} />
        <span className="text-xs font-bold">{skill.voteCount || 0}</span>
      </Button>
    </div>
  );
}

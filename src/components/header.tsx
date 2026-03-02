import { Button } from "@/components/ui/button";
import { Badge } from "lucide-react";
import { Target, Layers, Trophy } from "lucide-react";

interface HeaderProps {
  skillsCount: number;
  totalVotes: number;
  username: string | null;
  onOpenAuth: () => void;
}

export function Header({ skillsCount, totalVotes, username, onOpenAuth }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-claw-orange to-amber-500 shadow-lg shadow-claw-orange/20">
            <Target className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="gradient-claw-text">Claw</span>
            <span className="text-foreground">Cast</span>
          </span>
        </div>

        {/* Stats - Hidden on mobile */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">{skillsCount}</span>
            <span className="text-xs text-muted-foreground">skills</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-3 py-1.5">
            <Trophy className="h-4 w-4 text-claw-gold" />
            <span className="text-sm font-semibold text-foreground">{totalVotes}</span>
            <span className="text-xs text-muted-foreground">votes</span>
          </div>
        </div>

        {/* User Section */}
        <div>
          {username ? (
            <Button
              variant="ghost"
              onClick={onOpenAuth}
              className="group gap-2 rounded-full border border-border/50 px-3 hover:border-claw-orange/50 hover:bg-claw-orange/5"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-claw-orange to-claw-purple text-xs font-bold text-white">
                {username[0].toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-muted-foreground group-hover:text-foreground sm:inline">
                @{username}
              </span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenAuth}
              className="gap-2 rounded-full border-claw-orange/30 text-claw-orange hover:bg-claw-orange/10 hover:text-claw-orange"
            >
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

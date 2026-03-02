import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

// UI Components
import { Button } from "@/components/ui/button";
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  useToast,
  ToastIcon,
} from "@/components/ui/toast";
import {
  SkillCardSkeleton,
  LeaderboardItemSkeleton,
  HeroSkeleton,
} from "@/components/ui/skeleton";

// Feature Components
import { Header } from "@/components/header";
import { SkillCard } from "@/components/skill-card";
import { LeaderboardItem } from "@/components/leaderboard-item";
import { SearchBar } from "@/components/search-bar";
import { EmptyState } from "@/components/empty-state";
import { AuthModal } from "@/components/auth-modal";

// Icons
import { Search, Trophy, Sparkles, RefreshCw } from "lucide-react";

// Types
interface Skill {
  _id: string;
  name: string;
  slug: string;
  description: string;
  author: string;
  stars: number;
  url: string;
  voteCount: number;
}

function AppContent() {
  const [view, setView] = useState<"browse" | "leaderboard">("browse");
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoting, setIsVoting] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);

  const { toast, toasts, dismiss } = useToast();

  // Convex queries
  const skills = useQuery(api.functions.getSkills) ?? [];
  const leaderboard = useQuery(api.functions.getLeaderboard) ?? [];
  const userVotes = useQuery(api.functions.getUserVotes, { userId }) ?? [];

  // Convex mutations
  const voteMutation = useMutation(api.functions.vote);
  const seedMutation = useMutation(api.functions.seedSkills);
  const upsertUserMutation = useMutation(api.functions.upsertUser);

  // Initialize user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("clawcast_user");
    if (stored) {
      const { id, username: storedUsername } = JSON.parse(stored);
      setUserId(id);
      setUsername(storedUsername || "");
    } else {
      const anonId = "anon_" + Math.random().toString(36).substr(2, 9);
      setUserId(anonId);
      localStorage.setItem(
        "clawcast_user",
        JSON.stringify({ id: anonId, username: "" })
      );
    }
  }, []);

  // Upsert user when ID or username changes
  useEffect(() => {
    if (userId) {
      upsertUserMutation({
        anonymousId: userId,
        username: username || undefined,
      });
    }
  }, [userId, username]);

  // Filter skills based on search query
  const filteredSkills = useMemo(() => {
    if (!searchQuery.trim()) return skills;
    const query = searchQuery.toLowerCase();
    return skills.filter(
      (skill: Skill) =>
        skill.name.toLowerCase().includes(query) ||
        skill.description?.toLowerCase().includes(query) ||
        skill.author?.toLowerCase().includes(query)
    );
  }, [skills, searchQuery]);

  // Calculate total votes
  const totalVotes = useMemo(
    () => skills.reduce((sum: number, skill: Skill) => sum + (skill.voteCount || 0), 0),
    [skills]
  );

  // Calculate max votes for leaderboard progress
  const maxVotes = useMemo(
    () => (leaderboard.length > 0 ? (leaderboard[0] as Skill).voteCount || 1 : 1),
    [leaderboard]
  );

  // Handle vote
  const handleVote = async (skillId: string) => {
    if (!userId) return;
    
    setIsVoting(skillId);
    try {
      const result = await voteMutation({ skillId: skillId as any, userId });
      
      if (result.success) {
        toast({
          title: "Vote recorded!",
          description: "Your vote has been counted.",
          variant: "success",
        });
      } else {
        toast({
          title: "Vote removed",
          description: "Your vote has been removed.",
          variant: "info",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "error",
      });
    }
    setIsVoting(null);
  };

  // Handle seed skills
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      const result = await seedMutation({});
      toast({
        title: "Skills initialized!",
        description: result.message || "Top ClawHub skills have been loaded.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Already initialized",
        description: "Skills are already loaded in the database.",
        variant: "info",
      });
    }
    setIsSeeding(false);
  };

  // Handle set username
  const handleSetUsername = async () => {
    localStorage.setItem(
      "clawcast_user",
      JSON.stringify({ id: userId, username })
    );
    setShowAuth(false);
    
    if (username) {
      toast({
        title: "Welcome!",
        description: `You're now voting as @${username}`,
        variant: "success",
      });
    }
  };

  // Loading state
  const isLoading = skills.length === 0 && !searchQuery;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-claw-orange/10 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-claw-purple/10 blur-[120px]" />
      </div>

      <div className="relative">
        <Header
          skillsCount={skills.length}
          totalVotes={totalVotes}
          username={username || null}
          onOpenAuth={() => setShowAuth(true)}
        />

        <main className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12">
          {/* Hero Section */}
          {isLoading ? (
            <HeroSkeleton />
          ) : (
            <section className="mb-8 text-center sm:mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-claw-orange/30 bg-claw-orange/10 px-3 py-1 text-xs font-medium text-claw-orange sm:px-4 sm:text-sm">
                <Sparkles className="h-3.5 w-3.5" />
                OpenClaw Ecosystem
              </div>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Discover & Vote for
                <br />
                <span className="gradient-claw-text">Top ClawHub Skills</span>
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
                Help the community find the best skills by casting your votes
              </p>

              {/* Tabs */}
              <div className="mt-8 inline-flex rounded-xl border border-border/50 bg-secondary/50 p-1">
                <Button
                  variant={view === "browse" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("browse")}
                  leftIcon={<Search className="h-4 w-4" />}
                  className={view === "browse" ? "shadow-lg" : ""}
                >
                  Browse Skills
                </Button>
                <Button
                  variant={view === "leaderboard" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setView("leaderboard")}
                  leftIcon={<Trophy className="h-4 w-4" />}
                  className={view === "leaderboard" ? "shadow-lg" : ""}
                >
                  Leaderboard
                </Button>
              </div>
            </section>
          )}

          {/* Search Bar - Only in browse view */}
          {view === "browse" && skills.length > 0 && (
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search skills by name, description, or author..."
              />
            </div>
          )}

          {/* Empty State - No skills loaded */}
          {skills.length === 0 && !isLoading && (
            <EmptyState type="no-skills" onAction={handleSeed} />
          )}

          {/* Content */}
          {skills.length > 0 && (
            <>
              {view === "browse" ? (
                <div className="space-y-3">
                  {filteredSkills.length === 0 ? (
                    <EmptyState type="no-results" />
                  ) : (
                    filteredSkills.map((skill: Skill, idx: number) => (
                      <SkillCard
                        key={skill._id}
                        skill={skill}
                        index={idx}
                        hasVoted={userVotes.includes(skill._id)}
                        isVoting={isVoting === skill._id}
                        onVote={() => handleVote(skill._id)}
                      />
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((skill: Skill, idx: number) => (
                    <LeaderboardItem
                      key={skill._id}
                      skill={skill}
                      index={idx}
                      maxVotes={maxVotes}
                    />
                  ))}
                </div>
              )}

              {/* Footer Actions */}
              <div className="mt-8 flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSeed}
                  isLoading={isSeeding}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Re-initialize Skills
                </Button>
              </div>
            </>
          )}
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
          username={username}
          onUsernameChange={setUsername}
          onSave={handleSetUsername}
        />

        {/* Toast Notifications */}
        <ToastViewport />
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant}>
            <div className="flex items-start gap-3">
              <ToastIcon variant={t.variant} />
              <div className="flex-1">
                {t.title && <ToastTitle>{t.title}</ToastTitle>}
                {t.description && (
                  <ToastDescription>{t.description}</ToastDescription>
                )}
              </div>
            </div>
            <ToastClose onClick={() => dismiss(t.id)} />
          </Toast>
        ))}
      </div>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;

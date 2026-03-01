import { useState, useEffect } from "react";
import { useQuery, useMutation } from "./convex/react";
import { api } from "./convex/_generated/api";
import "./App.css";

function App() {
  const [view, setView] = useState<"browse" | "leaderboard">("browse");
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isVoting, setIsVoting] = useState<string | null>(null);

  const skills = useQuery(api.functions.getSkills) ?? [];
  const leaderboard = useQuery(api.functions.getLeaderboard) ?? [];
  const userVotes = useQuery(api.functions.getUserVotes, { userId }) ?? [];

  const voteMutation = useMutation(api.functions.vote);
  const seedMutation = useMutation(api.functions.seedSkills);
  const upsertUserMutation = useMutation(api.functions.upsertUser);

  useEffect(() => {
    const stored = localStorage.getItem("clawcast_user");
    if (stored) {
      const { id, username } = JSON.parse(stored);
      setUserId(id);
      setUsername(username || "");
    } else {
      const anonId = "anon_" + Math.random().toString(36).substr(2, 9);
      setUserId(anonId);
      localStorage.setItem("clawcast_user", JSON.stringify({ id: anonId, username: "" }));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      upsertUserMutation({ anonymousId: userId, username: username || undefined });
    }
  }, [userId, username]);

  const handleVote = async (skillId: string) => {
    setIsVoting(skillId);
    await voteMutation({ skillId: skillId as any, userId });
    setIsVoting(null);
  };

  const handleSeed = async () => {
    await seedMutation({});
  };

  const handleSetUsername = () => {
    localStorage.setItem("clawcast_user", JSON.stringify({ id: userId, username }));
    setShowAuth(false);
  };

  const filteredSkills = skills.filter((skill: any) =>
    skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    skill.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalVotes = skills.reduce((sum: number, skill: any) => sum + (skill.voteCount || 0), 0);
  const maxVotes = leaderboard.length > 0 ? (leaderboard[0] as any).voteCount || 1 : 1;

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">ClawCast</span>
        </div>
        <nav className="header-stats">
          <div className="stat-pill">
            <span className="stat-value">{skills.length}</span>
            <span className="stat-label">skills</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{totalVotes}</span>
            <span className="stat-label">votes</span>
          </div>
        </nav>
        <div className="user-section">
          {username ? (
            <button onClick={() => setShowAuth(true)} className="user-badge">
              <span className="user-avatar">{username[0].toUpperCase()}</span>
              <span className="username">@{username}</span>
            </button>
          ) : (
            <button onClick={() => setShowAuth(true)} className="login-btn">
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <div className="hero-badge">OpenClaw Ecosystem</div>
          <h1 className="hero-title">
            Discover &amp; Vote for
            <br />
            <span className="gradient-text">Top ClawHub Skills</span>
          </h1>
          <p className="hero-subtitle">
            Help the community find the best skills by casting your votes
          </p>
          <div className="tabs">
            <button
              className={`tab ${view === "browse" ? "active" : ""}`}
              onClick={() => setView("browse")}
            >
              <span className="tab-icon">🔍</span>
              Browse Skills
            </button>
            <button
              className={`tab ${view === "leaderboard" ? "active" : ""}`}
              onClick={() => setView("leaderboard")}
            >
              <span className="tab-icon">🏆</span>
              Leaderboard
            </button>
          </div>
        </section>

        {view === "browse" && (
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search skills by name, description, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>
        )}

        {skills.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No skills loaded yet</h3>
            <p>Initialize the database with top ClawHub skills to get started</p>
            <button onClick={handleSeed} className="seed-btn primary">
              Initialize Skills
            </button>
          </div>
        )}

        {skills.length > 0 && (
          <>
            {view === "browse" ? (
              <div className="skills-grid">
                {filteredSkills.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">🔎</div>
                    <h3>No matching skills</h3>
                    <p>Try a different search term</p>
                  </div>
                ) : (
                  filteredSkills.map((skill: any, idx: number) => (
                    <div key={skill._id} className="skill-card">
                      <div className="skill-rank">
                        <span className="rank-number">#{idx + 1}</span>
                      </div>
                      <div className="skill-content">
                        <div className="skill-header">
                          <h3 className="skill-name">{skill.name}</h3>
                          <a
                            href={skill.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="skill-link"
                          >
                            ↗
                          </a>
                        </div>
                        <p className="skill-description">{skill.description}</p>
                        <div className="skill-meta">
                          <span className="skill-author">
                            <span className="author-dot"></span>
                            {skill.author}
                          </span>
                          <span className="skill-stars">★ {Math.round(skill.stars / 1000)}k</span>
                        </div>
                      </div>
                      <div className="skill-stats">
                        <button
                          className={`vote-btn ${userVotes.includes(skill._id) ? "voted" : ""} ${isVoting === skill._id ? "voting" : ""}`}
                          onClick={() => handleVote(skill._id)}
                        >
                          <span className="vote-arrow">▲</span>
                          <span className="vote-count">{skill.voteCount || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="leaderboard">
                {leaderboard.map((skill: any, idx: number) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  const progressPct = Math.round(((skill.voteCount || 0) / maxVotes) * 100);
                  return (
                    <a
                      key={skill._id}
                      href={skill.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`leaderboard-item ${idx < 3 ? `top-${idx + 1}` : ""}`}
                    >
                      <div className="rank">
                        {idx < 3 ? medals[idx] : <span className="rank-num">{idx + 1}</span>}
                      </div>
                      <div className="info">
                        <h3>{skill.name}</h3>
                        <span className="lb-author">by {skill.author}</span>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
                        </div>
                      </div>
                      <div className="votes">
                        <span className="vote-count">{skill.voteCount || 0}</span>
                        <span className="vote-label">votes</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </>
        )}

        {skills.length > 0 && (
          <div className="footer-actions">
            <button onClick={handleSeed} className="seed-btn">
              ↻ Re-initialize Skills
            </button>
          </div>
        )}
      </main>

      {showAuth && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuth(false)}>✕</button>
            <div className="modal-icon">👤</div>
            <h2>Set Your Username</h2>
            <p className="modal-subtitle">Choose a display name to show on your votes</p>
            <input
              type="text"
              placeholder="Enter username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSetUsername()}
              autoFocus
            />
            <button onClick={handleSetUsername} className="btn-primary">
              {username ? "Save Username" : "Continue Anonymously"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

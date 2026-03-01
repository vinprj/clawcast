import { useState, useEffect } from "react";
import { useQuery, useMutation } from "./convex/react";
import { api } from "./convex/_generated/api";
import "./App.css";

function App() {
  const [view, setView] = useState<"browse" | "leaderboard">("browse");
  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [showAuth, setShowAuth] = useState(false);

  // Get skills with vote counts
  const skills = useQuery(api.functions.getSkills) ?? [];
  const leaderboard = useQuery(api.functions.getLeaderboard) ?? [];
  const userVotes = useQuery(api.functions.getUserVotes, { userId }) ?? [];
  
  const voteMutation = useMutation(api.functions.vote);
  const seedMutation = useMutation(api.functions.seedSkills);
  const upsertUserMutation = useMutation(api.functions.upsertUser);

  // Initialize user
  useEffect(() => {
    const stored = localStorage.getItem("clawcast_user");
    if (stored) {
      const { id, username } = JSON.parse(stored);
      setUserId(id);
      setUsername(username || "");
    } else {
      // Generate anonymous ID
      const anonId = "anon_" + Math.random().toString(36).substr(2, 9);
      setUserId(anonId);
      localStorage.setItem("clawcast_user", JSON.stringify({ id: anonId, username: "" }));
    }
  }, []);

  // Save user to Convex when we have an ID
  useEffect(() => {
    if (userId) {
      upsertUserMutation({ anonymousId: userId, username: username || undefined });
    }
  }, [userId, username]);

  const handleVote = async (skillId: string) => {
    await voteMutation({ skillId: skillId as any, userId });
  };

  const handleSeed = async () => {
    await seedMutation({});
  };

  const handleLogin = () => {
    setShowAuth(true);
  };

  const handleSetUsername = () => {
    localStorage.setItem("clawcast_user", JSON.stringify({ id: userId, username }));
    setShowAuth(false);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">🎯 ClawCast</div>
        <div className="user-section">
          {username ? (
            <span className="username">@{username}</span>
          ) : (
            <button onClick={handleLogin} className="login-btn">
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="main">
        <div className="hero">
          <h1>OpenClaw Skills Voting</h1>
          <p>Vote for the best skills from ClawHub</p>
          
          <div className="tabs">
            <button 
              className={`tab ${view === "browse" ? "active" : ""}`}
              onClick={() => setView("browse")}
            >
              Browse Skills
            </button>
            <button 
              className={`tab ${view === "leaderboard" ? "active" : ""}`}
              onClick={() => setView("leaderboard")}
            >
              Leaderboard
            </button>
          </div>
        </div>

        <button onClick={handleSeed} className="seed-btn">
          Initialize Skills (Run Once)
        </button>

        {view === "browse" ? (
          <div className="skills-grid">
            {skills.map((skill: any, idx: number) => (
              <a 
                key={skill._id} 
                href={skill.url}
                target="_blank"
                rel="noopener noreferrer"
                className="skill-card"
              >
                <div className="skill-rank">#{idx + 1}</div>
                <div className="skill-content">
                  <h3>{skill.name}</h3>
                  <p>{skill.description}</p>
                  <span className="skill-author">by {skill.author}</span>
                </div>
                <div className="skill-stats">
                  <div className="skill-votes">
                    <button 
                      className={`vote-btn ${userVotes.includes(skill._id) ? "voted" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleVote(skill._id);
                      }}
                    >
                      {userVotes.includes(skill._id) ? "✓" : "▲"}
                    </button>
                    <span className="vote-count">{skill.voteCount || 0}</span>
                  </div>
                  <span className="skill-stars">★ {Math.round(skill.stars / 1000)}k</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="leaderboard">
            {leaderboard.map((skill: any, idx: number) => (
              <a 
                key={skill._id} 
                href={skill.url}
                target="_blank"
                rel="noopener noreferrer"
                className="leaderboard-item"
              >
                <div className="rank">{idx + 1}</div>
                <div className="info">
                  <h3>{skill.name}</h3>
                  <span>by {skill.author}</span>
                </div>
                <div className="votes">
                  <span className="vote-count">{skill.voteCount || 0}</span>
                  <span className="vote-label">votes</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </main>

      {showAuth && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Sign in</h2>
            <input
              type="text"
              placeholder="Username (optional)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={handleSetUsername}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

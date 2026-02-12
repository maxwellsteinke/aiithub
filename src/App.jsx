import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { id: "all", label: "All", icon: "🌐" },
  { id: "sales", label: "AI for Sales", icon: "💼" },
  { id: "students", label: "AI for Students", icon: "🎓" },
  { id: "marketing", label: "AI for Marketing", icon: "📣" },
  { id: "coding", label: "AI for Coding", icon: "💻" },
  { id: "side-hustles", label: "AI Side Hustles", icon: "🚀" },
  { id: "automation", label: "AI Automation", icon: "⚙️" },
];

const SORT_OPTIONS = ["🔥 Hot", "🆕 New", "⬆️ Top"];

const SAMPLE_POSTS = [
  {
    id: 1,
    author: "promptKing",
    avatar: "PK",
    avatarColor: "#E8453C",
    category: "sales",
    timestamp: "2h ago",
    goal: "Automate cold email personalization for 500+ leads per week without hiring a VA",
    tool: "Clay + ChatGPT API + Instantly",
    prompt: `1. Scrape leads from LinkedIn Sales Nav → Clay\n2. Enrich with company data (funding, news, tech stack)\n3. Pass to GPT-4 with this prompt:\n\n"Write a 3-line cold email to {name} at {company}. Reference their recent {trigger_event}. Tie it to how {our_product} solves {pain_point}. Be conversational, not salesy. No fluff."\n\n4. Push to Instantly for sequencing`,
    result: "22% reply rate (up from 6% with templates). 3 closed deals in first month worth $47K.",
    timeSaved: "~15 hours/week",
    revenueImpact: "$47,000 in month one",
    upvotes: 847,
    comments: 64,
    forks: 203,
    saves: 412,
    verified: true,
    tags: ["cold-email", "lead-gen", "outbound"],
  },
  {
    id: 2,
    author: "studyWithAI",
    avatar: "SA",
    avatarColor: "#3B82F6",
    category: "students",
    timestamp: "5h ago",
    goal: "Turn dense textbook chapters into visual study guides with active recall questions",
    tool: "Claude + Napkin AI + Anki",
    prompt: `Upload chapter PDF to Claude with:\n\n"Analyze this chapter and create:\n1. A concept map showing relationships between key ideas\n2. 20 active recall questions (mix of factual + application)\n3. 5 common exam traps students fall for\n4. A 2-minute verbal summary I can record as audio"\n\nThen paste the concept map into Napkin AI for visual generation.\nExport Q&A to Anki with spaced repetition.`,
    result: "Went from B- to A+ average. Study time cut by 40%. Made my Anki deck public — 2,300 downloads.",
    timeSaved: "~8 hours/week",
    revenueImpact: null,
    upvotes: 623,
    comments: 89,
    forks: 341,
    saves: 567,
    verified: true,
    tags: ["study-hack", "anki", "exam-prep"],
  },
  {
    id: 3,
    author: "growthHacker_ai",
    avatar: "GH",
    avatarColor: "#10B981",
    category: "marketing",
    timestamp: "8h ago",
    goal: "Create 30 days of social content from a single long-form blog post",
    tool: "ChatGPT + Canva AI + Buffer",
    prompt: `Feed blog post to GPT-4:\n\n"From this blog post, extract:\n- 10 tweet threads (5 tweets each)\n- 10 LinkedIn carousel scripts (8 slides each)\n- 5 Instagram caption + hook combos\n- 5 short-form video scripts (30-60 sec)\n\nFor each: include a hook, value point, and CTA. Match tone: authoritative but approachable. Use data from the post as proof points."\n\nBatch generate Canva carousels with brand templates.\nSchedule everything in Buffer.`,
    result: "LinkedIn impressions went from 12K/mo to 340K/mo. Got 3 inbound podcast invitations.",
    timeSaved: "~20 hours/month",
    revenueImpact: "$12,000 in consulting leads",
    upvotes: 1204,
    comments: 156,
    forks: 489,
    saves: 723,
    verified: true,
    tags: ["content-repurpose", "social-media", "linkedin"],
  },
  {
    id: 4,
    author: "devAutomate",
    avatar: "DA",
    avatarColor: "#8B5CF6",
    category: "coding",
    timestamp: "12h ago",
    goal: "Auto-generate unit tests and documentation for legacy Python codebase",
    tool: "Claude Code + pytest + Sphinx",
    prompt: `Using Claude Code in terminal:\n\nclaude "Analyze /src directory. For each module:\n1. Generate pytest unit tests with edge cases\n2. Add Google-style docstrings to all functions\n3. Create a module-level README with architecture diagram\n4. Flag any security vulnerabilities or code smells\n\nPrioritize: core business logic > utilities > helpers"\n\nReview generated tests, run coverage report, iterate.`,
    result: "Test coverage: 12% → 87% in one weekend. Found 3 critical SQL injection vulnerabilities.",
    timeSaved: "~40 hours (estimated manual equivalent)",
    revenueImpact: "Prevented potential security breach",
    upvotes: 956,
    comments: 112,
    forks: 267,
    saves: 445,
    verified: true,
    tags: ["testing", "legacy-code", "security"],
  },
  {
    id: 5,
    author: "sideHustleAI",
    avatar: "SH",
    avatarColor: "#F59E0B",
    category: "side-hustles",
    timestamp: "1d ago",
    goal: "Launch a faceless YouTube channel generating $3K/mo in ad revenue",
    tool: "ChatGPT + ElevenLabs + Runway + Opus Clip",
    prompt: `Weekly workflow:\n\n1. GPT-4: "Write a 10-min YouTube script about {trending_topic} in the {niche} space. Structure: hook (15sec), problem, 3 solutions with examples, CTA. Conversational tone, no jargon."\n\n2. ElevenLabs: Generate voiceover with custom voice clone\n3. Runway Gen-3: Generate B-roll clips for key moments\n4. Edit in CapCut with stock footage + AI voiceover\n5. Opus Clip: Auto-generate 5 YouTube Shorts from long video\n6. Post Shorts throughout the week for algorithm boost`,
    result: "12 videos published. 180K total views. Monetized in 47 days. Current: $3,200/mo.",
    timeSaved: "~25 hours per video vs traditional production",
    revenueImpact: "$3,200/month recurring",
    upvotes: 2103,
    comments: 234,
    forks: 876,
    saves: 1102,
    verified: false,
    tags: ["youtube", "faceless", "passive-income"],
  },
  {
    id: 6,
    author: "zapierNinja",
    avatar: "ZN",
    avatarColor: "#EC4899",
    category: "automation",
    timestamp: "1d ago",
    goal: "Auto-qualify inbound leads and book calls without human intervention",
    tool: "Typeform + Make.com + GPT-4 API + Calendly",
    prompt: `Flow:\n1. Lead fills Typeform (budget, timeline, needs)\n2. Make.com triggers GPT-4 analysis:\n\n"Score this lead 1-100 based on:\n- Budget fit (our minimum is $5K)\n- Timeline urgency\n- Decision-maker status\n- Use case alignment with our services\n\nIf score > 70: draft a personalized Calendly invite email.\nIf score 40-70: draft a nurture email with relevant case study.\nIf score < 40: draft a polite redirect to self-serve resources."\n\n3. Auto-send via Gmail\n4. Log everything to Airtable CRM`,
    result: "Sales team only talks to qualified leads now. Booking rate up 340%. Zero leads fall through cracks.",
    timeSaved: "~12 hours/week for sales team",
    revenueImpact: "$28,000/month pipeline increase",
    upvotes: 1567,
    comments: 198,
    forks: 534,
    saves: 789,
    verified: true,
    tags: ["lead-scoring", "no-code", "crm"],
  },
];

function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n;
}

function PostCard({ post, onFork, onExpand, expanded }) {
  const [upvoted, setUpvoted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [localUpvotes, setLocalUpvotes] = useState(post.upvotes);
  const [forked, setForked] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const cat = CATEGORIES.find((c) => c.id === post.category);

  return (
    <div
      className={`post-card ${expanded ? "expanded" : ""}`}
      style={{
        background: "var(--card-bg)",
        borderRadius: "16px",
        padding: "0",
        marginBottom: "16px",
        border: "1px solid var(--border)",
        overflow: "hidden",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
      }}
    >
      {/* Verified badge strip */}
      {post.verified && (
        <div
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #10B981, #3B82F6, #8B5CF6)",
            width: "100%",
          }}
        />
      )}

      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: post.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              fontFamily: "'JetBrains Mono', monospace",
              flexShrink: 0,
            }}
          >
            {post.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  fontSize: "15px",
                }}
              >
                {post.author}
              </span>
              {post.verified && (
                <span
                  style={{
                    background: "linear-gradient(135deg, #10B981, #059669)",
                    color: "#fff",
                    fontSize: "10px",
                    padding: "2px 8px",
                    borderRadius: "100px",
                    fontWeight: 700,
                    letterSpacing: "0.5px",
                    textTransform: "uppercase",
                  }}
                >
                  ✓ Verified
                </span>
              )}
              <span
                style={{
                  color: "var(--text-muted)",
                  fontSize: "13px",
                }}
              >
                · {post.timestamp}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginTop: "4px",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  background: "var(--cat-bg)",
                  color: "var(--cat-text)",
                  fontSize: "11px",
                  padding: "2px 10px",
                  borderRadius: "100px",
                  fontWeight: 600,
                }}
              >
                {cat?.icon} {cat?.label}
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "var(--tag-bg)",
                    color: "var(--tag-text)",
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "100px",
                    fontWeight: 500,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Goal */}
        <div style={{ marginBottom: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "20px", lineHeight: "28px", flexShrink: 0 }}>🎯</span>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Goal
              </div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.4,
                }}
              >
                {post.goal}
              </div>
            </div>
          </div>
        </div>

        {/* Tool */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{ fontSize: "20px", lineHeight: "28px", flexShrink: 0 }}>🛠</span>
            <div>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "var(--text-muted)",
                  marginBottom: "4px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Tool Stack
              </div>
              <div
                style={{
                  fontSize: "15px",
                  color: "var(--accent)",
                  fontWeight: 600,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {post.tool}
              </div>
            </div>
          </div>
        </div>

        {/* Prompt/Workflow - Collapsible */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
            <span style={{ fontSize: "20px", lineHeight: "28px", flexShrink: 0 }}>🧠</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => setShowPrompt(!showPrompt)}
              >
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--text-muted)",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Prompt / Workflow
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--accent)",
                    fontWeight: 600,
                    padding: "4px 12px",
                    borderRadius: "8px",
                    background: "var(--accent-bg)",
                    transition: "all 0.2s",
                  }}
                >
                  {showPrompt ? "Hide ▲" : "Show ▼"}
                </span>
              </div>
              {showPrompt && (
                <pre
                  style={{
                    marginTop: "10px",
                    padding: "16px",
                    background: "var(--code-bg)",
                    borderRadius: "12px",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    color: "var(--code-text)",
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    border: "1px solid var(--code-border)",
                    overflow: "auto",
                    maxHeight: "400px",
                  }}
                >
                  {post.prompt}
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Result */}
        {post.result && (
          <div style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <span style={{ fontSize: "20px", lineHeight: "28px", flexShrink: 0 }}>💰</span>
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Result
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {post.result}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {post.timeSaved && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "var(--stat-bg)",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <span>⏱</span>
              <span style={{ color: "var(--text-secondary)" }}>{post.timeSaved}</span>
            </div>
          )}
          {post.revenueImpact && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 14px",
                background: "var(--revenue-bg)",
                borderRadius: "10px",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              <span>📈</span>
              <span style={{ color: "var(--revenue-text)" }}>
                {post.revenueImpact}
              </span>
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            flexWrap: "wrap",
            borderTop: "1px solid var(--border)",
            paddingTop: "16px",
          }}
        >
          <button
            onClick={() => {
              setUpvoted(!upvoted);
              setLocalUpvotes(upvoted ? localUpvotes - 1 : localUpvotes + 1);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              background: upvoted ? "var(--upvote-active-bg)" : "var(--action-bg)",
              color: upvoted ? "var(--upvote-active-text)" : "var(--text-muted)",
              fontWeight: 700,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span style={{ fontSize: "16px" }}>{upvoted ? "▲" : "△"}</span>
            {formatNumber(localUpvotes)}
          </button>

          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              background: "var(--action-bg)",
              color: "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            💬 {post.comments}
          </button>

          <button
            onClick={() => setForked(!forked)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              background: forked ? "var(--fork-active-bg)" : "var(--action-bg)",
              color: forked ? "var(--fork-active-text)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            🔀 {forked ? "Forked!" : `Fork (${formatNumber(post.forks)})`}
          </button>

          <button
            onClick={() => setSaved(!saved)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              borderRadius: "10px",
              border: "none",
              background: saved ? "var(--save-active-bg)" : "var(--action-bg)",
              color: saved ? "var(--save-active-text)" : "var(--text-muted)",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {saved ? "★" : "☆"} {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NewPostModal({ onClose, onSubmit }) {
  const [goal, setGoal] = useState("");
  const [tool, setTool] = useState("");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [timeSaved, setTimeSaved] = useState("");
  const [revenue, setRevenue] = useState("");
  const [category, setCategory] = useState("sales");

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "var(--input-bg)",
    color: "var(--text-primary)",
    fontSize: "14px",
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "var(--text-muted)",
    marginBottom: "6px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "'JetBrains Mono', monospace",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "20px",
          padding: "32px",
          width: "100%",
          maxWidth: "600px",
          maxHeight: "85vh",
          overflow: "auto",
          border: "1px solid var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              fontWeight: 800,
              color: "var(--text-primary)",
            }}
          >
            Share Your Workflow on aiithub
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={labelStyle}>📂 Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>🎯 Goal *</label>
            <input
              placeholder="What were you trying to accomplish?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>🛠 Tool Stack *</label>
            <input
              placeholder="e.g. ChatGPT + Zapier + Notion"
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>🧠 Prompt / Workflow *</label>
            <textarea
              placeholder="Share your exact prompt or step-by-step workflow..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "'JetBrains Mono', monospace", fontSize: "13px" }}
            />
          </div>
          <div>
            <label style={labelStyle}>💰 Result</label>
            <input
              placeholder="What happened? Share metrics if possible"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>⏱ Time Saved</label>
              <input
                placeholder="e.g. ~10 hrs/week"
                value={timeSaved}
                onChange={(e) => setTimeSaved(e.target.value)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>📈 Revenue Impact</label>
              <input
                placeholder="e.g. $5K/month"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          <button
            onClick={() => {
              if (goal && tool && prompt) {
                onSubmit({
                  goal,
                  tool,
                  prompt,
                  result,
                  timeSaved,
                  revenueImpact: revenue || null,
                  category,
                });
              }
            }}
            disabled={!goal || !tool || !prompt}
            style={{
              marginTop: "8px",
              padding: "14px 28px",
              borderRadius: "14px",
              border: "none",
              background:
                goal && tool && prompt
                  ? "linear-gradient(135deg, var(--accent), var(--accent-hover))"
                  : "var(--action-bg)",
              color: goal && tool && prompt ? "#fff" : "var(--text-muted)",
              fontWeight: 800,
              fontSize: "16px",
              cursor: goal && tool && prompt ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.3s",
              letterSpacing: "0.3px",
            }}
          >
            Publish to aiithub 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AIHub() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("🔥 Hot");
  const [showNewPost, setShowNewPost] = useState(false);
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const filteredPosts = posts
    .filter((p) => activeCategory === "all" || p.category === activeCategory)
    .filter(
      (p) =>
        !searchQuery ||
        p.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tool.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (activeSort === "🆕 New") return 0;
      if (activeSort === "⬆️ Top") return b.upvotes - a.upvotes;
      return b.upvotes * 0.7 + b.forks * 0.3 - (a.upvotes * 0.7 + a.forks * 0.3);
    });

  const handleNewPost = (data) => {
    const newPost = {
      id: Date.now(),
      author: "you",
      avatar: "YO",
      avatarColor: "#FF4500",
      category: data.category,
      timestamp: "Just now",
      goal: data.goal,
      tool: data.tool,
      prompt: data.prompt,
      result: data.result || null,
      timeSaved: data.timeSaved || null,
      revenueImpact: data.revenueImpact,
      upvotes: 1,
      comments: 0,
      forks: 0,
      saves: 0,
      verified: false,
      tags: [],
    };
    setPosts([newPost, ...posts]);
    setShowNewPost(false);
  };

  const themeVars = darkMode
    ? {
        "--bg": "#0C0C0F",
        "--bg-secondary": "#141419",
        "--card-bg": "#1A1A22",
        "--border": "#2A2A35",
        "--text-primary": "#F0F0F5",
        "--text-secondary": "#B0B0C0",
        "--text-muted": "#6B6B80",
        "--accent": "#FF4500",
        "--accent-hover": "#FF6D33",
        "--accent-bg": "rgba(255, 69, 0, 0.12)",
        "--cat-bg": "rgba(255, 69, 0, 0.15)",
        "--cat-text": "#FF6D33",
        "--tag-bg": "rgba(255,255,255,0.06)",
        "--tag-text": "#9090A0",
        "--code-bg": "#12121A",
        "--code-text": "#D0D0E0",
        "--code-border": "#252530",
        "--stat-bg": "rgba(59, 130, 246, 0.1)",
        "--revenue-bg": "rgba(16, 185, 129, 0.1)",
        "--revenue-text": "#34D399",
        "--action-bg": "rgba(255,255,255,0.05)",
        "--upvote-active-bg": "rgba(255, 69, 0, 0.2)",
        "--upvote-active-text": "#FF6D33",
        "--fork-active-bg": "rgba(59, 130, 246, 0.15)",
        "--fork-active-text": "#60A5FA",
        "--save-active-bg": "rgba(245, 158, 11, 0.15)",
        "--save-active-text": "#FBBF24",
        "--input-bg": "#12121A",
        "--sidebar-bg": "#141419",
        "--nav-bg": "rgba(12, 12, 15, 0.85)",
      }
    : {
        "--bg": "#F4F2EE",
        "--bg-secondary": "#FFFFFF",
        "--card-bg": "#FFFFFF",
        "--border": "#E5E2DC",
        "--text-primary": "#1A1A2E",
        "--text-secondary": "#4A4A60",
        "--text-muted": "#8A8AA0",
        "--accent": "#FF4500",
        "--accent-hover": "#E03D00",
        "--accent-bg": "rgba(255, 69, 0, 0.08)",
        "--cat-bg": "rgba(255, 69, 0, 0.1)",
        "--cat-text": "#FF4500",
        "--tag-bg": "rgba(0,0,0,0.04)",
        "--tag-text": "#6B6B80",
        "--code-bg": "#F8F7F4",
        "--code-text": "#2D2D3F",
        "--code-border": "#E5E2DC",
        "--stat-bg": "rgba(59, 130, 246, 0.06)",
        "--revenue-bg": "rgba(16, 185, 129, 0.08)",
        "--revenue-text": "#059669",
        "--action-bg": "rgba(0,0,0,0.04)",
        "--upvote-active-bg": "rgba(255, 69, 0, 0.12)",
        "--upvote-active-text": "#FF4500",
        "--fork-active-bg": "rgba(59, 130, 246, 0.1)",
        "--fork-active-text": "#3B82F6",
        "--save-active-bg": "rgba(245, 158, 11, 0.1)",
        "--save-active-text": "#D97706",
        "--input-bg": "#F8F7F4",
        "--sidebar-bg": "#FFFFFF",
        "--nav-bg": "rgba(244, 242, 238, 0.85)",
      };

  return (
    <div style={{ ...themeVars, background: "var(--bg)", minHeight: "100vh" }}>
      <style>{`
        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }

        input:focus, textarea:focus, select:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 3px var(--accent-bg);
        }

        button:hover {
          filter: brightness(1.1);
        }

        .category-btn {
          transition: all 0.2s !important;
        }
        .category-btn:hover {
          transform: scale(1.02);
        }

        .nav-blur {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .post-card {
          animation: fadeInUp 0.4s ease forwards;
        }

        .post-card:nth-child(2) { animation-delay: 0.05s; }
        .post-card:nth-child(3) { animation-delay: 0.1s; }
        .post-card:nth-child(4) { animation-delay: 0.15s; }
        .post-card:nth-child(5) { animation-delay: 0.2s; }
        .post-card:nth-child(6) { animation-delay: 0.25s; }

        @media (max-width: 768px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
          .sidebar-desktop {
            display: none !important;
          }
          .mobile-categories {
            display: flex !important;
          }
          .nav-inner {
            gap: 8px !important;
          }
          .nav-search {
            display: none !important;
          }
          .nav-brand-text {
            display: none !important;
          }
        }

        @media (min-width: 769px) {
          .mobile-categories {
            display: none !important;
          }
        }
      `}</style>

      {/* Navigation */}
      <nav
        className="nav-blur"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "var(--nav-bg)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
        }}
      >
        <div
          className="nav-inner"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #FF4500, #FF6D33)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontFamily: "'Sora', sans-serif",
                fontWeight: 900,
                color: "#fff",
                letterSpacing: "-1px",
              }}
            >
              ai
            </div>
            <div className="nav-brand-text" style={{ display: "flex", alignItems: "baseline", gap: "0px" }}>
              <span
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontWeight: 900,
                  fontSize: "22px",
                  color: "var(--text-primary)",
                  letterSpacing: "-1px",
                }}
              >
                aiithub
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  marginLeft: "6px",
                  letterSpacing: "0.5px",
                }}
              >
                .com
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="nav-search" style={{ flex: 1, maxWidth: "440px" }}>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "15px",
                  color: "var(--text-muted)",
                }}
              >
                🔍
              </span>
              <input
                placeholder="Search aiithub..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 16px 10px 40px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--input-bg)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                background: "var(--action-bg)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "16px",
                color: "var(--text-primary)",
              }}
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button
              onClick={() => setShowNewPost(true)}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg, #FF4500, #FF6D33)",
                color: "#fff",
                fontWeight: 700,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
                letterSpacing: "0.2px",
              }}
            >
              + Post Workflow
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className="main-grid"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px",
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: "24px",
        }}
      >
        {/* Sidebar */}
        <aside
          className="sidebar-desktop"
          style={{
            position: "sticky",
            top: "88px",
            height: "fit-content",
          }}
        >
          <div
            style={{
              background: "var(--sidebar-bg)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "var(--text-muted)",
                marginBottom: "12px",
                padding: "0 8px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Categories
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className="category-btn"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    activeCategory === cat.id ? "var(--accent-bg)" : "transparent",
                  color:
                    activeCategory === cat.id
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span style={{ fontSize: "16px" }}>{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Trending Tags */}
          <div
            style={{
              background: "var(--sidebar-bg)",
              borderRadius: "16px",
              padding: "16px",
              border: "1px solid var(--border)",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                fontSize: "10px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                color: "var(--text-muted)",
                marginBottom: "12px",
                padding: "0 8px",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              🔥 Trending Tags
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", padding: "0 4px" }}>
              {[
                "cold-email",
                "no-code",
                "passive-income",
                "content-repurpose",
                "lead-gen",
                "study-hack",
                "testing",
                "youtube",
              ].map((tag) => (
                <span
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  style={{
                    background: "var(--tag-bg)",
                    color: "var(--tag-text)",
                    fontSize: "12px",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: 500,
                    transition: "all 0.2s",
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Feed */}
        <main>
          {/* Mobile Categories */}
          <div
            className="mobile-categories"
            style={{
              display: "none",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "16px",
              marginBottom: "8px",
              scrollbarWidth: "none",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    activeCategory === cat.id ? "var(--accent-bg)" : "var(--action-bg)",
                  color:
                    activeCategory === cat.id ? "var(--accent)" : "var(--text-secondary)",
                  fontWeight: activeCategory === cat.id ? 700 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Sort Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveSort(opt)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  border: "none",
                  background:
                    activeSort === opt ? "var(--accent-bg)" : "var(--action-bg)",
                  color:
                    activeSort === opt ? "var(--accent)" : "var(--text-muted)",
                  fontWeight: activeSort === opt ? 700 : 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {opt}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-muted)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {filteredPosts.length} workflow{filteredPosts.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Posts */}
          {filteredPosts.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 20px",
                color: "var(--text-muted)",
              }}
            >
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <div style={{ fontSize: "18px", fontWeight: 600 }}>
                No workflows found
              </div>
              <div style={{ fontSize: "14px", marginTop: "8px" }}>
                Try a different category or search term
              </div>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </main>
      </div>

      {/* New Post Modal */}
      {showNewPost && (
        <NewPostModal
          onClose={() => setShowNewPost(false)}
          onSubmit={handleNewPost}
        />
      )}
    </div>
  );
}

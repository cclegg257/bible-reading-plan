import { useState, useEffect } from "react";

const initialPlan = [
  { day: 1,  book: "Romans",        chapter: 1,  verses: "1-17",  title: "The Power of the Gospel",        theme: "Identity in Christ" },
  { day: 2,  book: "Romans",        chapter: 3,  verses: "21-31", title: "Justified by Faith",              theme: "Grace" },
  { day: 3,  book: "Romans",        chapter: 5,  verses: "1-21",  title: "Peace with God",                  theme: "Reconciliation" },
  { day: 4,  book: "Romans",        chapter: 8,  verses: "1-17",  title: "Life in the Spirit",              theme: "Holy Spirit" },
  { day: 5,  book: "Romans",        chapter: 8,  verses: "18-39", title: "Nothing Can Separate Us",         theme: "God's Love" },
  { day: 6,  book: "Romans",        chapter: 12, verses: "1-21",  title: "Living Sacrifices",               theme: "Surrender" },
  { day: 7,  book: "1 Corinthians", chapter: 1,  verses: "18-31", title: "The Foolishness of the Cross",    theme: "Humility" },
  { day: 8,  book: "1 Corinthians", chapter: 13, verses: "1-13",  title: "The Greatest of These is Love",   theme: "Love" },
  { day: 9,  book: "1 Corinthians", chapter: 15, verses: "1-28",  title: "The Resurrection",                theme: "Hope" },
  { day: 10, book: "2 Corinthians", chapter: 4,  verses: "1-18",  title: "Treasure in Jars of Clay",        theme: "Weakness & Strength" },
  { day: 11, book: "2 Corinthians", chapter: 5,  verses: "11-21", title: "Ambassadors for Christ",          theme: "Mission" },
  { day: 12, book: "Galatians",     chapter: 2,  verses: "15-21", title: "Crucified with Christ",           theme: "New Identity" },
  { day: 13, book: "Galatians",     chapter: 5,  verses: "1-26",  title: "Freedom in the Spirit",           theme: "Fruit of the Spirit" },
  { day: 14, book: "Ephesians",     chapter: 1,  verses: "1-23",  title: "Every Spiritual Blessing",        theme: "Who You Are in Christ" },
  { day: 15, book: "Ephesians",     chapter: 2,  verses: "1-22",  title: "Made Alive in Christ",            theme: "Salvation" },
  { day: 16, book: "Ephesians",     chapter: 6,  verses: "10-20", title: "The Armor of God",                theme: "Spiritual Battle" },
  { day: 17, book: "Philippians",   chapter: 2,  verses: "1-18",  title: "The Humility of Christ",          theme: "Servant Leadership" },
  { day: 18, book: "Philippians",   chapter: 4,  verses: "1-23",  title: "The Peace That Passes Understanding", theme: "Contentment" },
  { day: 19, book: "Colossians",    chapter: 1,  verses: "15-29", title: "The Supremacy of Christ",         theme: "Christ Above All" },
  { day: 20, book: "Colossians",    chapter: 3,  verses: "1-17",  title: "Set Your Minds on Things Above",  theme: "Holy Living" },
];

const TABS = ["Plan", "Today", "Discuss", "Admin"];

const bookColors = {
  "John": "#9F9F9C",
  "Psalms": "#F59E0B",
  "Romans": "#10B981",
  "Genesis": "#EF4444",
};

function getPassageRef(entry) {
  return `${entry.book} ${entry.chapter}:${entry.verses}`;
}

function getDayLabel(dayNum) {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return days[(dayNum - 1) % 7];
}

export default function BibleApp() {
  const [tab, setTab] = useState("Plan");
  const [plan, setPlan] = useState(initialPlan);
  const [currentDay, setCurrentDay] = useState(1);
  const [reflections, setReflections] = useState({});
  const [discussions, setDiscussions] = useState({});
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");
  const [adminTab, setAdminTab] = useState("view");
  const [newEntry, setNewEntry] = useState({ book: "", chapter: "", verses: "", title: "", theme: "" });
  const [editingDay, setEditingDay] = useState(null);
  const [completedDays, setCompletedDays] = useState(new Set());
  const [planTitle, setPlanTitle] = useState("Paul's Letters: 20 Days in the Epistles");
  const [planDescription, setPlanDescription] = useState("A 20-day journey through the letters of Paul — Romans, Corinthians, Galatians, Ephesians, Philippians, and Colossians — exploring grace, identity, love, and how to live as followers of Jesus.");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminPasswordError, setAdminPasswordError] = useState(false);

  function attemptAdminUnlock() {
    if (adminPasswordInput === "101pisgah") {
      setAdminUnlocked(true);
      setAdminPasswordError(false);
      setAdminPasswordInput("");
    } else {
      setAdminPasswordError(true);
      setAdminPasswordInput("");
    }
  }

  const todayEntry = plan.find(e => e.day === currentDay);

  function toggleComplete(day) {
    setCompletedDays(prev => {
      const next = new Set(prev);
      next.has(day) ? next.delete(day) : next.add(day);
      return next;
    });
  }

  function saveReflection(day, text) {
    setReflections(prev => ({ ...prev, [day]: text }));
  }

  function addComment(day) {
    if (!newComment.trim()) return;
    const name = commenterName.trim() || "Anonymous";
    const comment = { name, text: newComment.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), id: Date.now() };
    setDiscussions(prev => ({ ...prev, [day]: [...(prev[day] || []), comment] }));
    setNewComment("");
  }

  function addDayToPlan() {
    if (!newEntry.book || !newEntry.chapter || !newEntry.verses) return;
    const maxDay = plan.length ? Math.max(...plan.map(e => e.day)) : 0;
    setPlan(prev => [...prev, { ...newEntry, day: maxDay + 1 }]);
    setNewEntry({ book: "", chapter: "", verses: "", title: "", theme: "" });
  }

  function removePlanEntry(day) {
    setPlan(prev => prev.filter(e => e.day !== day).map((e, i) => ({ ...e, day: i + 1 })));
    setCompletedDays(prev => {
      const next = new Set(prev);
      next.delete(day);
      return next;
    });
  }

  const progress = plan.length ? Math.round((completedDays.size / plan.length) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0D1B24", color: "#E8EEF2", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #112030 0%, #29465B 100%)",
        borderBottom: "1px solid #2E5270",
        padding: "24px 20px 0",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "linear-gradient(135deg, #9F9F9C, #8A8A87)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18
            }}>✦</div>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#9F9F9C", fontFamily: "system-ui" }}>
                Young Adults · Bible Plan
              </div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: "#EEF3F7", lineHeight: 1.1 }}>{planTitle}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 16, marginBottom: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#7A9BAD", fontFamily: "system-ui", marginBottom: 6 }}>
              <span>{completedDays.size} of {plan.length} days complete</span>
              <span style={{ color: "#9F9F9C" }}>{progress}%</span>
            </div>
            <div style={{ height: 4, background: "#29465B", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #9F9F9C, #B0B0AD)", borderRadius: 99, transition: "width 0.5s ease" }} />
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", marginTop: 20, gap: 0 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "10px 4px", fontSize: 13, fontFamily: "system-ui", fontWeight: tab === t ? 700 : 400,
                background: "none", border: "none", borderBottom: tab === t ? "2px solid #8A8A87" : "2px solid transparent",
                color: tab === t ? "#D8E6EE" : "#5A7D8E", cursor: "pointer", transition: "all 0.2s", letterSpacing: 0.5,
              }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 60px" }}>

        {/* ---- PLAN TAB ---- */}
        {tab === "Plan" && (
          <div>
            <p style={{ color: "#9F9F9C", fontSize: 14, fontFamily: "system-ui", marginBottom: 20, lineHeight: 1.5 }}>{planDescription}</p>
            {plan.map(entry => {
              const done = completedDays.has(entry.day);
              const isActive = entry.day === currentDay;
              return (
                <div key={entry.day} onClick={() => { setCurrentDay(entry.day); setTab("Today"); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    padding: "14px 16px", marginBottom: 8, borderRadius: 12, cursor: "pointer",
                    background: isActive ? "linear-gradient(135deg, #29465B, #29465B)" : "#162232",
                    border: isActive ? "1px solid #9F9F9C" : "1px solid #1E3547",
                    transition: "all 0.2s",
                  }}>
                  {/* Day circle */}
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: done ? "linear-gradient(135deg, #9F9F9C, #8A8A87)" : "#1E3547",
                    border: done ? "none" : "1px solid #2E5270",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: done ? 18 : 12, color: done ? "white" : "#7A9BAD",
                    fontFamily: "system-ui", fontWeight: 600,
                  }}>
                    {done ? "✓" : entry.day}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: "bold", color: "#D8E6EE", marginBottom: 2 }}>{entry.title}</div>
                    <div style={{ fontSize: 13, color: "#7A9BAD", fontFamily: "system-ui" }}>
                      {getPassageRef(entry)}
                      {entry.theme && <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 99, background: "#29465B", fontSize: 11, color: "#9F9F9C" }}>{entry.theme}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "#3A5A6E", fontFamily: "system-ui" }}>{getDayLabel(entry.day)}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- TODAY TAB ---- */}
        {tab === "Today" && todayEntry && (
          <div>
            {/* Day selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
              {plan.map(e => (
                <button key={e.day} onClick={() => setCurrentDay(e.day)} style={{
                  padding: "6px 14px", borderRadius: 99, border: "1px solid",
                  borderColor: e.day === currentDay ? "#9F9F9C" : "#1E3547",
                  background: e.day === currentDay ? "#9F9F9C" : "transparent",
                  color: e.day === currentDay ? "white" : "#7A9BAD",
                  fontSize: 13, fontFamily: "system-ui", cursor: "pointer", whiteSpace: "nowrap",
                  fontWeight: completedDays.has(e.day) ? 700 : 400,
                }}>
                  Day {e.day} {completedDays.has(e.day) ? "✓" : ""}
                </button>
              ))}
            </div>

            {/* Passage card */}
            <div style={{
              borderRadius: 16, padding: "24px",
              background: "linear-gradient(135deg, #112030, #29465B)",
              border: "1px solid #2E5270", marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#9F9F9C", fontFamily: "system-ui", marginBottom: 8 }}>
                Day {todayEntry.day} · {todayEntry.theme}
              </div>
              <div style={{ fontSize: 26, fontWeight: "bold", color: "#EEF3F7", marginBottom: 4 }}>{todayEntry.title}</div>
              <div style={{ fontSize: 18, color: "#B0B0AD", marginBottom: 16 }}>{getPassageRef(todayEntry)}</div>
              <a href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(getPassageRef(todayEntry))}&version=NIV`}
                target="_blank" rel="noreferrer"
                style={{
                  display: "inline-block", padding: "10px 20px", borderRadius: 8,
                  background: "linear-gradient(135deg, #9F9F9C, #8A8A87)",
                  color: "white", fontSize: 14, fontFamily: "system-ui", textDecoration: "none", fontWeight: 600,
                }}>
                📖 Open in Bible Gateway
              </a>
            </div>

            {/* Reflection */}
            <div style={{ borderRadius: 16, padding: "20px", background: "#162232", border: "1px solid #1E3547", marginBottom: 16 }}>
              <div style={{ fontSize: 14, fontWeight: "bold", color: "#D8E6EE", fontFamily: "system-ui", marginBottom: 12 }}>
                ✍️ My Reflection
              </div>
              <div style={{ fontSize: 13, color: "#7A9BAD", fontFamily: "system-ui", marginBottom: 8 }}>
                What stood out to you? What is God saying to you through this passage?
              </div>
              <textarea
                value={reflections[currentDay] || ""}
                onChange={e => saveReflection(currentDay, e.target.value)}
                placeholder="Write your thoughts here..."
                style={{
                  width: "100%", minHeight: 120, background: "#0D1B24",
                  border: "1px solid #2E5270", borderRadius: 8, padding: 12, color: "#E8EEF2",
                  fontSize: 14, fontFamily: "Georgia, serif", resize: "vertical", lineHeight: 1.6,
                  boxSizing: "border-box",
                }}
              />
              <button onClick={() => toggleComplete(currentDay)} style={{
                marginTop: 12, padding: "10px 20px", borderRadius: 8, border: "none", cursor: "pointer",
                background: completedDays.has(currentDay) ? "#29465B" : "linear-gradient(135deg, #9F9F9C, #8A8A87)",
                color: completedDays.has(currentDay) ? "#7A9BAD" : "white",
                fontSize: 14, fontFamily: "system-ui", fontWeight: 600,
              }}>
                {completedDays.has(currentDay) ? "✓ Marked Complete" : "Mark as Complete"}
              </button>
            </div>

            {/* Discussion preview */}
            <div style={{
              borderRadius: 12, padding: "14px 16px", background: "#162232",
              border: "1px solid #1E3547", cursor: "pointer",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }} onClick={() => setTab("Discuss")}>
              <span style={{ fontSize: 14, color: "#9F9F9C", fontFamily: "system-ui" }}>
                💬 {(discussions[currentDay] || []).length} discussion comment{(discussions[currentDay] || []).length !== 1 ? "s" : ""} for this passage
              </span>
              <span style={{ color: "#9F9F9C", fontSize: 18 }}>→</span>
            </div>
          </div>
        )}

        {/* ---- DISCUSS TAB ---- */}
        {tab === "Discuss" && (
          <div>
            {/* Day selector */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
              {plan.map(e => (
                <button key={e.day} onClick={() => setCurrentDay(e.day)} style={{
                  padding: "6px 14px", borderRadius: 99, border: "1px solid",
                  borderColor: e.day === currentDay ? "#9F9F9C" : "#1E3547",
                  background: e.day === currentDay ? "#9F9F9C" : "transparent",
                  color: e.day === currentDay ? "white" : "#7A9BAD",
                  fontSize: 13, fontFamily: "system-ui", cursor: "pointer", whiteSpace: "nowrap",
                }}>
                  Day {e.day}
                </button>
              ))}
            </div>

            {todayEntry && (
              <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: "#162232", border: "1px solid #1E3547" }}>
                <div style={{ fontSize: 13, color: "#9F9F9C", fontFamily: "system-ui" }}>Discussing: <strong style={{ color: "#D8E6EE" }}>{todayEntry.title}</strong> — {getPassageRef(todayEntry)}</div>
              </div>
            )}

            {/* Discussion prompt */}
            <div style={{ marginBottom: 20, padding: "16px", borderRadius: 12, background: "linear-gradient(135deg, #112030, #29465B)", border: "1px solid #2E5270" }}>
              <div style={{ fontSize: 13, color: "#B0B0AD", fontFamily: "system-ui", fontStyle: "italic", lineHeight: 1.6 }}>
                💡 Discussion prompt: What does this passage reveal about who Jesus is, and how does it apply to your life this week?
              </div>
            </div>

            {/* Comments */}
            {(discussions[currentDay] || []).length === 0 && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#3A5A6E", fontSize: 14, fontFamily: "system-ui" }}>
                No comments yet. Be the first to share!
              </div>
            )}
            {(discussions[currentDay] || []).map(c => (
              <div key={c.id} style={{ marginBottom: 12, padding: "14px 16px", borderRadius: 10, background: "#162232", border: "1px solid #1E3547" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: "bold", color: "#9F9F9C", fontFamily: "system-ui" }}>{c.name}</span>
                  <span style={{ fontSize: 11, color: "#3A5A6E", fontFamily: "system-ui" }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 14, color: "#C5D8E4", lineHeight: 1.6 }}>{c.text}</div>
              </div>
            ))}

            {/* Add comment */}
            <div style={{ marginTop: 20, padding: "16px", borderRadius: 12, background: "#162232", border: "1px solid #1E3547" }}>
              <input
                value={commenterName}
                onChange={e => setCommenterName(e.target.value)}
                placeholder="Your name"
                style={{
                  width: "100%", background: "#0D1B24", border: "1px solid #2E5270",
                  borderRadius: 8, padding: "10px 12px", color: "#E8EEF2",
                  fontSize: 14, fontFamily: "system-ui", marginBottom: 8, boxSizing: "border-box",
                }}
              />
              <textarea
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this passage..."
                style={{
                  width: "100%", minHeight: 90, background: "#0D1B24",
                  border: "1px solid #2E5270", borderRadius: 8, padding: "10px 12px", color: "#E8EEF2",
                  fontSize: 14, fontFamily: "Georgia, serif", resize: "vertical", lineHeight: 1.6,
                  boxSizing: "border-box", marginBottom: 10,
                }}
              />
              <button onClick={() => addComment(currentDay)} style={{
                width: "100%", padding: "12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #9F9F9C, #8A8A87)",
                color: "white", fontSize: 14, fontFamily: "system-ui", fontWeight: 700,
              }}>
                Post Comment
              </button>
            </div>
          </div>
        )}

        {/* ---- ADMIN TAB ---- */}
        {tab === "Admin" && !adminUnlocked && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <div style={{ fontSize: 20, fontWeight: "bold", color: "#D8E6EE", fontFamily: "system-ui", marginBottom: 8 }}>Admin Access</div>
            <div style={{ fontSize: 14, color: "#7A9BAD", fontFamily: "system-ui", marginBottom: 28, textAlign: "center" }}>Enter your password to manage the reading plan.</div>
            <div style={{ width: "100%", maxWidth: 320 }}>
              <input
                type="password"
                value={adminPasswordInput}
                onChange={e => { setAdminPasswordInput(e.target.value); setAdminPasswordError(false); }}
                onKeyDown={e => e.key === "Enter" && attemptAdminUnlock()}
                placeholder="Enter password"
                style={{
                  width: "100%", background: "#162232", border: adminPasswordError ? "1px solid #EF4444" : "1px solid #2E5270",
                  borderRadius: 8, padding: "12px 14px", color: "#E8EEF2",
                  fontSize: 15, fontFamily: "system-ui", boxSizing: "border-box", marginBottom: 8, outline: "none",
                }}
              />
              {adminPasswordError && (
                <div style={{ fontSize: 13, color: "#EF4444", fontFamily: "system-ui", marginBottom: 8, textAlign: "center" }}>
                  Incorrect password. Try again.
                </div>
              )}
              <button onClick={attemptAdminUnlock} style={{
                width: "100%", padding: "12px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #9F9F9C, #8A8A87)", color: "white",
                fontSize: 15, fontFamily: "system-ui", fontWeight: 700,
              }}>
                Unlock
              </button>
            </div>
          </div>
        )}

        {tab === "Admin" && adminUnlocked && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#9F9F9C", fontFamily: "system-ui" }}>🔓 Admin unlocked</div>
              <button onClick={() => setAdminUnlocked(false)} style={{ background: "none", border: "1px solid #1E3547", borderRadius: 6, color: "#7A9BAD", cursor: "pointer", padding: "4px 12px", fontSize: 12, fontFamily: "system-ui" }}>
                Lock
              </button>
            </div>
            <div style={{ marginBottom: 20, padding: "16px", borderRadius: 12, background: "#162232", border: "1px solid #1E3547" }}>
              <div style={{ fontSize: 14, fontWeight: "bold", color: "#D8E6EE", fontFamily: "system-ui", marginBottom: 12 }}>📋 Plan Settings</div>
              <input value={planTitle} onChange={e => setPlanTitle(e.target.value)}
                placeholder="Plan title"
                style={{ width: "100%", background: "#0D1B24", border: "1px solid #2E5270", borderRadius: 8, padding: "10px 12px", color: "#E8EEF2", fontSize: 14, fontFamily: "system-ui", boxSizing: "border-box", marginBottom: 8 }} />
              <textarea value={planDescription} onChange={e => setPlanDescription(e.target.value)}
                placeholder="Plan description"
                style={{ width: "100%", background: "#0D1B24", border: "1px solid #2E5270", borderRadius: 8, padding: "10px 12px", color: "#E8EEF2", fontSize: 14, fontFamily: "Georgia, serif", resize: "vertical", boxSizing: "border-box", minHeight: 70 }} />
            </div>

            <div style={{ marginBottom: 20, padding: "16px", borderRadius: 12, background: "#162232", border: "1px solid #1E3547" }}>
              <div style={{ fontSize: 14, fontWeight: "bold", color: "#D8E6EE", fontFamily: "system-ui", marginBottom: 12 }}>➕ Add a Day</div>
              {[
                ["Book", "book", "e.g. John"],
                ["Chapter", "chapter", "e.g. 3"],
                ["Verses", "verses", "e.g. 1-21"],
                ["Title", "title", "e.g. Born Again"],
                ["Theme", "theme", "e.g. New Life"],
              ].map(([label, key, ph]) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 11, color: "#7A9BAD", fontFamily: "system-ui", marginBottom: 3 }}>{label}</div>
                  <input value={newEntry[key]} onChange={e => setNewEntry(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={ph}
                    style={{ width: "100%", background: "#0D1B24", border: "1px solid #2E5270", borderRadius: 8, padding: "9px 12px", color: "#E8EEF2", fontSize: 14, fontFamily: "system-ui", boxSizing: "border-box" }} />
                </div>
              ))}
              <button onClick={addDayToPlan} style={{
                marginTop: 8, width: "100%", padding: "11px", borderRadius: 8, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #9F9F9C, #8A8A87)", color: "white", fontSize: 14, fontFamily: "system-ui", fontWeight: 700,
              }}>Add to Plan</button>
            </div>

            <div style={{ padding: "16px", borderRadius: 12, background: "#162232", border: "1px solid #1E3547" }}>
              <div style={{ fontSize: 14, fontWeight: "bold", color: "#D8E6EE", fontFamily: "system-ui", marginBottom: 12 }}>📅 Current Plan ({plan.length} days)</div>
              {plan.map(e => (
                <div key={e.day} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: "1px solid #1E3547" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#29465B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#9F9F9C", fontFamily: "system-ui", flexShrink: 0 }}>
                    {e.day}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#D8E6EE", fontFamily: "system-ui" }}>{e.title || getPassageRef(e)}</div>
                    <div style={{ fontSize: 12, color: "#5A7D8E", fontFamily: "system-ui" }}>{getPassageRef(e)}</div>
                  </div>
                  <button onClick={() => removePlanEntry(e.day)} style={{ background: "none", border: "1px solid #29465B", borderRadius: 6, color: "#9F9F9C", cursor: "pointer", padding: "4px 10px", fontSize: 12, fontFamily: "system-ui" }}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

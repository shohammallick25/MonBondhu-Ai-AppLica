import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ─────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────
const T = {
  bg: "#080B1A",
  grad: (a, b) => `linear-gradient(135deg,${a},${b})`,
};

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const QUOTES = [
  { text: "তুমি যতটা ভাবছো তার চেয়ে অনেক বেশি শক্তিশালী তুমি।", author: "মনবন্ধু AI", cat: "strength" },
  { text: "প্রতিটি নতুন দিন একটি নতুন সুযোগ।", author: "অজ্ঞাত", cat: "hope" },
  { text: "You are braver than you believe, stronger than you seem.", author: "A.A. Milne", cat: "strength" },
  { text: "It's okay to not be okay. Healing takes time.", author: "MonBondhu AI", cat: "healing" },
  { text: "নিজেকে ভালোবাসো, কারণ তুমি অনন্য।", author: "মনবন্ধু AI", cat: "self-love" },
  { text: "Every storm runs out of rain.", author: "Maya Angelou", cat: "hope" },
  { text: "ব্যর্থতা শেষ নয়, চেষ্টা বন্ধ করাই শেষ।", author: "চার্চিল", cat: "resilience" },
  { text: "The darkest hour has only 60 minutes.", author: "Morris Mandel", cat: "hope" },
  { text: "নিজের উপর বিশ্বাস রাখো। তুমি পারবে।", author: "মনবন্ধু AI", cat: "confidence" },
];

const MOODS = [
  { emoji: "😊", label: "Happy",    labelBn: "খুশি",      color: "#FFD700", score: 5 },
  { emoji: "😔", label: "Sad",      labelBn: "দুঃখী",     color: "#6B9BD2", score: 2 },
  { emoji: "😰", label: "Anxious",  labelBn: "উদ্বিগ্ন",  color: "#FF8C69", score: 2 },
  { emoji: "😡", label: "Angry",    labelBn: "রাগান্বিত", color: "#FF4444", score: 2 },
  { emoji: "😐", label: "Neutral",  labelBn: "স্বাভাবিক", color: "#A0A0B0", score: 3 },
  { emoji: "😴", label: "Tired",    labelBn: "ক্লান্ত",   color: "#9B8EC4", score: 2 },
  { emoji: "🤗", label: "Grateful", labelBn: "কৃতজ্ঞ",   color: "#48BB78", score: 5 },
  { emoji: "😤", label: "Stressed", labelBn: "চিন্তিত",  color: "#ED8936", score: 2 },
  { emoji: "🥰", label: "Loved",    labelBn: "ভালোবাসা", color: "#FF69B4", score: 5 },
  { emoji: "😌", label: "Calm",     labelBn: "শান্ত",     color: "#00CEC9", score: 4 },
];

const HELPLINES = [
  { name: "কান পেতে রই (BD)", number: "01779-554391", icon: "📞", country: "🇧🇩" },
  { name: "Emergency (BD)",   number: "999",           icon: "🚨", country: "🇧🇩" },
  { name: "iCall India",      number: "9152987821",    icon: "🤝", country: "🇮🇳" },
  { name: "Crisis Text Line", number: "741741",        icon: "💬", country: "🌍" },
];

const BREATHING_STEPS = [
  { text: "Breathe IN...",  textBn: "শ্বাস নাও...",   duration: 4000, scale: 1.3, color: "#4ECDC4" },
  { text: "Hold...",        textBn: "ধরে রাখো...",    duration: 4000, scale: 1.3, color: "#9B59B6" },
  { text: "Breathe OUT...", textBn: "শ্বাস ছাড়ো...",  duration: 6000, scale: 0.85,color: "#FF6B9D" },
  { text: "Hold...",        textBn: "ধরে রাখো...",    duration: 2000, scale: 0.85,color: "#F39C12" },
];

const EMERGENCY_KEYWORDS = [
  "suicide","সুইসাইড","মরতে চাই","মরে যেতে চাই","সব শেষ",
  "বাঁচতে চাই না","die","kill myself","end it all","আমাকে বাঁচাও","আর পারছি না",
];

// ─────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────
const CSS = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#080B1A;font-family:'Segoe UI',system-ui,sans-serif;color:#fff;overflow-x:hidden;}
  ::-webkit-scrollbar{width:4px;}
  ::-webkit-scrollbar-thumb{background:rgba(78,205,196,0.3);border-radius:4px;}
  input,select,textarea{font-family:inherit;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
  @keyframes popIn{from{transform:scale(0.85);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
  @keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes heartbeat{0%,100%{transform:scale(1)}25%{transform:scale(1.15)}50%{transform:scale(0.95)}}
  @keyframes slideIn{from{transform:translateX(-14px);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes glow{0%,100%{opacity:0.6}50%{opacity:1}}
  .card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:20px;padding:20px;}
  .btn{border:none;cursor:pointer;font-family:inherit;font-weight:700;transition:all 0.18s;border-radius:14px;}
  .btn:active{transform:scale(0.96);}
  .fade-up{animation:fadeUp 0.4s ease forwards;}
  .pop-in{animation:popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards;}
`;

// ─────────────────────────────────────────────
// ROBOT
// ─────────────────────────────────────────────
function Robot({ speaking, mood, size = 1, onClick }) {
  const [blink, setBlink] = useState(false);
  const [bounce, setBounce] = useState(false);
  useEffect(() => {
    const t = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 3000 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (speaking) { setBounce(true); setTimeout(() => setBounce(false), 600); } }, [speaking]);
  const ec = mood === "sad" ? "#6B9BD2" : mood === "anxious" ? "#FF8C69" : mood === "angry" ? "#FF4444" : mood === "happy" ? "#FFD700" : "#4ECDC4";
  const s = size;
  return (
    <div onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      cursor: onClick ? "pointer" : "default",
      transform: bounce ? `translateY(${-6 * s}px) scale(${1 + 0.05 * s})` : "scale(1)",
      transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)", userSelect: "none",
    }}>
      <div style={{ width: 3 * s, height: 14 * s, background: T.grad("#FF6B9D", "#4ECDC4"), borderRadius: 2, marginBottom: -1, position: "relative" }}>
        <div style={{ width: 9 * s, height: 9 * s, borderRadius: "50%", background: speaking ? "#FF6B9D" : "#4ECDC4", position: "absolute", top: -4 * s, left: -3 * s, boxShadow: speaking ? `0 0 ${10 * s}px #FF6B9D` : `0 0 ${6 * s}px #4ECDC4`, transition: "all 0.3s" }} />
      </div>
      <div style={{ width: 50 * s, height: 50 * s, borderRadius: 15 * s, background: T.grad("#2D1B69", "#11998E"), boxShadow: speaking ? `0 0 ${20 * s}px rgba(78,205,196,0.7)` : `0 ${4 * s}px ${14 * s}px rgba(0,0,0,0.4)`, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 3 * s, position: "relative" }}>
        <div style={{ position: "absolute", top: 4 * s, left: 4 * s, width: 14 * s, height: 6 * s, borderRadius: 4 * s, background: "rgba(255,255,255,0.12)" }} />
        <div style={{ display: "flex", gap: 8 * s }}>
          {[0, 1].map(i => (
            <div key={i} style={{ width: 9 * s, height: blink ? 1.5 * s : 9 * s, borderRadius: "50%", background: ec, boxShadow: `0 0 ${6 * s}px ${ec}`, transition: "height 0.06s", position: "relative" }}>
              <div style={{ width: 3 * s, height: 3 * s, borderRadius: "50%", background: "rgba(255,255,255,0.7)", position: "absolute", top: 1 * s, left: 1 * s }} />
            </div>
          ))}
        </div>
        <div style={{ width: speaking ? 18 * s : 13 * s, height: speaking ? 8 * s : 4 * s, borderRadius: speaking ? `0 0 ${10 * s}px ${10 * s}px` : `0 0 ${6 * s}px ${6 * s}px`, background: speaking ? "#FF6B9D" : "#4ECDC4", transition: "all 0.2s", boxShadow: speaking ? `0 0 ${8 * s}px #FF6B9D` : "none" }} />
      </div>
      <div style={{ width: 38 * s, height: 24 * s, borderRadius: `0 0 ${10 * s}px ${10 * s}px`, background: T.grad("#2D1B69", "#11998E"), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 11 * s, height: 11 * s, borderRadius: "50%", background: "rgba(255,255,255,0.15)", boxShadow: speaking ? `0 0 ${10 * s}px rgba(255,107,157,0.9)` : "none", transition: "box-shadow 0.3s" }} />
      </div>
      <div style={{ fontSize: 7 * s, color: "#4ECDC4", fontWeight: 800, letterSpacing: 1, marginTop: 2 * s, opacity: 0.8 }}>BONDHU</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// NAV
// ─────────────────────────────────────────────
const NAV = [
  { id: "home",      icon: "🏠", en: "Home",          bn: "হোম" },
  { id: "chat",      icon: "💬", en: "Chat AI",        bn: "AI চ্যাট", badge: "LIVE AI" },
  { id: "mood",      icon: "🌈", en: "Mood Tracker",   bn: "মুড ট্র্যাকার" },
  { id: "journal",   icon: "📓", en: "Journal",        bn: "জার্নাল" },
  { id: "tasks",     icon: "📋", en: "Tasks",          bn: "টাস্ক" },
  { id: "habits",    icon: "🔥", en: "Habits",         bn: "অভ্যাস" },
  { id: "sleep",     icon: "🌙", en: "Sleep Tracker",  bn: "ঘুম ট্র্যাকার" },
  { id: "meditation",icon: "🧘", en: "Meditation",     bn: "মেডিটেশন" },
  { id: "alarm",     icon: "⏰", en: "Reminders",      bn: "রিমাইন্ডার" },
  { id: "score",     icon: "🧠", en: "Mental Score",   bn: "মানসিক স্কোর" },
  { id: "emergency", icon: "🚨", en: "Emergency",      bn: "জরুরি" },
  { id: "resources", icon: "📚", en: "Resources",      bn: "রিসোর্স" },
  { id: "motivation",icon: "✨", en: "Motivation",     bn: "অনুপ্রেরণা" },
  { id: "settings",  icon: "⚙️", en: "Settings",       bn: "সেটিংস" },
];

function Sidebar({ page, setPage, open, setOpen, lang, robotMood, robotSpeaking }) {
  return (
    <>
      {open && <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 40, backdropFilter: "blur(3px)" }} />}
      <aside style={{ position: "fixed", left: 0, top: 0, height: "100vh", width: 250, background: "linear-gradient(180deg,#0A0820 0%,#12082E 50%,#0D0D26 100%)", zIndex: 50, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)", display: "flex", flexDirection: "column", borderRight: "1px solid rgba(78,205,196,0.15)" }}>
        <div style={{ padding: "18px 16px 14px", borderBottom: "1px solid rgba(78,205,196,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ fontSize: 26 }}>🧠</div>
            <div>
              <div style={{ color: "#4ECDC4", fontWeight: 900, fontSize: 14, letterSpacing: 0.5 }}>MonBondhu AI</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, letterSpacing: 1.5 }}>MENTAL HEALTH COMPANION</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: 18, cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <Robot speaking={robotSpeaking} mood={robotMood} size={0.9} />
          </div>
        </div>
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>
          {NAV.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setOpen(false); }} className="btn" style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "9px 12px", borderRadius: 12, background: page === item.id ? "rgba(78,205,196,0.12)" : "transparent", borderLeft: page === item.id ? "3px solid #4ECDC4" : "3px solid transparent", marginBottom: 2, transition: "all 0.15s" }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              <span style={{ color: page === item.id ? "#4ECDC4" : "rgba(255,255,255,0.65)", fontWeight: page === item.id ? 700 : 400, fontSize: 12.5, flex: 1, textAlign: "left" }}>{lang === "bn" ? item.bn : item.en}</span>
              {item.badge && <span style={{ fontSize: 8, background: "rgba(78,205,196,0.2)", color: "#4ECDC4", padding: "2px 5px", borderRadius: 6, fontWeight: 700 }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: 12, borderTop: "1px solid rgba(255,71,87,0.15)" }}>
          <button onClick={() => { setPage("emergency"); setOpen(false); }} className="btn" style={{ width: "100%", padding: "10px", borderRadius: 12, background: "linear-gradient(90deg,#FF4757,#FF6B7A)", color: "#fff", fontSize: 12, boxShadow: "0 4px 15px rgba(255,71,87,0.25)" }}>
            🚨 {lang === "bn" ? "জরুরি সাহায্য" : "Emergency Help"}
          </button>
        </div>
      </aside>
    </>
  );
}

// ─────────────────────────────────────────────
// TOPBAR
// ─────────────────────────────────────────────
function Topbar({ setOpen, page, lang, streak, mentalScore }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const nav = NAV.find(n => n.id === page);
  return (
    <header style={{ position: "fixed", top: 0, left: 0, right: 0, height: 58, zIndex: 30, background: "rgba(8,11,26,0.94)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(78,205,196,0.12)", display: "flex", alignItems: "center", padding: "0 14px", gap: 10 }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 10, width: 38, height: 38, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer" }}>
        {[0, 1, 2].map(i => <div key={i} style={{ width: 16, height: 2, background: "#4ECDC4", borderRadius: 2 }} />)}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{lang === "bn" ? nav?.bn : nav?.en}</div>
        <div style={{ color: "rgba(78,205,196,0.6)", fontSize: 9, letterSpacing: 0.5 }}>MonBondhu AI</div>
      </div>
      {streak > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(255,215,0,0.1)", border: "1px solid rgba(255,215,0,0.25)", borderRadius: 20, padding: "4px 10px" }}>
        <span style={{ fontSize: 12 }}>🔥</span>
        <span style={{ color: "#FFD700", fontSize: 11, fontWeight: 700 }}>{streak}d</span>
      </div>}
      <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(78,205,196,0.08)", border: "1px solid rgba(78,205,196,0.2)", borderRadius: 20, padding: "4px 10px" }}>
        <span style={{ fontSize: 11 }}>🧠</span>
        <span style={{ color: "#4ECDC4", fontSize: 11, fontWeight: 700 }}>{mentalScore}</span>
      </div>
      <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, minWidth: 48, textAlign: "right" }}>
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </div>
    </header>
  );
}

// ─────────────────────────────────────────────
// HOME
// ─────────────────────────────────────────────
function HomePage({ setPage, lang, currentMood, setCurrentMood, userName, streak, mentalScore, moodHistory }) {
  const [qi] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(lang === "bn" ? (h < 12 ? "শুভ সকাল" : h < 17 ? "শুভ অপরাহ্ন" : "শুভ সন্ধ্যা") : (h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening"));
  }, [lang]);
  const q = QUOTES[qi];
  const sc = mentalScore >= 75 ? "#2ECC71" : mentalScore >= 50 ? "#F39C12" : "#FF4757";
  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div className="fade-up" style={{ borderRadius: 24, padding: "28px 22px", marginBottom: 16, background: "linear-gradient(135deg,rgba(45,27,105,0.85) 0%,rgba(17,153,142,0.45) 100%)", border: "1px solid rgba(78,205,196,0.2)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle,rgba(78,205,196,0.12),transparent)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: 21, fontWeight: 900, marginBottom: 4 }}>{greeting}, {userName}! 👋</h1>
            <p style={{ color: "rgba(78,205,196,0.8)", fontSize: 12 }}>{lang === "bn" ? "মনবন্ধু AI তোমার পাশে।" : "MonBondhu AI is here for you."}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: `conic-gradient(${sc} ${mentalScore * 3.6}deg,rgba(255,255,255,0.08) 0)`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0A0820", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: sc, fontWeight: 900, fontSize: 13 }}>{mentalScore}</span>
              </div>
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, marginTop: 3 }}>Mental Score</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          {[{ icon: "🔥", val: `${streak}d`, label: "Streak" }, { icon: "📊", val: moodHistory.length, label: "Logs" }, { icon: "😊", val: moodHistory[0]?.mood.emoji || "–", label: "Last Mood" }].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: "10px 6px", textAlign: "center" }}>
              <div style={{ fontSize: 16 }}>{s.icon}</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>{s.val}</div>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 9 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, padding: "14px 18px", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ color: "#FFD700", fontSize: 14, marginBottom: 6 }}>✨</div>
          <p style={{ color: "rgba(255,255,255,0.88)", fontSize: 13, lineHeight: 1.7, fontStyle: "italic", marginBottom: 6 }}>"{q.text}"</p>
          <p style={{ color: "rgba(78,205,196,0.65)", fontSize: 11 }}>— {q.author}</p>
        </div>
      </div>

      {/* Quick Mood */}
      <div className="card" style={{ marginBottom: 14 }}>
        <h3 style={{ color: "rgba(255,255,255,0.8)", marginBottom: 12, fontSize: 13, fontWeight: 700 }}>{lang === "bn" ? "আজ কেমন অনুভব করছো?" : "How are you feeling today?"}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {MOODS.slice(0, 5).map(m => (
            <button key={m.label} onClick={() => setCurrentMood(m)} className="btn" style={{ flex: "1 1 50px", padding: "10px 4px", borderRadius: 12, border: `2px solid ${currentMood?.label === m.label ? m.color : "transparent"}`, background: currentMood?.label === m.label ? m.color + "22" : "rgba(255,255,255,0.04)", transform: currentMood?.label === m.label ? "scale(1.08)" : "scale(1)" }}>
              <div style={{ fontSize: 20 }}>{m.emoji}</div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, marginTop: 3 }}>{lang === "bn" ? m.labelBn : m.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
        {[
          { p: "chat",      icon: "💬", en: "Talk to AI",     bn: "AI চ্যাট",         g: T.grad("#4ECDC4", "#2980B9"),  badge: "🔴 LIVE" },
          { p: "meditation",icon: "🧘", en: "Meditate",       bn: "মেডিটেশন",         g: T.grad("#9B59B6", "#6C3483") },
          { p: "tasks",     icon: "📋", en: "Task Manager",   bn: "টাস্ক",            g: T.grad("#F39C12", "#D35400") },
          { p: "habits",    icon: "🔥", en: "Habit Tracker",  bn: "অভ্যাস ট্র্যাক",  g: T.grad("#2ECC71", "#27AE60") },
          { p: "journal",   icon: "📓", en: "Write Journal",  bn: "জার্নাল",          g: T.grad("#E74C3C", "#C0392B") },
          { p: "sleep",     icon: "🌙", en: "Sleep Tracker",  bn: "ঘুম ট্র্যাকার",   g: T.grad("#2C3E50", "#4A235A") },
        ].map(b => (
          <button key={b.p} onClick={() => setPage(b.p)} className="btn" style={{ padding: "16px 12px", borderRadius: 18, background: b.g, color: "#fff", fontSize: 13, textAlign: "left", display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            <span style={{ fontSize: 22 }}>{b.icon}</span>
            <span>{lang === "bn" ? b.bn : b.en}</span>
            {b.badge && <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9, background: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: 8 }}>{b.badge}</span>}
          </button>
        ))}
      </div>
      <button onClick={() => setPage("emergency")} className="btn" style={{ width: "100%", padding: "14px", borderRadius: 18, background: "linear-gradient(90deg,rgba(255,71,87,0.15),rgba(255,71,87,0.05))", border: "1px solid rgba(255,71,87,0.3)", color: "#FF6B7A", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        🚨 {lang === "bn" ? "জরুরি সাহায্য দরকার?" : "Need Emergency Help?"}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  ██████╗██╗  ██╗ █████╗ ████████╗    ██████╗  █████╗  ██████╗ ███████╗
// ██╔════╝██║  ██║██╔══██╗╚══██╔══╝    ██╔══██╗██╔══██╗██╔════╝ ██╔════╝
// ██║     ███████║███████║   ██║       ██████╔╝███████║██║  ███╗█████╗
// ██║     ██╔══██║██╔══██║   ██║       ██╔═══╝ ██╔══██║██║   ██║██╔══╝
// ╚██████╗██║  ██║██║  ██║   ██║       ██║     ██║  ██║╚██████╔╝███████╗
//  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝       ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
// ─────────────────────────────────────────────────────────────────────────────
// এই ChatPage-এই সম্পূর্ণ Claude API integration আছে।
// callClaude() function টা হলো মূল API caller।
// ─────────────────────────────────────────────────────────────────────────────


function ChatPage({ lang, setRobotSpeaking, setRobotMood, onEmergency }) {
  const [messages, setMessages] = useState([
    {
      id: 1, role: "ai",
      text: lang === "bn"
        ? "আমি মনবন্ধু AI! এখন থেকে তুমি যা লিখবে, আমি Shoham's AI দিয়ে সরাসরি উত্তর দেবো। মন খুলে কথা বলো। 💙"
        : "Hi! I'm MonBondhu AI — powered by Shoham. Type anything and I'll respond instantly. You're safe here. 💙",
      time: new Date(), emotion: "default",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]); // ← full context memory
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  // ═══════════════════════════════════════════════════════════════
  // 🔑 CLAUDE API CALLER — এটাই মূল integration point
  //
  // কীভাবে কাজ করে:
  // 1. User message নেয়
  // 2. Anthropic /v1/messages endpoint-এ POST করে
  // 3. System prompt-এ MonBondhu AI এর persona দেওয়া আছে
  // 4. Full conversation history পাঠায় (context memory)
  // 5. Real response UI-তে দেখায়
  // ═══════════════════════════════════════════════════════════════
  const callClaude = useCallback(async (userText, emotion) => {
    // Emergency check — API call করার আগেই stop
    if (EMERGENCY_KEYWORDS.some(k => userText.toLowerCase().includes(k.toLowerCase()))) {
      onEmergency();
      return;
    }

    setLoading(true);
    setRobotMood(emotion);

    // নতুন user message conversation history-তে যোগ করো
    const newHistory = [...conversationHistory, { role: "user", content: userText }];
    setConversationHistory(newHistory);

    try {
      // ═══════════════════════════════════════
      // API CALL — এখানেই Claude কথা বলে!
      // ═══════════════════════════════════════

      const key = import.meta.env.VITE_OPENROUTER_API_KEY;

const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${key}`,
    "X-Title": "MonBondhu AI",
  },
  body: JSON.stringify({
    model: "meta-llama/llama-3.1-70b-instruct",

    messages: [
      {
        role: "system",
        content: `You are MonBondhu AI (মনবন্ধু AI), a compassionate mental health assistant.

Rules:
- Be empathetic
- Reply in same language
- Do not give medical diagnosis
- Suggest professional help when needed

Current emotion: "${emotion}"`
      },

      ...newHistory
    ],

    max_tokens: 1000,
    temperature: 0.7
  }),
});

// 👇 এখানে লগ দাও (response আসার পর)
console.log("STATUS:", response.status);

const data = await response.json();

console.log("DATA:", data);

if (!response.ok) {
  console.error("OpenAI API Error:", data);
  throw new Error(data?.error?.message || `API Error: ${response.status}`);
}

      // ═══════════════════════════════════════
      // RESPONSE EXTRACT — API থেকে text বের করো
      // data.content[0].text হলো Ai এর reply
      // ═══════════════════════════════════════
      const aiReply = data?.choices?.[0]?.message?.content;

if (!aiReply) {
  throw new Error("Invalid API response");
}

      // AI এর reply conversation history-তে যোগ করো (memory)
      setConversationHistory(h => [...h, { role: "assistant", content: aiReply }]);

      // UI-তে message দেখাও
      setMessages(m => [...m, {
        id: Date.now() + 1,
        role: "ai",
        text: aiReply,
        time: new Date(),
        emotion,
      }]);

      // Robot animation trigger
      setRobotSpeaking(true);
      setTimeout(() => setRobotSpeaking(false), 2500);

    } catch (err) {
      console.error("Shoham's API Error:", err);
      // Error fallback — API fail হলেও UI ভাঙবে না
      setMessages(m => [...m, {
        id: Date.now() + 1,
        role: "ai",
        text: lang === "bn"
          ? "দুঃখিত, এই মুহূর্তে সংযোগে সমস্যা হচ্ছে। একটু পরে আবার চেষ্টা করো। আমি তোমার পাশে আছি। 💙"
          : "Sorry, connection issue right now. Please try again in a moment. I'm still here for you. 💙",
        time: new Date(),
        emotion: "default",
        isError: true,
      }]);
    } finally {
      setLoading(false);
    }
  }, [conversationHistory, lang, onEmergency, setRobotMood, setRobotSpeaking]);

  // ═══════════════════════════════════════
  // SEND HANDLER — UI থেকে message পাঠানো
  // ═══════════════════════════════════════
  const send = useCallback((text) => {
    const txt = (text || input).trim();
    if (!txt || loading) return;

    // Detect emotion from user text
    const t = txt.toLowerCase();
    const emotion =
      EMERGENCY_KEYWORDS.some(k => t.includes(k.toLowerCase())) ? "emergency" :
      ["sad", "cry", "কান্না", "দুঃখ", "কষ্ট", "unhappy", "depressed"].some(k => t.includes(k)) ? "sad" :
      ["anxious", "anxiety", "উদ্বেগ", "চিন্তা", "worry", "scared", "panic"].some(k => t.includes(k)) ? "anxious" :
      ["angry", "রাগ", "frustrated", "hate"].some(k => t.includes(k)) ? "angry" :
      ["happy", "great", "awesome", "খুশি", "wonderful", "joy"].some(k => t.includes(k)) ? "happy" :
      ["stress", "stressed", "overwhelmed", "চাপ"].some(k => t.includes(k)) ? "stressed" :
      "default";

    // User message UI-তে দেখাও
    setMessages(m => [...m, { id: Date.now(), role: "user", text: txt, time: new Date(), emotion }]);
    setInput("");

    // Claude API call করো
    callClaude(txt, emotion);
  }, [input, loading, callClaude]);

  // Quick suggestion chips
  const SUGGESTIONS = lang === "bn"
    ? ["আমি দুঃখী", "পড়াশোনায় চাপ", "উদ্বেগ লাগছে", "আজকে ভালো লাগছে না"]
    : ["I'm feeling anxious", "Need help with stress", "Feeling lonely today", "Help me focus"];

  const emotionColors = { sad: "#6B9BD2", anxious: "#FF8C69", angry: "#FF4444", happy: "#FFD700", stressed: "#ED8936", default: "#4ECDC4" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 58px)", maxWidth: 650, margin: "0 auto" }}>

      {/* API Status Badge */}
      <div style={{ padding: "8px 0 4px", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.25)", borderRadius: 20, padding: "5px 14px" }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#2ECC71", animation: "glow 2s infinite" }} />
          <span style={{ color: "#4ECDC4", fontSize: 11, fontWeight: 700 }}>
            {lang === "bn" ? "AI সংযুক্ত — Real-time Response" : "AI Connected — Real-time Response"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 0", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", animation: "slideIn 0.3s ease" }}>
            {msg.role === "ai" && (
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.grad("#4ECDC4", "#2980B9"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, marginRight: 8, flexShrink: 0, marginTop: 2 }}>🧠</div>
            )}
            <div style={{ maxWidth: "78%" }}>
              <div style={{
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                background: msg.role === "user" ? T.grad("#4ECDC4", "#2980B9") : msg.isError ? "rgba(255,71,87,0.1)" : "rgba(255,255,255,0.07)",
                border: msg.role === "ai" ? `1px solid ${msg.isError ? "rgba(255,71,87,0.2)" : "rgba(255,255,255,0.1)"}` : "none",
                color: "#fff", fontSize: 14, lineHeight: 1.65,
                whiteSpace: "pre-wrap", // line breaks সংরক্ষণ করে
              }}>
                {msg.text}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, paddingLeft: msg.role === "ai" ? 2 : 0, justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                {msg.emotion && msg.emotion !== "default" && <div style={{ width: 6, height: 6, borderRadius: "50%", background: emotionColors[msg.emotion] || "#4ECDC4" }} />}
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{msg.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                {msg.role === "ai" && !msg.isError && <span style={{ color: "rgba(78,205,196,0.5)", fontSize: 9 }}>• MonBondhu AI</span>}
              </div>
            </div>
          </div>
        ))}

        {/* Typing / Loading Indicator */}
        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, animation: "slideIn 0.3s ease" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.grad("#4ECDC4", "#2980B9"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🧠</div>
            <div style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px 20px 20px 4px", padding: "12px 18px", display: "flex", gap: 5, alignItems: "center" }}>
              {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#4ECDC4", animation: `bounce 1s ${i * 0.2}s infinite` }} />)}
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginLeft: 6 }}>
                {lang === "bn" ? "MonBondhu AI ভাবছে..." : "MonBondhu AI is thinking..."}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Suggestions (first load only) */}
      {messages.length <= 1 && (
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap", paddingBottom: 8 }}>
          {SUGGESTIONS.map((s, i) => (
            <button key={i} onClick={() => send(s)} className="btn" style={{ padding: "7px 14px", borderRadius: 20, background: "rgba(78,205,196,0.1)", border: "1px solid rgba(78,205,196,0.25)", color: "#4ECDC4", fontSize: 12, fontWeight: 500 }}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Clear conversation button */}
      {conversationHistory.length > 6 && (
        <div style={{ textAlign: "center", paddingBottom: 6 }}>
          <button onClick={() => { setConversationHistory([]); setMessages([{ id: Date.now(), role: "ai", text: lang === "bn" ? "নতুন কথোপকথন শুরু হয়েছে। 💙" : "Fresh conversation started. 💙", time: new Date(), emotion: "default" }]); }} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.4)", padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 11, fontFamily: "inherit" }}>
            🔄 {lang === "bn" ? "কথোপকথন রিসেট করো" : "Reset conversation"}
          </button>
        </div>
      )}

      {/* Input Area */}
      <div style={{ paddingBottom: 8, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder={loading ? (lang === "bn" ? "MonBondhu AI উত্তর দিচ্ছে..." : "MonBondhu AI is responding...") : (lang === "bn" ? "তোমার মনের কথা লিখো..." : "Type your message...")}
            disabled={loading}
            style={{ flex: 1, padding: "13px 16px", borderRadius: 16, background: loading ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.07)", border: `1px solid ${loading ? "rgba(255,255,255,0.08)" : "rgba(78,205,196,0.25)"}`, color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s" }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="btn"
            style={{ width: 48, height: 48, borderRadius: 14, background: !input.trim() || loading ? "rgba(255,255,255,0.08)" : T.grad("#4ECDC4", "#2980B9"), fontSize: 18, opacity: !input.trim() || loading ? 0.5 : 1, transition: "all 0.2s" }}>
            {loading ? <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#4ECDC4", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "auto" }} /> : "➤"}
          </button>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, marginTop: 6, textAlign: "center" }}>
          🔒 {lang === "bn" ? "Powered by MonBondhu AI · সম্পূর্ণ গোপন" : "Powered by Shoham · Fully private"}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MOOD PAGE
// ─────────────────────────────────────────────
function MoodPage({ lang, currentMood, setCurrentMood, moodHistory, setMoodHistory }) {
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState("");
  const [view, setView] = useState("log");

  const logMood = () => {
    if (!selected) return;
    setMoodHistory(h => [{ mood: selected, date: new Date(), note }, ...h]);
    setCurrentMood(selected);
    setSelected(null); setNote("");
  };

  const weekData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days.map((d, i) => {
      const dm = moodHistory.filter(h => new Date(h.date).getDay() === i && (Date.now() - new Date(h.date)) < 7 * 86400000);
      const avg = dm.length ? dm.reduce((s, m) => s + m.mood.score, 0) / dm.length : 0;
      return { day: d, score: avg, count: dm.length };
    });
  }, [moodHistory]);

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🌈 {lang === "bn" ? "মুড ট্র্যাকার" : "Mood Tracker"}</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["log", "chart", "insights"].map(v => (
          <button key={v} onClick={() => setView(v)} className="btn" style={{ flex: 1, padding: "9px", borderRadius: 12, background: view === v ? T.grad("#4ECDC4", "#2980B9") : "rgba(255,255,255,0.06)", color: "#fff", fontSize: 12 }}>
            {v === "log" ? "📝 Log" : v === "chart" ? "📊 Chart" : "💡 Insights"}
          </button>
        ))}
      </div>

      {view === "log" && (
        <>
          <div className="card" style={{ marginBottom: 14 }}>
            <h3 style={{ color: "rgba(255,255,255,0.8)", marginBottom: 14, fontSize: 13, fontWeight: 700 }}>{lang === "bn" ? "এখন কেমন লাগছে?" : "How are you feeling?"}</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginBottom: 14 }}>
              {MOODS.map(m => (
                <button key={m.label} onClick={() => setSelected(m)} className="btn" style={{ padding: "12px 4px", borderRadius: 14, border: `2px solid ${selected?.label === m.label ? m.color : "transparent"}`, background: selected?.label === m.label ? m.color + "22" : "rgba(255,255,255,0.04)", transform: selected?.label === m.label ? "scale(1.1)" : "scale(1)" }}>
                  <div style={{ fontSize: 24 }}>{m.emoji}</div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 9, marginTop: 4 }}>{lang === "bn" ? m.labelBn : m.label}</div>
                </button>
              ))}
            </div>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder={lang === "bn" ? "কিছু লিখতে চাও? (ঐচ্ছিক)" : "Add a note? (optional)"} style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, outline: "none", resize: "none", marginBottom: 10, fontFamily: "inherit" }} />
            <button onClick={logMood} disabled={!selected} className="btn" style={{ width: "100%", padding: "12px", borderRadius: 14, background: selected ? T.grad("#4ECDC4", "#2980B9") : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 13, opacity: selected ? 1 : 0.5 }}>
              {lang === "bn" ? "মুড লগ করো ✓" : "Log Mood ✓"}
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {moodHistory.slice(0, 15).map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontSize: 26 }}>{h.mood.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: h.mood.color, fontWeight: 700, fontSize: 13 }}>{lang === "bn" ? h.mood.labelBn : h.mood.label}</div>
                  {h.note && <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 11, marginTop: 2 }}>{h.note}</div>}
                </div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10 }}>{new Date(h.date).toLocaleDateString([], { month: "short", day: "numeric" })}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {view === "chart" && (
        <div className="card">
          <h3 style={{ color: "#fff", marginBottom: 16, fontSize: 14, fontWeight: 700 }}>📊 Weekly Mood</h3>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 120, marginBottom: 10 }}>
            {weekData.map((d, i) => {
              const h = d.score ? (d.score / 5) * 100 : 4;
              const col = d.score >= 4 ? "#2ECC71" : d.score >= 3 ? "#F39C12" : d.score > 0 ? "#FF4757" : "rgba(255,255,255,0.08)";
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", height: 16 }}>{d.count > 0 ? d.score.toFixed(1) : ""}</div>
                  <div style={{ width: "100%", borderRadius: "6px 6px 0 0", background: col, height: `${h}%`, minHeight: 4, transition: "height 0.5s" }} />
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{d.day}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {view === "insights" && (
        <div className="card">
          <h4 style={{ color: "#4ECDC4", marginBottom: 12, fontSize: 13, fontWeight: 700 }}>💡 AI Insight</h4>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7 }}>
            {moodHistory.length < 3
              ? (lang === "bn" ? "আরও মুড লগ করলে তোমার প্যাটার্ন বিশ্লেষণ করা যাবে।" : "Log more moods for personalized insights!")
              : (lang === "bn" ? "তোমার মুড ডেটা বিশ্লেষণ করে দেখা যাচ্ছে, নিয়মিত মেডিটেশন সাহায্য করতে পারে।" : "Based on your mood data, regular meditation and sleep consistency may help stabilize your mood.")}
          </p>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// JOURNAL
// ─────────────────────────────────────────────
function JournalPage({ lang }) {
  const [entries, setEntries] = useState([{ id: 1, title: "First Entry", body: "Today was a good day. Felt calm after meditation.", date: new Date(Date.now() - 86400000), mood: "😊", tag: "reflection" }]);
  const [writing, setWriting] = useState(false);
  const [title, setTitle] = useState(""); const [body, setBody] = useState("");
  const [tag, setTag] = useState("reflection"); const [moodPick, setMoodPick] = useState("😊");
  const [selected, setSelected] = useState(null);
  const TAGS = ["reflection", "gratitude", "anxiety", "goals", "daily", "vent"];
  const TC = { reflection: "#4ECDC4", gratitude: "#FFD700", anxiety: "#FF8C69", goals: "#2ECC71", daily: "#9B59B6", vent: "#E74C3C" };
  const save = () => { if (!body.trim()) return; setEntries(e => [{ id: Date.now(), title: title || "Untitled", body, date: new Date(), mood: moodPick, tag }, ...e]); setTitle(""); setBody(""); setWriting(false); };
  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900 }}>📓 {lang === "bn" ? "জার্নাল" : "Journal"}</h2>
        <button onClick={() => setWriting(v => !v)} className="btn" style={{ padding: "9px 18px", borderRadius: 14, background: writing ? T.grad("#FF4757", "#FF6B7A") : T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 12 }}>{writing ? "✕" : "✏️ Write"}</button>
      </div>
      {writing && (
        <div className="card pop-in" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title (optional)" style={{ flex: 1, padding: "9px 14px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none" }} />
            <select value={moodPick} onChange={e => setMoodPick(e.target.value)} style={{ padding: "9px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 18, outline: "none" }}>
              {MOODS.map(m => <option key={m.label} value={m.emoji}>{m.emoji}</option>)}
            </select>
          </div>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} placeholder={lang === "bn" ? "আজকের কথা লিখো..." : "Write freely..."} style={{ width: "100%", padding: "12px 14px", borderRadius: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13.5, outline: "none", resize: "none", lineHeight: 1.7, fontFamily: "inherit", marginBottom: 10 }} />
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
            {TAGS.map(t => <button key={t} onClick={() => setTag(t)} className="btn" style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, background: tag === t ? TC[t] + "33" : "rgba(255,255,255,0.06)", border: `1px solid ${tag === t ? TC[t] : "transparent"}`, color: tag === t ? TC[t] : "rgba(255,255,255,0.5)" }}>#{t}</button>)}
          </div>
          <button onClick={save} className="btn" style={{ width: "100%", padding: "12px", borderRadius: 14, background: T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 13 }}>💾 Save</button>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {entries.map(e => (
          <div key={e.id} onClick={() => setSelected(selected?.id === e.id ? null : e)} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "16px", border: `1px solid ${selected?.id === e.id ? "rgba(78,205,196,0.3)" : "rgba(255,255,255,0.08)"}`, cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 18 }}>{e.mood}</span>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{e.title}</span>
              </div>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{new Date(e.date).toLocaleDateString([], { month: "short", day: "numeric" })}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 12, lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: selected?.id === e.id ? 999 : 2, WebkitBoxOrient: "vertical" }}>{e.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TASKS
// ─────────────────────────────────────────────
function TaskPage({ lang }) {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Morning meditation", done: false, priority: "high", dueTime: "09:00", category: "Health" },
    { id: 2, text: "Study 2 hours", done: false, priority: "high", dueTime: "14:00", category: "Study" },
    { id: 3, text: "Evening walk", done: true, priority: "medium", dueTime: "18:00", category: "Health" },
  ]);
  const [newTask, setNewTask] = useState(""); const [priority, setPriority] = useState("medium");
  const [dueTime, setDueTime] = useState(""); const [category, setCategory] = useState("Personal");
  const [filter, setFilter] = useState("all");
  const add = () => { if (!newTask.trim()) return; setTasks(t => [...t, { id: Date.now(), text: newTask.trim(), done: false, priority, dueTime, category }]); setNewTask(""); setDueTime(""); };
  const toggle = id => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const del = id => setTasks(ts => ts.filter(t => t.id !== id));
  const filtered = tasks.filter(t => filter === "all" ? true : filter === "done" ? t.done : !t.done);
  const progress = tasks.length ? Math.round(tasks.filter(t => t.done).length / tasks.length * 100) : 0;
  const PC = { high: "#FF4757", medium: "#F39C12", low: "#2ECC71" };
  const CC = { Health: "#2ECC71", Study: "#3498DB", Personal: "#9B59B6", Work: "#E74C3C" };
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 14 }}>📋 {lang === "bn" ? "টাস্ক ম্যানেজার" : "Task Manager"}</h2>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Today's Progress</span>
          <span style={{ color: progress === 100 ? "#2ECC71" : "#4ECDC4", fontWeight: 800 }}>{progress}% {progress === 100 ? "🎉" : ""}</span>
        </div>
        <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, borderRadius: 5, transition: "width 0.5s", background: progress === 100 ? "linear-gradient(90deg,#2ECC71,#27AE60)" : "linear-gradient(90deg,#4ECDC4,#2980B9)" }} />
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 11, marginTop: 5 }}>{tasks.filter(t => t.done).length}/{tasks.length} completed</div>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && add()} placeholder={lang === "bn" ? "নতুন টাস্ক লিখো..." : "Add a new task..."} style={{ width: "100%", padding: "11px 14px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", marginBottom: 10 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 10 }}>
          <select value={priority} onChange={e => setPriority(e.target.value)} style={{ padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 11, outline: "none" }}><option value="high">🔴 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option></select>
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 11, outline: "none" }}>{["Personal", "Study", "Health", "Work"].map(c => <option key={c} value={c}>{c}</option>)}</select>
          <input type="time" value={dueTime} onChange={e => setDueTime(e.target.value)} style={{ padding: "8px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 11, outline: "none" }} />
        </div>
        <button onClick={add} className="btn" style={{ width: "100%", padding: "11px", borderRadius: 12, background: T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 13 }}>+ Add Task</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["all", "active", "done"].map(f => <button key={f} onClick={() => setFilter(f)} className="btn" style={{ padding: "7px 14px", borderRadius: 20, background: filter === f ? "#4ECDC4" : "rgba(255,255,255,0.07)", color: filter === f ? "#000" : "rgba(255,255,255,0.6)", fontSize: 11 }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>)}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {filtered.map(task => (
          <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 11, background: task.done ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)", borderRadius: 14, padding: "13px 15px", border: `1px solid ${task.done ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.09)"}`, opacity: task.done ? 0.65 : 1, transition: "all 0.25s" }}>
            <button onClick={() => toggle(task.id)} className="btn" style={{ width: 26, height: 26, borderRadius: "50%", border: `2px solid ${task.done ? "#2ECC71" : "rgba(255,255,255,0.25)"}`, background: task.done ? "#2ECC71" : "transparent", color: "#fff", fontSize: 13, flexShrink: 0 }}>{task.done ? "✓" : ""}</button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: "#fff", fontSize: 13, textDecoration: task.done ? "line-through" : "none", marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.text}</div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: PC[task.priority] + "28", color: PC[task.priority], fontWeight: 700 }}>{task.priority}</span>
                <span style={{ fontSize: 9, padding: "2px 7px", borderRadius: 20, background: (CC[task.category] || "#666") + "28", color: CC[task.category] || "#aaa", fontWeight: 600 }}>{task.category}</span>
                {task.dueTime && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)" }}>⏰{task.dueTime}</span>}
              </div>
            </div>
            <button onClick={() => del(task.id)} style={{ background: "none", border: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", fontSize: 15, flexShrink: 0 }}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// HABITS
// ─────────────────────────────────────────────
function HabitsPage({ lang }) {
  const today = new Date().toDateString();
  const [habits, setHabits] = useState([
    { id: 1, name: "Morning Meditation", nameBn: "মেডিটেশন", icon: "🧘", streak: 5, target: 21, completedDays: [today], color: "#9B59B6" },
    { id: 2, name: "Drink 8 Glasses Water", nameBn: "পানি পান", icon: "💧", streak: 3, target: 30, completedDays: [today], color: "#3498DB" },
    { id: 3, name: "Read 20 Minutes", nameBn: "পড়াশোনা", icon: "📖", streak: 7, target: 21, completedDays: [], color: "#2ECC71" },
    { id: 4, name: "Gratitude Journal", nameBn: "কৃতজ্ঞতা", icon: "🙏", streak: 10, target: 30, completedDays: [today], color: "#FFD700" },
  ]);
  const toggle = id => setHabits(hs => hs.map(h => { if (h.id !== id) return h; const done = h.completedDays.includes(today); return { ...h, completedDays: done ? h.completedDays.filter(d => d !== today) : [...h.completedDays, today], streak: done ? Math.max(0, h.streak - 1) : h.streak + 1 }; }));
  const overall = habits.length ? Math.round(habits.reduce((s, h) => s + (h.completedDays.includes(today) ? 1 : 0), 0) / habits.length * 100) : 0;
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🔥 {lang === "bn" ? "অভ্যাস ট্র্যাকার" : "Habit Tracker"}</h2>
      <div className="card" style={{ marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 6 }}>{overall >= 80 ? "🏆" : overall >= 50 ? "🌟" : "💪"}</div>
        <div style={{ color: "#fff", fontWeight: 900, fontSize: 28 }}>{overall}%</div>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, marginBottom: 10 }}>Today's Completion</div>
        <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 4 }}><div style={{ height: "100%", width: `${overall}%`, borderRadius: 4, background: overall >= 80 ? "#2ECC71" : overall >= 50 ? "#F39C12" : "#FF4757", transition: "width 0.5s" }} /></div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {habits.map(h => {
          const done = h.completedDays.includes(today);
          const pct = Math.min(100, Math.round((h.streak / h.target) * 100));
          return (
            <div key={h.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "16px", border: `1px solid ${done ? h.color + "44" : "rgba(255,255,255,0.08)"}`, transition: "border 0.3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>{h.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{lang === "bn" ? h.nameBn : h.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ flex: 1, height: 5, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}><div style={{ height: "100%", width: `${pct}%`, background: h.color, borderRadius: 3, transition: "width 0.5s" }} /></div>
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>{h.streak}/{h.target}d</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <button onClick={() => toggle(h.id)} className="btn" style={{ width: 38, height: 38, borderRadius: "50%", background: done ? h.color : "rgba(255,255,255,0.06)", border: `2px solid ${done ? h.color : "rgba(255,255,255,0.2)"}`, fontSize: 16 }}>{done ? "✓" : "○"}</button>
                  {h.streak > 0 && <div style={{ display: "flex", gap: 2, alignItems: "center" }}><span style={{ fontSize: 9 }}>🔥</span><span style={{ color: "#FFD700", fontSize: 10, fontWeight: 700 }}>{h.streak}</span></div>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SLEEP
// ─────────────────────────────────────────────
function SleepPage({ lang }) {
  const [bedtime, setBedtime] = useState("22:30"); const [wakeup, setWakeup] = useState("06:30"); const [quality, setQuality] = useState(3);
  const [logs, setLogs] = useState([
    { date: new Date(Date.now() - 86400000), bed: "23:00", wake: "06:00", quality: 3, hours: 7 },
    { date: new Date(Date.now() - 172800000), bed: "22:30", wake: "07:00", quality: 4, hours: 8.5 },
    { date: new Date(Date.now() - 259200000), bed: "01:00", wake: "06:30", quality: 2, hours: 5.5 },
    { date: new Date(Date.now() - 345600000), bed: "22:00", wake: "06:00", quality: 5, hours: 8 },
    { date: new Date(Date.now() - 432000000), bed: "23:30", wake: "07:30", quality: 4, hours: 8 },
    { date: new Date(Date.now() - 518400000), bed: "00:00", wake: "06:00", quality: 3, hours: 6 },
    { date: new Date(Date.now() - 604800000), bed: "22:00", wake: "06:30", quality: 5, hours: 8.5 },
  ]);
  const calcHours = (b, w) => { const [bh, bm] = b.split(":").map(Number); const [wh, wm] = w.split(":").map(Number); let d = (wh * 60 + wm) - (bh * 60 + bm); if (d < 0) d += 1440; return Math.round(d / 60 * 10) / 10; };
  const logSleep = () => { const hours = calcHours(bedtime, wakeup); setLogs(l => [{ date: new Date(), bed: bedtime, wake: wakeup, quality, hours }, ...l]); };
  const avgH = logs.length ? Math.round(logs.slice(0, 7).reduce((s, l) => s + l.hours, 0) / Math.min(logs.length, 7) * 10) / 10 : 0;
  const avgQ = logs.length ? Math.round(logs.slice(0, 7).reduce((s, l) => s + l.quality, 0) / Math.min(logs.length, 7) * 10) / 10 : 0;
  const sc = Math.min(100, Math.round((avgH / 8 * 0.6 + avgQ / 5 * 0.4) * 100));
  const qc = ["", "#FF4757", "#FF8C69", "#F39C12", "#2ECC71", "#4ECDC4"];
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🌙 {lang === "bn" ? "ঘুম ট্র্যাকার" : "Sleep Tracker"}</h2>
      <div className="card" style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <svg width={80} height={80} style={{ transform: "rotate(-90deg)" }}>
            <circle cx={40} cy={40} r={32} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
            <circle cx={40} cy={40} r={32} fill="none" stroke={sc >= 75 ? "#2ECC71" : sc >= 50 ? "#F39C12" : "#FF4757"} strokeWidth={6} strokeDasharray={`${2 * Math.PI * 32 * sc / 100} ${2 * Math.PI * 32 * (1 - sc / 100)}`} strokeLinecap="round" />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontWeight: 900, fontSize: 16 }}>{sc}</span></div>
        </div>
        <div>
          <div style={{ color: "#fff", fontSize: 13, marginBottom: 3 }}>Avg: <strong style={{ color: "#4ECDC4" }}>{avgH}h</strong> / night</div>
          <div style={{ color: "#fff", fontSize: 13 }}>Quality: <strong style={{ color: qc[Math.round(avgQ)] || "#F39C12" }}>{avgQ}/5</strong></div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <h3 style={{ color: "rgba(255,255,255,0.8)", marginBottom: 14, fontSize: 13, fontWeight: 700 }}>📝 Log Tonight's Sleep</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
          <div><label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 5 }}>🌙 Bedtime</label><input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 14, outline: "none" }} /></div>
          <div><label style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, display: "block", marginBottom: 5 }}>☀️ Wake Up</label><input type="time" value={wakeup} onChange={e => setWakeup(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 14, outline: "none" }} /></div>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, marginBottom: 6 }}>Quality: <strong style={{ color: qc[quality] }}>{quality}/5</strong> · <span style={{ color: "rgba(78,205,196,0.7)" }}>{calcHours(bedtime, wakeup)}h sleep</span></div>
          <input type="range" min={1} max={5} value={quality} onChange={e => setQuality(+e.target.value)} style={{ width: "100%", accentColor: "#4ECDC4" }} />
        </div>
        <button onClick={logSleep} className="btn" style={{ width: "100%", padding: "11px", borderRadius: 14, background: T.grad("#2C3E50", "#9B59B6"), color: "#fff", fontSize: 13 }}>🌙 Log Sleep</button>
      </div>
      <div className="card">
        <h4 style={{ color: "#fff", marginBottom: 14, fontSize: 13, fontWeight: 700 }}>📊 7-Day Sleep Chart</h4>
        <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 80 }}>
          {logs.slice(0, 7).reverse().map((l, i) => { const pct = Math.min(100, (l.hours / 9) * 100); const col = l.hours >= 7 ? "#4ECDC4" : l.hours >= 6 ? "#F39C12" : "#FF4757"; return (<div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}><div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>{l.hours}h</div><div style={{ width: "100%", borderRadius: "4px 4px 0 0", background: col, height: `${pct}%`, minHeight: 4 }} /><div style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>{new Date(l.date).toLocaleDateString([], { weekday: "short" }).slice(0, 2)}</div></div>); })}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MEDITATION
// ─────────────────────────────────────────────
function MeditationPage({ lang }) {
  const [mode, setMode] = useState("timer"); const [seconds, setSeconds] = useState(300);
  const [running, setRunning] = useState(false); const [preset, setPreset] = useState(300);
  const [breathStep, setBreathStep] = useState(-1); const [breathRunning, setBreathRunning] = useState(false);
  const intRef = useRef(null); const breathRef = useRef(null);
  useEffect(() => { if (running) { intRef.current = setInterval(() => { setSeconds(s => { if (mode === "timer" && s <= 1) { setRunning(false); clearInterval(intRef.current); return 0; } return mode === "timer" ? s - 1 : s + 1; }); }, 1000); } return () => clearInterval(intRef.current); }, [running, mode]);
  useEffect(() => { if (breathRunning && breathStep >= 0) { breathRef.current = setTimeout(() => setBreathStep(s => (s + 1) % 4), BREATHING_STEPS[breathStep % 4].duration); } return () => clearTimeout(breathRef.current); }, [breathRunning, breathStep]);
  const startBreath = () => { setBreathRunning(true); setBreathStep(0); };
  const stopBreath = () => { setBreathRunning(false); setBreathStep(-1); };
  const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const pct = mode === "timer" ? seconds / preset : 0;
  const curBreath = breathStep >= 0 ? BREATHING_STEPS[breathStep % 4] : null;
  const PRESETS = [{ l: "5m", s: 300 }, { l: "10m", s: 600 }, { l: "15m", s: 900 }, { l: "20m", s: 1200 }, { l: "30m", s: 1800 }];
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🧘 {lang === "bn" ? "মেডিটেশন" : "Meditation"}</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["timer", "stopwatch", "breathing"].map(m => <button key={m} onClick={() => { setMode(m); setRunning(false); setSeconds(m === "timer" ? preset : 0); }} className="btn" style={{ flex: 1, padding: "9px 4px", borderRadius: 12, fontSize: 11, background: mode === m ? T.grad("#9B59B6", "#6C3483") : "rgba(255,255,255,0.06)", color: "#fff" }}>{m === "timer" ? "⏱ Timer" : m === "stopwatch" ? "⏲ Watch" : "🌬 Breath"}</button>)}
      </div>
      {(mode === "timer" || mode === "stopwatch") && (
        <div className="card" style={{ textAlign: "center", marginBottom: 16 }}>
          {mode === "timer" && !running && <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>{PRESETS.map(p => <button key={p.s} onClick={() => { setPreset(p.s); setSeconds(p.s); }} className="btn" style={{ padding: "7px 14px", borderRadius: 20, background: preset === p.s ? "#9B59B6" : "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12 }}>{p.l}</button>)}</div>}
          <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 24px" }}>
            <svg width={180} height={180} style={{ transform: "rotate(-90deg)" }}><circle cx={90} cy={90} r={80} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={8} /><circle cx={90} cy={90} r={80} fill="none" stroke="#9B59B6" strokeWidth={8} strokeDasharray={`${2 * Math.PI * 80 * pct} ${2 * Math.PI * 80 * (1 - pct)}`} strokeLinecap="round" style={{ transition: "stroke-dasharray 0.8s ease" }} /></svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: 34, fontWeight: 900, fontFamily: "monospace" }}>{fmt(seconds)}</span></div>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => setRunning(r => !r)} className="btn" style={{ padding: "12px 28px", borderRadius: 14, background: T.grad("#9B59B6", "#6C3483"), color: "#fff", fontSize: 14 }}>{running ? "⏸ Pause" : "▶ Start"}</button>
            <button onClick={() => { setRunning(false); setSeconds(mode === "timer" ? preset : 0); }} className="btn" style={{ padding: "12px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 14 }}>↺ Reset</button>
          </div>
        </div>
      )}
      {mode === "breathing" && (
        <div className="card" style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ position: "relative", width: 180, height: 180, margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: breathRunning ? (curBreath?.scale || 1) * 80 + 60 : 100, height: breathRunning ? (curBreath?.scale || 1) * 80 + 60 : 100, borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: `3px solid ${breathRunning ? curBreath?.color : "rgba(78,205,196,0.3)"}`, background: breathRunning ? `radial-gradient(circle,${curBreath?.color}33,transparent)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 1.5s ease", boxShadow: breathRunning ? `0 0 30px ${curBreath?.color}55` : "none" }}>
              <span style={{ color: "#fff", fontSize: 11, textAlign: "center", padding: 8, lineHeight: 1.5 }}>{breathRunning ? (lang === "bn" ? curBreath?.textBn : curBreath?.text) : (lang === "bn" ? "শুরু করো" : "Press Start")}</span>
            </div>
          </div>
          <button onClick={breathRunning ? stopBreath : startBreath} className="btn" style={{ padding: "11px 28px", borderRadius: 14, background: breathRunning ? "rgba(255,71,87,0.3)" : T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 13 }}>{breathRunning ? "⏹ Stop" : "▶ Start"}</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// ALARM
// ─────────────────────────────────────────────
function AlarmPage({ lang }) {
  const [alarms, setAlarms] = useState([
    { id: 1, time: "07:00", label: "Morning Meditation", active: true, repeat: "Daily", icon: "🧘", color: "#9B59B6" },
    { id: 2, time: "13:00", label: "Study Time", active: true, repeat: "Weekdays", icon: "📚", color: "#3498DB" },
    { id: 3, time: "22:30", label: "Sleep Reminder", active: true, repeat: "Daily", icon: "🌙", color: "#2C3E50" },
  ]);
  const [newTime, setNewTime] = useState("08:00"); const [newLabel, setNewLabel] = useState(""); const [newIcon, setNewIcon] = useState("⏰"); const [newRepeat, setNewRepeat] = useState("Daily");
  const ICONS = ["⏰", "🧘", "📚", "💊", "🏃", "🌙", "☀️", "💧", "📝", "🎯"];
  const add = () => { if (!newLabel.trim()) return; setAlarms(a => [...a, { id: Date.now(), time: newTime, label: newLabel, active: true, repeat: newRepeat, icon: newIcon, color: "#4ECDC4" }]); setNewLabel(""); };
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>⏰ {lang === "bn" ? "অ্যালার্ম & রিমাইন্ডার" : "Alarms & Reminders"}</h2>
      <div className="card" style={{ marginBottom: 14, textAlign: "center" }}>
        <div style={{ fontSize: 42, fontWeight: 900, fontFamily: "monospace", background: "linear-gradient(90deg,#4ECDC4,#9B59B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</div>
      </div>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>{ICONS.map(ic => <button key={ic} onClick={() => setNewIcon(ic)} className="btn" style={{ width: 34, height: 34, borderRadius: 10, border: `2px solid ${newIcon === ic ? "#4ECDC4" : "transparent"}`, background: newIcon === ic ? "rgba(78,205,196,0.15)" : "rgba(255,255,255,0.05)", fontSize: 15 }}>{ic}</button>)}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
          <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} style={{ padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 14, outline: "none" }} />
          <select value={newRepeat} onChange={e => setNewRepeat(e.target.value)} style={{ padding: "10px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 12, outline: "none" }}>{["Once", "Daily", "Weekdays", "Weekends"].map(r => <option key={r} value={r}>{r}</option>)}</select>
        </div>
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Reminder label..." style={{ width: "100%", padding: "10px 14px", borderRadius: 12, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, outline: "none", marginBottom: 10 }} />
        <button onClick={add} className="btn" style={{ width: "100%", padding: "11px", borderRadius: 12, background: T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 13 }}>+ Add Reminder</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {alarms.map(a => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", borderRadius: 16, padding: "15px 16px", border: `1px solid ${a.active ? a.color + "44" : "rgba(255,255,255,0.06)"}`, opacity: a.active ? 1 : 0.5, transition: "all 0.3s" }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 22, fontFamily: "monospace" }}>{a.time}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{a.label} · {a.repeat}</div>
            </div>
            <label style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={a.active} onChange={() => setAlarms(as => as.map(al => al.id === a.id ? { ...al, active: !al.active } : al))} style={{ display: "none" }} />
              <div style={{ width: 46, height: 26, borderRadius: 13, background: a.active ? a.color : "rgba(255,255,255,0.12)", position: "relative", transition: "background 0.3s" }}><div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: a.active ? 23 : 3, transition: "left 0.3s" }} /></div>
            </label>
            <button onClick={() => setAlarms(as => as.filter(al => al.id !== a.id))} style={{ background: "none", border: "none", color: "rgba(255,100,100,0.5)", cursor: "pointer", fontSize: 16 }}>🗑</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MENTAL SCORE
// ─────────────────────────────────────────────
function ScorePage({ lang, mentalScore, moodHistory }) {
  const sc = mentalScore >= 75 ? "#2ECC71" : mentalScore >= 50 ? "#F39C12" : "#FF4757";
  const slabel = mentalScore >= 80 ? "Excellent 🌟" : mentalScore >= 65 ? "Good 😊" : mentalScore >= 50 ? "Fair 😐" : "Needs Care 💙";
  const cats = [
    { label: "Emotional Balance", score: Math.min(100, 50 + moodHistory.filter(m => m.mood.score >= 4).length * 5), icon: "💙", color: "#3498DB" },
    { label: "Stress Management", score: Math.max(20, 85 - moodHistory.filter(m => ["Stressed", "Anxious"].includes(m.mood.label)).length * 8), icon: "😤", color: "#E74C3C" },
    { label: "Mindfulness", score: 80, icon: "🧘", color: "#4ECDC4" },
    { label: "Sleep Quality", score: 72, icon: "🌙", color: "#9B59B6" },
    { label: "Productivity", score: 65, icon: "📋", color: "#F39C12" },
  ];
  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>🧠 Mental Health Score</h2>
      <div className="card" style={{ marginBottom: 16, textAlign: "center", background: "linear-gradient(135deg,rgba(45,27,105,0.6),rgba(17,153,142,0.3))" }}>
        <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 14px" }}>
          <svg width={140} height={140} style={{ transform: "rotate(-90deg)" }}><circle cx={70} cy={70} r={60} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} /><circle cx={70} cy={70} r={60} fill="none" stroke={sc} strokeWidth={10} strokeDasharray={`${2 * Math.PI * 60 * mentalScore / 100} ${2 * Math.PI * 60 * (1 - mentalScore / 100)}`} strokeLinecap="round" /></svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontWeight: 900, fontSize: 38 }}>{mentalScore}</span><span style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>/ 100</span></div>
        </div>
        <div style={{ color: sc, fontWeight: 800, fontSize: 18, marginBottom: 6 }}>{slabel}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {cats.map((c, i) => (
          <div key={i} className="card" style={{ padding: "14px 18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><span style={{ fontSize: 18 }}>{c.icon}</span><span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{c.label}</span></div>
              <span style={{ color: c.color, fontWeight: 800 }}>{c.score}%</span>
            </div>
            <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 3 }}><div style={{ height: "100%", width: `${c.score}%`, background: c.color, borderRadius: 3, transition: "width 0.7s" }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMERGENCY
// ─────────────────────────────────────────────
function EmergencyPage({ lang }) {
  const [breathStep, setBreathStep] = useState(-1); const [breathRunning, setBreathRunning] = useState(false);
  const breathRef = useRef(null);
  useEffect(() => { if (breathRunning && breathStep >= 0) { breathRef.current = setTimeout(() => setBreathStep(s => (s + 1) % 4), BREATHING_STEPS[breathStep % 4].duration); } return () => clearTimeout(breathRef.current); }, [breathRunning, breathStep]);
  const startBreath = () => { setBreathRunning(true); setBreathStep(0); };
  const stopBreath = () => { setBreathRunning(false); setBreathStep(-1); };
  const curBreath = breathStep >= 0 ? BREATHING_STEPS[breathStep % 4] : null;
  const GROUND = [{ n: 5, s: "SEE", e: "👁", c: "#3498DB" }, { n: 4, s: "TOUCH", e: "✋", c: "#2ECC71" }, { n: 3, s: "HEAR", e: "👂", c: "#9B59B6" }, { n: 2, s: "SMELL", e: "👃", c: "#F39C12" }, { n: 1, s: "TASTE", e: "👅", c: "#FF8C69" }];
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div style={{ background: "linear-gradient(135deg,rgba(255,71,87,0.18),rgba(255,71,87,0.04))", border: "1px solid rgba(255,71,87,0.35)", borderRadius: 22, padding: "24px 22px", marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 10, animation: "heartbeat 2s infinite" }}>🚨</div>
        <h2 style={{ color: "#FF6B7A", fontSize: 20, fontWeight: 900, marginBottom: 8 }}>{lang === "bn" ? "তুমি একা নও" : "You Are Not Alone"}</h2>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, lineHeight: 1.7 }}>{lang === "bn" ? "এই মুহূর্তে কষ্ট পাচ্ছো জানি। কিন্তু তোমার জীবন মূল্যবান। সাহায্য নেওয়া সাহসিকতার চিহ্ন।" : "I know you're hurting right now. Your life has immeasurable value. Asking for help is the bravest thing."}</p>
      </div>
      <div className="card" style={{ marginBottom: 14, textAlign: "center" }}>
        <h3 style={{ color: "#4ECDC4", marginBottom: 14, fontSize: 14, fontWeight: 700 }}>🌬️ Emergency Breathing</h3>
        <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: breathRunning ? (curBreath?.scale || 1) * 80 + 60 : 80, height: breathRunning ? (curBreath?.scale || 1) * 80 + 60 : 80, borderRadius: "50%", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: `3px solid ${breathRunning ? curBreath?.color : "rgba(78,205,196,0.3)"}`, background: breathRunning ? `radial-gradient(circle,${curBreath?.color}33,transparent)` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 1.5s ease" }}>
            <span style={{ color: "#fff", fontSize: 11, textAlign: "center", padding: 8 }}>{breathRunning ? (lang === "bn" ? curBreath?.textBn : curBreath?.text) : "Start"}</span>
          </div>
        </div>
        <button onClick={breathRunning ? stopBreath : startBreath} className="btn" style={{ padding: "11px 28px", borderRadius: 14, background: breathRunning ? "rgba(255,71,87,0.3)" : T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 13 }}>{breathRunning ? "⏹ Stop" : "▶ Start"}</button>
      </div>
      <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📞 Crisis Helplines</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
        {HELPLINES.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "13px 16px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <span style={{ fontSize: 22 }}>{h.icon}</span>
            <div style={{ flex: 1 }}><div style={{ color: "#fff", fontWeight: 600, fontSize: 12 }}>{h.country} {h.name}</div><div style={{ color: "#4ECDC4", fontSize: 15, fontWeight: 700, fontFamily: "monospace" }}>{h.number}</div></div>
            <a href={`tel:${h.number}`} style={{ padding: "8px 14px", borderRadius: 10, background: T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 11, fontWeight: 700, textDecoration: "none" }}>Call</a>
          </div>
        ))}
      </div>
      <div className="card">
        <h3 style={{ color: "#FFD700", marginBottom: 12, fontSize: 14, fontWeight: 700 }}>⭐ 5-4-3-2-1 Grounding</h3>
        {GROUND.map((g, i) => <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 9, background: g.c + "11", borderRadius: 12, padding: "11px 14px" }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: g.c + "22", display: "flex", alignItems: "center", justifyContent: "center", color: g.c, fontWeight: 900 }}>{g.n}</div><span style={{ fontSize: 20 }}>{g.e}</span><span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{g.n} things you can {g.s}</span></div>)}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// RESOURCES
// ─────────────────────────────────────────────
const RESOURCE_DATA = [
  { icon: "🧠", title: "Anxiety Guide", tag: "Anxiety", color: "#FF8C69", body: "Anxiety is your body's natural stress response. Techniques: Deep breathing (4-7-8), progressive muscle relaxation, grounding exercises. Seek help if it disrupts daily life." },
  { icon: "💙", title: "Depression Awareness", tag: "Depression", color: "#6B9BD2", body: "Depression is more than sadness. Symptoms: persistent low mood, fatigue, loss of interest. It's treatable through therapy, medication, and lifestyle changes." },
  { icon: "📚", title: "Exam Stress Tips", tag: "Stress", color: "#F39C12", body: "Manage exam stress: Pomodoro technique (25min focus + 5min break), sleep 7-8hrs, exercise, avoid all-nighters. Your worth ≠ your grades." },
  { icon: "🧘", title: "Meditation Basics", tag: "Mindfulness", color: "#9B59B6", body: "Start with 5 minutes: sit comfortably, close eyes, focus on breath, let thoughts pass without judgment. Consistency > duration." },
  { icon: "🌙", title: "Sleep Hygiene", tag: "Sleep", color: "#2C3E50", body: "Better sleep: consistent schedule, cool dark room, no screens 1hr before bed, avoid caffeine after 3pm. 7-9hrs is optimal." },
  { icon: "❤️", title: "Self-Care Guide", tag: "Self-Care", color: "#FF6B9D", body: "Self-care is essential: eat nutritiously, move your body, connect with others, set boundaries, practice gratitude daily." },
];
function ResourcesPage({ lang }) {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{ maxWidth: 620, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>📚 {lang === "bn" ? "রিসোর্স হাব" : "Resource Hub"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {RESOURCE_DATA.map((r, i) => <button key={i} onClick={() => setSelected(selected?.title === r.title ? null : r)} className="btn" style={{ background: selected?.title === r.title ? r.color + "18" : "rgba(255,255,255,0.04)", border: `1px solid ${selected?.title === r.title ? r.color + "55" : "rgba(255,255,255,0.08)"}`, borderRadius: 18, padding: "18px 16px", textAlign: "left" }}><div style={{ fontSize: 30, marginBottom: 8 }}>{r.icon}</div><div style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginBottom: 5 }}>{r.title}</div><div style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, display: "inline-block", background: r.color + "22", color: r.color, fontWeight: 600 }}>{r.tag}</div></button>)}
      </div>
      {selected && <div className="pop-in" style={{ marginTop: 16, background: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 22, border: `1px solid ${selected.color}44` }}><div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}><span style={{ fontSize: 28 }}>{selected.icon}</span><h3 style={{ color: selected.color, fontSize: 17, fontWeight: 800 }}>{selected.title}</h3></div><p style={{ color: "rgba(255,255,255,0.82)", lineHeight: 1.8, fontSize: 13.5 }}>{selected.body}</p></div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// MOTIVATION
// ─────────────────────────────────────────────
function MotivationPage({ lang }) {
  const [tab, setTab] = useState("quotes"); const [qi, setQi] = useState(0);
  const q = QUOTES[qi % QUOTES.length];
  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 16 }}>✨ Motivation Center</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {["quotes", "videos", "affirmations"].map(t => <button key={t} onClick={() => setTab(t)} className="btn" style={{ flex: 1, padding: "9px 4px", borderRadius: 12, fontSize: 12, background: tab === t ? T.grad("#FFD700", "#F39C12") : "rgba(255,255,255,0.06)", color: tab === t ? "#000" : "rgba(255,255,255,0.7)" }}>{t === "quotes" ? "💬 Quotes" : t === "videos" ? "🎥 Videos" : "🌟 Affirmations"}</button>)}
      </div>
      {tab === "quotes" && <div>
        <div style={{ background: "linear-gradient(135deg,rgba(45,27,105,0.85),rgba(17,153,142,0.45))", borderRadius: 24, padding: "32px 28px", textAlign: "center", marginBottom: 14, border: "1px solid rgba(78,205,196,0.2)", minHeight: 200, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✨</div>
          <p style={{ color: "#fff", fontSize: 18, lineHeight: 1.8, fontStyle: "italic", marginBottom: 12 }}>"{q.text}"</p>
          <p style={{ color: "#4ECDC4", fontSize: 12 }}>— {q.author}</p>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button onClick={() => setQi(i => (i - 1 + QUOTES.length) % QUOTES.length)} className="btn" style={{ padding: "10px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff" }}>← Prev</button>
          <button onClick={() => setQi(() => Math.floor(Math.random() * QUOTES.length))} className="btn" style={{ padding: "10px 20px", borderRadius: 14, background: T.grad("#FFD700", "#F39C12"), color: "#000" }}>🔀 Random</button>
          <button onClick={() => setQi(i => (i + 1) % QUOTES.length)} className="btn" style={{ padding: "10px 20px", borderRadius: 14, border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff" }}>Next →</button>
        </div>
      </div>}
      {tab === "videos" && <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {[{ title: "Overcome Anxiety - TEDx", url: "https://www.youtube.com/embed/aXItOY0sLRY" }, { title: "Morning Meditation", url: "https://www.youtube.com/embed/86m4RC_ADEY" }].map((v, i) => <div key={i} className="card" style={{ padding: 0, overflow: "hidden" }}><div style={{ padding: "12px 16px" }}><span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>🎥 {v.title}</span></div><div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}><iframe src={v.url} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }} allowFullScreen title={v.title} /></div></div>)}
      </div>}
      {tab === "affirmations" && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {["I am worthy of love and happiness. 💙", "I have the strength to overcome challenges. 💪", "I choose peace over worry. 🕊️", "My feelings are valid and I honor them. ❤️", "আমি আমার সেরাটা করছি। ✨", "আমি ভালোবাসার যোগ্য। 💝", "আমি প্রতিদিন আরও ভালো হচ্ছি। 🌱"].map((a, i) => <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", background: "rgba(255,255,255,0.04)", borderRadius: 14, padding: "16px", border: "1px solid rgba(255,255,255,0.07)" }}><span style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.6 }}>{a}</span></div>)}
      </div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────
function SettingsPage({ lang, setLang, onLogout }) {
  const [anonymous, setAnonymous] = useState(false); const [notifs, setNotifs] = useState(true);
  const Toggle = ({ v, onChange }) => <button onClick={() => onChange(!v)} className="btn" style={{ width: 46, height: 26, borderRadius: 13, background: v ? "#4ECDC4" : "rgba(255,255,255,0.13)", position: "relative" }}><div style={{ width: 20, height: 20, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: v ? 23 : 3, transition: "left 0.3s" }} /></button>;
  const Row = ({ icon, label, children }) => <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}><span style={{ fontSize: 18 }}>{icon}</span><div style={{ flex: 1, color: "#fff", fontSize: 13 }}>{label}</div>{children}</div>;
  return (
    <div style={{ maxWidth: 540, margin: "0 auto" }}>
      <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 900, marginBottom: 20 }}>⚙️ Settings</h2>
      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 18, padding: "4px 18px", marginBottom: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
        <Row icon="🌐" label="Language">
          <div style={{ display: "flex", gap: 6 }}>{["en", "bn"].map(l => <button key={l} onClick={() => setLang(l)} className="btn" style={{ padding: "6px 14px", borderRadius: 10, background: lang === l ? "#4ECDC4" : "rgba(255,255,255,0.09)", color: lang === l ? "#000" : "#fff", fontSize: 12 }}>{l === "en" ? "English" : "বাংলা"}</button>)}</div>
        </Row>
        <Row icon="🕵️" label="Anonymous Mode"><Toggle v={anonymous} onChange={setAnonymous} /></Row>
        <Row icon="🔔" label="Notifications"><Toggle v={notifs} onChange={setNotifs} /></Row>
      </div>

      {/* API Info Box */}
      <div style={{ background: "rgba(78,205,196,0.07)", borderRadius: 16, padding: 18, marginBottom: 14, border: "1px solid rgba(78,205,196,0.2)" }}>
        <h4 style={{ color: "#4ECDC4", marginBottom: 10, fontSize: 13, fontWeight: 700 }}>🔑 Claude API Integration</h4>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2ECC71", animation: "glow 2s infinite" }} />
          <span style={{ color: "#2ECC71", fontSize: 12, fontWeight: 700 }}>Connected to Claude AI</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 1.6 }}>
          Chat AI page uses <strong style={{ color: "#4ECDC4" }}>claude-sonnet-4-20250514</strong> model via Anthropic API with full conversation memory.
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 18, padding: "4px 18px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.06)" }}>
        <Row icon="🗑️" label="Clear Chat History"><button className="btn" style={{ padding: "6px 14px", borderRadius: 10, border: "1px solid rgba(255,71,87,0.3)", background: "transparent", color: "#FF6B7A", fontSize: 12 }}>Clear</button></Row>
        <Row icon="📤" label="Export Data"><button className="btn" style={{ padding: "6px 14px", borderRadius: 10, border: "1px solid rgba(78,205,196,0.3)", background: "transparent", color: "#4ECDC4", fontSize: 12 }}>Export</button></Row>
      </div>
      <button onClick={onLogout} className="btn" style={{ width: "100%", padding: "14px", borderRadius: 16, background: "linear-gradient(90deg,rgba(255,71,87,0.15),rgba(255,71,87,0.07))", border: "1px solid rgba(255,71,87,0.3)", color: "#FF6B7A", fontSize: 14, marginBottom: 16 }}>🚪 Log Out</button>
      <div style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", fontSize: 11 }}>MonBondhu AI v3.0 • Powered by Claude AI • Made with 💙</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────────
function LoginPage({ onLogin, lang }) {
  const [mode, setMode] = useState("login"); const [email, setEmail] = useState(""); const [pass, setPass] = useState(""); const [name, setName] = useState(""); const [loading, setLoading] = useState(false);
  const submit = () => { if (!email.trim() || !pass.trim()) return; setLoading(true); setTimeout(() => { setLoading(false); onLogin(name || email.split("@")[0]); }, 1500); };
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#080B1A 0%,#0F0C29 50%,#1a1040 100%)", padding: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 36 }}>
        <div style={{ fontSize: 64, marginBottom: 12, animation: "float 3s ease-in-out infinite" }}>🧠</div>
        <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 900, letterSpacing: -1, marginBottom: 6, background: "linear-gradient(90deg,#4ECDC4,#9B59B6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>MonBondhu AI</h1>
        <p style={{ color: "rgba(78,205,196,0.7)", fontSize: 13 }}>{lang === "bn" ? "তোমার মানসিক স্বাস্থ্য সঙ্গী • Powered by Shoham AI support" : "Your Mental Health Companion • Powered by Shoham"}</p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10, flexWrap: "wrap" }}>
          {["💬 Real AI Chat", "🌈 Mood Track", "📓 Journal", "🔥 Habits", "🌙 Sleep"].map(f => <span key={f} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.08)" }}>{f}</span>)}
        </div>
      </div>
      <div style={{ width: "100%", maxWidth: 400, background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: 24, padding: 28, border: "1px solid rgba(78,205,196,0.2)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.07)", borderRadius: 14, padding: 4, marginBottom: 22 }}>
          {["login", "register"].map(m => <button key={m} onClick={() => setMode(m)} className="btn" style={{ flex: 1, padding: "10px", borderRadius: 10, background: mode === m ? T.grad("#4ECDC4", "#2980B9") : "transparent", color: "#fff", fontSize: 13 }}>{m === "login" ? (lang === "bn" ? "লগইন" : "Sign In") : (lang === "bn" ? "রেজিস্টার" : "Register")}</button>)}
        </div>
        {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Your Name" style={{ width: "100%", padding: "13px 16px", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13.5, outline: "none", marginBottom: 12 }} />}
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" style={{ width: "100%", padding: "13px 16px", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13.5, outline: "none", marginBottom: 12 }} />
        <input value={pass} onChange={e => setPass(e.target.value)} type="password" onKeyDown={e => e.key === "Enter" && submit()} placeholder="Password" style={{ width: "100%", padding: "13px 16px", borderRadius: 14, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13.5, outline: "none", marginBottom: 16 }} />
        <button onClick={submit} disabled={loading} className="btn" style={{ width: "100%", padding: "14px", borderRadius: 16, background: T.grad("#4ECDC4", "#2980B9"), color: "#fff", fontSize: 15, opacity: loading ? 0.7 : 1, boxShadow: "0 8px 25px rgba(78,205,196,0.3)" }}>
          {loading ? "⏳ Signing in..." : (mode === "login" ? "Sign In" : "Join Now")}
        </button>
        <div style={{ textAlign: "center", marginTop: 14 }}>
          <button onClick={() => onLogin("Guest")} className="btn" style={{ background: "none", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.5)", padding: "9px 22px", borderRadius: 12, fontSize: 13 }}>Continue as Guest</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMERGENCY MODEL
// ─────────────────────────────────────────────
function EmergencyModal({ onClose, lang }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="pop-in" style={{ background: "linear-gradient(135deg,#1a0000,#2d0808)", borderRadius: 24, padding: 30, maxWidth: 400, width: "100%", border: "1px solid rgba(255,71,87,0.4)", textAlign: "center" }}>
        <div style={{ fontSize: 52, marginBottom: 14, animation: "heartbeat 1.5s infinite" }}>🚨</div>
        <h2 style={{ color: "#FF6B7A", fontSize: 20, fontWeight: 900, marginBottom: 10 }}>{lang === "bn" ? "সাহায্য পাওয়া যাচ্ছে" : "Help Is Available"}</h2>
        <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.8, marginBottom: 18, fontSize: 13.5 }}>{lang === "bn" ? "তোমার জীবন মূল্যবান। এই মুহূর্তটা কঠিন, কিন্তু তুমি এটা সামলাতে পারবে।" : "Your life has immeasurable value. This moment is hard, but you can get through this. Please reach out."}</p>
        {HELPLINES.slice(0, 3).map((h, i) => <a key={i} href={`tel:${h.number}`} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 16px", borderRadius: 14, background: "rgba(255,71,87,0.15)", border: "1px solid rgba(255,71,87,0.25)", color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 14, marginBottom: 9 }}><span style={{ fontSize: 22 }}>{h.icon}</span><span style={{ flex: 1, textAlign: "left" }}>{h.name}</span><span style={{ color: "#4ECDC4", fontFamily: "monospace" }}>{h.number}</span></a>)}
        <button onClick={onClose} className="btn" style={{ marginTop: 10, background: "none", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.45)", padding: "10px 26px", borderRadius: 12, fontSize: 13 }}>{lang === "bn" ? "আমি এখন নিরাপদ" : "I'm safe for now"}</button>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────
function Footer({ lang }) {
  return (
    <footer style={{
      width: "100%",
      marginTop: 40,
      padding: "20px 16px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(255,255,255,0.02)",
      backdropFilter: "blur(10px)",
      textAlign: "center"
    }}>
      
      {/* Logo / Name */}
      <div style={{
        fontSize: 16,
        fontWeight: 800,
        color: "#4ECDC4",
        marginBottom: 6
      }}>
        🧠 MonBondhu AI
      </div>

      {/* Tagline */}
      <p style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: 12,
        marginBottom: 12
      }}>
        {lang === "bn"
          ? "তোমার মানসিক স্বাস্থ্যের বিশ্বস্ত সঙ্গী 💙"
          : "Your trusted mental health companion 💙"}
      </p>

      {/* Links */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 12
      }}>
        {[
          { label: "Home", page: "home" },
          { label: "Chat", page: "chat" },
          { label: "Mood", page: "mood" },
          { label: "Emergency", page: "emergency" },
        ].map((l, i) => (
          <span
            key={i}
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            {l.label}
          </span>
        ))}
      </div>

      {/* Disclaimer */}
      <p style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.35)",
        maxWidth: 400,
        margin: "0 auto 10px"
      }}>
        {lang === "bn"
          ? "⚠️ এটি কোনো চিকিৎসা সেবা নয়। জরুরি অবস্থায় 999 অথবা মানসিক স্বাস্থ্য হেল্পলাইনে যোগাযোগ করুন।"
          : "⚠️ This is not a medical service. In emergencies, contact 999 or a professional helpline."}
      </p>

      {/* Copyright */}
      <div style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.3)"
      }}>
        © {new Date().getFullYear()} MonBondhu AI • Built By Shoham Mallick
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────
// FLOATING ROBOT
// ─────────────────────────────────────────────
function FloatingRobot({ robotMood, robotSpeaking, onClick }) {
  const [visible, setVisible] = useState(true);
  const [msg, setMsg] = useState(null);
  const msgs = ["How are you? 💙", "Tap to chat with AI!", "You're doing great! 🌟", "I'm here for you. 🤗"];
  useEffect(() => { const t = setInterval(() => { setMsg(msgs[Math.floor(Math.random() * msgs.length)]); setTimeout(() => setMsg(null), 3000); }, 15000); return () => clearInterval(t); }, []);
  if (!visible) return <button onClick={() => setVisible(true)} style={{ position: "fixed", bottom: 22, right: 14, zIndex: 35, width: 44, height: 44, borderRadius: "50%", background: T.grad("#2D1B69", "#4ECDC4"), border: "none", cursor: "pointer", fontSize: 20, boxShadow: "0 4px 15px rgba(78,205,196,0.3)" }}>🤖</button>;
  return (
    <div style={{ position: "fixed", bottom: 20, right: 12, zIndex: 35, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      {msg && <div style={{ background: "rgba(15,12,41,0.95)", border: "1px solid rgba(78,205,196,0.3)", borderRadius: "12px 12px 4px 12px", padding: "8px 12px", fontSize: 11, color: "#fff", maxWidth: 130, textAlign: "center", marginBottom: 4, animation: "popIn 0.3s ease" }}>{msg}</div>}
      <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", fontSize: 11, cursor: "pointer", alignSelf: "flex-end", marginBottom: -4 }}>✕</button>
      <div style={{ filter: "drop-shadow(0 4px 15px rgba(78,205,196,0.3))" }}>
        <Robot speaking={robotSpeaking} mood={robotMood} size={0.95} onClick={onClick} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [lang, setLang] = useState("en");
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([
    { mood: MOODS[0], date: new Date(Date.now() - 86400000), note: "Great day" },
    { mood: MOODS[2], date: new Date(Date.now() - 172800000), note: "" },
    { mood: MOODS[6], date: new Date(Date.now() - 259200000), note: "Grateful" },
    { mood: MOODS[0], date: new Date(Date.now() - 345600000), note: "" },
    { mood: MOODS[4], date: new Date(Date.now() - 432000000), note: "Normal day" },
  ]);
  const [robotMood, setRobotMood] = useState("default");
  const [robotSpeaking, setRobotSpeaking] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);
  const streak = 7;

  const mentalScore = useMemo(() => {
    if (!moodHistory.length) return 50;
    const avg = moodHistory.slice(0, 7).reduce((s, m) => s + m.mood.score, 0) / Math.min(moodHistory.length, 7);
    return Math.round(Math.min(100, avg / 5 * 100 * 0.7 + 30));
  }, [moodHistory]);

  if (!loggedIn) return (<><style>{CSS}</style><LoginPage onLogin={(n) => { setUserName(n); setLoggedIn(true); }} lang={lang} /></>);

  const pageProps = { lang, setPage };
  const pages = {
    home:      <HomePage {...pageProps} currentMood={currentMood} setCurrentMood={setCurrentMood} userName={userName} streak={streak} mentalScore={mentalScore} moodHistory={moodHistory} />,
    chat:      <ChatPage {...pageProps} setRobotSpeaking={setRobotSpeaking} setRobotMood={setRobotMood} onEmergency={() => setShowEmergency(true)} />,
    mood:      <MoodPage {...pageProps} currentMood={currentMood} setCurrentMood={setCurrentMood} moodHistory={moodHistory} setMoodHistory={setMoodHistory} />,
    journal:   <JournalPage {...pageProps} />,
    tasks:     <TaskPage {...pageProps} />,
    habits:    <HabitsPage {...pageProps} />,
    sleep:     <SleepPage {...pageProps} />,
    meditation:<MeditationPage {...pageProps} />,
    alarm:     <AlarmPage {...pageProps} />,
    score:     <ScorePage {...pageProps} mentalScore={mentalScore} moodHistory={moodHistory} />,
    emergency: <EmergencyPage {...pageProps} />,
    resources: <ResourcesPage {...pageProps} />,
    motivation:<MotivationPage {...pageProps} />,
    settings:  <SettingsPage {...pageProps} setLang={setLang} onLogout={() => { setLoggedIn(false); setUserName(""); setPage("home"); }} />,
  };

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#fff" }}>
        <Sidebar page={page} setPage={setPage} open={sidebarOpen} setOpen={setSidebarOpen} lang={lang} robotMood={robotMood} robotSpeaking={robotSpeaking} />
        <Topbar setOpen={setSidebarOpen} page={page} lang={lang} streak={streak} mentalScore={mentalScore} />
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
          <div style={{ position: "absolute", top: "20%", left: "5%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(78,205,196,0.03),transparent)" }} />
          <div style={{ position: "absolute", bottom: "20%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(155,89,182,0.03),transparent)" }} />
        </div>
        <main style={{ paddingTop: 74, paddingBottom: 110, paddingLeft: 16, paddingRight: 16, position: "relative", zIndex: 1 }}>
          {pages[page] || pages.home}
        </main>
        <FloatingRobot robotMood={robotMood} robotSpeaking={robotSpeaking} onClick={() => setPage("chat")} />
        {showEmergency && <EmergencyModal onClose={() => setShowEmergency(false)} lang={lang} />}
          <Footer lang={lang} />
      </div>
    </>
  );
}

import { useApp } from "../context/AppContext";
import { C, T } from "../constants";

export default function LandingScreen() {
  const { lang, setLang, setScreen, role } = useApp();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr", overflowX: "hidden" }}>
      <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://i.imgur.com/QMj8XdO.jpeg" alt="Qoot Logo" style={{ height: 40 }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {role !== "customer" && (
            <span style={{
              background: role === "admin" ? C.purple : C.teal,
              color: "#fff",
              borderRadius: 20,
              padding: "4px 12px",
              fontSize: 12,
              fontWeight: 600
            }}>
              {role === "admin" ? (lang === "ar" ? "مدير" : "Admin") : (lang === "ar" ? "متخصص" : "Specialist")}
            </span>
          )}
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ar" ? "English" : "العربية"}
          </button>
          {/* زر تسجيل الدخول */}
          <button onClick={() => setScreen("auth")}
            style={{ background: C.teal, border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
          </button>
          <span style={{ fontSize: 12, color: C.muted, background: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 20, padding: "4px 12px" }}>
            {T.landing.aiPowered[lang]}
          </span>
        </div>
      </div>

      {/* باقي محتوى الصفحة كما هو دون تغيير */}
      <div style={{ maxWidth: 660, margin: "0 auto", padding: "56px 20px 40px", textAlign: "center" }}>
        <div className="fu" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.tealGlow, border: `1px solid ${C.teal}44`, borderRadius: 100, padding: "6px 18px", fontSize: 13, color: C.teal, marginBottom: 24, fontWeight: 600 }}>
          {T.landing.badge[lang]}
        </div>
        <h1 className="fu2" style={{ fontSize: "clamp(1.9rem,5vw,2.9rem)", fontWeight: 700, lineHeight: 1.25, marginBottom: 18, color: C.text, letterSpacing: "-0.5px" }}>
          {T.landing.heading1[lang]}<br /><span style={{ color: C.teal }}>{T.landing.heading2[lang]}</span>
        </h1>
        <p className="fu3" style={{ fontSize: 15, color: C.muted, lineHeight: 1.9, marginBottom: 16, maxWidth: 500, margin: "0 auto 16px" }}>
          {T.landing.desc[lang]}
        </p>
        <div className="fu3" style={{ fontSize: 14, color: C.amber, margin: "0 auto 36px", maxWidth: 480, padding: "14px 20px", background: C.amberGlow, borderRadius: 14, border: `1px solid ${C.amber}33`, lineHeight: 1.8 }}>
          {T.landing.warning[lang]}
        </div>
        <button className="fu4" onClick={() => setScreen("quiz")}
          style={{ background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: "#fff", border: "none", borderRadius: 14, padding: "18px 52px", fontSize: 17, fontWeight: 700, cursor: "pointer", boxShadow: `0 8px 32px ${C.teal}44`, transition: "transform 0.2s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}>
          {T.landing.cta[lang]}
        </button>
        <div style={{ fontSize: 13, color: C.muted, marginTop: 14 }}>{T.landing.time[lang]}</div>
      </div>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 20px 48px" }}>
        <div className="fu3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          {T.landing.features.map(({ icon, title, desc }) => (
            <div key={title.en} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: "22px 18px" }}>
              <div style={{ fontSize: 26, marginBottom: 12 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 8 }}>{title[lang]}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{desc[lang]}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "0 20px 64px" }}>
        <div style={{ fontSize: 13, color: C.muted, textAlign: "center", marginBottom: 22, fontWeight: 600, letterSpacing: "1px" }}>
          {T.landing.steps[lang]}
        </div>
        {[["01", C.teal], ["02", C.amber], ["03", C.purple], ["04", C.green]].map(([num, color], i) => (
          <div key={num} style={{ display: "flex", gap: 16, marginBottom: i < 3 ? 22 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 40, height: 40, background: `${color}18`, border: `2px solid ${color}55`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color, flexShrink: 0 }}>
                {num}
              </div>
              {i < 3 && <div style={{ width: 2, flex: 1, background: C.border, marginTop: 8, minHeight: 20 }} />}
            </div>
            <div style={{ paddingTop: 6 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 4 }}>{T.landing.stepsList[i].title[lang]}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7 }}>{T.landing.stepsList[i].desc[lang]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

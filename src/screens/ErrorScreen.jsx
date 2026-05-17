import { useApp } from "../context/AppContext";
import { C, T } from "../constants";

export default function ErrorScreen() {
  const { lang, errorMsg, setScreen, setCurrentQ, setAnswers, setPlan, setApproved, setActiveDay, resetFields, setWeekNum, setFollowUp } = useApp();
  const QUESTIONS = T.questions;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: 20, textAlign: "center" }}>
      <div style={{ fontSize: 48 }}>{errorMsg === "rate_limit" ? "⏳" : "⚠️"}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>
        {errorMsg === "rate_limit" ? T.error.rateLimit[lang] : T.error.general[lang]}
      </div>
      <div style={{ fontSize: 14, color: C.muted, maxWidth: 380, lineHeight: 1.8 }}>
        {errorMsg === "rate_limit" ? T.error.rateLimitDesc[lang] : T.error.generalDesc[lang]}
      </div>
      {errorMsg && errorMsg !== "rate_limit" && (
        <div style={{ background: C.card, border: `1px solid ${C.danger}44`, borderRadius: 12, padding: "12px 18px", maxWidth: 400, width: "100%" }}>
          <div style={{ fontSize: 11, color: C.danger, marginBottom: 4, fontWeight: 600 }}>{T.error.details[lang]}:</div>
          <div style={{ fontSize: 12, color: C.muted, fontFamily: "monospace", direction: "ltr", textAlign: "left", wordBreak: "break-all" }}>{errorMsg}</div>
        </div>
      )}
      <button onClick={() => { setScreen("quiz"); setCurrentQ(QUESTIONS.length - 1); }}
        style={{ background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: "#fff", border: "none", borderRadius: 12, padding: "15px 40px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>
        {T.error.retry[lang]}
      </button>
      <button onClick={() => { setScreen("landing"); setAnswers({}); setCurrentQ(0); setPlan(null); resetFields(); }}
        style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 14, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>
        {T.error.restart[lang]}
      </button>
    </div>
  );
}

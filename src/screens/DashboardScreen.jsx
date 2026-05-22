// src/screens/DashboardScreen.jsx
import { useApp } from "../context/AppContext";
import { C } from "../constants";
import Chat from "../Chat";
import SignOutButton from "../components/SignOutButton";

export default function DashboardScreen() {
  const { lang, setScreen, answers, userProfile, uid, plan, activeDay } = useApp();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr", display: "flex", flexDirection: "column" }}>
      {/* Header with Back button, user info, and Sign Out */}
      <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* BACK BUTTON to Landing */}
          <button
            onClick={() => setScreen("landing")}
            style={{
              background: C.cardLight,
              border: `1px solid ${C.border}`,
              color: C.text,
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",
              display: "inline-flex",
              alignItems: "center",
              gap: 4
            }}
          >
            ← {lang === "ar" ? "الرئيسية" : "Home"}
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
            👤 {answers.first_name || userProfile?.name || (lang === "ar" ? "مستخدم" : "User")}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <SignOutButton />
          <button onClick={() => setScreen("community")} style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>🌍</button>
          <button onClick={() => setScreen("plan")} style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "6px 14px", fontSize: 13, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>
            {lang === "ar" ? "← خطتي" : "← My Plan"}
          </button>
        </div>
      </div>
      <div style={{ flex: 1, padding: "16px", maxWidth: 600, margin: "0 auto", width: "100%" }}>
        <Chat lang={lang} plan={plan} answers={answers} currentDay={activeDay} userId={uid} />
      </div>
    </div>
  );
}

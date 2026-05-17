import { useApp } from "../context/AppContext";
import { C, T } from "../constants";

export default function GeneratingScreen() {
  const { lang, loadMsg } = useApp();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, padding: 20 }}>
      <div style={{ width: 64, height: 64, border: `4px solid ${C.border}`, borderTop: `4px solid ${C.teal}`, borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      <div style={{ fontSize: 20, fontWeight: 600, color: C.text }}>{T.generating.title[lang]}</div>
      <div style={{ fontSize: 15, color: C.muted, animation: "pulse 1.5s ease infinite" }}>{loadMsg}</div>
      <div style={{ fontSize: 12, color: C.border }}>{T.generating.time[lang]}</div>
    </div>
  );
}

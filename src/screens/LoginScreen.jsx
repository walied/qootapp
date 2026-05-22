// src/screens/LoginScreen.jsx
import { useApp } from "../context/AppContext";
import { C, T } from "../constants";

export default function LoginScreen() {
  const { lang, setScreen, setRole, loginPass, setLoginPass, inp } = useApp();

  // ✅ Read passwords from environment variables (set in .env file)
  const adminPass = import.meta.env.VITE_ADMIN_PASS || "admin_default_change_me";
  const specialistPass = import.meta.env.VITE_SPECIALIST_PASS || "spec_default_change_me";

  const handleLogin = () => {
    if (loginPass === adminPass) {
      setRole("admin");
      setScreen("landing");
    } else if (loginPass === specialistPass) {
      setRole("specialist");
      setScreen("landing");
    } else {
      alert(T.login.error[lang]);
    }
    setLoginPass("");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="fu" style={{ width: "100%", maxWidth: 400, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>{T.login.title[lang]}</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>{T.login.hint[lang]}</div>
        <input 
          type="password" 
          placeholder={lang === "ar" ? "رمز الدخول..." : "Access code..."} 
          value={loginPass} 
          onChange={e => setLoginPass(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{ ...inp({ textAlign: "center", marginBottom: 16 }), letterSpacing: 2 }} 
        />
        <button 
          onClick={handleLogin}
          style={{ width: "100%", background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", marginBottom: 12 }}>
          {T.login.loginBtn[lang]}
        </button>
        <button 
          onClick={() => { setRole("customer"); setScreen("landing"); setLoginPass(""); }}
          style={{ width: "100%", background: "transparent", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", textDecoration: "underline" }}>
          {T.login.back[lang]}
        </button>
      </div>
    </div>
  );
}

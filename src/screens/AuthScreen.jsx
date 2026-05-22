import { useState } from "react";
import { useApp } from "../context/AppContext";
import { C, T } from "../constants";

export default function AuthScreen() {
  const { lang, signInWithGoogle, setScreen } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await signInWithGoogle();
    if (error) {
      setError(error);
      setLoading(false);
    }
    // No need to setScreen here – onAuthStateChange will redirect to quiz
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="fu" style={{ width: "100%", maxWidth: 400, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>{lang === "ar" ? "تسجيل الدخول" : "Sign In"}</div>
        <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>
          {lang === "ar" ? "استخدم حساب Google الخاص بك للدخول بسرعة وأمان." : "Use your Google account to sign in quickly and securely."}
        </div>

        {error && (
          <div style={{ background: `${C.danger}18`, border: `1px solid ${C.danger}44`, borderRadius: 10, padding: "8px 12px", marginBottom: 16, color: C.danger, fontSize: 13 }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? C.border : "#fff",
            color: loading ? C.muted : "#333",
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: "14px",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",
            marginBottom: 16
          }}
        >
          <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: 18, height: 18 }} />
          {loading ? (lang === "ar" ? "جاري التوجيه..." : "Redirecting...") : (lang === "ar" ? "تسجيل الدخول بواسطة Google" : "Sign in with Google")}
        </button>

        <button
          onClick={() => setScreen("landing")}
          style={{ background: "none", border: "none", color: C.muted, fontSize: 14, cursor: "pointer", textDecoration: "underline" }}
        >
          {lang === "ar" ? "← العودة إلى الرئيسية" : "← Back to Home"}
        </button>
      </div>
    </div>
  );
}

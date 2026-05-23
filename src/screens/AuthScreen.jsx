import { useApp } from "../context/AppContext";
import { C } from "../constants";

export default function AuthScreen() {
  const { lang, signInWithGoogle } = useApp();

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400, background: C.card, borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h2 style={{ color: C.text, marginBottom: 8 }}>{lang === "ar" ? "تسجيل الدخول" : "Sign In"}</h2>
        <p style={{ color: C.muted, marginBottom: 24 }}>{lang === "ar" ? "استخدم حساب Google للمتابعة" : "Use your Google account to continue"}</p>
        <button
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            background: "#fff",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: "14px",
            fontSize: 16,
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 20, height: 20 }} />
          {lang === "ar" ? "تسجيل الدخول بواسطة Google" : "Sign in with Google"}
        </button>
      </div>
    </div>
  );
}

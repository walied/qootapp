// src/screens/AuthScreen.jsx
import { useState } from "react";
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabaseClient";
import { C } from "../constants";

// Helper to get the correct base URL for redirects (works on Vercel & localhost)
function getBaseUrl() {
  // For browser: use current origin
  if (typeof window !== "undefined") return window.location.origin;
  // Fallback for SSR (not used here)
  return "https://qootapp.vercel.app";
}

export default function AuthScreen() {
  const { lang, setScreen, signInWithGoogle, setUid, setUserProfile } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: { data: { name: email.split("@")[0] } }
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        setSuccessMessage(
          lang === "ar"
            ? "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى تأكيد حسابك ثم تسجيل الدخول."
            : "A confirmation link has been sent to your email. Please confirm your account then sign in."
        );
        setIsSignUp(false);
        setPassword("");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        setUid(data.user.id);
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();
        if (profile) {
          setUserProfile(profile);
        } else {
          const newUser = {
            id: data.user.id,
            name: data.user.email.split("@")[0],
            email: data.user.email,
            xp: 0,
            level: 1,
            streak: 0,
            badges: [],
            paid: false,
          };
          await supabase.from("users").upsert(newUser);
          setUserProfile(newUser);
        }
        setScreen("quiz");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const redirectTo = `${getBaseUrl()}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",
        direction: lang === "ar" ? "rtl" : "ltr",
      }}
    >
      <div
        className="fu"
        style={{
          width: "100%",
          maxWidth: 400,
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: "32px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 8 }}>
          {isSignUp
            ? lang === "ar"
              ? "إنشاء حساب جديد"
              : "Create Account"
            : lang === "ar"
            ? "تسجيل الدخول"
            : "Sign In"}
        </div>

        {successMessage && (
          <div
            style={{
              background: `${C.green}18`,
              border: `1px solid ${C.green}44`,
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 16,
              color: C.green,
              fontSize: 13,
            }}
          >
            {successMessage}
          </div>
        )}

        {error && (
          <div
            style={{
              background: `${C.danger}18`,
              border: `1px solid ${C.danger}44`,
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 16,
              color: C.danger,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} style={{ textAlign: "right" }}>
          <input
            type="email"
            placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              background: C.cardLight,
              border: `2px solid ${C.border}`,
              borderRadius: 12,
              padding: "14px",
              fontSize: 14,
              color: C.text,
              marginBottom: 12,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <input
            type="password"
            placeholder={lang === "ar" ? "كلمة المرور" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              background: C.cardLight,
              border: `2px solid ${C.border}`,
              borderRadius: 12,
              padding: "14px",
              fontSize: 14,
              color: C.text,
              marginBottom: 16,
              outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? C.border : `linear-gradient(135deg,${C.teal},${C.tealDark})`,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontSize: 16,
              fontWeight: 700,
              cursor: loading ? "default" : "pointer",
              marginBottom: 12,
            }}
          >
            {loading
              ? lang === "ar"
                ? "جاري..."
                : "Loading..."
              : isSignUp
              ? lang === "ar"
                ? "إنشاء حساب"
                : "Sign Up"
              : lang === "ar"
              ? "تسجيل الدخول"
              : "Sign In"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
            setSuccessMessage("");
            setPassword("");
          }}
          style={{
            background: "none",
            border: "none",
            color: C.teal,
            cursor: "pointer",
            fontSize: 13,
            marginBottom: 16,
            textDecoration: "underline",
          }}
        >
          {isSignUp
            ? lang === "ar"
              ? "لديك حساب؟ سجل الدخول"
              : "Already have an account? Sign in"
            : lang === "ar"
            ? "ليس لديك حساب؟ أنشئ حساباً"
            : "No account? Create one"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: C.muted }}>{lang === "ar" ? "أو" : "or"}</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            background: "#fff",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: "12px",
            fontSize: 14,
            fontWeight: 600,
            cursor: loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: 18, height: 18 }}
          />
          {lang === "ar" ? "تسجيل الدخول بواسطة Google" : "Sign in with Google"}
        </button>

        <button
          onClick={() => setScreen("landing")}
          style={{
            background: "none",
            border: "none",
            color: C.muted,
            fontSize: 13,
            cursor: "pointer",
            marginTop: 16,
            textDecoration: "underline",
          }}
        >
          {lang === "ar" ? "← العودة إلى الرئيسية" : "← Back to Home"}
        </button>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../context/AppContext";
import { C, T } from "../constants";
import { supabase } from "../lib/supabaseClient";

export default function AuthScreen() {
  const { lang, setScreen, setUid, setUserProfile } = useApp();
  const [mode, setMode] = useState("signup"); // "signup" or "signin"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password || (mode === "signup" && !name)) {
      setError(lang === "ar" ? "املأ جميع الحقول" : "Fill all fields");
      return;
    }
    setLoading(true);

    if (mode === "signup") {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        await supabase.from("users").upsert({
          id: data.user.id,
          name: name || email.split("@")[0],
          xp: 0,
          level: 1,
          streak: 0,
          badges: [],
          paid: false,
        });
        setUid(data.user.id);
        setUserProfile({ id: data.user.id, name: name || email.split("@")[0], xp: 0, level: 1, streak: 0 });
        setScreen("landing");
      }
    } else {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }
      if (data?.user) {
        setUid(data.user.id);
        const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single();
        setUserProfile(profile || { id: data.user.id, name: email.split("@")[0], xp: 0, level: 1, streak: 0 });
        setScreen("landing");
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="fu" style={{ width: "100%", maxWidth: 400, background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>🔐</div>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: 24, borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            style={{
              flex: 1, padding: "10px", fontSize: 14, fontWeight: 600,
              background: mode === "signup" ? C.teal : "transparent",
              color: mode === "signup" ? "#fff" : C.text,
              border: "none", cursor: "pointer",
              fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
            }}>
            {lang === "ar" ? "إنشاء حساب" : "Sign Up"}
          </button>
          <button
            onClick={() => { setMode("signin"); setError(""); }}
            style={{
              flex: 1, padding: "10px", fontSize: 14, fontWeight: 600,
              background: mode === "signin" ? C.teal : "transparent",
              color: mode === "signin" ? "#fff" : C.text,
              border: "none", cursor: "pointer",
              fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
            }}>
            {lang === "ar" ? "تسجيل الدخول" : "Sign In"}
          </button>
        </div>

        {error && (
          <div style={{ background: `${C.danger}18`, border: `1px solid ${C.danger}44`, borderRadius: 10, padding: "8px 12px", marginBottom: 16, color: C.danger, fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Email / Password Form */}
        <form onSubmit={handleEmailAuth} style={{ textAlign: "right" }}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder={lang === "ar" ? "الاسم" : "Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", background: C.cardLight, border: `2px solid ${C.border}`, borderRadius: 12,
                padding: "12px 14px", fontSize: 14, color: C.text, marginBottom: 12, outline: "none",
                fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
              }}
            />
          )}
          <input
            type="email"
            placeholder={lang === "ar" ? "البريد الإلكتروني" : "Email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%", background: C.cardLight, border: `2px solid ${C.border}`, borderRadius: 12,
              padding: "12px 14px", fontSize: 14, color: C.text, marginBottom: 12, outline: "none",
              fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
            }}
          />
          <input
            type="password"
            placeholder={lang === "ar" ? "كلمة المرور" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%", background: C.cardLight, border: `2px solid ${C.border}`, borderRadius: 12,
              padding: "12px 14px", fontSize: 14, color: C.text, marginBottom: 16, outline: "none",
              fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", background: loading ? C.border : `linear-gradient(135deg,${C.teal},${C.tealDark})`,
              color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700,
              cursor: loading ? "default" : "pointer", marginBottom: 12,
              fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
            }}>
            {loading
              ? (lang === "ar" ? "انتظر..." : "Please wait...")
              : mode === "signup" ? (lang === "ar" ? "إنشاء حساب" : "Create Account") : (lang === "ar" ? "تسجيل الدخول" : "Sign In")}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 12, color: C.muted }}>{lang === "ar" ? "أو" : "or"}</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: "100%", background: "#fff", color: "#333", border: "1px solid #ddd", borderRadius: 12,
            padding: "14px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", gap: 8,
            fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
          }}>
          <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: 18, height: 18 }} />
          {lang === "ar" ? "تسجيل الدخول بـ Google" : "Sign in with Google"}
        </button>

        {/* Back button */}
        <button
          onClick={() => setScreen("landing")}
          style={{
            width: "100%", background: "transparent", border: "none", color: C.muted, fontSize: 14,
            cursor: "pointer", marginTop: 16, textDecoration: "underline",
            fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"
          }}>
          {lang === "ar" ? "← العودة" : "← Back"}
        </button>
      </div>
    </div>
  );
}

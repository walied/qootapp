// src/components/SignOutButton.jsx
import { useApp } from "../context/AppContext";
import { supabase } from "../lib/supabaseClient";
import { C } from "../constants";

export default function SignOutButton() {
  const { lang, setScreen, setUserProfile, setUid, setPlan, setPaid, setAnswers } = useApp();

  const handleSignOut = async () => {
    // Sign out from Supabase
    await supabase.auth.signOut();
    
    // Clear all local state
    setUserProfile(null);
    setUid(null);
    setPlan(null);
    setPaid(false);
    setAnswers({});
    
    // Clear local storage
    localStorage.removeItem("qoot_plan");
    localStorage.removeItem("qoot_answers");
    localStorage.removeItem("qoot_paid");
    localStorage.removeItem("qoot_uid");
    
    // Redirect to landing page
    setScreen("landing");
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        background: "transparent",
        border: `1px solid ${C.danger}`,
        color: C.danger,
        borderRadius: 8,
        padding: "6px 14px",
        fontSize: 13,
        cursor: "pointer",
        fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",
        transition: "all 0.2s"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = C.danger;
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = C.danger;
      }}
    >
      {lang === "ar" ? "تسجيل الخروج" : "Sign Out"}
    </button>
  );
}

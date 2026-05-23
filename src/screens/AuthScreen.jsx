// src/screens/AuthScreen.jsx
import { useApp } from "../context/AppContext";

export default function AuthScreen() {
  const { signInWithGoogle, lang } = useApp();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0B0F19", // نفس لون خلفية التطبيق
        fontFamily: lang === "ar" ? "'Alexandria', sans-serif" : "'Inter', sans-serif",
        direction: lang === "ar" ? "rtl" : "ltr",
        padding: "20px",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* شعار أو عنوان ترحيبي */}
        <div style={{ marginBottom: "32px" }}>
          <img
            src="https://i.imgur.com/QMj8XdO.jpeg"
            alt="Qoot Logo"
            style={{ height: "60px", marginBottom: "16px" }}
          />
          <h2 style={{ color: "#F8FAFC", margin: 0, fontWeight: 600 }}>
            {lang === "ar" ? "مرحباً بك في Qoot" : "Welcome to Qoot"}
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "14px", marginTop: "8px" }}>
            {lang === "ar"
              ? "سجل دخولك بحساب Google للمتابعة"
              : "Sign in with Google to continue"}
          </p>
        </div>

        {/* زر Google */}
        <button
          onClick={signInWithGoogle}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "12px 16px",
            backgroundColor: "#FFFFFF",
            color: "#5F6368",
            border: "1px solid #DADCE0",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
            gap: "12px",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#F8F9FA")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google logo"
            style={{ width: "20px", height: "20px" }}
          />
          <span>{lang === "ar" ? "تسجيل الدخول بحساب Google" : "Sign in with Google"}</span>
        </button>

        {/* رابط العودة إلى الصفحة الرئيسية (اختياري) */}
        <button
          onClick={() => window.history.back()}
          style={{
            background: "none",
            border: "none",
            color: "#94A3B8",
            fontSize: "13px",
            cursor: "pointer",
            marginTop: "24px",
            textDecoration: "underline",
          }}
        >
          {lang === "ar" ? "← العودة إلى الرئيسية" : "← Back to Home"}
        </button>
      </div>
    </div>
  );
}

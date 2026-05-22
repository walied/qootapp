// src/screens/OTPScreen.jsx
import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { C, T } from "../constants";

export default function OTPScreen() {
  const { lang, setScreen, setPaid, setIsSimulatingPayment, receiptNumber, setReceiptNumber } = useApp();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Generate a random 6-digit OTP
    const rand = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(rand);
    console.log("Demo OTP:", rand); // In production, send via SMS/email instead of console
    
    // Start resend cooldown
    setResendTimer(30);
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const verifyOtp = () => {
    if (otp === generatedOtp) {
      setReceiptNumber(Math.random().toString(36).substring(2, 10).toUpperCase());
      setPaid(true);
      localStorage.setItem("qoot_paid", "true");
      setScreen("plan");
    } else {
      setError(lang === "ar" ? "رمز غير صحيح" : "Incorrect code");
    }
  };

  const resendOtp = () => {
    if (resendTimer > 0) return;
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    console.log("New OTP:", newOtp);
    setResendTimer(30);
    setError("");
    // In production, send new OTP via SMS/email
    const timer = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div className="fu" style={{ maxWidth: 400, width: "100%", background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📲</div>
        <h2 style={{ color: C.text, marginBottom: 8, fontSize: "clamp(1.2rem,4vw,1.6rem)" }}>
          {lang === "ar" ? "تحقق من هاتفك" : "Verify your phone"}
        </h2>
        <p style={{ color: C.muted, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
          {lang === "ar" 
            ? "أدخل الرقم المكون من 6 أرقام الذي أرسلناه إلى هاتفك" 
            : "Enter the 6-digit code we sent to your phone"}
        </p>
        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
          onKeyDown={e => e.key === "Enter" && verifyOtp()}
          autoFocus
          style={{
            width: "100%",
            background: C.cardLight,
            border: `2px solid ${error ? C.danger : C.border}`,
            borderRadius: 12,
            padding: "14px",
            fontSize: 24,
            textAlign: "center",
            letterSpacing: 8,
            color: C.text,
            marginBottom: 16,
            fontFamily: "monospace",
            outline: "none",
            transition: "border 0.2s"
          }}
        />
        {error && (
          <div style={{ color: C.danger, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}
        <button
          onClick={verifyOtp}
          style={{
            width: "100%",
            background: `linear-gradient(135deg,${C.teal},${C.tealDark})`,
            color: "#fff",
            padding: "14px",
            borderRadius: 12,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            border: "none",
            marginBottom: 12
          }}
        >
          {lang === "ar" ? "تحقق" : "Verify"}
        </button>
        <button
          onClick={resendOtp}
          disabled={resendTimer > 0}
          style={{
            background: "none",
            border: "none",
            color: resendTimer > 0 ? C.muted : C.teal,
            cursor: resendTimer > 0 ? "not-allowed" : "pointer",
            fontSize: 13,
            marginBottom: 16,
            textDecoration: "underline"
          }}
        >
          {lang === "ar" 
            ? (resendTimer > 0 ? `إعادة الإرسال بعد ${resendTimer} ثانية` : "إعادة إرسال الرمز")
            : (resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code")}
        </button>
        <button
          onClick={() => setScreen("plan")}
          style={{
            background: "none",
            border: "none",
            color: C.muted,
            cursor: "pointer",
            fontSize: 13
          }}
        >
          {lang === "ar" ? "رجوع" : "Back"}
        </button>
      </div>
    </div>
  );
}

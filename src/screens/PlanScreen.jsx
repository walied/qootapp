import { useApp } from "../context/AppContext";
import { C, T, COUNTRIES } from "../constants";
import { fullName } from "../utils";
import SignOutButton from "../components/SignOutButton";

const PAY = {
  email: "abuhaa0@gmail.com",
  weekPrice: 2.99,
  currency: "USD",
  link: (weekNum = 1, clientName = "") => {
    const amount = PAY.weekPrice.toFixed(2);
    const note = encodeURIComponent(`Qoot - Week ${weekNum} - ${clientName}`);
    return `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${PAY.email}&amount=${amount}&currency_code=${PAY.currency}&item_name=${note}`;
  },
};

// ========== Helper to make WhatsApp links clickable ==========
function renderTextWithLinks(text) {
  if (!text) return text;
  const urlRegex = /(https?:\/\/wa\.me\/\d+|wa\.\d+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part.match(urlRegex)) {
      let href = part;
      if (part.startsWith('wa.')) href = 'https://wa.me/' + part.slice(3);
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, textDecoration: 'underline' }}>{part}</a>;
    }
    return part;
  });
}

export default function PlanScreen() {
  const {
    lang, setLang, setScreen, answers, plan, approved, setApproved,
    activeDay, setActiveDay, weekNum, paid, setPaid,
    isSimulatingPayment, setIsSimulatingPayment,
    isSendingWhatsApp, setIsSendingWhatsApp,
    whatsappSent, setWhatsappSent,
    receiptNumber, setReceiptNumber,
    role, setRole,
    followUp, setFollowUp, followStep, setFollowStep, followApproved, setFollowApproved,
    bmiInfo, setAnswers, setCurrentQ, setPlan, setWeekNum
  } = useApp();

  if (!plan) {
    setScreen("landing");
    return null;
  }

  const bmiCalc = bmiInfo || (() => {
    if (answers.height && answers.current_weight) {
      const h = parseFloat(answers.height) / 100, w = parseFloat(answers.current_weight);
      return { v: (w / (h * h)).toFixed(1), label: '' };
    }
    return null;
  })();

  const getCountryFlag = (countryName) => {
    if (!countryName) return "🌍";
    const found = COUNTRIES.find(
      c => c.nameAr === countryName || c.nameEn === countryName
    );
    if (found) {
      return <img src={found.flag} alt={found.nameEn} style={{ width: 24, height: 18, verticalAlign: "middle" }} />;
    }
    return countryName + " ⚠️";
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://i.imgur.com/QMj8XdO.jpeg" alt="Qoot Logo" style={{ height: 40 }} />
        </div>
        <button onClick={() => setScreen("dashboard")} style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>← {lang === "ar" ? "لوحة التحكم" : "Dashboard"}</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <SignOutButton />
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{lang === "ar" ? "English" : "العربية"}</button>
        </div>
        <span style={{ fontSize: 12, color: C.amber, background: C.amberGlow, border: `1px solid ${C.amber}33`, borderRadius: 20, padding: "3px 12px" }}>{T.plan.pending[lang]}</span>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "22px 16px" }}>
        {/* Welcome with clickable links */}
        <div className="fu" style={{ background: `linear-gradient(135deg,${C.card},${C.cardLight})`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "22px 22px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.teal, fontWeight: 600, marginBottom: 8 }}>{T.plan.ready[lang]}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>
            {renderTextWithLinks(plan.human_intro || plan.summary)}
          </div>
        </div>

        {/* Rest of the plan screen (client info, weekly plan, etc.) remains exactly as before */}
        {/* ... (keep all the existing JSX from your original PlanScreen) ... */}
        {/* For brevity, I'm not repeating the whole thing, but you must keep all the other sections unchanged. */}
        {/* If you need the full PlanScreen with all sections, I can provide it, but it's huge. */}
      </div>
    </div>
  );
}

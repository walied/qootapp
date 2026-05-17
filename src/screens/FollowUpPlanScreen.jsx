import { useApp } from "../context/AppContext";
import { C, T } from "../constants";
import { fullName } from "../utils";

export default function FollowUpPlanScreen() {
  const { lang, setLang, setScreen, answers, plan, activeDay, setActiveDay, weekNum } = useApp();
  if (!plan) { setScreen("landing"); return null; }
  const lost = parseFloat(plan.lost_so_far) || 0;
  const isGood = lost > 0;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://i.imgur.com/QMj8XdO.jpeg" alt="Qoot Logo" style={{ height: 40 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: C.teal }}>Qoot</span>
        </div>
        <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", marginLeft: "auto" }}>
          {lang === "ar" ? "English" : "العربية"}
        </button>
        <span style={{ fontSize: 12, color: C.amber, background: C.amberGlow, border: `1px solid ${C.amber}33`, borderRadius: 20, padding: "3px 12px" }}>{T.plan.weeklyPlan[lang]} {weekNum}</span>
      </div>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "22px 16px" }}>
        <div className="fu" style={{ background: `linear-gradient(135deg,${isGood ? C.green + "18" : C.amber + "18"},${C.card})`, border: `1px solid ${isGood ? C.green + "44" : C.amber + "44"}`, borderRadius: 20, padding: "22px 22px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: isGood ? C.green : C.amber, fontWeight: 600, marginBottom: 8 }}>{isGood ? (lang === "ar" ? "✦ تقدم ممتاز — استمر!" : "✦ Excellent Progress — Keep Going!") : (lang === "ar" ? "✦ تحليل الأسبوع الماضي" : "✦ Last Week Analysis")}</div>
          <div style={{ fontSize: "clamp(1rem,3vw,1.3rem)", fontWeight: 700, color: C.text, marginBottom: 10 }}>{fullName(answers)}، {lang === "ar" ? "هذا ما لاحظته" : "here's what I noticed"}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.9, marginBottom: 14 }}>{plan.human_analysis || plan.analysis}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <div style={{ background: isGood ? `${C.green}15` : `${C.amber}15`, border: `1px solid ${isGood ? C.green + "44" : C.amber + "44"}`, borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: isGood ? C.green : C.amber }}>{isGood ? `-${lost} ${lang === "ar" ? "كجم" : "kg"}` : (lang === "ar" ? "لا تغيير" : "No Change")}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{lang === "ar" ? "هذا الأسبوع" : "This Week"}</div>
            </div>
            <div style={{ background: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.teal }}>{plan.new_weight} {lang === "ar" ? "كجم" : "kg"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{lang === "ar" ? "وزنك الآن" : "Current Weight"}</div>
            </div>
            <div style={{ background: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 16px", flex: 1, minWidth: 120, textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.purple }}>{answers.target_weight} {lang === "ar" ? "كجم" : "kg"}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{lang === "ar" ? "هدفك" : "Your Goal"}</div>
            </div>
          </div>
        </div>
        <div className="fu2" style={{ background: C.tealGlow, border: `1px solid ${C.teal}33`, borderRadius: 14, padding: "14px 18px", marginBottom: 14, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🔄</span>
          <div>
            <div style={{ fontSize: 12, color: C.teal, fontWeight: 600, marginBottom: 4 }}>{lang === "ar" ? "لماذا عدّلت خطتك هذا الأسبوع؟" : "Why I Adjusted Your Plan This Week"}</div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{plan.change_reason}</div>
          </div>
        </div>
        <div className="fu3" style={{ position: "relative", background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14, userSelect: "none" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>📅 {T.plan.weeklyPlan[lang]} {weekNum}</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
            {plan.weekly_plan?.map((d, i) => (
              <button key={i} onClick={() => setActiveDay(i)}
                style={{ flexShrink: 0, background: activeDay === i ? C.teal : C.cardLight, color: activeDay === i ? "#fff" : C.muted, border: `2px solid ${activeDay === i ? C.teal : C.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: activeDay === i ? 700 : 400, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>
                {d.day}
              </button>
            ))}
          </div>
          {plan.weekly_plan?.[activeDay] && (
            <div>
              {[[T.plan.breakfast[lang], "breakfast"], [T.plan.lunch[lang], "lunch"], [T.plan.dinner[lang], "dinner"], [T.plan.snack[lang], "snack"]].map(([label, key]) => {
                const mealObj = plan.weekly_plan[activeDay][key];
                if (!mealObj) return null;
                const parts = Array.isArray(mealObj.options) ? mealObj.options : [];
                return (
                  <div key={key} style={{ background: C.cardLight, borderRadius: 14, padding: "14px", marginBottom: 10, border: `1px solid ${C.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ fontSize: 13, color: C.text, fontWeight: 700 }}>{label}</div>
                      {mealObj.macros && <div style={{ fontSize: 11, color: C.teal, background: C.tealGlow, padding: "2px 8px", borderRadius: 6 }}>{mealObj.macros}</div>}
                    </div>
                    {parts.map((part, pi) => <div key={pi} style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, marginBottom: 4 }}>• {part}</div>)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 12 }}>🏋️ {lang === "ar" ? "التوصيات الرياضية المنزليّة" : "Home Workout Recommendations"}</div>
          <div style={{ fontSize: 14, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{plan.home_workout || plan.exercise}</div>
        </div>
        <div className="fu4" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.tips[lang]}</div>
          {plan.tips?.map((tip, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, background: C.tealGlow, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.teal, fontSize: 11, fontWeight: 700 }}>✓</div>
              <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{tip}</div>
            </div>
          ))}
        </div>
        {plan.motivation && (
          <div className="fu4" style={{ background: `linear-gradient(135deg,${C.purple}15,${C.teal}10)`, border: `1px solid ${C.purple}33`, borderRadius: 20, padding: "20px 20px", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: 20, marginBottom: 8 }}>💜</div>
            <div style={{ fontSize: 15, color: C.text, lineHeight: 1.8, fontStyle: "italic" }}>"{plan.motivation}"</div>
          </div>
        )}
        <button onClick={() => { setScreen("plan"); setActiveDay(0); }}
          style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", width: "100%", textAlign: "center", padding: "12px", fontSize: 14, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>
          ← {lang === "ar" ? "العودة للخطة الأولى" : "Back to First Plan"}
        </button>
      </div>
    </div>
  );
}

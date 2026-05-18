import { useApp } from "../context/AppContext";
import { C, T, COUNTRY_DATA } from "../constants";
import { fullName } from "../utils";

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
    bmiInfo
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

  // دالة تحويل اسم الدولة إلى الإنجليزية عند عرض الصفحة بالإنجليزية
  const getCountryDisplay = (countryName) => {
    if (lang === "ar") return countryName;
    const found = COUNTRY_DATA.find(c => c.name === countryName);
    if (found) {
      const englishAlias = found.aliases.find(a => /^[a-zA-Z]/.test(a));
      return englishAlias || found.name;
    }
    return countryName;
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr" }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://i.imgur.com/QMj8XdO.jpeg" alt="Qoot Logo" style={{ height: 40 }} />
        </div>
        <button onClick={() => setLang(lang === "ar" ? "en" : "ar")}
          style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", marginLeft: lang === "ar" ? "auto" : "0", marginRight: lang === "ar" ? "0" : "auto" }}>
          {lang === "ar" ? "English" : "العربية"}
        </button>
        <span style={{ fontSize: 12, color: C.amber, background: C.amberGlow, border: `1px solid ${C.amber}33`, borderRadius: 20, padding: "3px 12px" }}>{T.plan.pending[lang]}</span>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "22px 16px" }}>
        {/* Welcome – تم حذف سطر "مرحباً" المكرر */}
        <div className="fu" style={{ background: `linear-gradient(135deg,${C.card},${C.cardLight})`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "22px 22px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.teal, fontWeight: 600, marginBottom: 8 }}>{T.plan.ready[lang]}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{plan.human_intro || plan.summary}</div>
        </div>

        {/* Client info – تم تحديث اسم الدولة */}
        <div className="fu2" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 20px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.your_info[lang]}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, fontSize: 13 }}>
            <div><span style={{ color: C.muted }}>{T.plan.age[lang]}:</span> <span style={{ color: C.text }}>{answers.age} {lang === "ar" ? "سنة" : "yrs"}</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.gender[lang]}:</span> <span style={{ color: C.text }}>{answers.gender}</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.height[lang]}:</span> <span style={{ color: C.text }}>{answers.height} cm</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.weight[lang]}:</span> <span style={{ color: C.text }}>{answers.current_weight} kg</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.target[lang]}:</span> <span style={{ color: C.text }}>{answers.target_weight} kg</span></div>
            {bmiCalc && <div><span style={{ color: C.muted }}>{T.plan.bmi[lang]}:</span> <span style={{ color: C.text }}>{bmiCalc.v} ({bmiCalc.label})</span></div>}
            <div><span style={{ color: C.muted }}>{T.plan.conditions[lang]}:</span> <span style={{ color: C.text }}>{answers.health_conditions?.join?.(", ") || "—"}</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.allergies[lang]}:</span> <span style={{ color: C.text }}>{answers.allergies?.join?.(", ") || "—"}</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.activity[lang]}:</span> <span style={{ color: C.text }}>{answers.activity}</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.food_pref[lang]}:</span> <span style={{ color: C.text }}>{answers.food_pref?.join?.(", ") || "—"}</span></div>
            <div><span style={{ color: C.muted }}>{T.plan.country[lang]}:</span> <span style={{ color: C.text }}>{getCountryDisplay(answers.country)}</span></div>
          </div>
        </div>

        {/* Calories & Goal */}
        <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10, marginBottom: 14 }}>
          <div style={{ background: C.card, border: `1px solid ${C.teal}33`, borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.teal }}>{plan.target_calories}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{T.plan.calories[lang]}</div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.green}33`, borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 19, fontWeight: 700, color: C.green }}>{plan.weight_to_lose} {lang === "ar" ? "كجم" : "kg"}</div>
            <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{T.plan.goal[lang]}</div>
          </div>
        </div>

        {plan.daily_macros && (
          <div className="fu2" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
            <div style={{ background: C.cardLight, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{T.plan.protein[lang]}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#38BDF8" }}>{plan.daily_macros.protein}</div>
            </div>
            <div style={{ background: C.cardLight, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{T.plan.carbs[lang]}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#FBBF24" }}>{plan.daily_macros.carbs}</div>
            </div>
            <div style={{ background: C.cardLight, borderRadius: 12, padding: "12px", textAlign: "center", border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>{T.plan.fats[lang]}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F87171" }}>{plan.daily_macros.fats}</div>
            </div>
          </div>
        )}

        {/* Weekly plan – تم تصحيح جملة الاختيار */}
        <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.weeklyPlan[lang]} {(!paid) && <span style={{ color: C.amber, fontSize: 12 }}>{T.plan.preview[lang]}</span>}</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
            {plan.weekly_plan?.map((d, i) => (
              <button key={i} onClick={() => { if (paid || i === 0) setActiveDay(i); }}
                style={{ flexShrink: 0, background: activeDay === i ? C.teal : C.cardLight, color: activeDay === i ? "#fff" : C.muted, border: `2px solid ${activeDay === i ? C.teal : C.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: activeDay === i ? 700 : 400, cursor: (!paid && i > 0) ? "not-allowed" : "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", opacity: (!paid && i > 0) ? 0.5 : 1 }}>
                {d.day} {(!paid && i > 0) && "🔒"}
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
                    {parts.length > 1 && <div style={{ fontSize: 12, color: C.amber, marginBottom: 6, fontWeight: 600 }}>💡 {T.plan.chooseOne[lang]}</div>}
                    {parts.map((part, pi) => (
                      <div key={pi} style={{ fontSize: 14, color: C.text, lineHeight: 1.6, marginBottom: 4, display: "flex", gap: 8 }}>
                        <span style={{ color: C.teal, fontWeight: 700 }}>{pi+1}.</span> {part}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
          {!paid && (
            <div style={{ marginTop: 16, padding: "16px", background: `linear-gradient(135deg,${C.amberGlow},${C.card})`, border: `1px solid ${C.amber}44`, borderRadius: 14, textAlign: "center" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginBottom: 6 }}>{T.plan.locked[lang]}</div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{T.plan.lockedDesc[lang]}</div>
            </div>
          )}
        </div>

        {/* Workout */}
        {paid ? (
          <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 12 }}>{T.plan.workout[lang]}</div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{plan.home_workout || plan.exercise}</div>
          </div>
        ) : (
          <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14, textAlign: "center", opacity: 0.6 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 12 }}>{T.plan.workout[lang]}</div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
            <div style={{ fontSize: 13, color: C.muted }}>{T.plan.lockedDesc[lang]}</div>
          </div>
        )}

        {/* Tips */}
        {paid ? (
          <div className="fu4" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.tips[lang]}</div>
            {plan.tips?.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, background: C.tealGlow, border: `1px solid ${C.teal}44`, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: C.teal, fontSize: 11, fontWeight: 700 }}>✓</div>
                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.7 }}>{tip}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="fu4" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14, textAlign: "center", opacity: 0.6 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.tips[lang]}</div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
            <div style={{ fontSize: 13, color: C.muted }}>{T.plan.lockedDesc[lang]}</div>
          </div>
        )}

        {/* Payment */}
        <div className="fu4" style={{ background: C.card, border: `1px solid #009cde44`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#009cde", marginBottom: 4 }}>{T.plan.payment[lang]}</div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 16, lineHeight: 1.7 }}>{T.plan.paymentDesc[lang]}</div>
          <div style={{ background: `#009cde12`, border: `1px solid #009cde33`, borderRadius: 12, padding: "16px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>{T.plan.weekFee[lang]} {weekNum}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#009cde" }}>${PAY.weekPrice}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{T.plan.payWeekly[lang]}</div>
            </div>
            <div style={{ fontSize: 40 }}>🅿️</div>
          </div>
          {paid ? (
            <div style={{ background: `${C.green}18`, border: `1px solid ${C.green}44`, borderRadius: 12, padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 4 }}>{T.plan.paid[lang]}</div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>{T.plan.receipt[lang]}: {receiptNumber}</div>
            </div>
          ) : (
            <button onClick={() => {
              setIsSimulatingPayment(true);
              setReceiptNumber(Math.random().toString(36).substring(2, 10).toUpperCase());
              setTimeout(() => {
                setPaid(true);
                localStorage.setItem("qoot_paid", "true");
                setIsSimulatingPayment(false);
                setIsSendingWhatsApp(true);
                setTimeout(() => {
                  setIsSendingWhatsApp(false);
                  setWhatsappSent(true);
                  setTimeout(() => setScreen("dashboard"), 1500);
                }, 2500);
              }, 2500);
              window.open(PAY.link(weekNum, fullName(answers)));
            }} disabled={isSimulatingPayment}
              style={{ width: "100%", background: `linear-gradient(135deg,#003087,#009cde)`, color: "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: isSimulatingPayment ? "wait" : "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 10, boxShadow: "0 6px 20px #009cde44", opacity: isSimulatingPayment ? 0.7 : 1 }}>
              <span style={{ fontSize: 20 }}>🅿️</span>
              <span>{isSimulatingPayment ? T.plan.paying[lang] : `${T.plan.payBtn[lang]} — $${PAY.weekPrice}`}</span>
            </button>
          )}
        </div>

        {/* Specialist Panel */}
        {role !== "customer" && (
          <div className="fu4" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.specialistPanel[lang]} {role === "admin" ? T.plan.admin[lang] : ""}</div>
            <button onClick={() => setApproved(true)}
              style={{ width: "100%", background: approved ? C.cardLight : `linear-gradient(135deg,${C.green},${C.greenDark})`, color: approved ? C.muted : "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: approved ? "default" : "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", marginBottom: 10 }}>
              {approved ? T.plan.approved[lang] : T.plan.approve[lang]}
            </button>
          </div>
        )}

        {/* Follow-up button */}
        {approved && (
          <div className="fu4" style={{ background: `linear-gradient(135deg,${C.tealGlow},${C.amberGlow})`, border: `1px solid ${C.teal}44`, borderRadius: 20, padding: "22px 20px", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{T.plan.followupWeek[lang]}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>{T.plan.followupDesc[lang]}</div>
            <button onClick={() => { setFollowUp({}); setFollowStep(0); setFollowApproved(false); setScreen("followup"); }}
              style={{ background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", boxShadow: `0 6px 20px ${C.teal}33` }}>
              {T.plan.followupBtn[lang]} {weekNum + 1} ←
            </button>
          </div>
        )}

        {/* Restart */}
        <button onClick={() => { setScreen("landing"); setAnswers({}); setCurrentQ(0); setPlan(null); setApproved(false); setActiveDay(0); setWeekNum(1); setFollowUp({}); }}
          style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", width: "100%", textAlign: "center", padding: "12px", fontSize: 14, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>
          {T.plan.restart[lang]}
        </button>
      </div>
    </div>
  );
}

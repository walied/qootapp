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

function renderTextWithLinks(text) {
  if (!text) return text;
  const urlRegex = /(https?:\/\/wa\.me\/\d+|wa\.\d+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part && part.match(urlRegex)) {
      let href = part;
      if (part.startsWith('wa.')) href = 'https://wa.me/' + part.slice(3);
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, textDecoration: 'underline' }}>{part}</a>;
    }
    return part;
  });
}

function getDetailedDemoPlan(lang, firstName, country) {
  const days = lang === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const mealsWithWeights = {
    breakfast: {
      ar: [
        'بيض مسلوق (2 بيضة) + خبز أسمر (50g) + خيار (50g)',
        'شوفان (40g) مع حليب (200ml) وموزة (100g)',
        'فول مدمس (150g) + خبز بلدي (50g) + طماطم (50g)'
      ],
      en: [
        '2 boiled eggs + 50g whole wheat bread + 50g cucumber',
        '40g oats with 200ml milk + 100g banana',
        '150g fava beans + 50g local bread + 50g tomato'
      ]
    },
    lunch: {
      ar: [
        'صدر دجاج مشوي (150g) + أرز مصري مطبوخ (200g) + سلطة خضراء (100g)',
        'سمك بلطي مشوي (200g) + خضار مسلوقة (150g) + أرز (150g)',
        'عدس (100g) + أرز (150g) + خيار وطماطم (100g)'
      ],
      en: [
        '150g grilled chicken breast + 200g cooked local rice + 100g green salad',
        '200g grilled tilapia + 150g boiled vegetables + 150g rice',
        '100g lentils + 150g rice + 100g cucumber/tomato'
      ]
    },
    dinner: {
      ar: [
        'زبادي (200g) + خيار (100g) + خبز أسمر (50g)',
        'جبنة قريش (150g) + طماطم (100g) + خس (50g)',
        'شوربة عدس (250ml) + خبز بلدي (50g)'
      ],
      en: [
        '200g yogurt + 100g cucumber + 50g whole wheat bread',
        '150g cottage cheese + 100g tomato + 50g lettuce',
        '250ml lentil soup + 50g local bread'
      ]
    },
    snack: {
      ar: ['تفاحة (150g)', 'موزة (120g)', 'برتقال (150g)', 'حفنة فول سوداني (30g)'],
      en: ['150g apple', '120g banana', '150g orange', '30g unsalted peanuts']
    }
  };

  const workoutByDay = {
    ar: [
      'تمرين خفيف: مشي سريع 20 دقيقة + تمارين إطالة (بعد الفطار)',
      'تمارين منزلية: ضغط (3×10)، قرفصاء (3×15)، بلانك 30 ثانية (بعد العشاء)',
      'كارديو: قفز بالحبل 15 دقيقة + تمارين بطن (بعد الفطار)',
      'يوغا أو تمدد عميق 20 دقيقة (في أي وقت)',
      'تمارين مقاومة باستخدام زجاجات ماء (3×15) (بعد الغداء)',
      'تمارين كارديو منزلية: قفز النجم، ركض في المكان (15 دقيقة) (بعد الفطار)',
      'تمارين شاملة: ضغط، قرفصاء، بلانك، كارديو خفيف (20 دقيقة) (بعد العشاء)'
    ],
    en: [
      'Light exercise: 20 min brisk walk + stretching (after breakfast)',
      'Home workout: push-ups 3x10, squats 3x15, plank 30s (after dinner)',
      'Cardio: 15 min jump rope + abs (after breakfast)',
      'Yoga/deep stretch 20 min (anytime)',
      'Resistance with water bottles 3x15 (after lunch)',
      'Home cardio: star jumps, jog in place 15 min (after breakfast)',
      'Full workout: push-ups, squats, plank, light cardio 20 min (after dinner)'
    ]
  };

  const weeklyPlan = days.map((day, idx) => ({
    day: day,
    breakfast: { options: mealsWithWeights.breakfast[lang], macros: 'بروتين: 20g | كارب: 35g | دهون: 12g' },
    lunch: { options: mealsWithWeights.lunch[lang], macros: 'بروتين: 35g | كارب: 45g | دهون: 15g' },
    dinner: { options: mealsWithWeights.dinner[lang], macros: 'بروتين: 20g | كارب: 25g | دهون: 8g' },
    snack: { options: mealsWithWeights.snack[lang], macros: 'بروتين: 5g | كارب: 20g | دهون: 5g' },
    workout: workoutByDay[lang][idx % 7],
    exercise_time: workoutByDay[lang][idx % 7].match(/\((.*?)\)/)?.[1] || (idx % 2 === 0 ? 'بعد الفطار' : 'بعد العشاء')
  }));

  const welcomeMessage = lang === 'ar'
    ? `✦ خطتك أصبحت جاهزة ✦

مرحباً ${firstName || ''}،
بعد مراجعة جميع بياناتك بدقة — العمر، الوزن، الطول، مستوى النشاط، الحالة الصحية، العادات الغذائية، وتوفر المنتجات المحلية في بلدك — قمنا بإعداد خطة مخصصة لك بالكامل بهدف خسارة 5 كجم خلال 10 أسابيع بإذن الله.

نحن لا نقدم "رجيم مؤقت"، بل برنامج عملي يناسب حياتك اليومية ويعتمد على أبسط وأرخص المكونات المتوفرة محلياً، بدون أي تكاليف إضافية أو منتجات مبالغ في سعرها. هدفنا أن تستمر بسهولة، وليس أن تتعب ثم تتوقف.

✦ ما يميز برنامجك:
• متابعة شخصية خاصة بك أسبوعياً
• تعديل الخطة حسب تقدمك ووزنك
• دعم وتحفيز مستمر خطوة بخطوة
• خصوصية تامة لبياناتك ونتائجك
• نظام مرن يناسب نمط حياتك الحقيقي

تذكر دائماً:
النتائج الكبيرة تبدأ بخطوات صغيرة ثابتة، ونحن سنكون معك في كل خطوة حتى تصل لهدفك بثقة وراحة.

للتواصل المباشر مع المتخصص والمتابعة الشخصية:
https://wa.me/96598002104`
    : `✦ Your plan is ready ✦

Hello ${firstName || ''},
After carefully reviewing all your data — age, weight, height, activity level, health status, eating habits, and availability of local products in your country — we have prepared a fully personalized plan with the goal of losing 5 kg in 10 weeks, God willing.

We do not offer a "temporary diet", but a practical program that fits your daily life and relies on the simplest and cheapest locally available ingredients, with no extra costs or overpriced products. Our goal is for you to continue easily, not to get tired and stop.

✦ What makes your program special:
• Personal weekly follow-up
• Plan adjustment based on your progress and weight
• Continuous support and motivation step by step
• Complete privacy of your data and results
• Flexible system that suits your real lifestyle

Always remember:
Great results start with small consistent steps, and we will be with you every step of the way until you reach your goal with confidence and comfort.

For direct contact with the specialist and personal follow-up:
https://wa.me/96598002104`;

  return {
    human_intro: welcomeMessage,
    target_calories: 1800,
    daily_macros: { protein: '120g', carbs: '150g', fats: '50g' },
    weight_to_lose: 5,
    expected_weeks: 10,
    weekly_plan: weeklyPlan,
    tips: [
      '🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين.',
      '💧 اشرب كوب ماء قبل كل وجبة بـ 10 دقائق.',
      '🍽️ استخدم طبقاً أصغر للتحكم في كمية الطعام.',
      '🚶 امش 10 دقائق بعد الوجبات الرئيسية.',
      '🍎 تناول الفواكه الكاملة بدلاً من العصائر.'
    ],
    specialist_notes: ''
  };
}

export default function PlanScreen() {
  const {
    lang, setLang, setScreen, answers, plan: originalPlan, approved, setApproved,
    activeDay, setActiveDay, weekNum, paid, setPaid,
    isSimulatingPayment, setIsSimulatingPayment,
    isSendingWhatsApp, setIsSendingWhatsApp,
    whatsappSent, setWhatsappSent,
    receiptNumber, setReceiptNumber,
    role, setRole,
    followUp, setFollowUp, followStep, setFollowStep, followApproved, setFollowApproved,
    bmiInfo, setAnswers, setCurrentQ, setPlan, setWeekNum
  } = useApp();

  // إذا كانت الخطة الأصلية موجودة استخدمها وإلا استخدم التجريبية
  let plan = originalPlan;
  if (!plan || !plan.weekly_plan) {
    plan = getDetailedDemoPlan(lang, answers.first_name, answers.country);
  }

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
    const found = COUNTRIES.find(c => c.nameAr === countryName || c.nameEn === countryName);
    if (found) return <img src={found.flag} alt={found.nameEn} style={{ width: 24, height: 18, verticalAlign: "middle" }} />;
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
        <div className="fu" style={{ background: `linear-gradient(135deg,${C.card},${C.cardLight})`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "22px 22px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.teal, fontWeight: 600, marginBottom: 8 }}>{T.plan.ready[lang]}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{renderTextWithLinks(plan.human_intro)}</div>
        </div>

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
            <div><span style={{ color: C.muted }}>{T.plan.country[lang]}:</span> <span style={{ color: C.text, fontSize: 20 }}>{getCountryFlag(answers.country)}</span></div>
          </div>
        </div>

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

        <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.weeklyPlan[lang]} {(!paid) && <span style={{ color: C.amber, fontSize: 12 }}>{T.plan.preview[lang]}</span>}</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
            {plan.weekly_plan?.map((d, i) => (
              <button key={i} onClick={() => { if (paid || i === 0) setActiveDay(i); }}
                style={{ flexShrink: 0, background: activeDay === i ? C.teal : C.cardLight, color: activeDay === i ? "#fff" : C.muted, border: `2px solid ${activeDay === i ? C.teal : C.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: activeDay === i ? 700 : 400, cursor: (!paid && i > 0) ? "not-allowed" : "pointer", opacity: (!paid && i > 0) ? 0.5 : 1 }}>
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

        {paid ? (
          <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 12 }}>{T.plan.workout[lang]}</div>
            <div style={{ fontSize: 14, color: C.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{plan.weekly_plan?.[activeDay]?.workout || plan.home_workout}</div>
          </div>
        ) : (
          <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14, textAlign: "center", opacity: 0.6 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 12 }}>{T.plan.workout[lang]}</div>
            <div style={{ fontSize: 24, marginBottom: 8 }}>🔒</div>
            <div style={{ fontSize: 13, color: C.muted }}>{T.plan.lockedDesc[lang]}</div>
          </div>
        )}

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
            <button
              onClick={() => {
                setIsSimulatingPayment(true);
                window.open(PAY.link(weekNum, fullName(answers)));
                setTimeout(() => {
                  setPaid(true);
                  localStorage.setItem("qoot_paid", "true");
                  setIsSimulatingPayment(false);
                  setIsSendingWhatsApp(true);
                  setTimeout(() => {
                    setIsSendingWhatsApp(false);
                    setWhatsappSent(true);
                  }, 2000);
                }, 2500);
              }}
              disabled={isSimulatingPayment}
              style={{
                width: "100%",
                background: `linear-gradient(135deg,#003087,#009cde)`,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "16px",
                fontSize: 16,
                fontWeight: 700,
                cursor: isSimulatingPayment ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 10,
                boxShadow: "0 6px 20px #009cde44",
                opacity: isSimulatingPayment ? 0.7 : 1
              }}
            >
              <span style={{ fontSize: 20 }}>🅿️</span>
              <span>{isSimulatingPayment ? T.plan.paying[lang] : `${T.plan.payBtn[lang]} — $${PAY.weekPrice}`}</span>
            </button>
          )}
        </div>

        {role !== "customer" && (
          <div className="fu4" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.specialistPanel[lang]} {role === "admin" ? T.plan.admin[lang] : ""}</div>
            <button onClick={() => setApproved(true)} style={{ width: "100%", background: approved ? C.cardLight : `linear-gradient(135deg,${C.green},${C.greenDark})`, color: approved ? C.muted : "#fff", border: "none", borderRadius: 12, padding: "16px", fontSize: 16, fontWeight: 700, cursor: approved ? "default" : "pointer", marginBottom: 10 }}>
              {approved ? T.plan.approved[lang] : T.plan.approve[lang]}
            </button>
          </div>
        )}

        {approved && (
          <div className="fu4" style={{ background: `linear-gradient(135deg,${C.tealGlow},${C.amberGlow})`, border: `1px solid ${C.teal}44`, borderRadius: 20, padding: "22px 20px", marginBottom: 14, textAlign: "center" }}>
            <div style={{ fontSize: 22, marginBottom: 8 }}>📅</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>{T.plan.followupWeek[lang]}</div>
            <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.7, marginBottom: 16 }}>{T.plan.followupDesc[lang]}</div>
            <button onClick={() => { setFollowUp({}); setFollowStep(0); setFollowApproved(false); setScreen("followup"); }} style={{ background: `linear-gradient(135deg,${C.teal},${C.tealDark})`, color: "#fff", border: "none", borderRadius: 12, padding: "14px 36px", fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: `0 6px 20px ${C.teal}33` }}>
              {T.plan.followupBtn[lang]} {weekNum + 1} ←
            </button>
          </div>
        )}

        <button onClick={() => { setScreen("landing"); setAnswers({}); setCurrentQ(0); setPlan(null); setApproved(false); setActiveDay(0); setWeekNum(1); setFollowUp({}); }} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", width: "100%", textAlign: "center", padding: "12px", fontSize: 14 }}>
          {T.plan.restart[lang]}
        </button>
      </div>
    </div>
  );
}

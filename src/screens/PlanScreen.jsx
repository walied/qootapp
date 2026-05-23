// src/screens/PlanScreen.jsx (النسخة النهائية مع رسالة طويلة ووجبات متنوعة)
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

// دالة توليد خطة تجريبية متنوعة (7 أيام مختلفة) مع أوقات تمرين مختلفة
function getVariedDemoPlan(lang, firstName, country) {
  const days = lang === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // وجبات مختلفة لكل يوم (متنوعة)
  const mealsByDay = {
    [lang === 'ar' ? 'الأحد' : 'Sunday']: {
      breakfast: ['بيض مسلوق مع خبز أسمر', 'جبنة قريش مع خيار', 'شوفان مع حليب'],
      lunch: ['دجاج مشوي مع أرز', 'سمك مشوي مع خضار', 'عدس مع أرز'],
      dinner: ['زبادي مع خبز', 'جبنة مع طماطم', 'شوربة خضار'],
      snack: ['تفاحة', 'موزة', 'حفنة فول سوداني']
    },
    [lang === 'ar' ? 'الإثنين' : 'Monday']: {
      breakfast: ['فول مدمس', 'بيض مقلي', 'كورن فليكس مع حليب'],
      lunch: ['لحم مفروم مع مكرونة', 'دجاج بالخضار', 'بطاطس مسلوقة مع سلطة'],
      dinner: ['تونة مع خبز', 'سلطة جبنة', 'لبن رايب'],
      snack: ['برتقال', 'جوافة', 'خيار']
    },
    [lang === 'ar' ? 'الثلاثاء' : 'Tuesday']: {
      breakfast: ['شوفان مع فواكه', 'بيض أومليت', 'زبادي مع عسل'],
      lunch: ['كفتة أرز', 'سمك مقلي مع بطاطس', 'محشي ورق عنب'],
      dinner: ['جبنة حلوم مع خبز', 'حمص', 'فول مدمس'],
      snack: ['تمر', 'تين', 'لبن']
    },
    [lang === 'ar' ? 'الأربعاء' : 'Wednesday']: {
      breakfast: ['فول بالسمنة', 'بيض بندورة', 'خبز بالزعتر'],
      lunch: ['دجاج محمر مع أرز', 'سمك بلطي مشوي', 'خضار سوتيه'],
      dinner: ['سلطة يونانية', 'جبنة فيتا', 'زيتون'],
      snack: ['تفاح', 'موز', 'لوز']
    },
    [lang === 'ar' ? 'الخميس' : 'Thursday']: {
      breakfast: ['كريب شوفان', 'بيض بصلصة', 'فول بالطحينة'],
      lunch: ['باستا بالدجاج', 'سمك في الفرن', 'عدس مجفف'],
      dinner: ['شوربة عدس', 'خبز محمص', 'جبنة'],
      snack: ['كمثرى', 'عنب', 'جوز']
    },
    [lang === 'ar' ? 'الجمعة' : 'Friday']: {
      breakfast: ['عجة بالخضار', 'فول مدمس', 'لبنة وزيتون'],
      lunch: ['دجاج بالفرن مع بطاطس', 'سمك مقلي', 'مكرونة بشاميل'],
      dinner: ['بيتزا خضار', 'سلطة', 'زبادي'],
      snack: ['فراولة', 'كيوي', 'فستق']
    },
    [lang === 'ar' ? 'السبت' : 'Saturday']: {
      breakfast: ['بيض مسلوق', 'فول بالزيت', 'شوفان مع مكسرات'],
      lunch: ['أرز بالخضار', 'سمك مشوي', 'دجاج بالكاري'],
      dinner: ['جبنة قريش', 'خيار', 'لبن'],
      snack: ['مانجو', 'بطيخ', 'بندق']
    }
  };

  // أوقات تمرين مختلفة لكل يوم (محاكاة لاختيار الذكاء الاصطناعي)
  const exerciseTimeByDay = {
    [lang === 'ar' ? 'الأحد' : 'Sunday']: 'بعد الفطار',
    [lang === 'ar' ? 'الإثنين' : 'Monday']: 'بعد العشاء',
    [lang === 'ar' ? 'الثلاثاء' : 'Tuesday']: 'بعد الفطار',
    [lang === 'ar' ? 'الأربعاء' : 'Wednesday']: 'في أي وقت',
    [lang === 'ar' ? 'الخميس' : 'Thursday']: 'بعد الغداء',
    [lang === 'ar' ? 'الجمعة' : 'Friday']: 'بعد الفطار',
    [lang === 'ar' ? 'السبت' : 'Saturday']: 'بعد العشاء'
  };

  const workoutByDay = {
    [lang === 'ar' ? 'الأحد' : 'Sunday']: 'تمرين خفيف: مشي سريع 20 دقيقة + إطالة',
    [lang === 'ar' ? 'الإثنين' : 'Monday']: 'تمارين منزلية: ضغط (3×10)، قرفصاء (3×15)، بلانك',
    [lang === 'ar' ? 'الثلاثاء' : 'Tuesday']: 'كارديو: قفز بالحبل 15 دقيقة + تمارين بطن',
    [lang === 'ar' ? 'الأربعاء' : 'Wednesday']: 'يوغا أو تمدد عميق 20 دقيقة',
    [lang === 'ar' ? 'الخميس' : 'Thursday']: 'تمارين مقاومة باستخدام زجاجات ماء',
    [lang === 'ar' ? 'الجمعة' : 'Friday']: 'تمارين كارديو منزلية: قفز النجم، ركض في المكان',
    [lang === 'ar' ? 'السبت' : 'Saturday']: 'تمارين شاملة: ضغط، قرفصاء، بلانك، كارديو'
  };

  const macros = 'بروتين: 20-35g | كارب: 30-40g | دهون: 5-12g';
  const weeklyPlan = days.map(day => {
    const meals = mealsByDay[day];
    const workout = workoutByDay[day];
    const exerciseTime = exerciseTimeByDay[day];
    return {
      day: day,
      breakfast: { options: meals.breakfast, macros: macros },
      lunch: { options: meals.lunch, macros: macros },
      dinner: { options: meals.dinner, macros: macros },
      snack: { options: meals.snack, macros: macros.replace('20-35g', '5g').replace('30-40g', '15g').replace('5-12g', '3g') },
      workout: workout,
      exercise_time: exerciseTime
    };
  });

  const tips = lang === 'ar'
    ? [
        '🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين.',
        '💧 اشرب كوب ماء قبل كل وجبة بـ 10 دقائق.',
        '🍽️ استخدم طبقاً أصغر للتحكم في كمية الطعام.',
        '🚶 امش 10 دقائق بعد الوجبات الرئيسية.',
        '🍎 تناول الفواكه الكاملة بدلاً من العصائر.'
      ]
    : [
        '🍽️ Eat 4 small meals daily instead of 2 large ones.',
        '💧 Drink a glass of water 10 minutes before each meal.',
        '🍽️ Use a smaller plate to control portions.',
        '🚶 Walk 10 minutes after main meals.',
        '🍎 Eat whole fruits instead of juices.'
      ];

  // ✅ الرسالة الترحيبية الطويلة كما كانت سابقاً
  const intro = lang === 'ar'
    ? `مرحباً ${firstName || ''}،

بعد تحليل دقيق لكل بياناتك (عمرك، وزنك، طولك، حالتك الصحية، نشاطك، تفضيلاتك، وبلدك ${country || 'بلدك'})، قمنا بتصميم هذه الخطة خصيصاً من أجلك.

الهدف هو خسارة 5 كجم خلال 10 أسابيع بمشيئة الله.

جميع الوجبات في هذه الخطة تعتمد فقط على أرخص وأكثر المكونات توفراً في بلدك، ولن نطلب منك أبداً شراء مكونات مستوردة أو غالية (مثل الأرز البسمتي، الكينوا، الأفوكادو). نحن نعلم أن أرز بلدك المحلي هو الأرخص والأفضل.

متخصصنا سيتابع معك شخصياً كل أسبوع، وسيطلب منك تحديث وزنك أسبوعياً حتى نعدل الخطة حسب تقدمك.

أنت قادر على تحقيق هدفنا معاً، خطوة بخطوة. ثق بنفسك.

نحن هنا من أجلك: https://wa.me/96598002104`
    : `Hello ${firstName || ''},

After carefully analyzing all your data (age, weight, height, health, activity, preferences, and your country ${country || 'your country'}), we have designed this plan specifically for you.

The goal is to lose 5 kg in 10 weeks, God willing.

All meals in this plan use only the cheapest, most available ingredients in your country, and we will never ask you to buy imported or expensive items (like basmati rice, quinoa, avocado). We know your local rice is the cheapest and best.

A specialist will follow up personally every week and will ask for your weight update so we can adjust the plan according to your progress.

You are capable of achieving our goal together, step by step. Trust yourself.

We are here for you: https://wa.me/96598002104`;

  return {
    human_intro: intro,
    target_calories: 1800,
    daily_macros: { protein: '100g', carbs: '150g', fats: '50g' },
    weight_to_lose: 5,
    expected_weeks: 10,
    weekly_plan: weeklyPlan,
    home_workout: '', // لم نعد نستخدم بلوك منفصل
    tips: tips,
    specialist_notes: ''
  };
}

export default function PlanScreen() {
  const {
    lang, setLang, setScreen, answers, approved, setApproved,
    activeDay, setActiveDay, weekNum, paid, setPaid,
    isSimulatingPayment, setIsSimulatingPayment,
    isSendingWhatsApp, setIsSendingWhatsApp,
    whatsappSent, setWhatsappSent,
    receiptNumber, setReceiptNumber,
    role, setRole,
    followUp, setFollowUp, followStep, setFollowStep, followApproved, setFollowApproved,
    bmiInfo, setAnswers, setCurrentQ, setPlan, setWeekNum
  } = useApp();

  // استخدام الخطة التجريبية المتنوعة
  const plan = getVariedDemoPlan(lang, answers.first_name, answers.country);

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
      {/* HEADER (نفس السابق) */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="https://i.imgur.com/QMj8XdO.jpeg" alt="Qoot Logo" style={{ height: 40 }} />
        </div>
        <button onClick={() => setScreen("dashboard")} style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "6px 12px", fontSize: 13, cursor: "pointer" }}>
          ← {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
        </button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          <SignOutButton />
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} style={{ background: C.cardLight, border: `1px solid ${C.border}`, color: C.text, borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
        <span style={{ fontSize: 12, color: C.amber, background: C.amberGlow, border: `1px solid ${C.amber}33`, borderRadius: 20, padding: "3px 12px" }}>{T.plan.pending[lang]}</span>
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "22px 16px" }}>
        {/* Welcome message (طويلة) */}
        <div className="fu" style={{ background: `linear-gradient(135deg,${C.card},${C.cardLight})`, border: `1px solid ${C.border}`, borderRadius: 20, padding: "22px 22px", marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: C.teal, fontWeight: 600, marginBottom: 8 }}>{T.plan.ready[lang]}</div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.8 }}>{renderTextWithLinks(plan.human_intro)}</div>
        </div>

        {/* معلومات العميل (بدون تغيير) */}
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

        {/* السعرات والهدف */}
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

        {/* الماكروز */}
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

        {/* الخطة الأسبوعية مع التمارين ووقتها */}
        <div className="fu3" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.weeklyPlan[lang]} {(!paid) && <span style={{ color: C.amber, fontSize: 12 }}>{T.plan.preview[lang]}</span>}</div>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", marginBottom: 14 }}>
            {plan.weekly_plan.map((d, i) => (
              <button key={i} onClick={() => { if (paid || i === 0) setActiveDay(i); }}
                style={{ flexShrink: 0, background: activeDay === i ? C.teal : C.cardLight, color: activeDay === i ? "#fff" : C.muted, border: `2px solid ${activeDay === i ? C.teal : C.border}`, borderRadius: 10, padding: "8px 14px", fontSize: 13, fontWeight: activeDay === i ? 700 : 400, cursor: (!paid && i > 0) ? "not-allowed" : "pointer", opacity: (!paid && i > 0) ? 0.5 : 1 }}>
                {d.day} {(!paid && i > 0) && "🔒"}
              </button>
            ))}
          </div>
          {plan.weekly_plan[activeDay] && (
            <div>
              {[
                [T.plan.breakfast[lang], "breakfast"],
                [T.plan.lunch[lang], "lunch"],
                [T.plan.dinner[lang], "dinner"],
                [T.plan.snack[lang], "snack"]
              ].map(([label, key]) => {
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
              {/* عرض التمرين والوقت المفضل */}
              {plan.weekly_plan[activeDay].workout && (
                <div style={{ background: C.cardLight, borderRadius: 14, padding: "14px", marginTop: 10, border: `1px solid ${C.teal}44` }}>
                  <div style={{ fontSize: 13, color: C.teal, fontWeight: 700, marginBottom: 6 }}>
                    🏋️ {lang === "ar" ? "تمرين اليوم" : "Today's Exercise"}
                    {plan.weekly_plan[activeDay].exercise_time && (
                      <span style={{ fontSize: 11, color: C.amber, marginLeft: 8 }}>
                        ({lang === "ar" ? "الوقت المفضل: " : "Best time: "}{plan.weekly_plan[activeDay].exercise_time})
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{plan.weekly_plan[activeDay].workout}</div>
                </div>
              )}
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

        {/* النصائح (تظهر فقط بعد الدفع) */}
        {paid ? (
          <div className="fu4" style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: "20px 16px", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.teal, marginBottom: 14 }}>{T.plan.tips[lang]}</div>
            {plan.tips.map((tip, i) => (
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

        {/* الدفع (بدون تغيير) */}
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

        {/* باقي الأقسام (لوحة المتخصص، متابعة أسبوعية، إعادة التشغيل) كما هي دون تغيير */}
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

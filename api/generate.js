export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userData, lang } = req.body;
    if (!userData) {
      return res.status(400).json({ error: 'Missing userData' });
    }

    const country = userData.country || 'الدولة';
    
    // New unified country list
    const COUNTRIES = [
      { nameAr: "مصر", nameEn: "Egypt", flag: "🇪🇬" },
      { nameAr: "الكويت", nameEn: "Kuwait", flag: "🇰🇼" },
      { nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", flag: "🇸🇦" },
      { nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", flag: "🇦🇪" },
      { nameAr: "قطر", nameEn: "Qatar", flag: "🇶🇦" },
      { nameAr: "البحرين", nameEn: "Bahrain", flag: "🇧🇭" },
      { nameAr: "الأردن", nameEn: "Jordan", flag: "🇯🇴" },
      { nameAr: "لبنان", nameEn: "Lebanon", flag: "🇱🇧" },
      { nameAr: "سوريا", nameEn: "Syria", flag: "🇸🇾" },
      { nameAr: "العراق", nameEn: "Iraq", flag: "🇮🇶" },
      { nameAr: "اليمن", nameEn: "Yemen", flag: "🇾🇪" },
      { nameAr: "عُمان", nameEn: "Oman", flag: "🇴🇲" },
      { nameAr: "المغرب", nameEn: "Morocco", flag: "🇲🇦" },
      { nameAr: "تونس", nameEn: "Tunisia", flag: "🇹🇳" },
      { nameAr: "الجزائر", nameEn: "Algeria", flag: "🇩🇿" },
      { nameAr: "ليبيا", nameEn: "Libya", flag: "🇱🇾" },
      { nameAr: "السودان", nameEn: "Sudan", flag: "🇸🇩" },
      { nameAr: "الصومال", nameEn: "Somalia", flag: "🇸🇴" },
      { nameAr: "موريتانيا", nameEn: "Mauritania", flag: "🇲🇷" },
      { nameAr: "جيبوتي", nameEn: "Djibouti", flag: "🇩🇯" },
      { nameAr: "جزر القمر", nameEn: "Comoros", flag: "🇰🇲" },
      { nameAr: "فلسطين", nameEn: "Palestine", flag: "🇵🇸" },
      { nameAr: "المملكة المتحدة", nameEn: "United Kingdom", flag: "🇬🇧" },
      { nameAr: "الولايات المتحدة الأمريكية", nameEn: "United States", flag: "🇺🇸" },
      { nameAr: "كندا", nameEn: "Canada", flag: "🇨🇦" },
      { nameAr: "أستراليا", nameEn: "Australia", flag: "🇦🇺" },
      { nameAr: "فرنسا", nameEn: "France", flag: "🇫🇷" },
      { nameAr: "ألمانيا", nameEn: "Germany", flag: "🇩🇪" },
      { nameAr: "إيطاليا", nameEn: "Italy", flag: "🇮🇹" },
      { nameAr: "إسبانيا", nameEn: "Spain", flag: "🇪🇸" },
      { nameAr: "هولندا", nameEn: "Netherlands", flag: "🇳🇱" },
      { nameAr: "بلجيكا", nameEn: "Belgium", flag: "🇧🇪" },
      { nameAr: "السويد", nameEn: "Sweden", flag: "🇸🇪" },
      { nameAr: "النرويج", nameEn: "Norway", flag: "🇳🇴" },
      { nameAr: "الدنمارك", nameEn: "Denmark", flag: "🇩🇰" },
      { nameAr: "فنلندا", nameEn: "Finland", flag: "🇫🇮" },
      { nameAr: "سويسرا", nameEn: "Switzerland", flag: "🇨🇭" },
      { nameAr: "النمسا", nameEn: "Austria", flag: "🇦🇹" },
      { nameAr: "البرتغال", nameEn: "Portugal", flag: "🇵🇹" },
      { nameAr: "اليونان", nameEn: "Greece", flag: "🇬🇷" },
      { nameAr: "تركيا", nameEn: "Turkey", flag: "🇹🇷" },
      { nameAr: "روسيا", nameEn: "Russia", flag: "🇷🇺" },
      { nameAr: "الصين", nameEn: "China", flag: "🇨🇳" },
      { nameAr: "اليابان", nameEn: "Japan", flag: "🇯🇵" },
      { nameAr: "كوريا الجنوبية", nameEn: "South Korea", flag: "🇰🇷" },
      { nameAr: "الهند", nameEn: "India", flag: "🇮🇳" },
      { nameAr: "باكستان", nameEn: "Pakistan", flag: "🇵🇰" },
      { nameAr: "بنغلاديش", nameEn: "Bangladesh", flag: "🇧🇩" },
      { nameAr: "إندونيسيا", nameEn: "Indonesia", flag: "🇮🇩" },
      { nameAr: "ماليزيا", nameEn: "Malaysia", flag: "🇲🇾" },
      { nameAr: "سنغافورة", nameEn: "Singapore", flag: "🇸🇬" },
      { nameAr: "الفلبين", nameEn: "Philippines", flag: "🇵🇭" },
      { nameAr: "تايلاند", nameEn: "Thailand", flag: "🇹🇭" },
      { nameAr: "إيران", nameEn: "Iran", flag: "🇮🇷" },
      { nameAr: "أفغانستان", nameEn: "Afghanistan", flag: "🇦🇫" },
      { nameAr: "نيجيريا", nameEn: "Nigeria", flag: "🇳🇬" },
      { nameAr: "كينيا", nameEn: "Kenya", flag: "🇰🇪" },
      { nameAr: "إثيوبيا", nameEn: "Ethiopia", flag: "🇪🇹" },
      { nameAr: "غانا", nameEn: "Ghana", flag: "🇬🇭" },
      { nameAr: "جنوب أفريقيا", nameEn: "South Africa", flag: "🇿🇦" },
      { nameAr: "البرازيل", nameEn: "Brazil", flag: "🇧🇷" },
      { nameAr: "الأرجنتين", nameEn: "Argentina", flag: "🇦🇷" },
      { nameAr: "المكسيك", nameEn: "Mexico", flag: "🇲🇽" },
      { nameAr: "ألبانيا", nameEn: "Albania", flag: "🇦🇱" },
      { nameAr: "أرمينيا", nameEn: "Armenia", flag: "🇦🇲" },
      { nameAr: "أذربيجان", nameEn: "Azerbaijan", flag: "🇦🇿" },
      { nameAr: "البوسنة والهرسك", nameEn: "Bosnia and Herzegovina", flag: "🇧🇦" },
      { nameAr: "كرواتيا", nameEn: "Croatia", flag: "🇭🇷" },
      { nameAr: "التشيك", nameEn: "Czech Republic", flag: "🇨🇿" },
      { nameAr: "المجر", nameEn: "Hungary", flag: "🇭🇺" },
      { nameAr: "بولندا", nameEn: "Poland", flag: "🇵🇱" },
      { nameAr: "رومانيا", nameEn: "Romania", flag: "🇷🇴" },
      { nameAr: "أوكرانيا", nameEn: "Ukraine", flag: "🇺🇦" },
      { nameAr: "أيرلندا", nameEn: "Ireland", flag: "🇮🇪" },
      { nameAr: "نيوزيلندا", nameEn: "New Zealand", flag: "🇳🇿" },
      { nameAr: "قيرغيزستان", nameEn: "Kyrgyzstan", flag: "🇰🇬" },
      { nameAr: "كازاخستان", nameEn: "Kazakhstan", flag: "🇰🇿" },
      { nameAr: "أوزبكستان", nameEn: "Uzbekistan", flag: "🇺🇿" },
      { nameAr: "تركمانستان", nameEn: "Turkmenistan", flag: "🇹🇲" },
      { nameAr: "طاجيكستان", nameEn: "Tajikistan", flag: "🇹🇯" },
      { nameAr: "جورجيا", nameEn: "Georgia", flag: "🇬🇪" },
      { nameAr: "إريتريا", nameEn: "Eritrea", flag: "🇪🇷" },
      { nameAr: "رواندا", nameEn: "Rwanda", flag: "🇷🇼" },
      { nameAr: "أوغندا", nameEn: "Uganda", flag: "🇺🇬" },
      { nameAr: "تنزانيا", nameEn: "Tanzania", flag: "🇹🇿" },
      { nameAr: "زيمبابوي", nameEn: "Zimbabwe", flag: "🇿🇼" },
      { nameAr: "زامبيا", nameEn: "Zambia", flag: "🇿🇲" },
      { nameAr: "موزمبيق", nameEn: "Mozambique", flag: "🇲🇿" },
      { nameAr: "مدغشقر", nameEn: "Madagascar", flag: "🇲🇬" },
      { nameAr: "الكاميرون", nameEn: "Cameroon", flag: "🇨🇲" },
      { nameAr: "السنغال", nameEn: "Senegal", flag: "🇸🇳" },
      { nameAr: "ساحل العاج", nameEn: "Ivory Coast", flag: "🇨🇮" },
      { nameAr: "فيتنام", nameEn: "Vietnam", flag: "🇻🇳" },
      { nameAr: "كمبوديا", nameEn: "Cambodia", flag: "🇰🇭" },
      { nameAr: "ميانمار", nameEn: "Myanmar", flag: "🇲🇲" },
      { nameAr: "سريلانكا", nameEn: "Sri Lanka", flag: "🇱🇰" },
      { nameAr: "نيبال", nameEn: "Nepal", flag: "🇳🇵" },
      { nameAr: "كولومبيا", nameEn: "Colombia", flag: "🇨🇴" },
      { nameAr: "بيرو", nameEn: "Peru", flag: "🇵🇪" },
      { nameAr: "شيلي", nameEn: "Chile", flag: "🇨🇱" },
      { nameAr: "فنزويلا", nameEn: "Venezuela", flag: "🇻🇪" },
      { nameAr: "كوبا", nameEn: "Cuba", flag: "🇨🇺" },
      { nameAr: "الدومينيكان", nameEn: "Dominican Republic", flag: "🇩🇴" },
      { nameAr: "بوليفيا", nameEn: "Bolivia", flag: "🇧🇴" },
      { nameAr: "باراغواي", nameEn: "Paraguay", flag: "🇵🇾" },
      { nameAr: "أوروغواي", nameEn: "Uruguay", flag: "🇺🇾" },
    ];

    // Find the country – matches by either Arabic or English name
    const countryForPrompt = lang !== 'ar'
      ? (COUNTRIES.find(c => c.nameAr === country || c.nameEn === country)?.nameEn || country)
      : country;

    const sysPrompt = lang === 'ar'
      ? `أنت أخصائي تغذية متخصص. مهمتك الوحيدة هي الرد بـ **JSON صحيح فقط** بالهيكل التالي. لا تستخدم أي حقول عربية. لا تكتب أي شيء خارج JSON.

{
  "human_intro": "رسالة ترحيبية دافئة",
  "target_calories": 1800,
  "daily_macros": { "protein": "120g", "carbs": "150g", "fats": "60g" },
  "weight_to_lose": 10,
  "expected_weeks": 16,
  "weekly_plan": [
    {
      "day": "الأحد",
      "breakfast": { "options": ["خيار 1", "خيار 2"], "macros": "بروتين: ... | كارب: ... | دهون: ..." },
      "lunch": { "options": ["خيار 1", "خيار 2"], "macros": "..." },
      "dinner": { "options": ["خيار 1", "خيار 2"], "macros": "..." },
      "snack": { "options": ["خيار 1", "خيار 2"], "macros": "..." }
    },
    ... (7 أيام)
  ],
  "home_workout": "تفاصيل روتين رياضي منزلي (بدون جيم)",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3"],
  "specialist_notes": "ملاحظات طبية للمتخصص"
}

تحذير: أي رد لا يتوافق مع هذه البنية بالضبط سيتم رفضه. استخدم **أرخص المكونات المحلية المتوفرة** في (${countryForPrompt}). كل وجبة تحتوي على 2-3 بدائل. الرياضة **منزلية فقط**.`
      : `You are a nutrition specialist. Your ONLY task is to output valid JSON in the exact structure below. No other text. Use only English keys, even if user data is in Arabic. Any deviation will be rejected.

{
  "human_intro": "A warm welcoming message",
  "target_calories": 1800,
  "daily_macros": { "protein": "120g", "carbs": "150g", "fats": "60g" },
  "weight_to_lose": 10,
  "expected_weeks": 16,
  "weekly_plan": [
    {
      "day": "Sunday",
      "breakfast": { "options": ["Option 1", "Option 2"], "macros": "Protein: ... | Carbs: ... | Fats: ..." },
      "lunch": { "options": ["Option 1", "Option 2"], "macros": "..." },
      "dinner": { "options": ["Option 1", "Option 2"], "macros": "..." },
      "snack": { "options": ["Option 1", "Option 2"], "macros": "..." }
    },
    ... (7 days)
  ],
  "home_workout": "Home workout details (no gym)",
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "specialist_notes": "Medical notes for specialist"
}

WARNING: Any response that does not exactly match this structure will be rejected. Strictly use the cheapest, most available local ingredients in ${countryForPrompt}. Each meal must have 2-3 options. Home workout only.`;

    const fullUserPrompt = lang === 'ar'
      ? `الاسم: ${userData.first_name || ''} | العمر: ${userData.age} | الجنس: ${userData.gender} | الطول: ${userData.height}سم | الوزن: ${userData.current_weight}كجم | الهدف: ${userData.target_weight}كجم | الصحة: ${[userData.health_conditions].flat().join(', ')} (ملاحظات: ${userData.health_notes || 'لا'}) | الحساسية: ${[userData.allergies].flat().join(', ') || 'لا'} | النشاط: ${userData.activity} | تفضيلات الطعام: ${[userData.food_pref].flat().join(', ') || 'كل شيء'} | البلد: ${countryForPrompt}`
      : `Name: ${userData.first_name || ''} | Age: ${userData.age} | Gender: ${userData.gender} | Height: ${userData.height}cm | Weight: ${userData.current_weight}kg | Goal: ${userData.target_weight}kg | Health: ${[userData.health_conditions].flat().join(', ')} (Notes: ${userData.health_notes || 'None'}) | Allergies: ${[userData.allergies].flat().join(', ') || 'None'} | Activity: ${userData.activity} | Food Prefs: ${[userData.food_pref].flat().join(', ') || 'Everything'} | Country: ${countryForPrompt}`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });
    }

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 2500,
        messages: [
          { role: 'system', content: sysPrompt },
          { role: 'user', content: fullUserPrompt }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({ error: `DeepSeek API error: ${response.status}`, details: errText });
    }

    const data = await response.json();
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    const raw = data.choices[0].message.content;
    
    // Extract JSON from the response
    let planJson = extractJSON(raw);
    
    if (!planJson) {
      return res.status(500).json({ error: 'Failed to parse AI response as JSON', raw: raw.substring(0, 200) });
    }

    const standardized = standardizePlan(planJson, userData, lang);
    res.status(200).json({ plan: JSON.stringify(standardized) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

// Improved JSON extraction
function extractJSON(raw) {
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    const opens = [];
    for (const ch of cleaned) {
      if (ch === '{') opens.push('}');
      else if (ch === '[') opens.push(']');
      else if (ch === '}' || ch === ']') opens.pop();
    }
    cleaned += opens.reverse().join('');
    const quoteCount = (cleaned.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) cleaned += '"';
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      return null;
    }
  }
}

function standardizePlan(plan, userData, lang) {
  if (plan.human_intro && plan.weekly_plan) return plan;
  const p = plan;

  let targetCalories = 1800;
  const calSources = [
    p.daily_calories, p.target_calories,
    p.التقييم?.["السعرات اليومية"],
    p.diet_plan?.daily_calories_target,
    p.diet_plan?.calories_per_day,
    p.meal_plan?.daily_calories_target,
    p.meal_plan?.calories_per_day
  ];
  for (const src of calSources) {
    if (src) {
      const match = String(src).match(/(\d+)/);
      if (match) { targetCalories = parseInt(match[1]); break; }
    }
  }

  let weightToLose = 15;
  if (p.weight_to_lose) weightToLose = p.weight_to_lose;
  else if (p.التقييم?.["الوزن المطلوب فقدانه"]) weightToLose = parseInt(p.التقييم["الوزن المطلوب فقدانه"]) || weightToLose;
  else if (userData.current_weight && userData.target_weight) weightToLose = Math.max(0, userData.current_weight - userData.target_weight);

  let dailyMacros = { protein: '120g', carbs: '150g', fats: '60g' };
  const macroSrc = p.macros || p.daily_macros || p.diet_plan?.macros || p.diet_plan?.macronutrients || p.meal_plan?.macros || p.meal_plan?.macronutrients;
  if (macroSrc) {
    dailyMacros = {
      protein: macroSrc.protein || macroSrc.protein_g || '120g',
      carbs: macroSrc.carbs || macroSrc.carbs_g || '150g',
      fats: macroSrc.fats || macroSrc.fat_g || macroSrc.fat || '60g'
    };
    Object.keys(dailyMacros).forEach(k => {
      const m = String(dailyMacros[k]).match(/(\d+)\s*g/);
      if (m) dailyMacros[k] = m[0];
    });
  }

  const tipsArr = p.nutritional_tips || p.general_advice || p.نصائح_عامة || p.نصائح_إضافية || p.additional_advice || p.diet_plan?.notes || p.meal_plan?.notes || p.tips || [];
  let humanIntro = lang === 'ar' ? `مرحباً ${userData.first_name || ''}! خطتك جاهزة.` : `Welcome ${userData.first_name || ''}! Your plan is ready.`;
  if (Array.isArray(tipsArr) && tipsArr.length > 0) humanIntro = tipsArr[0];

  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = lang === 'ar' ? daysAr : daysEn;
  const mealSource = p.meal_plan || p.diet_plan?.meal_alternatives || p.diet_plan?.meals || p.نظام_الوجبات || p.meals || {};

  const getOptions = (meal) => {
    if (!meal) return ['وجبة مقترحة'];
    if (typeof meal === 'string') return [meal];
    if (Array.isArray(meal)) {
      if (meal.every(item => typeof item === 'string')) return meal;
      return meal.map(item => typeof item === 'string' ? item : (item.meal || item.name || item.description || item.option || Object.values(item).join(' / ')));
    }
    return Object.values(meal).map(v => typeof v === 'string' ? v : (v.meal || v.name || JSON.stringify(v)));
  };

  const breakfast = getOptions(mealSource.breakfast || mealSource.الإفطار);
  const lunch = getOptions(mealSource.lunch || mealSource.الغداء);
  const dinner = getOptions(mealSource.dinner || mealSource.العشاء);
  const snack = getOptions(mealSource.snacks || mealSource.snack || mealSource["وجبة خفيفة"] || mealSource["وجبات خفيفة"] || []);
  const weeklyPlan = [];
  for (let i = 0; i < 7; i++) {
    weeklyPlan.push({
      day: days[i],
      breakfast: { options: breakfast, macros: '' },
      lunch: { options: lunch, macros: '' },
      dinner: { options: dinner, macros: '' },
      snack: { options: snack, macros: '' }
    });
  }

  let homeWorkout = '';
  const wo = p.home_exercise_plan || p.home_exercise_routine || p.diet_plan?.home_exercises || p.تمارين_رياضية_منزلية || p.رياضة_منزلية || p.home_workout;
  if (typeof wo === 'string') homeWorkout = wo;
  else if (wo && typeof wo === 'object') {
    const parts = [];
    if (wo.schedule) parts.push(wo.schedule);
    if (wo.exercises && Array.isArray(wo.exercises)) {
      parts.push(wo.exercises.map((ex, idx) => `${idx+1}. ${ex.name || ex}${ex.sets ? ` (${ex.sets} مجموعات × ${ex.reps || ex.duration_secs})` : ''}`).join('\n'));
    }
    if (wo.warm_up) parts.push(`الإحماء: ${wo.warm_up}`);
    if (wo.cool_down) parts.push(`التهدئة: ${wo.cool_down}`);
    homeWorkout = parts.join('\n\n');
  }
  if (!homeWorkout) homeWorkout = 'تمارين منزلية يومية';

  const tips = tipsArr && Array.isArray(tipsArr) ? tipsArr : ['اتبع خطتك'];
  let specialistNotes = '';
  if (p.إرشادات_السكري_والضغط) specialistNotes = JSON.stringify(p.إرشادات_السكري_والضغط);
  else if (p.specialist_notes) specialistNotes = p.specialist_notes;

  return {
    human_intro: humanIntro,
    target_calories: targetCalories,
    daily_macros: dailyMacros,
    weight_to_lose: weightToLose,
    expected_weeks: Math.ceil(weightToLose / 0.5),
    weekly_plan: weeklyPlan,
    home_workout: homeWorkout,
    tips: tips,
    specialist_notes: specialistNotes
  };
}

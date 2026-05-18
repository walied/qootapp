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
    const COUNTRY_DATA = [
      { name: "مصر", aliases: ["مصر", "egypt", "ايجبت"] },
      { name: "الكويت", aliases: ["الكويت", "كويت", "kuwait"] },
      { name: "المملكة العربية السعودية", aliases: ["السعودية", "المملكة", "سعودية", "الرياض", "saudi", "ksa", "saudi arabia"] },
      { name: "الإمارات العربية المتحدة", aliases: ["الامارات", "الإمارات", "دبي", "ابوظبي", "أبوظبي", "uae", "dubai", "emirates"] },
      { name: "قطر", aliases: ["قطر", "الدوحة", "qatar", "doha"] },
      { name: "البحرين", aliases: ["البحرين", "بحرين", "bahrain", "المنامة"] },
      { name: "الأردن", aliases: ["الأردن", "اردن", "عمان", "jordan", "amman"] },
      { name: "لبنان", aliases: ["لبنان", "بيروت", "lebanon", "beirut"] },
      { name: "سوريا", aliases: ["سوريا", "دمشق", "syria", "damascus"] },
      { name: "العراق", aliases: ["العراق", "عراق", "بغداد", "iraq", "baghdad"] },
      { name: "اليمن", aliases: ["اليمن", "يمن", "صنعاء", "yemen", "sanaa"] },
      { name: "عُمان", aliases: ["عمان", "سلطنة عمان", "مسقط", "oman", "muscat"] },
      { name: "المغرب", aliases: ["المغرب", "مغرب", "الرباط", "الدار البيضاء", "morocco", "maroc", "casablanca"] },
      { name: "تونس", aliases: ["تونس", "تونس العاصمة", "tunisia"] },
      { name: "الجزائر", aliases: ["الجزائر", "جزائر", "algeria"] },
      { name: "ليبيا", aliases: ["ليبيا", "طرابلس", "libya", "tripoli"] },
      { name: "السودان", aliases: ["السودان", "سودان", "الخرطوم", "sudan", "khartoum"] },
      { name: "الصومال", aliases: ["الصومال", "صومال", "مقديشو", "somalia", "mogadishu"] },
      { name: "موريتانيا", aliases: ["موريتانيا", "نواكشوط", "mauritania"] },
      { name: "جيبوتي", aliases: ["جيبوتي", "djibouti"] },
      { name: "جزر القمر", aliases: ["جزر القمر", "comoros"] },
      { name: "فلسطين", aliases: ["فلسطين", "غزة", "الضفة", "palestine", "gaza"] },
      { name: "المملكة المتحدة", aliases: ["المملكة المتحدة", "انجلترا", "إنجلترا", "بريطانيا", "لندن", "uk", "england", "britain", "great britain", "united kingdom", "london"] },
      { name: "الولايات المتحدة الأمريكية", aliases: ["الولايات المتحدة", "أمريكا", "امريكا", "نيويورك", "usa", "us", "america", "united states", "new york"] },
      { name: "كندا", aliases: ["كندا", "canada", "toronto", "montreal"] },
      { name: "أستراليا", aliases: ["استراليا", "أستراليا", "australia", "sydney", "melbourne"] },
      { name: "فرنسا", aliases: ["فرنسا", "باريس", "france", "paris"] },
      { name: "ألمانيا", aliases: ["المانيا", "ألمانيا", "برلين", "germany", "berlin"] },
      { name: "إيطاليا", aliases: ["ايطاليا", "إيطاليا", "روما", "italy", "rome"] },
      { name: "إسبانيا", aliases: ["اسبانيا", "إسبانيا", "مدريد", "spain", "madrid"] },
      { name: "هولندا", aliases: ["هولندا", "امستردام", "netherlands", "amsterdam", "holland"] },
      { name: "بلجيكا", aliases: ["بلجيكا", "بروكسل", "belgium", "brussels"] },
      { name: "السويد", aliases: ["السويد", "ستوكهولم", "sweden", "stockholm"] },
      { name: "النرويج", aliases: ["النرويج", "اوسلو", "norway", "oslo"] },
      { name: "الدنمارك", aliases: ["الدنمارك", "كوبنهاغن", "denmark", "copenhagen"] },
      { name: "فنلندا", aliases: ["فنلندا", "هلسنكي", "finland", "helsinki"] },
      { name: "سويسرا", aliases: ["سويسرا", "جنيف", "زيورخ", "switzerland", "geneva", "zurich"] },
      { name: "النمسا", aliases: ["النمسا", "فيينا", "austria", "vienna"] },
      { name: "البرتغال", aliases: ["البرتغال", "لشبونة", "portugal", "lisbon"] },
      { name: "اليونان", aliases: ["اليونان", "اثينا", "greece", "athens"] },
      { name: "تركيا", aliases: ["تركيا", "اسطنبول", "إسطنبول", "أنقرة", "turkey", "istanbul", "ankara"] },
      { name: "روسيا", aliases: ["روسيا", "موسكو", "russia", "moscow"] },
      { name: "الصين", aliases: ["الصين", "بكين", "شنغهاي", "china", "beijing", "shanghai"] },
      { name: "اليابان", aliases: ["اليابان", "طوكيو", "japan", "tokyo"] },
      { name: "كوريا الجنوبية", aliases: ["كوريا", "كوريا الجنوبية", "سيول", "south korea", "korea", "seoul"] },
      { name: "الهند", aliases: ["الهند", "هند", "نيودلهي", "india", "new delhi", "mumbai"] },
      { name: "باكستان", aliases: ["باكستان", "اسلام اباد", "كراتشي", "pakistan", "islamabad", "karachi"] },
      { name: "بنغلاديش", aliases: ["بنغلاديش", "داكا", "bangladesh", "dhaka"] },
      { name: "إندونيسيا", aliases: ["اندونيسيا", "إندونيسيا", "جاكرتا", "indonesia", "jakarta"] },
      { name: "ماليزيا", aliases: ["ماليزيا", "كوالالمبور", "malaysia", "kuala lumpur", "kl"] },
      { name: "سنغافورة", aliases: ["سنغافورة", "singapore"] },
      { name: "الفلبين", aliases: ["الفلبين", "فلبين", "مانيلا", "philippines", "manila"] },
      { name: "تايلاند", aliases: ["تايلاند", "بانكوك", "thailand", "bangkok"] },
      { name: "إيران", aliases: ["ايران", "إيران", "طهران", "iran", "tehran"] },
      { name: "أفغانستان", aliases: ["افغانستان", "أفغانستان", "كابل", "afghanistan", "kabul"] },
      { name: "نيجيريا", aliases: ["نيجيريا", "لاغوس", "nigeria", "lagos", "abuja"] },
      { name: "كينيا", aliases: ["كينيا", "نيروبي", "kenya", "nairobi"] },
      { name: "إثيوبيا", aliases: ["اثيوبيا", "إثيوبيا", "اديس ابابا", "ethiopia", "addis ababa"] },
      { name: "غانا", aliases: ["غانا", "اكرا", "ghana", "accra"] },
      { name: "جنوب أفريقيا", aliases: ["جنوب افريقيا", "جنوب أفريقيا", "كيب تاون", "جوهانسبرغ", "south africa", "cape town", "johannesburg"] },
      { name: "البرازيل", aliases: ["البرازيل", "برازيل", "ساو باولو", "brazil", "sao paulo", "rio"] },
      { name: "الأرجنتين", aliases: ["الأرجنتين", "أرجنتين", "بوينس أيرس", "argentina", "buenos aires"] },
      { name: "المكسيك", aliases: ["المكسيك", "مكسيك", "mexico", "mexico city"] },
      { name: "ألبانيا", aliases: ["البانيا", "ألبانيا", "albania"] },
      { name: "أرمينيا", aliases: ["ارمينيا", "أرمينيا", "armenia"] },
      { name: "أذربيجان", aliases: ["اذربيجان", "أذربيجان", "azerbaijan", "baku"] },
      { name: "البوسنة والهرسك", aliases: ["البوسنة", "Bosnia"] },
      { name: "كرواتيا", aliases: ["كرواتيا", "croatia", "zagreb"] },
      { name: "التشيك", aliases: ["التشيك", "براغ", "czech", "prague"] },
      { name: "المجر", aliases: ["المجر", "هنغاريا", "budapest", "hungary"] },
      { name: "بولندا", aliases: ["بولندا", "وارسو", "poland", "warsaw"] },
      { name: "رومانيا", aliases: ["رومانيا", "بوخارست", "romania", "bucharest"] },
      { name: "أوكرانيا", aliases: ["اوكرانيا", "أوكرانيا", "كييف", "ukraine", "kyiv"] },
      { name: "أيرلندا", aliases: ["ايرلندا", "أيرلندا", "دبلن", "ireland", "dublin"] },
      { name: "نيوزيلندا", aliases: ["نيوزيلندا", "new zealand", "auckland"] },
      { name: "قيرغيزستان", aliases: ["قيرغيزستان", "kyrgyzstan"] },
      { name: "كازاخستان", aliases: ["كازاخستان", "kazakhstan", "almaty"] },
      { name: "أوزبكستان", aliases: ["اوزبكستان", "أوزبكستان", "uzbekistan", "tashkent"] },
      { name: "تركمانستان", aliases: ["تركمانستان", "turkmenistan"] },
      { name: "طاجيكستان", aliases: ["طاجيكستان", "tajikistan"] },
      { name: "جورجيا", aliases: ["جورجيا", "تبليسي", "georgia", "tbilisi"] },
      { name: "إريتريا", aliases: ["اريتريا", "إريتريا", "eritrea"] },
      { name: "رواندا", aliases: ["رواندا", "rwanda", "kigali"] },
      { name: "أوغندا", aliases: ["اوغندا", "أوغندا", "uganda", "kampala"] },
      { name: "تنزانيا", aliases: ["تنزانيا", "دار السلام", "tanzania", "dar es salaam"] },
      { name: "زيمبابوي", aliases: ["زيمبابوي", "zimbabwe", "harare"] },
      { name: "زامبيا", aliases: ["زامبيا", "zambia", "lusaka"] },
      { name: "موزمبيق", aliases: ["موزمبيق", "mozambique", "maputo"] },
      { name: "مدغشقر", aliases: ["مدغشقر", "madagascar"] },
      { name: "الكاميرون", aliases: ["الكاميرون", "كاميرون", "cameroon", "yaounde"] },
      { name: "السنغال", aliases: ["السنغال", "سنغال", "داكار", "senegal", "dakar"] },
      { name: "ساحل العاج", aliases: ["ساحل العاج", "كوت ديفوار", "ivory coast", "cote d'ivoire", "abidjan"] },
      { name: "فيتنام", aliases: ["فيتنام", "هانوي", "vietnam", "hanoi", "ho chi minh"] },
      { name: "كمبوديا", aliases: ["كمبوديا", "بنوم بنه", "cambodia", "phnom penh"] },
      { name: "ميانمار", aliases: ["ميانمار", "بورما", "myanmar", "burma", "rangoon"] },
      { name: "سريلانكا", aliases: ["سريلانكا", "sri lanka", "colombo"] },
      { name: "نيبال", aliases: ["نيبال", "كاتماندو", "nepal", "kathmandu"] },
      { name: "كولومبيا", aliases: ["كولومبيا", "بوغوتا", "colombia", "bogota"] },
      { name: "بيرو", aliases: ["بيرو", "ليما", "peru", "lima"] },
      { name: "شيلي", aliases: ["شيلي", "سانتياغو", "chile", "santiago"] },
      { name: "فنزويلا", aliases: ["فنزويلا", "كاراكاس", "venezuela", "caracas"] },
      { name: "كوبا", aliases: ["كوبا", "هافانا", "cuba", "havana"] },
      { name: "الدومينيكان", aliases: ["الدومينيكان", "جمهورية الدومينيكان", "dominican republic", "santo domingo"] },
      { name: "بوليفيا", aliases: ["بوليفيا", "لاباز", "bolivia", "la paz"] },
      { name: "باراغواي", aliases: ["باراغواي", "اسونسيون", "paraguay", "asuncion"] },
      { name: "أوروغواي", aliases: ["اوروغواي", "أوروغواي", "مونتيفيديو", "uruguay", "montevideo"] }
    ];

    const countryForPrompt = lang !== 'ar'
      ? (COUNTRY_DATA.find(c => c.name === country)?.aliases.find(a => /^[a-zA-Z]/.test(a)) || country)
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
    
    // Extract JSON from the response (handles <think> tags and extra text)
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

// Improved JSON extraction that handles DeepSeek thinking tags
function extractJSON(raw) {
  // Remove <think>...</think> tags (DeepSeek R1 reasoning)
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  
  // Remove any text before the first '{' and after the last '}'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;
  
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  
  // Fix common JSON errors
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
  
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    // Try fixing unclosed brackets
    const opens = [];
    for (const ch of cleaned) {
      if (ch === '{') opens.push('}');
      else if (ch === '[') opens.push(']');
      else if (ch === '}' || ch === ']') opens.pop();
    }
    cleaned += opens.reverse().join('');
    
    // Fix unclosed quotes
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

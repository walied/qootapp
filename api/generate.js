export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { userData, lang } = req.body;
    if (!userData) return res.status(400).json({ error: 'Missing userData' });

    const country = userData.country || 'الدولة';
    const COUNTRIES = [
     { nameAr: "مصر", nameEn: "Egypt", flag: "https://flagcdn.com/w40/eg.png" },
  { nameAr: "الكويت", nameEn: "Kuwait", flag: "https://flagcdn.com/w40/kw.png" },
  { nameAr: "المملكة العربية السعودية", nameEn: "Saudi Arabia", flag: "https://flagcdn.com/w40/sa.png" },
  { nameAr: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", flag: "https://flagcdn.com/w40/ae.png" },
  { nameAr: "قطر", nameEn: "Qatar", flag: "https://flagcdn.com/w40/qa.png" },
  { nameAr: "البحرين", nameEn: "Bahrain", flag: "https://flagcdn.com/w40/bh.png" },
  { nameAr: "الأردن", nameEn: "Jordan", flag: "https://flagcdn.com/w40/jo.png" },
  { nameAr: "لبنان", nameEn: "Lebanon", flag: "https://flagcdn.com/w40/lb.png" },
  { nameAr: "سوريا", nameEn: "Syria", flag: "https://flagcdn.com/w40/sy.png" },
  { nameAr: "العراق", nameEn: "Iraq", flag: "https://flagcdn.com/w40/iq.png" },
  { nameAr: "اليمن", nameEn: "Yemen", flag: "https://flagcdn.com/w40/ye.png" },
  { nameAr: "عُمان", nameEn: "Oman", flag: "https://flagcdn.com/w40/om.png" },
  { nameAr: "المغرب", nameEn: "Morocco", flag: "https://flagcdn.com/w40/ma.png" },
  { nameAr: "تونس", nameEn: "Tunisia", flag: "https://flagcdn.com/w40/tn.png" },
  { nameAr: "الجزائر", nameEn: "Algeria", flag: "https://flagcdn.com/w40/dz.png" },
  { nameAr: "ليبيا", nameEn: "Libya", flag: "https://flagcdn.com/w40/ly.png" },
  { nameAr: "السودان", nameEn: "Sudan", flag: "https://flagcdn.com/w40/sd.png" },
  { nameAr: "الصومال", nameEn: "Somalia", flag: "https://flagcdn.com/w40/so.png" },
  { nameAr: "موريتانيا", nameEn: "Mauritania", flag: "https://flagcdn.com/w40/mr.png" },
  { nameAr: "جيبوتي", nameEn: "Djibouti", flag: "https://flagcdn.com/w40/dj.png" },
  { nameAr: "جزر القمر", nameEn: "Comoros", flag: "https://flagcdn.com/w40/km.png" },
  { nameAr: "فلسطين", nameEn: "Palestine", flag: "https://flagcdn.com/w40/ps.png" },
  { nameAr: "المملكة المتحدة", nameEn: "United Kingdom", flag: "https://flagcdn.com/w40/gb.png" },
  { nameAr: "الولايات المتحدة الأمريكية", nameEn: "United States", flag: "https://flagcdn.com/w40/us.png" },
  { nameAr: "كندا", nameEn: "Canada", flag: "https://flagcdn.com/w40/ca.png" },
  { nameAr: "أستراليا", nameEn: "Australia", flag: "https://flagcdn.com/w40/au.png" },
  { nameAr: "فرنسا", nameEn: "France", flag: "https://flagcdn.com/w40/fr.png" },
  { nameAr: "ألمانيا", nameEn: "Germany", flag: "https://flagcdn.com/w40/de.png" },
  { nameAr: "إيطاليا", nameEn: "Italy", flag: "https://flagcdn.com/w40/it.png" },
  { nameAr: "إسبانيا", nameEn: "Spain", flag: "https://flagcdn.com/w40/es.png" },
  { nameAr: "هولندا", nameEn: "Netherlands", flag: "https://flagcdn.com/w40/nl.png" },
  { nameAr: "بلجيكا", nameEn: "Belgium", flag: "https://flagcdn.com/w40/be.png" },
  { nameAr: "السويد", nameEn: "Sweden", flag: "https://flagcdn.com/w40/se.png" },
  { nameAr: "النرويج", nameEn: "Norway", flag: "https://flagcdn.com/w40/no.png" },
  { nameAr: "الدنمارك", nameEn: "Denmark", flag: "https://flagcdn.com/w40/dk.png" },
  { nameAr: "فنلندا", nameEn: "Finland", flag: "https://flagcdn.com/w40/fi.png" },
  { nameAr: "سويسرا", nameEn: "Switzerland", flag: "https://flagcdn.com/w40/ch.png" },
  { nameAr: "النمسا", nameEn: "Austria", flag: "https://flagcdn.com/w40/at.png" },
  { nameAr: "البرتغال", nameEn: "Portugal", flag: "https://flagcdn.com/w40/pt.png" },
  { nameAr: "اليونان", nameEn: "Greece", flag: "https://flagcdn.com/w40/gr.png" },
  { nameAr: "تركيا", nameEn: "Turkey", flag: "https://flagcdn.com/w40/tr.png" },
  { nameAr: "روسيا", nameEn: "Russia", flag: "https://flagcdn.com/w40/ru.png" },
  { nameAr: "الصين", nameEn: "China", flag: "https://flagcdn.com/w40/cn.png" },
  { nameAr: "اليابان", nameEn: "Japan", flag: "https://flagcdn.com/w40/jp.png" },
  { nameAr: "كوريا الجنوبية", nameEn: "South Korea", flag: "https://flagcdn.com/w40/kr.png" },
  { nameAr: "الهند", nameEn: "India", flag: "https://flagcdn.com/w40/in.png" },
  { nameAr: "باكستان", nameEn: "Pakistan", flag: "https://flagcdn.com/w40/pk.png" },
  { nameAr: "بنغلاديش", nameEn: "Bangladesh", flag: "https://flagcdn.com/w40/bd.png" },
  { nameAr: "إندونيسيا", nameEn: "Indonesia", flag: "https://flagcdn.com/w40/id.png" },
  { nameAr: "ماليزيا", nameEn: "Malaysia", flag: "https://flagcdn.com/w40/my.png" },
  { nameAr: "سنغافورة", nameEn: "Singapore", flag: "https://flagcdn.com/w40/sg.png" },
  { nameAr: "الفلبين", nameEn: "Philippines", flag: "https://flagcdn.com/w40/ph.png" },
  { nameAr: "تايلاند", nameEn: "Thailand", flag: "https://flagcdn.com/w40/th.png" },
  { nameAr: "إيران", nameEn: "Iran", flag: "https://flagcdn.com/w40/ir.png" },
  { nameAr: "أفغانستان", nameEn: "Afghanistan", flag: "https://flagcdn.com/w40/af.png" },
  { nameAr: "نيجيريا", nameEn: "Nigeria", flag: "https://flagcdn.com/w40/ng.png" },
  { nameAr: "كينيا", nameEn: "Kenya", flag: "https://flagcdn.com/w40/ke.png" },
  { nameAr: "إثيوبيا", nameEn: "Ethiopia", flag: "https://flagcdn.com/w40/et.png" },
  { nameAr: "غانا", nameEn: "Ghana", flag: "https://flagcdn.com/w40/gh.png" },
  { nameAr: "جنوب أفريقيا", nameEn: "South Africa", flag: "https://flagcdn.com/w40/za.png" },
  { nameAr: "البرازيل", nameEn: "Brazil", flag: "https://flagcdn.com/w40/br.png" },
  { nameAr: "الأرجنتين", nameEn: "Argentina", flag: "https://flagcdn.com/w40/ar.png" },
  { nameAr: "المكسيك", nameEn: "Mexico", flag: "https://flagcdn.com/w40/mx.png" },
  { nameAr: "ألبانيا", nameEn: "Albania", flag: "https://flagcdn.com/w40/al.png" },
  { nameAr: "أرمينيا", nameEn: "Armenia", flag: "https://flagcdn.com/w40/am.png" },
  { nameAr: "أذربيجان", nameEn: "Azerbaijan", flag: "https://flagcdn.com/w40/az.png" },
  { nameAr: "البوسنة والهرسك", nameEn: "Bosnia and Herzegovina", flag: "https://flagcdn.com/w40/ba.png" },
  { nameAr: "كرواتيا", nameEn: "Croatia", flag: "https://flagcdn.com/w40/hr.png" },
  { nameAr: "التشيك", nameEn: "Czech Republic", flag: "https://flagcdn.com/w40/cz.png" },
  { nameAr: "المجر", nameEn: "Hungary", flag: "https://flagcdn.com/w40/hu.png" },
  { nameAr: "بولندا", nameEn: "Poland", flag: "https://flagcdn.com/w40/pl.png" },
  { nameAr: "رومانيا", nameEn: "Romania", flag: "https://flagcdn.com/w40/ro.png" },
  { nameAr: "أوكرانيا", nameEn: "Ukraine", flag: "https://flagcdn.com/w40/ua.png" },
  { nameAr: "أيرلندا", nameEn: "Ireland", flag: "https://flagcdn.com/w40/ie.png" },
  { nameAr: "نيوزيلندا", nameEn: "New Zealand", flag: "https://flagcdn.com/w40/nz.png" },
  { nameAr: "قيرغيزستان", nameEn: "Kyrgyzstan", flag: "https://flagcdn.com/w40/kg.png" },
  { nameAr: "كازاخستان", nameEn: "Kazakhstan", flag: "https://flagcdn.com/w40/kz.png" },
  { nameAr: "أوزبكستان", nameEn: "Uzbekistan", flag: "https://flagcdn.com/w40/uz.png" },
  { nameAr: "تركمانستان", nameEn: "Turkmenistan", flag: "https://flagcdn.com/w40/tm.png" },
  { nameAr: "طاجيكستان", nameEn: "Tajikistan", flag: "https://flagcdn.com/w40/tj.png" },
  { nameAr: "جورجيا", nameEn: "Georgia", flag: "https://flagcdn.com/w40/ge.png" },
  { nameAr: "إريتريا", nameEn: "Eritrea", flag: "https://flagcdn.com/w40/er.png" },
  { nameAr: "رواندا", nameEn: "Rwanda", flag: "https://flagcdn.com/w40/rw.png" },
  { nameAr: "أوغندا", nameEn: "Uganda", flag: "https://flagcdn.com/w40/ug.png" },
  { nameAr: "تنزانيا", nameEn: "Tanzania", flag: "https://flagcdn.com/w40/tz.png" },
  { nameAr: "زيمبابوي", nameEn: "Zimbabwe", flag: "https://flagcdn.com/w40/zw.png" },
  { nameAr: "زامبيا", nameEn: "Zambia", flag: "https://flagcdn.com/w40/zm.png" },
  { nameAr: "موزمبيق", nameEn: "Mozambique", flag: "https://flagcdn.com/w40/mz.png" },
  { nameAr: "مدغشقر", nameEn: "Madagascar", flag: "https://flagcdn.com/w40/mg.png" },
  { nameAr: "الكاميرون", nameEn: "Cameroon", flag: "https://flagcdn.com/w40/cm.png" },
  { nameAr: "السنغال", nameEn: "Senegal", flag: "https://flagcdn.com/w40/sn.png" },
  { nameAr: "ساحل العاج", nameEn: "Ivory Coast", flag: "https://flagcdn.com/w40/ci.png" },
  { nameAr: "فيتنام", nameEn: "Vietnam", flag: "https://flagcdn.com/w40/vn.png" },
  { nameAr: "كمبوديا", nameEn: "Cambodia", flag: "https://flagcdn.com/w40/kh.png" },
  { nameAr: "ميانمار", nameEn: "Myanmar", flag: "https://flagcdn.com/w40/mm.png" },
  { nameAr: "سريلانكا", nameEn: "Sri Lanka", flag: "https://flagcdn.com/w40/lk.png" },
  { nameAr: "نيبال", nameEn: "Nepal", flag: "https://flagcdn.com/w40/np.png" },
  { nameAr: "كولومبيا", nameEn: "Colombia", flag: "https://flagcdn.com/w40/co.png" },
  { nameAr: "بيرو", nameEn: "Peru", flag: "https://flagcdn.com/w40/pe.png" },
  { nameAr: "شيلي", nameEn: "Chile", flag: "https://flagcdn.com/w40/cl.png" },
  { nameAr: "فنزويلا", nameEn: "Venezuela", flag: "https://flagcdn.com/w40/ve.png" },
  { nameAr: "كوبا", nameEn: "Cuba", flag: "https://flagcdn.com/w40/cu.png" },
  { nameAr: "الدومينيكان", nameEn: "Dominican Republic", flag: "https://flagcdn.com/w40/do.png" },
  { nameAr: "بوليفيا", nameEn: "Bolivia", flag: "https://flagcdn.com/w40/bo.png" },
  { nameAr: "باراغواي", nameEn: "Paraguay", flag: "https://flagcdn.com/w40/py.png" },
  { nameAr: "أوروغواي", nameEn: "Uruguay", flag: "https://flagcdn.com/w40/uy.png" },
];

    const countryForPrompt = lang !== 'ar'
      ? (COUNTRIES.find(c => c.nameAr === country || c.nameEn === country)?.nameEn || country)
      : country;

    const weight = parseFloat(userData.current_weight) || 80;
    const height = parseFloat(userData.height) || 170;
    const age = parseInt(userData.age) || 30;
    const gender = userData.gender;
    let bmr = (gender === "ذكر" || gender === "Male") ? (10 * weight + 6.25 * height - 5 * age + 5) : (10 * weight + 6.25 * height - 5 * age - 161);
    let activityMultiplier = 1.2;
    const activity = userData.activity;
    if (activity?.includes("خفيف") || activity?.includes("Light")) activityMultiplier = 1.375;
    else if (activity?.includes("متوسط") || activity?.includes("Moderate")) activityMultiplier = 1.55;
    else if (activity?.includes("عالي") || activity?.includes("Active")) activityMultiplier = 1.725;
    let targetCalories = Math.round(bmr * activityMultiplier - 500);
    if (targetCalories < 1200) targetCalories = 1200;
    if (targetCalories > 2500) targetCalories = 2500;
    let weightToLose = userData.current_weight && userData.target_weight ? Math.max(1, Math.round(userData.current_weight - userData.target_weight)) : 10;
    let weeks = Math.ceil(weightToLose / 0.5);

    const sysPrompt = lang === 'ar'
      ? `أنت أخصائي تغذية. أعد JSON صارم بالهيكل التالي. استخدم المفاتيح الإنجليزية فقط (breakfast, lunch, dinner, snack). كل يوم 4 وجبات مختلفة مع 2-3 بدائل. الروتين الرياضي مفصّل يومياً وليس نصاً عاماً. 5 نصائح مخصصة. جميع النصوص بالعربية.
هيكل JSON:
{
  "human_intro": "رسالة ترحيب",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "الأحد",
      "breakfast": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "lunch": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "..." },
      "dinner": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "..." },
      "snack": { "options": ["خيار 1", "خيار 2"], "macros": "..." }
    },
    ... (7 أيام مختلفة تماماً)
  ],
  "home_workout": "روتين رياضي يومي مفصل (كل يوم له تمارينه)",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3", "نصيحة 4", "نصيحة 5"],
  "specialist_notes": "ملاحظات طبية"
}`
      : `You are a nutritionist. Output strict JSON with ENGLISH keys only. Each day has 4 different meals with 2-3 options. Detailed daily home workout. 5 personalized tips. All text in English.
JSON structure:
{
  "human_intro": "Welcome message",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "Sunday",
      "breakfast": { "options": ["Opt1", "Opt2", "Opt3"], "macros": "Protein: Xg | Carbs: Xg | Fats: Xg" },
      "lunch": { "options": ["Opt1", "Opt2", "Opt3"], "macros": "..." },
      "dinner": { "options": ["Opt1", "Opt2", "Opt3"], "macros": "..." },
      "snack": { "options": ["Opt1", "Opt2"], "macros": "..." }
    },
    ... (7 completely different days)
  ],
  "home_workout": "Detailed daily home workout (different each day)",
  "tips": ["Tip1", "Tip2", "Tip3", "Tip4", "Tip5"],
  "specialist_notes": "Medical notes"
}`;

    const fullUserPrompt = lang === 'ar'
      ? `البيانات: الاسم: ${userData.first_name || ''}، العمر: ${age}، الجنس: ${gender || ''}، الوزن: ${weight}كجم، الطول: ${height}سم، الهدف: ${userData.target_weight || ''}كجم، الأمراض: ${[userData.health_conditions].flat().join(', ')}، الحساسية: ${[userData.allergies].flat().join(', ') || 'لا'}، النشاط: ${activity || ''}، تفضيلات الطعام: ${[userData.food_pref].flat().join(', ') || 'كل شيء'}، البلد: ${countryForPrompt}`
      : `Data: Name: ${userData.first_name || ''}, Age: ${age}, Gender: ${gender || ''}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${userData.target_weight || ''}kg, Health: ${[userData.health_conditions].flat().join(', ')}, Allergies: ${[userData.allergies].flat().join(', ') || 'None'}, Activity: ${activity || ''}, Food Prefs: ${[userData.food_pref].flat().join(', ') || 'Everything'}, Country: ${countryForPrompt}`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 3000,
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
    if (data.error) return res.status(500).json({ error: data.error.message || JSON.stringify(data.error) });

    const raw = data.choices[0].message.content;
    let planJson = extractJSON(raw);
    if (!planJson) return res.status(500).json({ error: 'Failed to parse AI response as JSON', raw: raw.substring(0, 200) });

    // إنشاء تمارين افتراضية إذا لم تكن موجودة
    if (!planJson.home_workout || planJson.home_workout === 'تمارين منزلية يومية' || planJson.home_workout.length < 20) {
      planJson.home_workout = generateWorkout(lang, activity);
    }
    // إنشاء نصائح افتراضية إذا لم تكن موجودة
    if (!planJson.tips || !Array.isArray(planJson.tips) || planJson.tips.length === 0 || planJson.tips[0] === 'اتبع خطتك') {
      planJson.tips = generateTips(lang, userData);
    }

    const standardized = robustStandardizePlan(planJson, userData, lang, targetCalories, weightToLose, weeks);
    res.status(200).json({ plan: JSON.stringify(standardized) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

function generateWorkout(lang, activity) {
  if (lang === 'ar') {
    return `السبت: إحماء 5 دقائق، قفز بالحبل 3 مجموعات × 30 ثانية، ضغط 3×10، قرفصاء 3×15، بلانك 3×30 ثانية، تمدد 5 دقائق.
الأحد: إحماء، طعنات 3×12 لكل رجل، بيربيز 3×10، رفع الساقين 3×20، كارديو خفيف 10 دقائق.
الإثنين: راحة.
الثلاثاء: إحماء، تمارين مقاومة باستخدام زجاجات ماء 3×15، خطف 3×12، مشي في المكان 15 دقيقة.
الأربعاء: إحماء، يوغا أو تمدد عميق 20 دقيقة.
الخميس: إحماء، قفز مع رفع الركبة 3×20، ضغط على الحائط 3×15، تمارين بطن دراجة 3×20، بلانك جانبي 3×20 ثانية.
الجمعة: إحماء، تمارين كارديو (قفز النجم، ركض في المكان) 15 دقيقة، تهدئة 5 دقائق.`;
  } else {
    return `Saturday: Warm up 5min, jump rope 3x30sec, push-ups 3x10, squats 3x15, plank 3x30sec, cool down 5min.
Sunday: Warm up, lunges 3x12 per leg, burpees 3x10, leg raises 3x20, light cardio 10min.
Monday: Rest.
Tuesday: Warm up, resistance exercises with water bottles 3x15, snatch 3x12, march in place 15min.
Wednesday: Warm up, yoga/deep stretch 20min.
Thursday: Warm up, high knee jumps 3x20, wall push-ups 3x15, bicycle crunches 3x20, side plank 3x20sec.
Friday: Warm up, cardio (star jumps, jog in place) 15min, cool down 5min.`;
  }
}

function generateTips(lang, userData) {
  const conditions = userData.health_conditions?.join?.(',') || '';
  if (lang === 'ar') {
    return [
      'تناول 5-6 وجبات صغيرة يومياً بدلاً من 3 وجبات كبيرة.',
      'اشرب كوباً من الماء قبل كل وجبة بـ 10 دقائق.',
      conditions.includes('سكري') ? 'تجنب الفواكه العالية بالسكر مثل العنب والمانجو.' : 'تناول الفواكه الكاملة بدلاً من العصائر.',
      'استخدم طبقاً أصغر للتحكم في كمية الطعام.',
      'قم بالمشي 10 دقائق بعد كل وجبة.',
    ];
  } else {
    return [
      'Eat 5-6 small meals daily instead of 3 large ones.',
      'Drink a glass of water 10 minutes before each meal.',
      conditions.includes('Diabetes') ? 'Avoid high-sugar fruits like grapes and mango.' : 'Eat whole fruits instead of juices.',
      'Use a smaller plate to control portions.',
      'Walk for 10 minutes after each meal.',
    ];
  }
}

function extractJSON(raw) {
  let cleaned = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace === -1 || lastBrace === -1) return null;
  cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
  try { return JSON.parse(cleaned); } catch (e) {
    const opens = [];
    for (const ch of cleaned) {
      if (ch === '{') opens.push('}');
      else if (ch === '[') opens.push(']');
      else if (ch === '}' || ch === ']') opens.pop();
    }
    cleaned += opens.reverse().join('');
    const quoteCount = (cleaned.match(/(?<!\\)"/g) || []).length;
    if (quoteCount % 2 !== 0) cleaned += '"';
    try { return JSON.parse(cleaned); } catch (e2) { return null; }
  }
}

function robustStandardizePlan(plan, userData, lang, targetCalories, weightToLose, weeks) {
  const MEAL_KEY_MAP = {
    'الإفطار': 'breakfast', 'افطار': 'breakfast', 'فطور': 'breakfast',
    'الغداء': 'lunch', 'غداء': 'lunch',
    'العشاء': 'dinner', 'عشاء': 'dinner',
    'وجبة خفيفة': 'snack', 'سناك': 'snack', 'وجبات خفيفة': 'snack',
  };

  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = lang === 'ar' ? daysAr : daysEn;

  let weeklyPlan = [];
  let rawPlan = plan.weekly_plan || [];
  if (Array.isArray(rawPlan)) {
    weeklyPlan = rawPlan.slice(0, 7).map((day, i) => {
      let dayObj = { day: day.day || days[i], breakfast: null, lunch: null, dinner: null, snack: null };
      Object.keys(day).forEach(key => {
        const mapped = MEAL_KEY_MAP[key] || key;
        if (['breakfast', 'lunch', 'dinner', 'snack'].includes(mapped)) {
          let meal = day[key];
          if (!meal) meal = day[mapped];
          if (meal) {
            dayObj[mapped] = {
              options: Array.isArray(meal.options) ? meal.options : (Array.isArray(meal) ? meal : [meal]),
              macros: meal.macros || ''
            };
          }
        }
      });
      ['breakfast', 'lunch', 'dinner', 'snack'].forEach(slot => {
        if (!dayObj[slot] || !dayObj[slot].options || dayObj[slot].options.length === 0) {
          dayObj[slot] = { options: ['وجبة مقترحة'], macros: '' };
        } else {
          dayObj[slot].options = dayObj[slot].options.map(opt => typeof opt === 'string' ? opt : (opt.name || opt.meal || JSON.stringify(opt)));
        }
      });
      return dayObj;
    });
  } else {
    for (let i = 0; i < 7; i++) {
      weeklyPlan.push({
        day: days[i],
        breakfast: { options: ['وجبة مقترحة'], macros: '' },
        lunch: { options: ['وجبة مقترحة'], macros: '' },
        dinner: { options: ['وجبة مقترحة'], macros: '' },
        snack: { options: ['وجبة مقترحة'], macros: '' }
      });
    }
  }

  let homeWorkout = plan.home_workout || '';
  if (!homeWorkout || homeWorkout.length < 20) {
    homeWorkout = generateWorkout(lang, userData.activity);
  }

  let tips = plan.tips || [];
  if (!Array.isArray(tips) || tips.length === 0) {
    tips = generateTips(lang, userData);
  }

  return {
    human_intro: plan.human_intro || (lang === 'ar' ? `مرحباً ${userData.first_name || ''}!` : `Welcome ${userData.first_name || ''}!`),
    target_calories: plan.target_calories || targetCalories,
    daily_macros: plan.daily_macros || { protein: '120g', carbs: '150g', fats: '60g' },
    weight_to_lose: plan.weight_to_lose || weightToLose,
    expected_weeks: plan.expected_weeks || weeks,
    weekly_plan: weeklyPlan,
    home_workout: homeWorkout,
    tips: tips,
    specialist_notes: plan.specialist_notes || ''
  };
}

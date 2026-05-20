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
      { nameAr: "إيران", nameEn: "Iran", flag: "https://flagcdn.com/w40/ir.png" },
      { nameAr: "تركيا", nameEn: "Turkey", flag: "https://flagcdn.com/w40/tr.png" },
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
      ? `أنت أخصائي تغذية. أعد JSON صارم بالهيكل التالي (لا تخرج عن الهيكل). كل يوم يحتوي 4 وجبات مختلفة (فطور، غداء، عشاء، سناك) مع 2-3 بدائل لكل وجبة. الروتين الرياضي مفصل لكل يوم وليس نصًا عامًا.

هيكل JSON المطلوب:
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
    ... (7 أيام مختلفة تمامًا)
  ],
  "home_workout": "روتين رياضي مفصل يوميًا (كل يوم له تمارينه)",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3", "نصيحة 4", "نصيحة 5"],
  "specialist_notes": "ملاحظات طبية"
}
استخدم المكونات المحلية الرخيصة في ${countryForPrompt}. لا تكرر الوجبات عبر الأيام.`
      : `You are a nutritionist. Output strict JSON in the structure below. Each day has 4 different meals (breakfast, lunch, dinner, snack) with 2-3 options each. Detailed daily home workout, not generic.

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
  "home_workout": "Detailed daily workout (each day different exercises)",
  "tips": ["Tip1", "Tip2", "Tip3", "Tip4", "Tip5"],
  "specialist_notes": "Medical notes"
}
Use cheap local ingredients in ${countryForPrompt}. All text in English. No repetition across days.`;

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

    const standardized = standardizePlan(planJson, userData, lang, targetCalories, weightToLose, weeks);
    res.status(200).json({ plan: JSON.stringify(standardized) });
  } catch (error) {
    return res.status(500).json({ error: error.message });
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

function standardizePlan(plan, userData, lang, targetCalories, weightToLose, weeks) {
  const p = plan;
  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = lang === 'ar' ? daysAr : daysEn;

  let weeklyPlan = [];
  if (Array.isArray(p.weekly_plan)) {
    weeklyPlan = p.weekly_plan.slice(0, 7).map((day, i) => ({
      day: day.day || days[i],
      breakfast: { options: extractOptions(day.breakfast), macros: day.breakfast?.macros || '' },
      lunch: { options: extractOptions(day.lunch), macros: day.lunch?.macros || '' },
      dinner: { options: extractOptions(day.dinner), macros: day.dinner?.macros || '' },
      snack: { options: extractOptions(day.snack), macros: day.snack?.macros || '' }
    }));
  }
  while (weeklyPlan.length < 7) {
    weeklyPlan.push({
      day: days[weeklyPlan.length],
      breakfast: { options: ['وجبة مقترحة'], macros: '' },
      lunch: { options: ['وجبة مقترحة'], macros: '' },
      dinner: { options: ['وجبة مقترحة'], macros: '' },
      snack: { options: ['وجبة خفيفة'], macros: '' }
    });
  }

  return {
    human_intro: p.human_intro || (lang === 'ar' ? `مرحباً ${userData.first_name || ''}!` : `Welcome ${userData.first_name || ''}!`),
    target_calories: p.target_calories || targetCalories,
    daily_macros: p.daily_macros || { protein: '120g', carbs: '150g', fats: '60g' },
    weight_to_lose: p.weight_to_lose || weightToLose,
    expected_weeks: p.expected_weeks || weeks,
    weekly_plan: weeklyPlan,
    home_workout: p.home_workout || p.exercise || 'تمارين منزلية يومية',
    tips: Array.isArray(p.tips) ? p.tips : (p.tips ? [p.tips] : ['اتبع خطتك']),
    specialist_notes: p.specialist_notes || ''
  };
}

function extractOptions(meal) {
  if (!meal) return ['وجبة مقترحة'];
  if (typeof meal === 'string') return [meal];
  if (Array.isArray(meal)) return meal.map(item => typeof item === 'string' ? item : (item.meal || item.name || Object.values(item).join(' / ')));
  if (meal.options) return Array.isArray(meal.options) ? meal.options : [meal.options];
  return Object.values(meal).map(v => typeof v === 'string' ? v : JSON.stringify(v));
}

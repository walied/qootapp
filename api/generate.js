export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { userData, lang } = req.body;
    if (!userData) return res.status(400).json({ error: 'Missing userData' });

    const country = userData.country || 'الدولة';
    const COUNTRIES = [
      { nameAr: "مصر", nameEn: "Egypt", flag: "https://flagcdn.com/w40/eg.png" },
      { nameAr: "الكويت", nameEn: "Kuwait", flag: "https://flagcdn.com/w40/kw.png" },
      // ... (أضف جميع الدول هنا) ...
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
      ? `أنت أخصائي تغذية. أعد JSON صارم بالهيكل التالي. استخدم المفاتيح الإنجليزية فقط (مثل "breakfast", "lunch", "dinner", "snack", "options", "macros", "day"). كل يوم يحتوي 4 وجبات مختلفة مع 2-3 بدائل لكل وجبة. الروتين الرياضي مفصّل يومياً وليس نصاً عاماً. النصائح 5 نصائح مخصصة. جميع النصوص بالعربية.

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
  "home_workout": "روتين رياضي يومي مفصل (كل يوم تمارينه)",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3", "نصيحة 4", "نصيحة 5"],
  "specialist_notes": "ملاحظات طبية"
}
استخدم المكونات المحلية الرخيصة في ${countryForPrompt}. لا تكرر الوجبات عبر الأيام.`
      : `You are a nutritionist. Output strict JSON with ENGLISH keys only. Each day has 4 different meals (breakfast, lunch, dinner, snack) with 2-3 options each. Detailed daily home workout. 5 personalized tips. All text in English.

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
}
Use cheap local ingredients in ${countryForPrompt}. No repetition across days.`;

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

    const standardized = robustStandardizePlan(planJson, userData, lang, targetCalories, weightToLose, weeks);
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

function robustStandardizePlan(plan, userData, lang, targetCalories, weightToLose, weeks) {
  // مفتاح عربي -> إنجليزي للوجبات
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

  // إذا كان rawPlan مصفوفة
  if (Array.isArray(rawPlan)) {
    weeklyPlan = rawPlan.slice(0, 7).map((day, i) => {
      let dayObj = { day: day.day || days[i], breakfast: null, lunch: null, dinner: null, snack: null };
      // نقل أي مفتاح عربي إلى الإنجليزي
      Object.keys(day).forEach(key => {
        const mapped = MEAL_KEY_MAP[key] || key;
        if (['breakfast', 'lunch', 'dinner', 'snack'].includes(mapped)) {
          let meal = day[key];
          if (!meal) meal = day[mapped]; // fallback
          if (meal) {
            dayObj[mapped] = {
              options: Array.isArray(meal.options) ? meal.options : (Array.isArray(meal) ? meal : [meal]),
              macros: meal.macros || ''
            };
          }
        }
      });
      // ضمان 4 وجبات
      ['breakfast', 'lunch', 'dinner', 'snack'].forEach(slot => {
        if (!dayObj[slot] || !dayObj[slot].options || dayObj[slot].options.length === 0) {
          dayObj[slot] = { options: ['وجبة مقترحة'], macros: '' };
        } else {
          // تحويل الخيارات إلى نصوص
          dayObj[slot].options = dayObj[slot].options.map(opt => typeof opt === 'string' ? opt : (opt.name || opt.meal || JSON.stringify(opt)));
        }
      });
      return dayObj;
    });
  } else {
    // لا يوجد weekly_plan – إنشاء فارغ
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

  // استخراج التمارين والنصائح
  let homeWorkout = 'تمارين منزلية يومية';
  if (typeof plan.home_workout === 'string') homeWorkout = plan.home_workout;
  else if (plan.home_exercise_plan || plan['تمارين_رياضية_منزلية'] || plan['رياضة_منزلية'] || plan.exercise) {
    let src = plan.home_exercise_plan || plan['تمارين_رياضية_منزلية'] || plan['رياضة_منزلية'] || plan.exercise;
    if (typeof src === 'string') homeWorkout = src;
    else if (typeof src === 'object') homeWorkout = JSON.stringify(src);
  }

  let tips = plan.tips || plan['نصائح_عامة'] || plan['نصائح_إضافية'] || plan.additional_advice || [];
  if (!Array.isArray(tips)) tips = [tips];
  if (tips.length === 0) tips = ['اتبع خطتك'];

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

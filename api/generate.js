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

    // Calculate estimated calories based on user data
    const weight = parseFloat(userData.current_weight) || 80;
    const height = parseFloat(userData.height) || 170;
    const age = parseInt(userData.age) || 30;
    const gender = userData.gender;
    
    let bmr;
    if (gender === "ذكر" || gender === "Male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    let activityMultiplier = 1.2;
    const activity = userData.activity;
    if (activity?.includes("خفيف") || activity?.includes("Light")) activityMultiplier = 1.375;
    else if (activity?.includes("متوسط") || activity?.includes("Moderate")) activityMultiplier = 1.55;
    else if (activity?.includes("عالي") || activity?.includes("Active")) activityMultiplier = 1.725;
    
    let tdee = Math.round(bmr * activityMultiplier);
    let targetCalories = tdee - 500;
    if (targetCalories < 1200) targetCalories = 1200;
    if (targetCalories > 2500) targetCalories = 2500;
    
    let weightToLose = 10;
    if (userData.current_weight && userData.target_weight) {
      weightToLose = Math.max(1, Math.round(userData.current_weight - userData.target_weight));
    }
    
    let weeks = Math.ceil(weightToLose / 0.5);

    const sysPrompt = lang === 'ar'
      ? `أنت أخصائي تغذية محترف. مهمتك الوحيدة هي الرد بـ JSON صحيح فقط بالهيكل المطلوب. لا تكتب أي شيء خارج JSON.

معلومات العميل:
- العمر: ${age} | الجنس: ${gender || 'غير محدد'} | الوزن: ${weight} كجم | الطول: ${height} سم
- الوزن المستهدف: ${userData.target_weight || 'غير محدد'} كجم
- السعرات المحسوبة: ${targetCalories} سعرة يومياً
- الوزن المطلوب فقده: ${weightToLose} كجم | المدة المتوقعة: ${weeks} أسبوع
- البلد: ${countryForPrompt}
- النشاط: ${activity || 'غير محدد'}
- الحالات الصحية: ${[userData.health_conditions].flat().join(', ')}
- الحساسية: ${[userData.allergies].flat().join(', ') || 'لا يوجد'}
- تفضيلات الطعام: ${[userData.food_pref].flat().join(', ') || 'كل شيء'}

المطلوب JSON بالهيكل التالي بالضبط:

{
  "human_intro": "رسالة ترحيبية دافئة ومخصصة للعميل",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "الأحد",
      "breakfast": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "lunch": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "dinner": { "options": ["خيار 1", "خيار 2", "خيار 3"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "snack": { "options": ["خيار 1", "خيار 2"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" }
    },
    ... (7 أيام - كل يوم مختلف تماماً)
  ],
  "home_workout": "روتين رياضي منزلي مفصل لكل يوم - تمارين مختلفة يومياً مع عدد المجموعات والتكرارات",
  "tips": ["نصيحة 1 مخصصة", "نصيحة 2 مخصصة", "نصيحة 3 مخصصة", "نصيحة 4 مخصصة", "نصيحة 5 مخصصة"],
  "specialist_notes": "ملاحظات طبية مهمة بناءً على الحالة الصحية للعميل"
}

قواعد صارمة:
1. كل يوم يجب أن يكون مختلفاً تماماً عن الأيام الأخرى في جميع الوجبات.
2. استخدم أرخص المكونات المحلية المتوفرة في ${countryForPrompt}.
3. كل وجبة تحتوي على 2-3 بدائل مختلفة.
4. احسب الماكروز (بروتين، كارب، دهون) لكل وجبة.
5. الروتين الرياضي منزلي بالكامل ومختلف كل يوم.
6. راعِ الحالات الصحية والحساسية المذكورة.`
      : `You are a professional nutritionist. Your ONLY task is to output valid JSON in the exact structure below. No other text.

Client Info:
- Age: ${age} | Gender: ${gender || 'Not specified'} | Weight: ${weight} kg | Height: ${height} cm
- Target Weight: ${userData.target_weight || 'Not specified'} kg
- Calculated Calories: ${targetCalories} cal/day
- Weight to Lose: ${weightToLose} kg | Expected Duration: ${weeks} weeks
- Country: ${countryForPrompt}
- Activity: ${activity || 'Not specified'}
- Health Conditions: ${[userData.health_conditions].flat().join(', ')}
- Allergies: ${[userData.allergies].flat().join(', ') || 'None'}
- Food Preferences: ${[userData.food_pref].flat().join(', ') || 'Everything'}

Required JSON structure exactly:

{
  "human_intro": "A warm, personalized welcome message for the client",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "Sunday",
      "breakfast": { "options": ["Option 1", "Option 2", "Option 3"], "macros": "Protein: Xg | Carbs: Xg | Fats: Xg" },
      "lunch": { "options": ["Option 1", "Option 2", "Option 3"], "macros": "Protein: Xg | Carbs: Xg | Fats: Xg" },
      "dinner": { "options": ["Option 1", "Option 2", "Option 3"], "macros": "Protein: Xg | Carbs: Xg | Fats: Xg" },
      "snack": { "options": ["Option 1", "Option 2"], "macros": "Protein: Xg | Carbs: Xg | Fats: Xg" }
    },
    ... (7 days - each day completely different)
  ],
  "home_workout": "Detailed daily home workout routine - different exercises each day with sets and reps",
  "tips": ["Personalized tip 1", "Personalized tip 2", "Personalized tip 3", "Personalized tip 4", "Personalized tip 5"],
  "specialist_notes": "Important medical notes based on client's health conditions"
}

STRICT RULES:
1. IMPORTANT: All text MUST be in English, even if user data contains Arabic.
2. Each day must be COMPLETELY different from other days in all meals.
3. Use the cheapest, most available local ingredients in ${countryForPrompt}.
4. Each meal must have 2-3 different alternatives.
5. Calculate macros (protein, carbs, fats) for every meal.
6. Home workout only - different each day.
7. Respect all health conditions and allergies mentioned.`;

    const fullUserPrompt = lang === 'ar'
      ? `بيانات العميل الكاملة:\nالاسم: ${userData.first_name || ''}\nالعمر: ${age}\nالجنس: ${gender || ''}\nالطول: ${height} سم\nالوزن: ${weight} كجم\nالهدف: ${userData.target_weight || ''} كجم\nالأمراض: ${[userData.health_conditions].flat().join(', ')}\nالأدوية: ${userData.health_notes || 'لا يوجد'}\nالحساسية: ${[userData.allergies].flat().join(', ') || 'لا يوجد'}\nالنشاط: ${activity || ''}\nتفضيلات الطعام: ${[userData.food_pref].flat().join(', ') || 'كل شيء'}\nالبلد: ${countryForPrompt}`
      : `Full client data:\nName: ${userData.first_name || ''}\nAge: ${age}\nGender: ${gender || ''}\nHeight: ${height} cm\nWeight: ${weight} kg\nGoal: ${userData.target_weight || ''} kg\nHealth: ${[userData.health_conditions].flat().join(', ')}\nMeds: ${userData.health_notes || 'None'}\nAllergies: ${[userData.allergies].flat().join(', ') || 'None'}\nActivity: ${activity || ''}\nFood Prefs: ${[userData.food_pref].flat().join(', ') || 'Everything'}\nCountry: ${countryForPrompt}`;

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
    
    if (data.error) {
      return res.status(500).json({ error: data.error.message || JSON.stringify(data.error) });
    }

    const raw = data.choices[0].message.content;
    let planJson = extractJSON(raw);
    
    if (!planJson) {
      return res.status(500).json({ error: 'Failed to parse AI response as JSON', raw: raw.substring(0, 200) });
    }

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

function standardizePlan(plan, userData, lang, targetCalories, weightToLose, weeks) {
  if (plan.human_intro && plan.weekly_plan) {
    return {
      ...plan,
      target_calories: plan.target_calories || targetCalories,
      weight_to_lose: plan.weight_to_lose || weightToLose,
      expected_weeks: plan.expected_weeks || weeks,
    };
  }
  
  const p = plan;

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

  const weeklyPlan = [];
  for (let i = 0; i < 7; i++) {
    const breakfast = getOptions(mealSource.breakfast || mealSource.الإفطار);
    const lunch = getOptions(mealSource.lunch || mealSource.الغداء);
    const dinner = getOptions(mealSource.dinner || mealSource.العشاء);
    const snack = getOptions(mealSource.snacks || mealSource.snack || mealSource["وجبة خفيفة"] || mealSource["وجبات خفيفة"] || []);
    
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

  let dailyMacros = p.daily_macros || p.macros || { protein: '120g', carbs: '150g', fats: '60g' };

  return {
    human_intro: humanIntro,
    target_calories: p.target_calories || targetCalories,
    daily_macros: dailyMacros,
    weight_to_lose: p.weight_to_lose || weightToLose,
    expected_weeks: p.expected_weeks || weeks,
    weekly_plan: weeklyPlan,
    home_workout: homeWorkout,
    tips: tips,
    specialist_notes: specialistNotes
  };
}

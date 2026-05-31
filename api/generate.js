// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { userData, lang } = req.body;
    if (!userData) return res.status(400).json({ error: 'Missing userData' });

    const country = userData.country || 'الدولة';
    const whatsappLink = "https://wa.me/96598002104";

    // حساب المعايير الصحية الأساسية
    const weight = parseFloat(userData.current_weight) || 80;
    const height = parseFloat(userData.height) || 170;
    const age = parseInt(userData.age) || 30;
    const gender = userData.gender;
    let bmr = (gender === "ذكر" || gender === "Male") 
      ? (10 * weight + 6.25 * height - 5 * age + 5) 
      : (10 * weight + 6.25 * height - 5 * age - 161);
    let activityMultiplier = 1.2;
    const activity = userData.activity;
    if (activity?.includes("خفيف") || activity?.includes("Light")) activityMultiplier = 1.375;
    else if (activity?.includes("متوسط") || activity?.includes("Moderate")) activityMultiplier = 1.55;
    else if (activity?.includes("عالي") || activity?.includes("Active")) activityMultiplier = 1.725;
    let targetCalories = Math.round(bmr * activityMultiplier - 500);
    if (targetCalories < 1200) targetCalories = 1200;
    if (targetCalories > 2500) targetCalories = 2500;
    let weightToLose = userData.current_weight && userData.target_weight 
      ? Math.max(1, Math.round(userData.current_weight - userData.target_weight)) 
      : 10;
    let weeks = Math.ceil(weightToLose / 0.5);

    // بيانات إضافية من الأسئلة الجديدة
    const diet_type = userData.diet_type || 'لا شيء';
    const allergies = userData.allergies || 'لا شيء';
    const medications = userData.medications || 'لا شيء';
    const eating_out = userData.eating_out || '0-1';

    // الرسالة الترحيبية الطويلة
    const exactWelcomeAr = `✦ خطتك أصبحت جاهزة ✦

مرحباً ${userData.first_name || ''}،
بعد مراجعة جميع بياناتك بدقة — العمر، الوزن، الطول، مستوى النشاط، الحالة الصحية، العادات الغذائية، وتوفر المنتجات المحلية في بلدك — قمنا بإعداد خطة مخصصة لك بالكامل بهدف خسارة ${weightToLose} كجم خلال ${weeks} أسابيع بإذن الله.

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
${whatsappLink}`;

    const exactWelcomeEn = `✦ Your plan is ready ✦

Hello ${userData.first_name || ''},
After carefully reviewing all your data — age, weight, height, activity level, health status, eating habits, and availability of local products in your country — we have prepared a fully personalized plan with the goal of losing ${weightToLose} kg in ${weeks} weeks, God willing.

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
${whatsappLink}`;

    // SYSTEM PROMPT (Arabic) – مع تعليمات صارمة للخيارات الثلاثة
    const sysPromptAr = `أنت أخصائي تغذية. أعد JSON بالهيكل التالي بدقة. استخدم المفاتيح الإنجليزية فقط. كل يوم يحتوي على 4 وجبات (breakfast, lunch, dinner, snack). لكل وجبة، اكتب 3 خيارات مختلفة تماماً. كل خيار يجب أن يحتوي على أوزان دقيقة بالجرام (مثال: "150g دجاج، 200g أرز عادي، 100g سلطة"). افصل بين الخيارات بكلمة "أو" في سطر منفصل. مثال صحيح:
      "options": [
        "خيار 1: 150g دجاج مشوي + 200g أرز عادي + 100g سلطة",
        "أو",
        "خيار 2: 200g سمك مشوي + 150g خضار مسلوقة",
        "أو",
        "خيار 3: 250g شوربة عدس + 50g خبز أسمر"
      ]
أضف حقل "macros" يحتوي على البروتين والكربوهيدرات والدهون بالجرام. أضف لكل يوم "workout" (تمرين منزلي مفصل) و "exercise_time" (بعد الفطار، بعد الغداء، بعد العشاء، أو في أي وقت).

🚨 القواعد الإلزامية:
- جميع المكونات يجب أن تكون أرخص وأكثر المكونات توفراً في بلد المستخدم (${country}). استخدم "أرز عادي" بدلاً من "أرز مصري" أو "بسمتي" إلا إذا كان البلد يستهلك البسمتي عادة.
- يمنع استخدام مكونات مستوردة أو غالية (كينوا، بذور شيا، أفوكادو، لوز، إلخ).
- كل وصفة يجب أن تحتوي على وزن تقريبي بالجرام.
- النصائح (tips) 5 نصائح، أولها "🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين."
- خذ في الاعتبار البيانات الإضافية: النظام الغذائي المفضل للمستخدم (${diet_type})، الحساسيات (${allergies})، الأدوية (${medications})، وتكرار الأكل خارج المنزل (${eating_out}).

استخدم هذه الرسالة الترحيبية بالضبط في حقل "human_intro" (بدون أي تغيير):
${exactWelcomeAr}

هيكل JSON المطلوب:
{
  "human_intro": "الرسالة أعلاه",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "120g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "الأحد",
      "breakfast": { "options": ["خيار 1: ...", "أو", "خيار 2: ...", "أو", "خيار 3: ..."], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "lunch": { "options": ["خيار 1: ...", "أو", "خيار 2: ...", "أو", "خيار 3: ..."], "macros": "..." },
      "dinner": { "options": ["خيار 1: ...", "أو", "خيار 2: ...", "أو", "خيار 3: ..."], "macros": "..." },
      "snack": { "options": ["خيار 1: ...", "أو", "خيار 2: ..."], "macros": "..." },
      "workout": "شرح مفصل للتمرين المنزلي لهذا اليوم مع المدة والتكرارات",
      "exercise_time": "بعد الفطار"
    },
    ... (7 أيام مختلفة تماماً)
  ],
  "tips": ["🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين.", "...", "...", "...", "..."],
  "specialist_notes": ""
}`;

    // SYSTEM PROMPT (English) – similar strict rules
    const sysPromptEn = `You are a nutritionist. Output strict JSON with the structure below. Use English keys only. Each day has 4 meals (breakfast, lunch, dinner, snack). For each meal, provide exactly 3 distinct options. Each option must include detailed ingredients with grams (e.g., "150g chicken, 200g local rice, 100g salad"). Separate options with "or" on a new line. Example:
      "options": [
        "Option 1: 150g grilled chicken + 200g local rice + 100g salad",
        "or",
        "Option 2: 200g grilled fish + 150g boiled vegetables",
        "or",
        "Option 3: 250g lentil soup + 50g brown bread"
      ]
Add a "macros" field with protein, carbs, fats in grams. Add a "workout" (detailed home exercise) and "exercise_time" (after breakfast, after lunch, after dinner, or anytime).

Mandatory rules:
- All ingredients must be the cheapest and most available in the user's country (${country}). Use "local rice" not specific origin names.
- No imported/expensive items (quinoa, chia seeds, avocado, almonds, etc.).
- Each recipe must include approximate weights in grams.
- Tips (5 tips), first tip: "🍽️ Eat 4 small meals daily instead of 2 large ones."
- Consider the additional data: preferred diet (${diet_type}), allergies (${allergies}), medications (${medications}), eating out frequency (${eating_out}).

Use this exact welcome message in the "human_intro" field:
${exactWelcomeEn}

JSON structure as above.`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 4000,
        messages: [
          { role: 'system', content: lang === 'ar' ? sysPromptAr : sysPromptEn },
          { role: 'user', content: lang === 'ar' ? `البيانات: ${JSON.stringify(userData)}. البلد: ${country}.` : `Data: ${JSON.stringify(userData)}. Country: ${country}.` }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} - ${errText}`);
    }
    const data = await response.json();
    let planJson = extractJSON(data.choices[0].message.content);
    if (!planJson) planJson = generateFallbackPlan(lang, userData, targetCalories, weightToLose, weeks, whatsappLink, exactWelcomeAr, exactWelcomeEn);

    // Ensure weekly plan has workout and exercise_time
    if (planJson.weekly_plan) {
      planJson.weekly_plan = planJson.weekly_plan.map((day, idx) => {
        if (!day.workout) day.workout = generateWorkout(lang, idx);
        if (!day.exercise_time) day.exercise_time = (idx % 2 === 0) ? 'بعد الفطار' : 'بعد العشاء';
        return day;
      });
    }

    res.status(200).json({ plan: JSON.stringify(planJson) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

// Helper functions (unchanged but complete)
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

function generateFallbackPlan(lang, userData, targetCalories, weightToLose, weeks, whatsappLink, exactWelcomeAr, exactWelcomeEn) {
  const days = lang === 'ar' ? ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'] : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const weeklyPlan = days.map((day, i) => ({
    day: day,
    breakfast: { 
      options: [
        "خيار 1: 2 بيضة مسلوقة (100g) + خبز أسمر (50g) + خيار (50g)",
        "أو",
        "خيار 2: 40g شوفان + 200ml حليب + موزة (100g)",
        "أو",
        "خيار 3: 150g فول مدمس + 50g خبز بلدي + 50g طماطم"
      ], 
      macros: 'بروتين: 20g | كارب: 35g | دهون: 12g' 
    },
    lunch: { 
      options: [
        "خيار 1: 150g دجاج مشوي + 200g أرز عادي + 100g سلطة",
        "أو",
        "خيار 2: 200g سمك مشوي + 150g خضار مسلوقة",
        "أو",
        "خيار 3: 100g عدس + 150g أرز + 100g خيار/طماطم"
      ], 
      macros: 'بروتين: 30g | كارب: 50g | دهون: 15g' 
    },
    dinner: { 
      options: [
        "خيار 1: 200g زبادي + 100g خيار + 50g خبز أسمر",
        "أو",
        "خيار 2: 150g جبنة قريش + 100g طماطم + 50g خس",
        "أو",
        "خيار 3: 250ml شوربة عدس + 50g خبز بلدي"
      ], 
      macros: 'بروتين: 20g | كارب: 20g | دهون: 8g' 
    },
    snack: { 
      options: [
        "خيار 1: تفاحة (150g)",
        "أو",
        "خيار 2: موزة (120g)",
        "أو",
        "خيار 3: 30g فول سوداني غير مملح"
      ], 
      macros: 'بروتين: 5g | كارب: 20g | دهون: 5g' 
    },
    workout: generateWorkout(lang, i),
    exercise_time: i % 2 === 0 ? 'بعد الفطار' : 'بعد العشاء'
  }));
  const tips = generateTips(lang, userData);
  return {
    human_intro: lang === 'ar' ? exactWelcomeAr : exactWelcomeEn,
    target_calories: targetCalories,
    daily_macros: { protein: '120g', carbs: '150g', fats: '50g' },
    weight_to_lose: weightToLose,
    expected_weeks: weeks,
    weekly_plan: weeklyPlan,
    tips: tips,
    specialist_notes: ''
  };
}

function generateWorkout(lang, dayIndex) {
  const workoutsAr = [
    'تمرين خفيف: مشي سريع 20 دقيقة + تمارين إطالة (بعد الفطار)',
    'تمارين منزلية: ضغط (3×10)، قرفصاء (3×15)، بلانك (3×30 ثانية) (بعد العشاء)',
    'كارديو: قفز بالحبل 15 دقيقة + تمارين بطن (بعد الفطار)',
    'يوغا أو تمدد عميق 20 دقيقة (في أي وقت)',
    'تمارين مقاومة باستخدام زجاجات ماء (3×15)، رفع ساقين (3×20) (بعد الغداء)',
    'تمارين كارديو منزلية: قفز النجم، ركض في المكان (15 دقيقة) (بعد الفطار)',
    'تمارين شاملة: ضغط، قرفصاء، بلانك، كارديو خفيف (20 دقيقة) (بعد العشاء)'
  ];
  const workoutsEn = [
    'Light exercise: 20 min brisk walk + stretching (after breakfast)',
    'Home workout: push-ups 3x10, squats 3x15, plank 30s (after dinner)',
    'Cardio: 15 min jump rope + abs (after breakfast)',
    'Yoga/deep stretch 20 min (anytime)',
    'Resistance with water bottles 3x15, leg raises 3x20 (after lunch)',
    'Home cardio: star jumps, jog in place 15 min (after breakfast)',
    'Full workout: push-ups, squats, plank, light cardio 20 min (after dinner)'
  ];
  const idx = dayIndex % workoutsAr.length;
  return lang === 'ar' ? workoutsAr[idx] : workoutsEn[idx];
}

function generateTips(lang, userData) {
  const conditions = userData.health_conditions?.join?.(',') || '';
  if (lang === 'ar') {
    return [
      '🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين.',
      '💧 اشرب كوباً من الماء قبل كل وجبة بـ 10 دقائق.',
      conditions.includes('سكري') ? '🥗 تجنب الفواكه عالية السكر واستبدلها بالخيار أو الخس.' : '🍎 تناول الفواكه الكاملة بدلاً من العصائر.',
      '🍽️ استخدم طبقاً أصغر للتحكم في كمية الطعام.',
      '🚶 قم بالمشي 10 دقائق بعد كل وجبة.'
    ];
  } else {
    return [
      '🍽️ Eat 4 small meals daily instead of 2 large ones.',
      '💧 Drink a glass of water 10 minutes before each meal.',
      conditions.includes('Diabetes') ? '🥗 Avoid high-sugar fruits; replace with cucumber or lettuce.' : '🍎 Eat whole fruits instead of juices.',
      '🍽️ Use a smaller plate to control portions.',
      '🚶 Walk 10 minutes after each meal.'
    ];
  }
}

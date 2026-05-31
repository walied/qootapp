// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { userData, lang } = req.body;
    if (!userData) return res.status(400).json({ error: 'Missing userData' });

    const country = userData.country || 'الدولة';
    const whatsappLink = "https://wa.me/96598002104";

    // حساب المعايير الصحية
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

    // بيانات إضافية اختيارية (لنستخدمها لاحقاً)
    const sleep = userData.sleep_hours || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const smoking = userData.smoking || (lang === 'ar' ? 'لا' : 'No');
    const stress = userData.stress_level || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const cookingTime = userData.cooking_time || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const previousSurgeries = userData.previous_surgeries || (lang === 'ar' ? 'لا توجد' : 'None');

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

    // SYSTEM PROMPT (عربي) – معدل ليكون عاماً ولا يذكر "أرز مصري"
    const sysPromptAr = `أنت أخصائي تغذية. أعد JSON بالهيكل التالي بدقة. استخدم المفاتيح الإنجليزية فقط. كل يوم يحتوي على 4 وجبات (breakfast, lunch, dinner, snack)، كل وجبة تقدم 2-3 خيارات بديلة. لكل خيار، اكتب المكونات التفصيلية مع الأوزان بالجرام. أضف حقلاً "macros" يحتوي على البروتين والكربوهيدرات والدهون بالجرام. أضف لكل يوم "workout" (تمرين منزلي مفصل) و"exercise_time" (يحدد الوقت الأفضل بناءً على بيانات المستخدم: "بعد الفطار" أو "بعد الغداء" أو "بعد العشاء" أو "في أي وقت").

🚨 القواعد الإلزامية:
- جميع المكونات يجب أن تكون أرخص وأكثر المكونات توفراً في بلد المستخدم (${country}). 
- يمنع استخدام مكونات مستوردة أو غالية (كينوا، بذور شيا، أفوكادو، لوز، أرز بسمتي إلا إذا كان رخيصاً محلياً). استخدم بدائل محلية مثل الأرز العادي، الخبز المحلي، الدجاج، البيض، الخضروات الموسمية.
- كل وصفة يجب أن تحتوي على وزن تقريبي بالجرام.
- النصائح (tips) 5 نصائح، أولها "🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين."

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
      "breakfast": { "options": ["وصفة1 مع أوزان", "وصفة2 مع أوزان", "وصفة3 مع أوزان"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "lunch": { "options": ["وصفة1 مع أوزان", "وصفة2 مع أوزان", "وصفة3 مع أوزان"], "macros": "..." },
      "dinner": { "options": ["وصفة1 مع أوزان", "وصفة2 مع أوزان", "وصفة3 مع أوزان"], "macros": "..." },
      "snack": { "options": ["وصفة1 مع أوزان", "وصفة2 مع أوزان"], "macros": "..." },
      "workout": "شرح مفصل للتمرين المنزلي لهذا اليوم مع المدة والتكرارات",
      "exercise_time": "بعد الفطار"
    },
    ... (7 أيام مختلفة تماماً)
  ],
  "tips": ["🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين.", "...", "...", "...", "..."],
  "specialist_notes": ""
}`;

    // SYSTEM PROMPT (English) – similarly general
    const sysPromptEn = `You are a nutritionist. Output strict JSON with the structure below. Use English keys only. Each day has 4 meals (breakfast, lunch, dinner, snack) with 2-3 options each. For each option, include detailed ingredients with grams. Add a "macros" field with protein, carbs, fats in grams. Add a "workout" (detailed home exercise) and "exercise_time" (best time based on user data: "after breakfast", "after lunch", "after dinner", "anytime").

Mandatory rules:
- All ingredients must be the cheapest and most available in the user's country (${country}).
- No imported/expensive items (quinoa, chia seeds, avocado, almonds, basmati rice unless locally cheap). Use local alternatives: regular rice, local bread, chicken, eggs, seasonal vegetables.
- Each recipe must include approximate weights in grams.
- Tips (5 tips), first tip: "🍽️ Eat 4 small meals daily instead of 2 large ones."

Use this exact welcome message in the "human_intro" field:
${exactWelcomeEn}

JSON structure as above (similar to Arabic).`;

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

    if (!response.ok) throw new Error(`DeepSeek API error: ${response.status}`);
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

// Helper functions (simplified but complete)
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
    breakfast: { options: ['بيض مسلوق (2 بيضة) + خبز أسمر (50g) + خيار (50g)', 'شوفان (40g) مع حليب (200ml) وموزة (100g)'], macros: 'بروتين: 20g | كارب: 35g | دهون: 12g' },
    lunch: { options: ['دجاج مشوي (150g) + أرز عادي مطبوخ (200g) + سلطة خضراء (100g)', 'عدس (100g) + أرز (150g) + خضار مسلوقة (100g)'], macros: 'بروتين: 30g | كارب: 50g | دهون: 15g' },
    dinner: { options: ['زبادي (200g) + خيار (100g) + خبز أسمر (50g)', 'جبنة قريش (150g) + طماطم (100g)'], macros: 'بروتين: 20g | كارب: 20g | دهون: 8g' },
    snack: { options: ['تفاحة (150g)', 'موزة (120g)', 'حفنة فول سوداني (30g)'], macros: 'بروتين: 5g | كارب: 20g | دهون: 5g' },
    workout: generateWorkout(lang, i),
    exercise_time: i % 2 === 0 ? 'بعد الفطار' : 'بعد العشاء'
  }));
  return {
    human_intro: lang === 'ar' ? exactWelcomeAr : exactWelcomeEn,
    target_calories: targetCalories,
    daily_macros: { protein: '120g', carbs: '150g', fats: '50g' },
    weight_to_lose: weightToLose,
    expected_weeks: weeks,
    weekly_plan: weeklyPlan,
    tips: generateTips(lang, userData),
    specialist_notes: ''
  };
}

function generateWorkout(lang, dayIndex) {
  const workoutsAr = [
    'تمرين خفيف: مشي سريع 20 دقيقة + تمارين إطالة',
    'تمارين منزلية: ضغط (3×10)، قرفصاء (3×15)، بلانك (3×30 ثانية)',
    'كارديو: قفز بالحبل 15 دقيقة + تمارين بطن',
    'يوغا أو تمدد عميق 20 دقيقة',
    'تمارين مقاومة باستخدام زجاجات ماء (3×15)، رفع ساقين (3×20)',
    'تمارين كارديو منزلية: قفز النجم، ركض في المكان (15 دقيقة)',
    'تمارين شاملة: ضغط، قرفصاء، بلانك، كارديو خفيف (20 دقيقة)'
  ];
  const workoutsEn = [
    'Light exercise: 20 min brisk walk + stretching',
    'Home workout: push-ups 3x10, squats 3x15, plank 30s',
    'Cardio: 15 min jump rope + abs',
    'Yoga/deep stretch 20 min',
    'Resistance with water bottles 3x15, leg raises 3x20',
    'Home cardio: star jumps, jog in place 15 min',
    'Full workout: push-ups, squats, plank, light cardio 20 min'
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

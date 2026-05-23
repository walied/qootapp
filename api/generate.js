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

    // معطيات إضافية اختيارية
    const sleep = userData.sleep_hours || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const smoking = userData.smoking || (lang === 'ar' ? 'لا' : 'No');
    const stress = userData.stress_level || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const cookingTime = userData.cooking_time || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const previousSurgeries = userData.previous_surgeries || (lang === 'ar' ? 'لا توجد' : 'None');

    // بناء التعليمات للرسالة الترحيبية
    const welcomeInstructionAr = `
**تعليمات حقل "human_intro" (الرسالة الترحيبية الطويلة):**
- ابدأ بـ "مرحباً ${userData.first_name || ''}"
- قل: "بعد تحليل دقيق لكل بياناتك (عمرك، وزنك، طولك، حالتك الصحية، نشاطك، تفضيلاتك، وبلدك ${country})، قمنا بتصميم هذه الخطة خصيصاً من أجلك."
- اذكر أن الهدف هو خسارة ${weightToLose} كجم خلال ${weeks} أسبوع بمشيئة الله.
- أكد أن جميع الوجبات تعتمد فقط على أرخص وأكثر المكونات توفراً في بلده (${country})، ولا تحتوي أي مكون مستورد أو غالٍ.
- ذكّره بأن المتخصص سيتابع معه شخصياً كل أسبوع، وسيطلب منه تحديث وزنه أسبوعياً حتى نعدل الخطة حسب تقدمه.
- أضف جملة تحفيزية: "أنت قادر على تحقيق هدفنا معاً، خطوة بخطوة. ثق بنفسك."
- أضف عبارة "نحن هنا من أجلك" ثم اكتب رابط واتساب: ${whatsappLink}
- اجعل النص طويلاً (150-200 كلمة)، دافئاً، واضحاً، ومشجعاً.
`;

    const welcomeInstructionEn = `
**Instructions for "human_intro" field (long welcome message):**
- Start with "Hello ${userData.first_name || ''}"
- Say: "After carefully analyzing all your data (age, weight, height, health, activity, preferences, and your country ${country}), we have designed this plan specifically for you."
- Mention that the goal is to lose ${weightToLose} kg in ${weeks} weeks, God willing.
- Assure that all meals use only the cheapest, most available ingredients in his/her country (${country}), with no imported or expensive items.
- Remind that a specialist will follow up personally every week and will ask for a weight update to adjust the plan accordingly.
- Add a motivational phrase: "You are capable of achieving our goal together, step by step. Trust yourself."
- Add the phrase "We are here for you" and then a direct WhatsApp support link: ${whatsappLink}
- Length around 150-200 words, warm and encouraging.
`;

    // SYSTEM PROMPT (Arabic) with new fields
    const sysPromptAr = `أنت أخصائي تغذية ذكي جداً. أعد JSON صارم بالهيكل التالي. استخدم المفاتيح الإنجليزية فقط (breakfast, lunch, dinner, snack, workout, exercise_time). كل يوم 4 وجبات مختلفة مع 2-3 بدائل. الروتين الرياضي (workout) يجب أن يكون مفصلاً ويناسب اليوم. أضف حقل "exercise_time" لكل يوم يحدد الوقت الأفضل لممارسة التمرين بناءً على بيانات المستخدم (عمره، وزنه، نشاطه، تفضيلاته). اختر من: "بعد الفطار"، "بعد الغداء"، "بعد العشاء"، أو "في أي وقت". جميع النصوص بالعربية.

🚨 قواعد إلزامية:
1. كل المكونات الغذائية يجب أن تكون الأرخص والأكثر توفراً في بلد المستخدم (${country}).
2. لا تذكر أبداً مكونات مستوردة أو غالية مثل الكينوا، بذور الشيا، الأفوكادو، اللوز، الأرز البسمتي (إلا إذا كان رخيصاً محلياً).
3. اعتمد على المكونات المحلية الرخيصة (أرز عادي، خبز بلدي، فول، عدس، دجاج، بيض، خضروات موسمية، أسماك محلية رخيصة).
4. كل وجبة تقدم 2-3 خيارات بديلة.
5. التمرين (workout) يجب أن يكون عملياً ومنزلياً (بدون معدات) ويختلف من يوم لآخر.

${welcomeInstructionAr}

هيكل JSON المطلوب:
{
  "human_intro": "الرسالة الترحيبية الطويلة...",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "الأحد",
      "breakfast": { "options": ["خيار1", "خيار2", "خيار3"], "macros": "بروتين: Xg | كارب: Xg | دهون: Xg" },
      "lunch": { "options": ["خيار1", "خيار2", "خيار3"], "macros": "..." },
      "dinner": { "options": ["خيار1", "خيار2", "خيار3"], "macros": "..." },
      "snack": { "options": ["خيار1", "خيار2"], "macros": "..." },
      "workout": "شرح مفصل للتمرين المنزلي لهذا اليوم",
      "exercise_time": "بعد الفطار أو بعد العشاء أو بعد الغداء أو في أي وقت"
    },
    ... (7 أيام مختلفة تماماً)
  ],
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3", "نصيحة 4", "نصيحة 5"],
  "specialist_notes": "ملاحظات طبية إن وجدت"
}

ملاحظة: السطر الأول من النصائح يجب أن يكون "🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين." أو ما يعادله بالإنجليزية.
`;

    // SYSTEM PROMPT (English)
    const sysPromptEn = `You are a highly intelligent nutritionist. Output strict JSON with ENGLISH keys only. Each day has 4 different meals with 2-3 options, plus a "workout" (detailed home exercise) and "exercise_time" (best time to exercise based on user data: "after breakfast", "after lunch", "after dinner", or "anytime"). All text in English.

🚨 Mandatory rules:
1. All ingredients must be the cheapest and most available in the user's country (${country}).
2. Never mention imported/expensive ingredients like quinoa, chia seeds, avocado, almonds, basmati rice (unless locally cheap).
3. Rely on cheap local staples: local rice, local bread, beans, lentils, chicken, eggs, seasonal vegetables, cheap local fish.
4. Provide 2-3 meal options per meal slot.
5. Workout must be practical, home-based (no equipment), and vary by day.

${welcomeInstructionEn}

JSON structure:
{
  "human_intro": "The long welcome message...",
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
      "snack": { "options": ["Opt1", "Opt2"], "macros": "..." },
      "workout": "Detailed home workout for this day",
      "exercise_time": "after breakfast / after lunch / after dinner / anytime"
    },
    ... (7 completely different days)
  ],
  "tips": ["Tip1", "Tip2", "Tip3", "Tip4", "Tip5"],
  "specialist_notes": "Medical notes if any"
}

Note: The first tip must be "🍽️ Eat 4 small meals daily instead of 2 large ones."
`;

    // USER PROMPT (Arabic)
    const fullUserPromptAr = `البيانات: الاسم: ${userData.first_name || ''}، العمر: ${age}، الجنس: ${gender || ''}، الوزن: ${weight}كجم، الطول: ${height}سم، الهدف: ${userData.target_weight || ''}كجم، الأمراض: ${[userData.health_conditions].flat().join(', ')}، الحساسية: ${[userData.allergies].flat().join(', ') || 'لا'}، النشاط: ${activity || ''}، تفضيلات الطعام: ${[userData.food_pref].flat().join(', ') || 'كل شيء'}، النوم: ${sleep} ساعات، التدخين: ${smoking}، مستوى التوتر: ${stress}، وقت الطهي المتاح: ${cookingTime}، العمليات السابقة: ${previousSurgeries}، البلد: ${country}.

**تذكير حاسم: كل وجبة يجب أن تعتمد فقط على أرخص وأكثر المكونات توفراً في هذا البلد. حدد time_exercise المناسب بناءً على بيانات المستخدم (عمره، وزنه، نشاطه، تفضيلاته).**`;

    const fullUserPromptEn = `Data: Name: ${userData.first_name || ''}, Age: ${age}, Gender: ${gender || ''}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${userData.target_weight || ''}kg, Health: ${[userData.health_conditions].flat().join(', ')}, Allergies: ${[userData.allergies].flat().join(', ') || 'None'}, Activity: ${activity || ''}, Food Prefs: ${[userData.food_pref].flat().join(', ') || 'Everything'}, Sleep: ${sleep} hrs, Smoking: ${smoking}, Stress level: ${stress}, Cooking time: ${cookingTime}, Previous surgeries: ${previousSurgeries}, Country: ${country}.

**Critical reminder: Every meal must use only the cheapest, most available ingredients in this country. Determine exercise_time appropriately based on user data (age, weight, activity, preferences).**`;

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
          { role: 'user', content: lang === 'ar' ? fullUserPromptAr : fullUserPromptEn }
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
    if (!planJson) {
      planJson = generateFallbackPlan(lang, userData, targetCalories, weightToLose, weeks, whatsappLink);
    }

    // تأمين الحقول المفقودة
    if (!planJson.weekly_plan || !Array.isArray(planJson.weekly_plan) || planJson.weekly_plan.length === 0) {
      planJson.weekly_plan = generateFallbackPlan(lang, userData, targetCalories, weightToLose, weeks, whatsappLink).weekly_plan;
    }
    if (!planJson.tips || !Array.isArray(planJson.tips)) {
      planJson.tips = generateTips(lang, userData);
    }
    // التأكد من وجود حقلي workout و exercise_time في كل يوم
    planJson.weekly_plan = planJson.weekly_plan.map(day => {
      if (!day.workout) day.workout = lang === 'ar' ? 'تمرين منزلي خفيف: مشي سريع 20 دقيقة' : 'Light home workout: brisk walk 20 min';
      if (!day.exercise_time) day.exercise_time = lang === 'ar' ? 'بعد الفطار' : 'after breakfast';
      return day;
    });

    const standardized = robustStandardizePlan(planJson, userData, lang, targetCalories, weightToLose, weeks);
    res.status(200).json({ plan: JSON.stringify(standardized) });
  } catch (error) {
    console.error('Generate error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Helper functions (extractJSON, generateFallbackPlan, generateWorkout, generateTips, robustStandardizePlan)
// They remain similar to previous version but we update generateFallbackPlan to include workout and exercise_time

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

function generateFallbackPlan(lang, userData, targetCalories, weightToLose, weeks, whatsappLink) {
  const days = lang === 'ar' 
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const cheapBreakfast = lang === 'ar' 
    ? ['شوفان مع حليب (أو ماء) وموز', 'بيض مسلوق مع خبز بلدي', 'فول مدمس مع خبز أسمر محلي']
    : ['Oatmeal with milk/water and banana', 'Boiled eggs with local brown bread', 'Fava beans with local bread'];
  const cheapLunch = lang === 'ar'
    ? ['أرز عادي (محلي) مع عدس أو دجاج', 'مكرونة بشطة بسيطة', 'سمك بلطي مشوي مع خضار موسمي']
    : ['Local rice with lentils or chicken', 'Simple pasta with tomato sauce', 'Grilled local fish with seasonal veggies'];
  const cheapDinner = lang === 'ar'
    ? ['زبادي مع خيار وخبز', 'جبنة قريش مع طماطم', 'شوربة عدس']
    : ['Yogurt with cucumber and bread', 'Cottage cheese with tomatoes', 'Lentil soup'];
  const cheapSnack = lang === 'ar'
    ? ['تفاحة', 'موزة', 'حفنة فول سوداني غير مملح']
    : ['Apple', 'Banana', 'Handful of unsalted peanuts'];
  const macros = lang === 'ar' ? 'بروتين: 15-20g | كارب: 30-40g | دهون: 5-10g' : 'Protein: 15-20g | Carbs: 30-40g | Fats: 5-10g';
  
  const workoutByDay = {
    [lang === 'ar' ? 'الأحد' : 'Sunday']: 'تمرين خفيف: مشي سريع 20 دقيقة + إطالة (بعد الفطار)',
    [lang === 'ar' ? 'الإثنين' : 'Monday']: 'تمارين منزلية: ضغط (3×10)، قرفصاء (3×15)، بلانك (بعد العشاء)',
    [lang === 'ar' ? 'الثلاثاء' : 'Tuesday']: 'كارديو: قفز بالحبل 15 دقيقة + تمارين بطن (بعد الفطار)',
    [lang === 'ar' ? 'الأربعاء' : 'Wednesday']: 'يوغا أو تمدد عميق 20 دقيقة (في أي وقت)',
    [lang === 'ar' ? 'الخميس' : 'Thursday']: 'تمارين مقاومة باستخدام زجاجات ماء (بعد الغداء)',
    [lang === 'ar' ? 'الجمعة' : 'Friday']: 'تمارين كارديو منزلية: قفز النجم، ركض في المكان (بعد الفطار)',
    [lang === 'ar' ? 'السبت' : 'Saturday']: 'تمارين شاملة: ضغط، قرفصاء، بلانك، كارديو خفيف (بعد العشاء)'
  };
  const exerciseTimeByDay = {
    [lang === 'ar' ? 'الأحد' : 'Sunday']: 'بعد الفطار',
    [lang === 'ar' ? 'الإثنين' : 'Monday']: 'بعد العشاء',
    [lang === 'ar' ? 'الثلاثاء' : 'Tuesday']: 'بعد الفطار',
    [lang === 'ar' ? 'الأربعاء' : 'Wednesday']: 'في أي وقت',
    [lang === 'ar' ? 'الخميس' : 'Thursday']: 'بعد الغداء',
    [lang === 'ar' ? 'الجمعة' : 'Friday']: 'بعد الفطار',
    [lang === 'ar' ? 'السبت' : 'Saturday']: 'بعد العشاء'
  };

  const weeklyPlan = days.map(day => ({
    day: day,
    breakfast: { options: cheapBreakfast, macros: macros },
    lunch: { options: cheapLunch, macros: macros },
    dinner: { options: cheapDinner, macros: macros },
    snack: { options: cheapSnack, macros: macros.replace('15-20g', '5g').replace('30-40g', '15g').replace('5-10g', '3g') },
    workout: workoutByDay[day] || 'تمرين منزلي خفيف',
    exercise_time: exerciseTimeByDay[day] || 'بعد الفطار'
  }));

  const intro = lang === 'ar'
    ? `مرحباً ${userData.first_name || ''}،

بعد تحليل دقيق لكل بياناتك (عمرك، وزنك، طولك، حالتك الصحية، نشاطك، تفضيلاتك، وبلدك ${userData.country || 'بلدك'})، قمنا بتصميم هذه الخطة خصيصاً من أجلك.

الهدف هو خسارة ${weightToLose} كجم خلال ${weeks} أسبوع بمشيئة الله.

جميع الوجبات في هذه الخطة تعتمد فقط على أرخص وأكثر المكونات توفراً في بلدك، ولن نطلب منك أبداً شراء مكونات مستوردة أو غالية (مثل الأرز البسمتي، الكينوا، الأفوكادو). نحن نعلم أن أرز بلدك المحلي هو الأرخص والأفضل.

متخصصنا سيتابع معك شخصياً كل أسبوع، وسيطلب منك تحديث وزنك أسبوعياً حتى نعدل الخطة حسب تقدمك.

أنت قادر على تحقيق هدفنا معاً، خطوة بخطوة. ثق بنفسك.

نحن هنا من أجلك: ${whatsappLink}`
    : `Hello ${userData.first_name || ''},

After carefully analyzing all your data (age, weight, height, health, activity, preferences, and your country ${userData.country || 'your country'}), we have designed this plan specifically for you.

The goal is to lose ${weightToLose} kg in ${weeks} weeks, God willing.

All meals in this plan use only the cheapest, most available ingredients in your country, and we will never ask you to buy imported or expensive items (like basmati rice, quinoa, avocado). We know your local rice is the cheapest and best.

A specialist will follow up personally every week and will ask for your weight update so we can adjust the plan according to your progress.

You are capable of achieving our goal together, step by step. Trust yourself.

We are here for you: ${whatsappLink}`;

  const tips = generateTips(lang, userData);
  return {
    human_intro: intro,
    target_calories: targetCalories,
    daily_macros: { protein: '100g', carbs: '150g', fats: '50g' },
    weight_to_lose: weightToLose,
    expected_weeks: weeks,
    weekly_plan: weeklyPlan,
    tips: tips,
    specialist_notes: ''
  };
}

function generateTips(lang, userData) {
  const conditions = userData.health_conditions?.join?.(',') || '';
  if (lang === 'ar') {
    return [
      '🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين.',
      '💧 اشرب كوباً من الماء قبل كل وجبة بـ 10 دقائق.',
      conditions.includes('سكري') ? '🥗 تجنب الفواكه عالية السكر واستبدلها بالخيار أو الخس.' : '🍎 تناول الفواكه الكاملة بدلاً من العصائر (تفاح، برتقال، موز).',
      '🍽️ استخدم طبقاً أصغر للتحكم في كمية الطعام.',
      '🚶 قم بالمشي 10 دقائق بعد كل وجبة.'
    ];
  } else {
    return [
      '🍽️ Eat 4 small meals daily instead of 2 large ones.',
      '💧 Drink a glass of water 10 minutes before each meal.',
      conditions.includes('Diabetes') ? '🥗 Avoid high-sugar fruits; replace with cucumber or lettuce.' : '🍎 Eat whole fruits instead of juices (apple, orange, banana).',
      '🍽️ Use a smaller plate to control portions.',
      '🚶 Walk 10 minutes after each meal.'
    ];
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
      let dayObj = { day: day.day || days[i], breakfast: null, lunch: null, dinner: null, snack: null, workout: day.workout || '', exercise_time: day.exercise_time || '' };
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
          dayObj[slot] = { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' };
        }
      });
      return dayObj;
    });
  } else {
    for (let i = 0; i < 7; i++) {
      weeklyPlan.push({
        day: days[i],
        breakfast: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' },
        lunch: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' },
        dinner: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' },
        snack: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' },
        workout: '',
        exercise_time: ''
      });
    }
  }
  let tips = plan.tips || [];
  if (!Array.isArray(tips) || tips.length === 0) {
    tips = generateTips(lang, userData);
  }
  return {
    human_intro: plan.human_intro || (lang === 'ar' ? `مرحباً ${userData.first_name || ''}!` : `Welcome ${userData.first_name || ''}!`),
    target_calories: plan.target_calories || targetCalories,
    daily_macros: plan.daily_macros || { protein: '100g', carbs: '150g', fats: '50g' },
    weight_to_lose: plan.weight_to_lose || weightToLose,
    expected_weeks: plan.expected_weeks || weeks,
    weekly_plan: weeklyPlan,
    tips: tips,
    specialist_notes: plan.specialist_notes || ''
  };
}

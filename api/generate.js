// api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { userData, lang } = req.body;
    if (!userData) return res.status(400).json({ error: 'Missing userData' });

    const country = userData.country || 'الدولة';
    const whatsappLink = "https://wa.me/96598002104";

    // ========== حساب المعايير الصحية الأساسية ==========
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

    // ========== البيانات الإضافية (اختيارية) ==========
    const sleep = userData.sleep_hours || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const smoking = userData.smoking || (lang === 'ar' ? 'لا' : 'No');
    const stress = userData.stress_level || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const cookingTime = userData.cooking_time || (lang === 'ar' ? 'غير محدد' : 'not specified');
    const previousSurgeries = userData.previous_surgeries || (lang === 'ar' ? 'لا توجد' : 'None');

    // ========== تعليمات الرسالة الترحيبية ==========
    const welcomeInstructionAr = `
**تعليمات حقل "human_intro" (الرسالة الترحيبية الطويلة):**
- ابدأ بـ "مرحباً ${userData.first_name || ''}" (استخدم اسمه الأول).
- قل: "بعد تحليل دقيق لكل بياناتك (عمرك، وزنك، طولك، حالتك الصحية، نشاطك، تفضيلاتك، وبلدك ${country})، قمنا بتصميم هذه الخطة خصيصاً من أجلك."
- اذكر أن الهدف هو خسارة ${weightToLose} كجم خلال ${weeks} أسبوع بمشيئة الله.
- أكد أن جميع الوجبات تعتمد فقط على أرخص وأكثر المكونات توفراً في بلده (${country})، ولا تحتوي أي مكون مستورد أو غالٍ (مثل الأرز البسمتي، الكينوا، الأفوكادو، إلخ). قل مثلاً: "نحن نعلم أن أرز بلدك المحلي هو الأرخص والأفضل، ولن نطلب منك أبداً شراء مكونات خيالية."
- ذكّره بأن المتخصص سيتابع معه شخصياً كل أسبوع، وسيطلب منه تحديث وزنه أسبوعياً حتى نعدل الخطة حسب تقدمه.
- أضف جملة تحفيزية: "أنت قادر على تحقيق هدفنا معاً، خطوة بخطوة. ثق بنفسك."
- أضف عبارة "نحن هنا من أجلك" ثم اكتب رابط واتساب للدعم المباشر: ${whatsappLink} (اجعل الرابط ظاهراً كنص قابل للنقر).
- اجعل النص طويلاً (80-120 كلمة)، دافئاً، واضحاً، ومشجعاً.
`;

    const welcomeInstructionEn = `
**Instructions for "human_intro" field (long welcome message):**
- Start with "Hello ${userData.first_name || ''}".
- Say: "After carefully analyzing all your data (age, weight, height, health, activity, preferences, and your country ${country}), we have designed this plan specifically for you."
- Mention that the goal is to lose ${weightToLose} kg in ${weeks} weeks, God willing.
- Assure that all meals use only the cheapest, most available ingredients in his/her country (${country}), and contain no imported or expensive items (e.g., basmati rice, quinoa, avocado, etc.). For example: "We know your local rice is the cheapest and best, and we will never ask you to buy fancy ingredients."
- Remind that a specialist will follow up personally every week and will ask for a weight update to adjust the plan accordingly.
- Add a motivational phrase: "You are capable of achieving our goal together, step by step. Trust yourself."
- Add the phrase "We are here for you" and then a direct WhatsApp support link: ${whatsappLink} (make it clickable text).
- Length around 80-120 words, warm and encouraging.
`;

    // ========== SYSTEM PROMPT (Arabic) ==========
    const sysPromptAr = `أنت أخصائي تغذية ذكي جداً. أعد JSON صارم بالهيكل التالي. استخدم المفاتيح الإنجليزية فقط (breakfast, lunch, dinner, snack). كل يوم 4 وجبات مختلفة مع 2-3 بدائل. الروتين الرياضي مفصّل يومياً. 5 نصائح مخصصة. جميع النصوص بالعربية.

🚨 قواعد إلزامية لا يمكن كسرها أبداً:
1. كل المكونات الغذائية المذكورة في الوجبات يجب أن تكون **الأرخص والأكثر توفراً** في بلد المستخدم (الموجودة في كل بيت وبأسعار زهيدة).
2. لا تذكر أبداً أي مكون مستورد أو غالي الثمن أو نادر مثل: الكينوا، بذور الشيا، الأفوكادو، اللوز، الكاجو، زيت جوز الهند، الأرز البسمتي (إلا إذا كان المستخدم من دولة يباع فيها البسمتي بسعر الأرز العادي)، المحار، الجمبري، اللحم الضأن (بكميات كبيرة)، الخبز الخالي من الجلوتين (ما لم يكن ضرورياً طبياً).
3. اعتمد على المكونات المحلية الأساسية الرخيصة مثلاً: الأرز العادي (غير المستورد)، الخبز البلدي أو العادي، الفول، العدس، الحمص، الدجاج، البيض، الزبادي، الخضروات الموسمية، الأسماك الصغيرة الرخيصة، زيت عباد الشمس، زيت الزيتون العادي.
4. إذا كان المستخدم من بلد يستهلك أرزاً محلياً رخيصاً (مثل مصر، الهند، باكستان، الفلبين) يجب استخدام الأرز المحلي وليس البسمتي أو الأرز المستورد.
5. جميع الوجبات يجب أن تكون سهلة التحضير وغير مكلفة.

${welcomeInstructionAr}

هيكل JSON:
{
  "human_intro": "الرسالة الترحيبية الطويلة التي كتبتها حسب التعليمات أعلاه",
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
  "home_workout": "روتين رياضي يومي مفصل يختلف كل يوم",
  "tips": ["نصيحة 1", "نصيحة 2", "نصيحة 3", "نصيحة 4", "نصيحة 5"],
  "specialist_notes": "ملاحظات طبية إن وجدت"
}`;

    // ========== SYSTEM PROMPT (English) ==========
    const sysPromptEn = `You are a highly intelligent nutritionist. Output strict JSON with ENGLISH keys only. Each day has 4 different meals with 2-3 options. Detailed daily home workout. 5 personalized tips. All text in English.

🚨 Mandatory rules (never break):
1. All food ingredients must be the **cheapest and most available** in the user's country (found in every home at low cost).
2. Never mention imported or expensive/rare ingredients such as: quinoa, chia seeds, avocado, almonds, cashews, coconut oil, basmati rice (unless it's as cheap as local rice in that country), shrimp, lobster, lamb (in large quantities), gluten-free bread (unless medically necessary).
3. Rely on cheap, basic local staples like: regular local rice (not imported), local bread, beans, lentils, chickpeas, chicken, eggs, yogurt, seasonal vegetables, cheap local fish, sunflower oil, regular olive oil.
4. If the user's country has a cheap local rice (e.g., Egypt, India, Pakistan, Philippines), use that local rice, not basmati or imported rice.
5. All meals must be easy to prepare and inexpensive.

${welcomeInstructionEn}

JSON structure:
{
  "human_intro": "The long welcoming message you wrote following the instructions above",
  "target_calories": ${targetCalories},
  "daily_macros": { "protein": "100g", "carbs": "150g", "fats": "50g" },
  "weight_to_lose": ${weightToLose},
  "expected_weeks": ${weeks},
  "weekly_plan": [
    {
      "day": "Sunday",
      "breakfast": { "options": ["Option1", "Option2", "Option3"], "macros": "Protein: Xg | Carbs: Xg | Fats: Xg" },
      "lunch": { "options": ["Option1", "Option2", "Option3"], "macros": "..." },
      "dinner": { "options": ["Option1", "Option2", "Option3"], "macros": "..." },
      "snack": { "options": ["Option1", "Option2"], "macros": "..." }
    },
    ... (7 completely different days)
  ],
  "home_workout": "Detailed daily home workout (different each day)",
  "tips": ["Tip1", "Tip2", "Tip3", "Tip4", "Tip5"],
  "specialist_notes": "Medical notes if any"
}`;

    // ========== USER PROMPT ==========
    const countryForPrompt = country;
    const fullUserPromptAr = `البيانات: الاسم: ${userData.first_name || ''}، العمر: ${age}، الجنس: ${gender || ''}، الوزن: ${weight}كجم، الطول: ${height}سم، الهدف: ${userData.target_weight || ''}كجم، الأمراض: ${[userData.health_conditions].flat().join(', ')}، الحساسية: ${[userData.allergies].flat().join(', ') || 'لا'}، النشاط: ${activity || ''}، تفضيلات الطعام: ${[userData.food_pref].flat().join(', ') || 'كل شيء'}، النوم: ${sleep} ساعات، التدخين: ${smoking}، مستوى التوتر: ${stress}، وقت الطهي المتاح: ${cookingTime}، العمليات السابقة: ${previousSurgeries}، البلد: ${countryForPrompt}.

**تذكير حاسم: كل وجبة يجب أن تعتمد فقط على أرخص وأكثر المكونات توفراً في هذا البلد. يمنع تماماً استخدام أي مكون غالي أو مستورد مثل البسمتي (إذا لم يكن رخيصاً محلياً)، الكينوا، الأفوكادو، إلخ.**`;

    const fullUserPromptEn = `Data: Name: ${userData.first_name || ''}, Age: ${age}, Gender: ${gender || ''}, Weight: ${weight}kg, Height: ${height}cm, Goal: ${userData.target_weight || ''}kg, Health: ${[userData.health_conditions].flat().join(', ')}, Allergies: ${[userData.allergies].flat().join(', ') || 'None'}, Activity: ${activity || ''}, Food Prefs: ${[userData.food_pref].flat().join(', ') || 'Everything'}, Sleep: ${sleep} hrs, Smoking: ${smoking}, Stress level: ${stress}, Cooking time available: ${cookingTime}, Previous surgeries: ${previousSurgeries}, Country: ${countryForPrompt}.

**Critical reminder: Every meal must use only the cheapest, most available ingredients in this country. Never mention expensive or imported items like basmati (unless locally cheap), quinoa, avocado, etc.**`;

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Missing DEEPSEEK_API_KEY' });

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 3500,
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
    if (!planJson.home_workout || planJson.home_workout.length < 20) {
      planJson.home_workout = generateWorkout(lang, activity);
    }
    if (!planJson.tips || !Array.isArray(planJson.tips) || planJson.tips.length === 0) {
      planJson.tips = generateTips(lang, userData);
    }

    const standardized = robustStandardizePlan(planJson, userData, lang, targetCalories, weightToLose, weeks);
    res.status(200).json({ plan: JSON.stringify(standardized) });
  } catch (error) {
    console.error('Generate error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// ========== Helper Functions ==========
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
  
  const weeklyPlan = days.map(day => ({
    day: day,
    breakfast: { options: cheapBreakfast, macros: macros },
    lunch: { options: cheapLunch, macros: macros },
    dinner: { options: cheapDinner, macros: macros },
    snack: { options: cheapSnack, macros: macros }
  }));

  // رسالة ترحيبية بديلة طويلة
  let fallbackIntro = '';
  if (lang === 'ar') {
    fallbackIntro = `مرحباً ${userData.first_name || ''}،

بعد تحليل دقيق لكل بياناتك (عمرك، وزنك، طولك، حالتك الصحية، نشاطك، تفضيلاتك، وبلدك ${userData.country || 'بلدك'})، قمنا بتصميم هذه الخطة خصيصاً من أجلك.

الهدف هو خسارة ${weightToLose} كجم خلال ${weeks} أسبوع بمشيئة الله.

جميع الوجبات في هذه الخطة تعتمد فقط على أرخص وأكثر المكونات توفراً في بلدك، ولن نطلب منك أبداً شراء مكونات مستوردة أو غالية (مثل الأرز البسمتي، الكينوا، الأفوكادو). نحن نعلم أن أرز بلدك المحلي هو الأرخص والأفضل.

متخصصنا سيتابع معك شخصياً كل أسبوع، وسيطلب منك تحديث وزنك أسبوعياً حتى نعدل الخطة حسب تقدمك.

أنت قادر على تحقيق هدفنا معاً، خطوة بخطوة. ثق بنفسك.

نحن هنا من أجلك: ${whatsappLink}`;
  } else {
    fallbackIntro = `Hello ${userData.first_name || ''},

After carefully analyzing all your data (age, weight, height, health, activity, preferences, and your country ${userData.country || 'your country'}), we have designed this plan specifically for you.

The goal is to lose ${weightToLose} kg in ${weeks} weeks, God willing.

All meals in this plan use only the cheapest, most available ingredients in your country, and we will never ask you to buy imported or expensive items (like basmati rice, quinoa, avocado). We know your local rice is the cheapest and best.

A specialist will follow up personally every week and will ask for your weight update so we can adjust the plan according to your progress.

You are capable of achieving our goal together, step by step. Trust yourself.

We are here for you: ${whatsappLink}`;
  }

  return {
    human_intro: fallbackIntro,
    target_calories: targetCalories,
    daily_macros: { protein: '100g', carbs: '150g', fats: '50g' },
    weight_to_lose: weightToLose,
    expected_weeks: weeks,
    weekly_plan: weeklyPlan,
    home_workout: generateWorkout(lang, userData.activity),
    tips: generateTips(lang, userData),
    specialist_notes: ''
  };
}

function generateWorkout(lang, activity) {
  if (lang === 'ar') {
    return `السبت: إحماء 5 دقائق، قفز بالحبل 3 مجموعات × 30 ثانية، ضغط 3×10، قرفصاء 3×15، بلانك 3×30 ثانية، تمدد 5 دقائق.
الأحد: إحماء، طعنات 3×12 لكل رجل، بيربيز 3×10، رفع الساقين 3×20، كارديو خفيف 10 دقائق (مشي سريع).
الإثنين: راحة.
الثلاثاء: إحماء، تمارين مقاومة باستخدام زجاجات ماء 3×15، تمرين السحب العلوي (بمنشفة) 3×12، مشي في المكان 15 دقيقة.
الأربعاء: إحماء، يوغا أو تمدد عميق 20 دقيقة.
الخميس: إحماء، قفز مع رفع الركبة 3×20، ضغط على الحائط 3×15، تمارين بطن دراجة 3×20، بلانك جانبي 3×20 ثانية.
الجمعة: إحماء، تمارين كارديو (قفز النجم، ركض في المكان) 15 دقيقة، تهدئة 5 دقائق.`;
  } else {
    return `Saturday: Warm up 5min, jump rope 3x30sec, push-ups 3x10, squats 3x15, plank 3x30sec, cool down 5min.
Sunday: Warm up, lunges 3x12 per leg, burpees 3x10, leg raises 3x20, light cardio (brisk walk) 10min.
Monday: Rest.
Tuesday: Warm up, resistance with water bottles 3x15, towel rows 3x12, march in place 15min.
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
      conditions.includes('سكري') ? 'تجنب الفواكه عالية السكر واستبدلها بالخيار أو الخس.' : 'تناول الفواكه الكاملة بدلاً من العصائر (تفاح، برتقال، موز).',
      'استخدم طبقاً أصغر للتحكم في كمية الطعام.',
      'قم بالمشي 10 دقائق بعد كل وجبة.'
    ];
  } else {
    return [
      'Eat 5-6 small meals daily instead of 3 large ones.',
      'Drink a glass of water 10 minutes before each meal.',
      conditions.includes('Diabetes') ? 'Avoid high-sugar fruits; replace with cucumber or lettuce.' : 'Eat whole fruits instead of juices (apple, orange, banana).',
      'Use a smaller plate to control portions.',
      'Walk for 10 minutes after each meal.'
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
        snack: { options: [lang === 'ar' ? 'وجبة مقترحة' : 'Suggested meal'], macros: '' }
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
    daily_macros: plan.daily_macros || { protein: '100g', carbs: '150g', fats: '50g' },
    weight_to_lose: plan.weight_to_lose || weightToLose,
    expected_weeks: plan.expected_weeks || weeks,
    weekly_plan: weeklyPlan,
    home_workout: homeWorkout,
    tips: tips,
    specialist_notes: plan.specialist_notes || ''
  };
}

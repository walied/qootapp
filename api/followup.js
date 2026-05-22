// api/followup.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { followUpData, lang, oldPlan, answers } = req.body;
    if (!followUpData) {
      return res.status(400).json({ error: 'Missing followUpData' });
    }

    // Build system prompt based on language
    const sysPrompt = lang === 'ar'
      ? `أنت أخصائي تغذية. قم بتحليل نتائج الأسبوع الماضي وإنشاء خطة جديدة للأسبوع القادم مع تعديل السعرات والوجبات والتمارين بناءً على التقدم. أخرج JSON بنفس هيكل الخطة الأولى (breakfast, lunch, dinner, snack لكل يوم، مع home_workout و tips).`
      : `You are a nutritionist. Analyze last week's results and create a new plan for next week, adjusting calories, meals, and workouts based on progress. Output JSON with the same structure as the original plan (breakfast, lunch, dinner, snack per day, plus home_workout and tips).`;

    const userPrompt = lang === 'ar'
      ? `البيانات الأصلية: ${JSON.stringify(answers)}. نتائج الأسبوع الماضي: ${JSON.stringify(followUpData)}.`
      : `Original data: ${JSON.stringify(answers)}. Last week's results: ${JSON.stringify(followUpData)}.`;

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
          { role: 'user', content: userPrompt }
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
    let newPlan = extractJSON(raw);
    if (!newPlan) {
      // Fallback to a default plan if JSON parsing fails
      newPlan = generateFallbackPlan(lang, answers, followUpData);
    }

    // Ensure required fields exist
    newPlan = normalizeFollowUpPlan(newPlan, answers, lang);

    res.status(200).json({ plan: JSON.stringify(newPlan) });
  } catch (error) {
    console.error('Follow-up generation error:', error);
    res.status(500).json({ error: error.message });
  }
}

// Helper to extract JSON from AI response (same as in generate.js)
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
    // Attempt to fix missing closing braces/quotas
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

// Fallback plan when AI fails
function generateFallbackPlan(lang, answers, followUpData) {
  const days = lang === 'ar' 
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  const weeklyPlan = days.map(day => ({
    day: day,
    breakfast: { options: ['شوفان مع حليب', 'بيض مسلوق مع خبز أسمر'], macros: 'بروتين: 20g | كارب: 30g | دهون: 10g' },
    lunch: { options: ['صدر دجاج مشوي مع أرز بني', 'سمك مشوي مع خضار'], macros: 'بروتين: 35g | كارب: 40g | دهون: 12g' },
    dinner: { options: ['زبادي يوناني مع مكسرات', 'جبنة قريش مع خيار'], macros: 'بروتين: 25g | كارب: 15g | دهون: 8g' },
    snack: { options: ['تفاحة', 'لوز'], macros: 'بروتين: 5g | كارب: 15g | دهون: 6g' }
  }));

  const workout = lang === 'ar'
    ? 'السبت: تمرين كارديو 20 دقيقة. الأحد: تمارين مقاومة خفيفة. الإثنين: راحة. الثلاثاء: مشي سريع 30 دقيقة. الأربعاء: يوغا. الخميس: تمارين منزلية شاملة. الجمعة: راحة.'
    : 'Saturday: 20 min cardio. Sunday: Light resistance. Monday: Rest. Tuesday: 30 min brisk walk. Wednesday: Yoga. Thursday: Full home workout. Friday: Rest.';

  const tips = lang === 'ar'
    ? ['اشرب 2-3 لتر ماء يومياً', 'تناول الخضروات في كل وجبة', 'لا تخطِ وجبة الإفطار', 'نام 7-8 ساعات', 'سجل تقدمك أسبوعياً']
    : ['Drink 2-3L water daily', 'Eat vegetables with every meal', 'Never skip breakfast', 'Sleep 7-8 hours', 'Track progress weekly'];

  return {
    human_intro: lang === 'ar' ? `مرحباً ${answers.first_name || ''}، هذه خطتك المعدلة للأسبوع القادم.` : `Hello ${answers.first_name || ''}, here is your adjusted plan for next week.`,
    target_calories: 1800,
    daily_macros: { protein: '120g', carbs: '150g', fats: '60g' },
    weight_to_lose: 2,
    expected_weeks: 4,
    weekly_plan: weeklyPlan,
    home_workout: workout,
    tips: tips,
    specialist_notes: ''
  };
}

function normalizeFollowUpPlan(plan, answers, lang) {
  // Ensure basic structure exists
  if (!plan.weekly_plan || !Array.isArray(plan.weekly_plan) || plan.weekly_plan.length === 0) {
    return generateFallbackPlan(lang, answers, {});
  }
  if (!plan.home_workout) plan.home_workout = generateFallbackPlan(lang, answers, {}).home_workout;
  if (!plan.tips || !Array.isArray(plan.tips)) plan.tips = generateFallbackPlan(lang, answers, {}).tips;
  if (!plan.target_calories) plan.target_calories = 1800;
  if (!plan.daily_macros) plan.daily_macros = { protein: '120g', carbs: '150g', fats: '60g' };
  return plan;
}

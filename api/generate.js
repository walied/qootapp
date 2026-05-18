// api/generate.js
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
    // ... (keep the full COUNTRY_DATA array as before) ...
    const COUNTRY_DATA = [
      { name: "مصر", aliases: ["مصر", "egypt", "ايجبت"] },
      { name: "الكويت", aliases: ["الكويت", "كويت", "kuwait"] },
      // ... (all other countries - keep them exactly as before)
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
    
    // 🔧 NEW: Strip DeepSeek R1 thinking tags and extract JSON
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

// 🆕 Improved JSON extraction that handles DeepSeek thinking tags
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

// ... (keep standardizePlan exactly as before) ...
function standardizePlan(plan, userData, lang) {
  // ... (keep the entire function unchanged) ...
}

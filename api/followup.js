// api/followup.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { followUpData, lang, oldPlan, answers } = req.body;
    if (!followUpData) return res.status(400).json({ error: 'Missing followUpData' });

    const sysPrompt = lang === 'ar'
      ? `أنت أخصائي تغذية. قم بتحليل نتائج الأسبوع الماضي وإنشاء خطة جديدة للأسبوع القادم مع تعديل السعرات والوجبات والتمارين بناءً على التقدم. أخرج JSON بنفس هيكل الخطة الأولى.`
      : `You are a nutritionist. Analyze last week's results and create a new plan for next week, adjusting calories, meals, and workouts based on progress. Output JSON with same structure as the original plan.`;

    const userPrompt = lang === 'ar'
      ? `البيانات السابقة: ${JSON.stringify(answers)}. نتائج الأسبوع: ${JSON.stringify(followUpData)}.`
      : `Previous data: ${JSON.stringify(answers)}. Week results: ${JSON.stringify(followUpData)}.`;

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
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) throw new Error(`DeepSeek API error: ${response.status}`);
    const data = await response.json();
    const raw = data.choices[0].message.content;
    const newPlan = extractJSON(raw); // reuse extractJSON from generate.js
    if (!newPlan) throw new Error('Failed to parse AI response');

    res.status(200).json({ plan: JSON.stringify(newPlan) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

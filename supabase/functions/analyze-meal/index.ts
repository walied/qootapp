import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

serve(async (req) => {
  try {
    const { imageUrl, additionalText } = await req.json();
    const openAiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAiKey) throw new Error('OPENAI_API_KEY missing');

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openAiKey}` },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: [
            { type: 'text', text: `حلل هذه الوجبة. قدّر السعرات، البروتين، الكارب، الدهون، والمكونات الرئيسية. أجب بالعربية.\n${additionalText || ''}` },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }],
        max_tokens: 300
      })
    });
    const data = await resp.json();
    const analysis = data.choices?.[0]?.message?.content || 'تعذر التحليل.';
    // يمكن استخراج السعرات رقمياً (اختياري)
    const caloriesMatch = analysis.match(/\d+/);
    const calories = caloriesMatch ? parseInt(caloriesMatch[0]) : null;
    return new Response(JSON.stringify({ analysis, mealData: { analysis, calories } }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

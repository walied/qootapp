import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

serve(async (req) => {
  try {
    const { message, userId, userProfile, currentPlan, recentMessages, imageUrl } = await req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // حفظ رسالة المستخدم فوراً
    await supabase.from('conversations').insert({
      user_id: userId,
      role: 'user',
      content: message || (imageUrl ? '[صورة]' : ''),
      created_at: new Date().toISOString()
    });

    // بناء الـ system prompt
    const systemPrompt = `أنت Qoot، مدرب صحي ذكي بالعربية. تتحدث اللهجة الخليجية والمصرية. خطة المستخدم الحالية: ${JSON.stringify(currentPlan?.plan_data?.weekly_plan?.[0] || {})}. وزنه: ${userProfile?.current_weight} كجم، هدفه: ${userProfile?.target_weight} كجم. كن مشجعاً ومختصراً.`;
    
    const aiMessages = [
      { role: 'system', content: systemPrompt },
      ...(recentMessages || []).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message || (imageUrl ? 'أرسل صورة وجبة' : '') }
    ];

    const resp = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}` },
      body: JSON.stringify({ model: 'deepseek-chat', messages: aiMessages, temperature: 0.7, max_tokens: 500 })
    });
    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || 'عذراً، حدث خطأ.';

    // حفظ رد المساعد
    await supabase.from('conversations').insert({
      user_id: userId,
      role: 'assistant',
      content: reply,
      created_at: new Date().toISOString()
    });

    return new Response(JSON.stringify({ reply }), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});

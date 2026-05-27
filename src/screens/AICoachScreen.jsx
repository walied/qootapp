import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import ChatMessage from '../components/ChatMessage';
import SidebarPlan from '../components/SidebarPlan';
import { C } from '../constants';

const AICoachScreen = () => {
  const { lang, user, messages, setMessages, currentPlan, setCurrentPlan, userProfile, setUserProfile, userMetrics, setUserMetrics, onboardingStep, setOnboardingStep } = useApp();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Steps for onboarding state machine
  const steps = [
    { key: 'weight', question: lang === 'ar' ? 'ما هو وزنك الحالي (كجم)؟' : 'What is your current weight (kg)?' },
    { key: 'height', question: lang === 'ar' ? 'ما هو طولك (سم)؟' : 'What is your height (cm)?' },
    { key: 'age', question: lang === 'ar' ? 'كم عمرك؟' : 'How old are you?' },
    { key: 'target_weight', question: lang === 'ar' ? 'ما هو الوزن المستهدف؟' : 'What is your target weight?' },
    { key: 'activity', question: lang === 'ar' ? 'مستوى نشاطك؟ (قليل/متوسط/عالي)' : 'Activity level? (low/medium/high)' },
    { key: 'health', question: lang === 'ar' ? 'هل تعاني من أي أمراض مزمنة؟ (سكري، ضغط، غدة...)' : 'Any chronic diseases? (diabetes, pressure, thyroid...)' },
    { key: 'country', question: lang === 'ar' ? 'ما هي بلد إقامتك؟' : 'What is your country?' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user?.id) {
      loadMessages();
      loadUserProfile();
      loadCurrentPlan();
    }
  }, [user]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase.from('conversations').select('*').eq('user_id', user.id).order('created_at', { ascending: true });
      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) { console.error(err); }
  };

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setUserProfile(data);
        // إذا كان onboardingStep موجوداً في الملف الشخصي، استخدمه
        if (data.onboarding_step !== undefined && data.onboarding_step < steps.length) {
          setOnboardingStep(data.onboarding_step);
        } else if (data.onboarding_step >= steps.length) {
          setOnboardingStep(steps.length); // completed
        }
      }
    } catch (err) { console.error(err); }
  };

  const loadCurrentPlan = async () => {
    try {
      const { data, error } = await supabase.from('weekly_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1);
      if (error) throw error;
      if (data && data.length) setCurrentPlan(data[0]);
    } catch (err) { console.error(err); }
  };

  const handleOnboardingAnswer = async (answer) => {
    const step = steps[onboardingStep];
    if (!step) return;
    // تحديث الملف الشخصي
    const updates = { [step.key]: answer, onboarding_step: onboardingStep + 1 };
    const { error } = await supabase.from('user_profiles').upsert({ user_id: user.id, ...updates });
    if (error) console.error(error);
    else {
      setUserProfile(prev => ({ ...prev, ...updates }));
      setOnboardingStep(onboardingStep + 1);
      // إذا اكتمل، قم باستدعاء توليد الخطة
      if (onboardingStep + 1 >= steps.length) {
        await generatePlan();
      }
    }
  };

  const generatePlan = async () => {
    try {
      const { data: profile } = await supabase.from('user_profiles').select('*').eq('user_id', user.id).single();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: profile, lang })
      });
      const result = await response.json();
      const planData = JSON.parse(result.plan);
      // تخزين الخطة في جدول weekly_plans
      await supabase.from('weekly_plans').insert({
        user_id: user.id,
        week_number: 1,
        plan_data: planData
      });
      setCurrentPlan({ plan_data: planData });
    } catch (err) { console.error(err); }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !imageFile) return;

    // إذا كنا في مرحلة onboarding، تعامل كإجابة على السؤال الحالي
    if (onboardingStep < steps.length && inputText.trim()) {
      await handleOnboardingAnswer(inputText.trim());
      setInputText('');
      return;
    }

    const userMessage = { role: 'user', content: inputText || (imageFile ? '📷 صورة' : '') };
    // عرض الرسالة محلياً فوراً
    setMessages(prev => [...prev, { ...userMessage, created_at: new Date().toISOString(), user_id: user.id }]);
    setInputText('');
    setIsLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        // رفع الصورة إلى Supabase Storage
        const fileName = `${user.id}/${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meal-images')
          .upload(fileName, imageFile);
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('meal-images').getPublicUrl(fileName);
        imageUrl = publicUrl;
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }

      // استدعاء Edge Function (ترسل الصورة URL وليس base64)
      const { data: fnData, error: fnErr } = await supabase.functions.invoke('send-message', {
        body: {
          message: inputText,
          userId: user.id,
          userProfile,
          currentPlan,
          recentMessages: messages.slice(-5),
          imageUrl
        }
      });
      if (fnErr) throw fnErr;
      const aiMessage = { role: 'assistant', content: fnData.reply, created_at: new Date().toISOString(), user_id: user.id };
      setMessages(prev => [...prev, aiMessage]);
      // لا نحفظ هنا لأن Edge Function ستحفظ كلا الطرفين (user + assistant)
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImageFile(f);
      const r = new FileReader();
      r.onload = (ev) => setImagePreview(ev.target.result);
      r.readAsDataURL(f);
    }
  };

  const weekProgress = currentPlan?.created_at ? {
    weekNumber: currentPlan.week_number || 1,
    currentDay: Math.min(7, Math.floor((Date.now() - new Date(currentPlan.created_at).getTime()) / 86400000) + 1),
    daysRemaining: Math.max(0, 7 - Math.floor((Date.now() - new Date(currentPlan.created_at).getTime()) / 86400000))
  } : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.card, padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: C.text }}>☰</button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C.teal, margin: 0 }}>{lang === 'ar' ? 'قوت - مدربك الشخصي' : 'Qoot - Your Coach'}</h1>
        <div style={{ width: '24px' }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {messages.map((msg, i) => <ChatMessage key={i} message={msg} lang={lang} />)}
        {isLoading && <div style={{ padding: '12px 16px', textAlign: 'center', color: C.muted }}>{lang === 'ar' ? 'يجيب...' : 'Thinking...'}</div>}
        <div ref={messagesEndRef} />
      </div>
      {imagePreview && (
        <div style={{ padding: '8px 16px', background: C.cardLight, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={imagePreview} alt="preview" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
          <span style={{ flex: 1, fontSize: '14px', color: C.text }}>{imageFile?.name}</span>
          <button onClick={() => { setImageFile(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = ''; }} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: C.danger }}>✕</button>
        </div>
      )}
      <div style={{ padding: '16px', borderTop: `1px solid ${C.border}`, background: C.bg }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder={onboardingStep < steps.length ? (lang === 'ar' ? steps[onboardingStep]?.question : steps[onboardingStep]?.question) : (lang === 'ar' ? 'اكتب رسالتك...' : 'Type...')} style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: `1px solid ${C.border}`, background: C.cardLight, color: C.text, fontSize: '14px', outline: 'none' }} />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} style={{ background: C.cardLight, border: `1px solid ${C.border}`, borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', fontSize: '20px' }}>📷</button>
          <button onClick={handleSendMessage} disabled={isLoading || (!inputText.trim() && !imageFile)} style={{ background: C.teal, border: 'none', borderRadius: '24px', padding: '12px 20px', color: '#fff', cursor: 'pointer', fontWeight: '600', opacity: (isLoading || (!inputText.trim() && !imageFile)) ? 0.6 : 1 }}>➤</button>
        </div>
      </div>
      <SidebarPlan isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} plan={currentPlan} userMetrics={userMetrics} lang={lang} weekProgress={weekProgress} />
    </div>
  );
};

export default AICoachScreen;

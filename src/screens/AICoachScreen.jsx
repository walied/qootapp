import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabaseClient';
import ChatMessage from '../components/ChatMessage';
import SidebarPlan from '../components/SidebarPlan';
import { C } from '../constants';

const AICoachScreen = () => {
  const {
    lang, user, messages, setMessages, currentPlan, setCurrentPlan,
    userProfile, setUserProfile, userMetrics, setUserMetrics,
    onboardingStep, setOnboardingStep, updateProfile
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // تعريف الأسئلة مع دعم الوزن المستهدف الذكي
  const steps = [
    { key: 'current_weight', questionAr: 'ما هو وزنك الحالي (كجم)؟', questionEn: 'Current weight (kg)?', type: 'number' },
    { key: 'height', questionAr: 'ما هو طولك (سم)؟', questionEn: 'Height (cm)?', type: 'number' },
    { key: 'age', questionAr: 'كم عمرك؟', questionEn: 'Age?', type: 'number' },
    { 
      key: 'target_weight', 
      questionAr: '', // سيتم توليدها ديناميكياً بعد معرفة الطول
      questionEn: '',
      type: 'target_suggestion'
    },
    { key: 'activity_level', questionAr: 'مستوى نشاطك؟ (قليل/متوسط/عالي)', questionEn: 'Activity level? (low/medium/high)', type: 'text' },
    { key: 'health_conditions', questionAr: 'هل تعاني من أي أمراض مزمنة؟ (سكري، ضغط، غدة...)', questionEn: 'Any chronic diseases?', type: 'text' },
    { key: 'country', questionAr: 'ما هي بلد إقامتك؟', questionEn: 'Country?', type: 'text' }
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
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      if (data) setMessages(data);
    } catch (err) { console.error(err); }
  };

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setUserProfile(data);
        setOnboardingStep(data.onboarding_step ?? 0);
      } else {
        await supabase.from('user_profiles').insert({ user_id: user.id, onboarding_step: 0 });
        setOnboardingStep(0);
      }
    } catch (err) { console.error(err); }
  };

  const loadCurrentPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      if (data && data.length) setCurrentPlan(data[0]);
    } catch (err) { console.error(err); }
  };

  // حساب الوزن المثالي (BMI = 22)
  const getIdealWeight = (heightCm) => {
    const heightM = heightCm / 100;
    return Math.round(22 * heightM * heightM);
  };

  // توليد سؤال الوزن المستهدف بناءً على الطول المدخل
  const getTargetWeightQuestion = () => {
    const height = userProfile?.height;
    if (!height) return lang === 'ar' ? 'ما هو الوزن المستهدف؟' : 'Target weight?';
    const ideal = getIdealWeight(height);
    return lang === 'ar'
      ? `الوزن المثالي لطولك هو ${ideal} كجم. هل ترغب في الوصول إلى هذا الوزن؟ (اكتب ${ideal} أو أي رقم آخر)`
      : `Your ideal weight is ${ideal} kg. Do you want to reach this weight? (enter ${ideal} or any other number)`;
  };

  const handleOnboardingAnswer = async (answer) => {
    const currentStep = onboardingStep;
    if (currentStep >= steps.length) return false;

    let stepKey = steps[currentStep].key;
    let processedAnswer = answer.trim();

    // معالجة خاصة للوزن المستهدف: إذا لم يُدخل المستخدم رقماً، استخدم الوزن المثالي
    if (stepKey === 'target_weight' && userProfile?.height) {
      const ideal = getIdealWeight(userProfile.height);
      // إذا أجاب بنعم أو موافق أو ترك فارغاً، استخدم المثالي
      if (processedAnswer === '' || processedAnswer === 'نعم' || processedAnswer === 'yes' || processedAnswer === 'ok') {
        processedAnswer = ideal.toString();
      }
    }

    // تحديث الملف الشخصي
    const updates = { [stepKey]: processedAnswer, onboarding_step: currentStep + 1 };
    const { error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', user.id);
    if (error) {
      console.error('Error saving answer:', error);
      return false;
    }

    setUserProfile(prev => ({ ...prev, ...updates }));
    setOnboardingStep(currentStep + 1);

    // إضافة رسالة المستخدم إلى المحادثة
    const userMsg = {
      role: 'user',
      content: answer,
      created_at: new Date().toISOString(),
      user_id: user.id
    };
    setMessages(prev => [...prev, userMsg]);

    // إذا اكتمل onboarding، قم بتوليد الخطة
    if (currentStep + 1 >= steps.length) {
      const loadingMsg = {
        role: 'assistant',
        content: lang === 'ar' ? 'جاري تجهيز خطتك الغذائية... يرجى الانتظار قليلاً.' : 'Preparing your meal plan... Please wait.',
        created_at: new Date().toISOString(),
        user_id: user.id
      };
      setMessages(prev => [...prev, loadingMsg]);
      await generatePlan();
      return true;
    }

    // عرض السؤال التالي
    let nextQuestion = '';
    const nextStep = steps[currentStep + 1];
    if (nextStep.key === 'target_weight') {
      nextQuestion = getTargetWeightQuestion();
    } else {
      nextQuestion = lang === 'ar' ? nextStep.questionAr : nextStep.questionEn;
    }

    const assistantMsg = {
      role: 'assistant',
      content: nextQuestion,
      created_at: new Date().toISOString(),
      user_id: user.id
    };
    setMessages(prev => [...prev, assistantMsg]);

    // حفظ الرسالتين
    await supabase.from('conversations').insert([
      { user_id: user.id, role: 'user', content: answer, created_at: new Date().toISOString() },
      { user_id: user.id, role: 'assistant', content: nextQuestion, created_at: new Date().toISOString() }
    ]);

    return true;
  };

  const generatePlan = async () => {
    try {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: profile, lang })
      });
      const result = await response.json();
      const planData = JSON.parse(result.plan);

      await supabase.from('weekly_plans').insert({
        user_id: user.id,
        week_number: 1,
        plan_data: planData
      });

      setCurrentPlan({ plan_data: planData });

      const successMsg = {
        role: 'assistant',
        content: lang === 'ar'
          ? '✨ تم إنشاء خطتك الغذائية بنجاح! يمكنك الآن سؤالي عن أي وجبة أو رفع صورة لتحليلها. اضغط على ☰ لعرض الخطة الأسبوعية.'
          : '✨ Your meal plan has been created! You can now ask me about any meal or upload a photo for analysis. Click ☰ to view your weekly plan.',
        created_at: new Date().toISOString(),
        user_id: user.id
      };
      setMessages(prev => [...prev, successMsg]);
      await supabase.from('conversations').insert(successMsg);
    } catch (err) {
      console.error('Plan generation error:', err);
      const errorMsg = {
        role: 'assistant',
        content: lang === 'ar' ? 'عذراً، حدث خطأ في إنشاء خطتك. حاول مجدداً لاحقاً.' : 'Sorry, an error occurred. Please try again later.',
        created_at: new Date().toISOString(),
        user_id: user.id
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const sendNormalMessage = async (text, imageUrl = null) => {
    const userMessage = {
      role: 'user',
      content: text || (imageUrl ? '📷 صورة وجبة' : ''),
      created_at: new Date().toISOString(),
      user_id: user.id
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const { data: fnData, error: fnErr } = await supabase.functions.invoke('send-message', {
        body: {
          message: text,
          userId: user.id,
          userProfile,
          currentPlan,
          recentMessages: messages.slice(-5),
          imageUrl
        }
      });
      if (fnErr) throw fnErr;
      const aiMessage = {
        role: 'assistant',
        content: fnData.reply,
        created_at: new Date().toISOString(),
        user_id: user.id
      };
      setMessages(prev => [...prev, aiMessage]);
      // لا نحفظ هنا لأن Edge Function تحفظ كلا الطرفين
    } catch (err) {
      console.error('sendNormalMessage error:', err);
      const errorReply = {
        role: 'assistant',
        content: lang === 'ar' ? 'عذراً، حدث خطأ، حاول مجدداً.' : 'Sorry, an error occurred. Please try again.',
        created_at: new Date().toISOString(),
        user_id: user.id
      };
      setMessages(prev => [...prev, errorReply]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() && !imageFile) return;

    // إذا كنا في مرحلة onboarding
    if (onboardingStep < steps.length) {
      await handleOnboardingAnswer(inputText.trim());
      setInputText('');   // مسح الحقل
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // بعد onboarding: إرسال رسالة عادية
    let imageUrl = null;
    if (imageFile) {
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(fileName, imageFile);
      if (uploadError) {
        console.error(uploadError);
        alert(lang === 'ar' ? 'فشل رفع الصورة' : 'Image upload failed');
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('meal-images').getPublicUrl(fileName);
      imageUrl = publicUrl;
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }

    await sendNormalMessage(inputText, imageUrl);
    setInputText('');
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

  const getPlaceholder = () => {
    if (onboardingStep < steps.length) {
      const step = steps[onboardingStep];
      if (step.key === 'target_weight') return getTargetWeightQuestion();
      return lang === 'ar' ? step.questionAr : step.questionEn;
    }
    return lang === 'ar' ? 'اكتب رسالتك أو ارفع صورة...' : 'Type your message or upload a photo...';
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: C.card, padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: C.text }}>☰</button>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: C.teal, margin: 0 }}>{lang === 'ar' ? 'قوت - مدربك الشخصي' : 'Qoot - Your Coach'}</h1>
        <div style={{ width: '24px' }} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
        {messages.map((msg, idx) => <ChatMessage key={idx} message={msg} lang={lang} />)}
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
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={getPlaceholder()}
            style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: `1px solid ${C.border}`, background: C.cardLight, color: C.text, fontSize: '14px', outline: 'none' }}
          />
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

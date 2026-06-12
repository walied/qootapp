import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import SidebarPlan from '../components/SidebarPlan';
import SidebarProfile from '../components/SidebarProfile';
import ChatMessage from '../components/ChatMessage';
import { C } from '../constants';

const AICoachScreen = () => {
  const { user, lang, setLang } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPlanSidebar, setShowPlanSidebar] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [gamification, setGamification] = useState({ xp: 0, level: 1, streak: 0, badges: [] });
  const [onboardingStep, setOnboardingStep] = useState(null); // null means onboarding finished
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadConversation();
      loadCurrentPlan();
      loadGamification();
      // Check if onboarding needed (profile missing fields)
      checkOnboardingStatus();
    }
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUserProfile = async () => {
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserProfile(docSnap.data().profile || {});
    }
  };

  const loadConversation = () => {
    const q = query(
      collection(db, 'users', user.uid, 'messages'),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
  };

  const loadCurrentPlan = async () => {
    const planRef = doc(db, 'users', user.uid, 'plan', 'current');
    const planSnap = await getDoc(planRef);
    if (planSnap.exists()) {
      setCurrentPlan(planSnap.data());
    }
  };

  const loadGamification = async () => {
    const gamRef = doc(db, 'users', user.uid, 'gamification', 'stats');
    const gamSnap = await getDoc(gamRef);
    if (gamSnap.exists()) {
      setGamification(gamSnap.data());
    }
  };

  const checkOnboardingStatus = async () => {
    const profile = userProfile;
    const requiredFields = ['firstName', 'currentWeight', 'height', 'age', 'targetWeight', 'activityLevel', 'country'];
    const missing = requiredFields.some(f => !profile?.[f]);
    if (missing) {
      setOnboardingStep(0);
      // Optionally redirect to onboarding screen, but here we'll handle via chat
    } else {
      setOnboardingStep(null);
    }
  };

  const updateGamification = async (points, action) => {
    const newXp = gamification.xp + points;
    const newLevel = Math.floor(newXp / 1000) + 1;
    const updates = { xp: newXp, level: newLevel };
    if (action === 'streak') {
      const today = new Date().toDateString();
      const lastActive = gamification.lastActiveDate;
      let newStreak = gamification.streak;
      if (lastActive !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastActive === yesterday) newStreak++;
        else newStreak = 1;
        updates.streak = newStreak;
        updates.lastActiveDate = today;
      }
    }
    await setDoc(doc(db, 'users', user.uid, 'gamification', 'stats'), updates, { merge: true });
    setGamification(prev => ({ ...prev, ...updates }));
  };

  const retrieveMemory = async () => {
    const memoryRef = collection(db, 'users', user.uid, 'memory');
    const snapshot = await getDocs(memoryRef);
    return snapshot.docs.map(doc => doc.data().observation);
  };

  const storeMemory = async (observation) => {
    await addDoc(collection(db, 'users', user.uid, 'memory'), {
      observation,
      timestamp: serverTimestamp()
    });
  };

  const callDeepSeek = async (messagesArray, userData, plan, memory) => {
    const systemPrompt = `أنت Qoot، مدرب صحي ذكي بالعربية. تتحدث اللهجة الخليجية والمصرية.
    خطة المستخدم الحالية: ${JSON.stringify(plan?.weekly_plan?.[0] || {})}
    وزنه: ${userData?.currentWeight} كجم، هدفه: ${userData?.targetWeight} كجم.
    ذاكرة العادات: ${memory.join(', ')}
    كن مختصراً وداعماً ولا تكرر النصائح.`;
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'system', content: systemPrompt }, ...messagesArray],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  };

  const sendMessage = async (text, imageUrl = null) => {
    const userMsg = {
      role: 'user',
      content: text || (imageUrl ? '📷 صورة وجبة' : ''),
      timestamp: serverTimestamp()
    };
    const msgRef = await addDoc(collection(db, 'users', user.uid, 'messages'), userMsg);
    setMessages(prev => [...prev, { id: msgRef.id, ...userMsg }]);

    setIsLoading(true);
    try {
      const memory = await retrieveMemory();
      const aiReply = await callDeepSeek(
        messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
        userProfile,
        currentPlan,
        memory
      );
      const aiMsg = {
        role: 'assistant',
        content: aiReply,
        timestamp: serverTimestamp()
      };
      const aiMsgRef = await addDoc(collection(db, 'users', user.uid, 'messages'), aiMsg);
      setMessages(prev => [...prev, { id: aiMsgRef.id, ...aiMsg }]);
      await updateGamification(5, 'chat');
    } catch (error) {
      console.error('DeepSeek error:', error);
      const errorMsg = {
        role: 'assistant',
        content: lang === 'ar' ? 'عذراً، حدث خطأ. حاول مجدداً.' : 'Sorry, an error occurred. Try again.',
        timestamp: serverTimestamp()
      };
      const errRef = await addDoc(collection(db, 'users', user.uid, 'messages'), errorMsg);
      setMessages(prev => [...prev, { id: errRef.id, ...errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeMealImage = async (file) => {
    const storageRef = ref(storage, `meal-images/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);
    // Call Gemini Vision API
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + import.meta.env.VITE_GEMINI_API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Analyze this meal photo. Estimate calories, protein, carbs, fat, and main ingredients. Respond in Arabic." },
            { inlineData: { mimeType: file.type, data: await fileToBase64(file) } }
          ]
        }]
      })
    });
    const data = await response.json();
    const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text || 'تعذر التحليل';
    // Store in meal_logs
    await addDoc(collection(db, 'meal_logs'), {
      userId: user.uid,
      imageUrl: downloadUrl,
      analysis,
      timestamp: serverTimestamp()
    });
    return analysis;
  };

  const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  const handleSendMessage = async () => {
    if (!inputText.trim() && !imageFile) return;
    let imageUrl = null;
    let analysisText = '';
    if (imageFile) {
      analysisText = await analyzeMealImage(imageFile);
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
    const finalText = inputText || (imageFile ? `📷 تحليل الوجبة: ${analysisText}` : '');
    await sendMessage(finalText, imageUrl);
    setInputText('');
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#151C2C] border-b border-[#334155] p-4 flex justify-between items-center">
        <div className="flex gap-3">
          <button onClick={() => setShowPlanSidebar(true)} className="text-2xl text-[#F8FAFC]">☰</button>
          <button onClick={() => setShowProfileSidebar(true)} className="text-2xl text-[#F8FAFC]">👤</button>
        </div>
        <h1 className="text-xl font-bold text-[#145952]">Qoot - {lang === 'ar' ? 'مدربك الشخصي' : 'Your Coach'}</h1>
        <div className="w-6"></div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} lang={lang} />
        ))}
        {isLoading && <div className="text-center text-[#94A3B8] p-2">{lang === 'ar' ? 'يجيب...' : 'Thinking...'}</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Image preview */}
      {imagePreview && (
        <div className="p-2 bg-[#1E293B] flex items-center gap-2">
          <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded" />
          <span className="flex-1 text-sm text-[#F8FAFC]">{imageFile?.name}</span>
          <button onClick={() => { setImageFile(null); setImagePreview(null); }} className="text-red-500 text-xl">✕</button>
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t border-[#334155] bg-[#0B0F19]">
        <div className="flex gap-2 items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={lang === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
            className="flex-1 px-4 py-3 rounded-full bg-[#1E293B] border border-[#334155] text-[#F8FAFC] focus:outline-none focus:border-[#145952]"
          />
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageSelect} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="bg-[#1E293B] border border-[#334155] rounded-full w-12 h-12 text-2xl">📷</button>
          <button onClick={handleSendMessage} disabled={isLoading || (!inputText.trim() && !imageFile)} className="bg-[#145952] rounded-full px-5 py-3 text-white font-semibold disabled:opacity-50">➤</button>
        </div>
      </div>

      {/* Sidebars */}
      <SidebarPlan isOpen={showPlanSidebar} onClose={() => setShowPlanSidebar(false)} plan={currentPlan} gamification={gamification} lang={lang} />
      <SidebarProfile isOpen={showProfileSidebar} onClose={() => setShowProfileSidebar(false)} userProfile={userProfile} lang={lang} onUpdate={async (data) => { /* update profile and regenerate plan */ }} />
    </div>
  );
};

export default AICoachScreen;

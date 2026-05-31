// src/context/AppContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { C } from '../constants';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState('ar');
  const [screen, setScreen] = useState('landing');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userMetrics, setUserMetrics] = useState({ level: 1, xp: 0, streak: 0, badges: [] });
  const [messages, setMessages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
        fetchCurrentPlan(session.user.id);
        if (screen !== 'coach') setScreen('coach');
      } else {
        setUser(null);
        setUserProfile(null);
        setCurrentPlan(null);
        setMessages([]);
        setOnboardingStep(0);
        if (screen !== 'landing') setScreen('landing');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
        fetchCurrentPlan(session.user.id);
        setScreen('coach');
      } else {
        setUser(null);
        setUserProfile(null);
        setCurrentPlan(null);
        setMessages([]);
        setOnboardingStep(0);
        setScreen('landing');
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      if (data) {
        setUserProfile(data);
        setOnboardingStep(data.onboarding_step ?? 0);
      } else {
        const defaultProfile = {
          user_id: userId,
          onboarding_step: 0,
          diet_type: 'لا شيء',
          allergies: 'لا شيء',
          medications: 'لا شيء',
          eating_out: '0-1'
        };
        await supabase.from('user_profiles').insert(defaultProfile);
        setOnboardingStep(0);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchCurrentPlan = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('weekly_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);
      if (error) throw error;
      if (data && data.length) setCurrentPlan(data[0]);
    } catch (err) {
      console.error('Error fetching plan:', err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert(lang === 'ar' ? 'فشل تسجيل الدخول، حاول مجدداً' : 'Sign-in failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id);
      if (error) throw error;
      setUserProfile(prev => ({ ...prev, ...updates }));
    } catch (err) {
      console.error('Profile update error:', err);
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id);
      if (error) throw error;
      setUserProfile(prev => ({ ...prev, ...updates }));
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  const regeneratePlan = async () => {
    if (!user || !userProfile) return false;
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: userProfile, lang })
      });
      const result = await response.json();
      const planData = JSON.parse(result.plan);
      const { error } = await supabase.from('weekly_plans').insert({
        user_id: user.id,
        week_number: (currentPlan?.week_number || 0) + 1,
        plan_data: planData
      });
      if (error) throw error;
      setCurrentPlan({ plan_data: planData });
      return true;
    } catch (err) {
      console.error('Regenerate plan error:', err);
      return false;
    }
  };

  const inp = (extra = {}) => ({
    width: "100%", background: "#1E293B", border: `2px solid #334155`, borderRadius: 12,
    padding: "15px 18px", fontSize: 16, color: "#F8FAFC",
    fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",
    outline: "none", direction: lang === "ar" ? "rtl" : "ltr", transition: "border 0.2s", ...extra
  });

  const contextValue = {
    lang, setLang,
    screen, setScreen,
    loading, setLoading,
    supabase,
    user, setUser,
    userProfile, setUserProfile,
    userMetrics, setUserMetrics,
    messages, setMessages,
    currentPlan, setCurrentPlan,
    onboardingStep, setOnboardingStep,
    signInWithGoogle,
    updateProfile,
    updateUserProfile,
    regeneratePlan,
    fetchUserProfile, fetchCurrentPlan,
    inp,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

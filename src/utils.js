import { useState, useEffect } from "react";
import { COUNTRIES } from "./constants";

export const searchCountry = (q) => {
  if (!q.trim()) return [];
  const t = q.trim().toLowerCase();
  return COUNTRIES.filter(c =>
    c.nameAr.toLowerCase().includes(t) ||
    c.nameEn.toLowerCase().includes(t)
  ).slice(0, 8);
};

export const fullName = (a) => `${a.first_name || ""} ${a.last_name || ""}`.trim();

export const clientID = (a, role = "customer") => {
  const last4 = role === "specialist" ? "****" : (a.phone || "").replace(/\D/g, "").slice(-4);
  const country = role === "specialist" ? "hidden" : (a.country || "").replace(/\s/g, "-");
  return `${a.first_name || ""}${a.last_name || ""}-${country}-${last4}`.toLowerCase();
};

export function useDebounce(value, delay = 200) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

export function safeParseJSON(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("no json found");
  try { return JSON.parse(match[0]); } catch (firstError) {
    console.warn("First JSON parse attempt failed, attempting repair:", firstError.message);
  }
  let s = match[0];
  const quoteCount = (s.match(/(?<!\\)"/g) || []).length;
  if (quoteCount % 2 !== 0) s += '"';
  const opens = [];
  for (const ch of s) {
    if (ch === '{') opens.push('}');
    else if (ch === '[') opens.push(']');
    else if (ch === '}' || ch === ']') opens.pop();
  }
  s += opens.reverse().join('');
  try { return JSON.parse(s); } catch (secondError) {
    throw new Error("JSON parse failed after repair: " + secondError.message);
  }
}

// ===================== NORMALIZE PLAN (FINAL FIX) =====================
export function normalizePlan(rawPlan, userData, lang) {
  // If AI returned a valid weekly_plan, use it directly and ensure it's complete
  const plan = { ...rawPlan };

  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = lang === 'ar' ? daysAr : daysEn;

  let weeklyPlan = [];
  if (Array.isArray(plan.weekly_plan) && plan.weekly_plan.length > 0) {
    weeklyPlan = plan.weekly_plan.slice(0, 7).map((day, i) => {
      const safeMeal = (meal) => {
        if (!meal) return { options: ['وجبة مقترحة'], macros: '' };
        if (typeof meal === 'string') return { options: [meal], macros: '' };
        return {
          options: Array.isArray(meal.options) ? meal.options : (Array.isArray(meal) ? meal : [meal]),
          macros: meal.macros || ''
        };
      };
      return {
        day: day.day || days[i],
        breakfast: safeMeal(day.breakfast),
        lunch: safeMeal(day.lunch),
        dinner: safeMeal(day.dinner),
        snack: safeMeal(day.snack)
      };
    });
  }
  // Fill missing days
  while (weeklyPlan.length < 7) {
    weeklyPlan.push({
      day: days[weeklyPlan.length],
      breakfast: { options: ['وجبة مقترحة'], macros: '' },
      lunch: { options: ['وجبة مقترحة'], macros: '' },
      dinner: { options: ['وجبة مقترحة'], macros: '' },
      snack: { options: ['وجبة خفيفة'], macros: '' }
    });
  }

  return {
    human_intro: plan.human_intro || (lang === 'ar' ? `مرحباً ${userData.first_name || ''}!` : `Welcome ${userData.first_name || ''}!`),
    target_calories: plan.target_calories || 1800,
    daily_macros: plan.daily_macros || { protein: '120g', carbs: '150g', fats: '60g' },
    weight_to_lose: plan.weight_to_lose || 10,
    expected_weeks: plan.expected_weeks || 12,
    weekly_plan: weeklyPlan,
    home_workout: plan.home_workout || plan.exercise || 'تمارين منزلية يومية',
    tips: Array.isArray(plan.tips) ? plan.tips : (plan.tips ? [plan.tips] : ['اتبع خطتك']),
    specialist_notes: plan.specialist_notes || ''
  };
}

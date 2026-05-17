import { useState, useEffect } from "react";
import { COUNTRY_DATA } from "./constants";

// ===================== COUNTRY SEARCH =====================
export const searchCountry = (q) => {
  if (!q.trim()) return [];
  const t = q.trim().toLowerCase();
  return COUNTRY_DATA.filter(c =>
    c.aliases.some(a => a.includes(t) || t.includes(a))
  ).slice(0, 8);
};

// ===================== FULL NAME =====================
export const fullName = (a) => `${a.first_name || ""} ${a.last_name || ""}`.trim();

// ===================== CLIENT ID =====================
export const clientID = (a, role = "customer") => {
  const last4 = role === "specialist" ? "****" : (a.phone || "").replace(/\D/g, "").slice(-4);
  const country = role === "specialist" ? "hidden" : (a.country || "").replace(/\s/g, "-");
  return `${a.first_name || ""}${a.last_name || ""}-${country}-${last4}`.toLowerCase();
};

// ===================== DEBOUNCE HOOK =====================
export function useDebounce(value, delay = 200) {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return dv;
}

// ===================== SAFE JSON PARSER =====================
export function safeParseJSON(raw) {
  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("no json found");
  try {
    return JSON.parse(match[0]);
  } catch (firstError) {
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
  try {
    return JSON.parse(s);
  } catch (secondError) {
    throw new Error("JSON parse failed after repair: " + secondError.message);
  }
}

// ===================== NORMALIZE PLAN =====================
export function normalizePlan(rawPlan, userData, lang) {
  if (rawPlan.human_intro && rawPlan.weekly_plan) return rawPlan;
  const p = rawPlan;

  // Calories
  let targetCalories = 1800;
  const calSources = [
    p.daily_calories, p.target_calories,
    p.التقييم?.["السعرات اليومية"],
    p.diet_plan?.daily_calories_target,
    p.diet_plan?.calories_per_day,
    p.meal_plan?.daily_calories_target,
    p.meal_plan?.calories_per_day
  ];
  for (const src of calSources) {
    if (src) {
      const match = String(src).match(/(\d+)/);
      if (match) { targetCalories = parseInt(match[1]); break; }
    }
  }

  // Weight to lose
  let weightToLose = 15;
  if (p.weight_to_lose) weightToLose = p.weight_to_lose;
  else if (p.التقييم?.["الوزن المطلوب فقدانه"]) weightToLose = parseInt(p.التقييم["الوزن المطلوب فقدانه"]) || weightToLose;
  else if (userData.current_weight && userData.target_weight) weightToLose = Math.max(0, userData.current_weight - userData.target_weight);

  // Macros
  let dailyMacros = { protein: '120g', carbs: '150g', fats: '60g' };
  const macroSrc = p.macros || p.daily_macros || p.diet_plan?.macros || p.diet_plan?.macronutrients || p.meal_plan?.macros || p.meal_plan?.macronutrients;
  if (macroSrc) {
    dailyMacros = {
      protein: macroSrc.protein || macroSrc.protein_g || '120g',
      carbs: macroSrc.carbs || macroSrc.carbs_g || '150g',
      fats: macroSrc.fats || macroSrc.fat_g || macroSrc.fat || '60g'
    };
    Object.keys(dailyMacros).forEach(k => {
      const m = String(dailyMacros[k]).match(/(\d+)\s*g/);
      if (m) dailyMacros[k] = m[0];
    });
  }

  // Intro
  const tipsArr = p.nutritional_tips || p.general_advice || p.نصائح_عامة || p.نصائح_إضافية || p.additional_advice || p.diet_plan?.notes || p.meal_plan?.notes || p.tips || [];
  let humanIntro = lang === 'ar' ? `مرحباً ${userData.first_name || ''}! خطتك جاهزة.` : `Welcome ${userData.first_name || ''}! Your plan is ready.`;
  if (Array.isArray(tipsArr) && tipsArr.length > 0) humanIntro = tipsArr[0];

  // Weekly plan
  const daysAr = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const daysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const days = lang === 'ar' ? daysAr : daysEn;
  const mealSource = p.meal_plan || p.diet_plan?.meal_alternatives || p.diet_plan?.meals || p.نظام_الوجبات || p.meals || {};

  const getOptions = (meal) => {
    if (!meal) return ['وجبة مقترحة'];
    if (typeof meal === 'string') return [meal];
    if (Array.isArray(meal)) {
      if (meal.every(item => typeof item === 'string')) return meal;
      return meal.map(item => typeof item === 'string' ? item : (item.meal || item.name || item.description || item.option || Object.values(item).join(' / ')));
    }
    return Object.values(meal).map(v => typeof v === 'string' ? v : (v.meal || v.name || JSON.stringify(v)));
  };

  const breakfast = getOptions(mealSource.breakfast || mealSource.الإفطار);
  const lunch = getOptions(mealSource.lunch || mealSource.الغداء);
  const dinner = getOptions(mealSource.dinner || mealSource.العشاء);
  const snack = getOptions(mealSource.snacks || mealSource.snack || mealSource["وجبة خفيفة"] || mealSource["وجبات خفيفة"] || []);
  const weeklyPlan = [];
  for (let i = 0; i < 7; i++) {
    weeklyPlan.push({
      day: days[i],
      breakfast: { options: breakfast, macros: '' },
      lunch: { options: lunch, macros: '' },
      dinner: { options: dinner, macros: '' },
      snack: { options: snack, macros: '' }
    });
  }

  // Home workout
  let homeWorkout = '';
  const wo = p.home_exercise_plan || p.home_exercise_routine || p.diet_plan?.home_exercises || p.تمارين_رياضية_منزلية || p.رياضة_منزلية || p.home_workout;
  if (typeof wo === 'string') homeWorkout = wo;
  else if (wo && typeof wo === 'object') {
    const parts = [];
    if (wo.schedule) parts.push(wo.schedule);
    if (wo.exercises && Array.isArray(wo.exercises)) {
      parts.push(wo.exercises.map((ex, idx) => `${idx+1}. ${ex.name || ex}${ex.sets ? ` (${ex.sets} مجموعات × ${ex.reps || ex.duration_secs})` : ''}`).join('\n'));
    }
    if (wo.warm_up) parts.push(`الإحماء: ${wo.warm_up}`);
    if (wo.cool_down) parts.push(`التهدئة: ${wo.cool_down}`);
    homeWorkout = parts.join('\n\n');
  }
  if (!homeWorkout) homeWorkout = 'تمارين منزلية يومية';

  // Tips
  const tips = tipsArr && Array.isArray(tipsArr) ? tipsArr : ['اتبع خطتك'];

  // Specialist notes
  let specialistNotes = '';
  if (p.إرشادات_السكري_والضغط) specialistNotes = JSON.stringify(p.إرشادات_السكري_والضغط);
  else if (p.specialist_notes) specialistNotes = p.specialist_notes;

  return {
    human_intro: humanIntro,
    target_calories: targetCalories,
    daily_macros: dailyMacros,
    weight_to_lose: weightToLose,
    expected_weeks: Math.ceil(weightToLose / 0.5),
    weekly_plan: weeklyPlan,
    home_workout: homeWorkout,
    tips: tips,
    specialist_notes: specialistNotes
  };
}

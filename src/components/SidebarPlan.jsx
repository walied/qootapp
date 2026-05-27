import React from 'react';
import { C } from '../constants';

const SidebarPlan = ({ isOpen, onClose, plan, userMetrics, lang, weekProgress }) => {
  if (!isOpen) return null;
  const xp = userMetrics?.xp || 0;
  const level = userMetrics?.level || 1;
  const xpProgress = (xp % 1000) / 10;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, width: '320px', maxWidth: '85%', height: '100vh', background: C.bg, boxShadow: '-4px 0 12px rgba(0,0,0,0.15)', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: C.text }}>{lang === 'ar' ? 'خطتي' : 'My Plan'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: C.muted }}>✕</button>
        </div>
        <div style={{ background: C.card, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: C.text, fontWeight: '600' }}>{lang === 'ar' ? 'المستوى' : 'Level'} {level}</span>
              <span style={{ color: C.muted, fontSize: '14px' }}>{xp % 1000} / 1000 XP</span>
            </div>
            <div style={{ height: '8px', background: C.bg, borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: `linear-gradient(90deg, ${C.teal}, ${C.purple})`, width: `${xpProgress}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <div><div style={{ color: C.text, fontWeight: '600' }}>{userMetrics?.streak || 0} {lang === 'ar' ? 'يوم متتالي' : 'Day Streak'}</div><div style={{ color: C.muted, fontSize: '12px' }}>{lang === 'ar' ? 'استمر!' : 'Keep it up!'}</div></div>
          </div>
        </div>
        {weekProgress && (
          <div style={{ background: C.card, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ color: C.text, fontWeight: '600', marginBottom: '8px' }}>{lang === 'ar' ? 'التقدم الأسبوعي' : 'Weekly Progress'}</div>
            <div style={{ color: C.muted, fontSize: '14px' }}>{lang === 'ar' ? `اليوم ${weekProgress.currentDay} من الأسبوع ${weekProgress.weekNumber}` : `Day ${weekProgress.currentDay} of Week ${weekProgress.weekNumber}`}</div>
            {weekProgress.daysRemaining > 0 && <div style={{ color: C.teal, fontSize: '13px', marginTop: '4px' }}>{lang === 'ar' ? `باقي ${weekProgress.daysRemaining} يوم` : `${weekProgress.daysRemaining} days remaining`}</div>}
          </div>
        )}
        {plan?.plan_data?.weekly_plan ? (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: C.text, marginBottom: '16px' }}>{lang === 'ar' ? 'الخطة الأسبوعية' : 'Weekly Plan'}</h3>
            {plan.plan_data.weekly_plan.map((day, idx) => (
              <div key={idx} style={{ background: C.card, borderRadius: '12px', padding: '14px', marginBottom: '12px' }}>
                <div style={{ fontWeight: '600', color: C.text, marginBottom: '10px' }}>{day.day}</div>
                {['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
                  const m = day[meal];
                  if (!m || !m.options) return null;
                  const labels = { breakfast: lang==='ar'?'فطور':'Breakfast', lunch: lang==='ar'?'غداء':'Lunch', dinner: lang==='ar'?'عشاء':'Dinner', snack: lang==='ar'?'سناك':'Snack' };
                  return <div key={meal} style={{ marginBottom: '8px' }}><div style={{ fontSize: '12px', color: C.muted }}>{labels[meal]}</div><div style={{ fontSize: '14px', color: C.text }}>{m.options.join('، ')}</div>{m.macros && <div style={{ fontSize: '12px', color: C.teal }}>{m.macros}</div>}</div>;
                })}
              </div>
            ))}
          </div>
        ) : <div style={{ textAlign: 'center', color: C.muted, padding: '20px' }}>{lang === 'ar' ? 'لا توجد خطة بعد' : 'No plan yet'}</div>}
      </div>
    </>
  );
};

export default SidebarPlan;

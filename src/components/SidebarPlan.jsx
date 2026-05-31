import React, { useState } from 'react';
import { C } from '../constants';

const SidebarPlan = ({ isOpen, onClose, plan, userMetrics, lang, weekProgress, userProfile, onPayment }) => {
  const [currentDayIndex, setCurrentDayIndex] = useState(weekProgress ? weekProgress.currentDay - 1 : 0);
  const daysInWeek = 7;

  if (!isOpen) return null;

  const xp = userMetrics?.xp || 0;
  const level = userMetrics?.level || 1;
  const xpProgress = (xp % 1000) / 10;

  const currentDayPlan = plan?.plan_data?.weekly_plan?.[currentDayIndex];
  const currentDayName = currentDayPlan?.day || (lang === 'ar' ? `اليوم ${currentDayIndex + 1}` : `Day ${currentDayIndex + 1}`);

  // تنظيف الخيارات من كلمة "أو" الزائدة
  const cleanOptions = (options) => {
    if (!options) return [];
    let opts = Array.isArray(options) ? options : [options];
    // إزالة العناصر التي هي "أو" فقط
    opts = opts.filter(opt => {
      if (typeof opt !== 'string') return true;
      const trimmed = opt.trim();
      return trimmed !== 'أو' && trimmed !== 'or';
    });
    // إزالة "أو" من بداية أو نهاية النص
    opts = opts.map(opt => {
      if (typeof opt !== 'string') return opt;
      return opt.replace(/^أو\s*/i, '').replace(/\s*أو$/i, '').trim();
    });
    return opts.filter(opt => opt && opt !== '');
  };

  const renderMeal = (mealData, mealLabel) => {
    if (!mealData) return null;
    const options = cleanOptions(mealData.options);
    if (options.length === 0) return null;

    return (
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: C.muted, marginBottom: '4px' }}>{mealLabel}</div>
        {options.map((opt, idx) => (
          <div key={idx} style={{ fontSize: '14px', color: C.text, marginBottom: '4px' }}>
            {opt}
            {idx < options.length - 1 && (
              <span style={{ color: C.amber, marginLeft: '4px', marginRight: '4px', fontWeight: 'bold' }}> أو </span>
            )}
          </div>
        ))}
        {mealData.macros && (
          <div style={{ fontSize: '12px', color: C.teal, marginTop: '4px' }}>{mealData.macros}</div>
        )}
      </div>
    );
  };

  const goPrevDay = () => {
    if (currentDayIndex > 0) setCurrentDayIndex(currentDayIndex - 1);
  };

  const goNextDay = () => {
    if (currentDayIndex < daysInWeek - 1) setCurrentDayIndex(currentDayIndex + 1);
  };

  const workout = currentDayPlan?.workout || (plan?.plan_data?.home_workout ? (typeof plan.plan_data.home_workout === 'string' ? plan.plan_data.home_workout : '') : '');
  const tips = plan?.plan_data?.tips || [];

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
      <div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '340px',
        maxWidth: '85%',
        height: '100vh',
        background: C.bg,
        boxShadow: '-4px 0 12px rgba(0,0,0,0.15)',
        zIndex: 1000,
        overflowY: 'auto',
        padding: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: C.text }}>{lang === 'ar' ? 'خطتي' : 'My Plan'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: C.muted }}>✕</button>
        </div>

        {/* Gamification */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🔥</span>
            <div><div style={{ color: C.text, fontWeight: '600' }}>{userMetrics?.streak || 0} {lang === 'ar' ? 'يوم متتالي' : 'Day Streak'}</div><div style={{ color: C.muted, fontSize: '12px' }}>{lang === 'ar' ? 'استمر!' : 'Keep it up!'}</div></div>
          </div>
        </div>

        {/* Week Progress */}
        {weekProgress && (
          <div style={{ background: C.card, borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: C.text, fontWeight: '600', marginBottom: '4px' }}>{lang === 'ar' ? 'التقدم الأسبوعي' : 'Weekly Progress'}</div>
                <div style={{ color: C.muted, fontSize: '14px' }}>
                  {lang === 'ar' ? `اليوم ${weekProgress.currentDay} من الأسبوع ${weekProgress.weekNumber}` : `Day ${weekProgress.currentDay} of Week ${weekProgress.weekNumber}`}
                </div>
                {weekProgress.daysRemaining > 0 && <div style={{ color: C.teal, fontSize: '13px', marginTop: '4px' }}>{lang === 'ar' ? `باقي ${weekProgress.daysRemaining} يوم` : `${weekProgress.daysRemaining} days remaining`}</div>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={goPrevDay} disabled={currentDayIndex === 0} style={{ background: C.cardLight, border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: currentDayIndex === 0 ? 'not-allowed' : 'pointer', opacity: currentDayIndex === 0 ? 0.5 : 1 }}>←</button>
                <button onClick={goNextDay} disabled={currentDayIndex === daysInWeek - 1} style={{ background: C.cardLight, border: 'none', borderRadius: '8px', padding: '6px 10px', cursor: currentDayIndex === daysInWeek - 1 ? 'not-allowed' : 'pointer', opacity: currentDayIndex === daysInWeek - 1 ? 0.5 : 1 }}>→</button>
              </div>
            </div>
          </div>
        )}

        {/* Today's Plan */}
        {currentDayPlan ? (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: C.text, marginBottom: '16px' }}>{currentDayName}</h3>
            {renderMeal(currentDayPlan.breakfast, lang === 'ar' ? 'فطور' : 'Breakfast')}
            {renderMeal(currentDayPlan.lunch, lang === 'ar' ? 'غداء' : 'Lunch')}
            {renderMeal(currentDayPlan.dinner, lang === 'ar' ? 'عشاء' : 'Dinner')}
            {renderMeal(currentDayPlan.snack, lang === 'ar' ? 'سناك' : 'Snack')}

            {workout && (
              <div style={{ marginTop: '16px', background: C.cardLight, borderRadius: '12px', padding: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: C.teal, marginBottom: '8px' }}>🏋️ {lang === 'ar' ? 'تمارين اليوم' : 'Today\'s Exercise'}</div>
                <div style={{ fontSize: '13px', color: C.text, lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{workout}</div>
              </div>
            )}

            {tips.length > 0 && (
              <div style={{ marginTop: '16px', background: C.cardLight, borderRadius: '12px', padding: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: C.teal, marginBottom: '8px' }}>💡 {lang === 'ar' ? 'نصائح اليوم' : 'Today\'s Tips'}</div>
                {tips.map((tip, idx) => (
                  <div key={idx} style={{ fontSize: '13px', color: C.text, marginBottom: '6px' }}>✓ {tip}</div>
                ))}
              </div>
            )}

            <div style={{ marginTop: '24px', padding: '16px', background: C.card, borderRadius: '12px', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: '14px', fontWeight: '600', color: C.text, marginBottom: '8px' }}>
                {lang === 'ar' ? '💳 الاشتراك الأسبوعي' : '💳 Weekly Subscription'}
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: C.teal, marginBottom: '12px' }}>
                $2.99 / {lang === 'ar' ? 'أسبوع' : 'week'}
              </div>
              <button
                onClick={onPayment}
                style={{
                  width: '100%',
                  background: `linear-gradient(135deg, #003087, #009cde)`,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <span>🅿️</span>
                <span>{lang === 'ar' ? 'ادفع عبر PayPal' : 'Pay with PayPal'}</span>
              </button>
              <p style={{ fontSize: '11px', color: C.muted, textAlign: 'center', marginTop: '8px' }}>
                {lang === 'ar' ? 'دفع آمن · إلغاء في أي وقت' : 'Secure payment · Cancel anytime'}
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: C.muted, padding: '20px' }}>{lang === 'ar' ? 'لا توجد خطة بعد' : 'No plan yet'}</div>
        )}
      </div>
    </>
  );
};

export default SidebarPlan;

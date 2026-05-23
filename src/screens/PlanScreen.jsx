// src/screens/PlanScreen.jsx (final)
import { useApp } from "../context/AppContext";
import { C, T, COUNTRIES } from "../constants";
import { fullName } from "../utils";
import SignOutButton from "../components/SignOutButton";

const PAY = { /* same as before */ };

function renderTextWithLinks(text) {
  if (!text) return text;
  const urlRegex = /(https?:\/\/wa\.me\/\d+|wa\.\d+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, i) => {
    if (part && part.match(urlRegex)) {
      let href = part;
      if (part.startsWith('wa.')) href = 'https://wa.me/' + part.slice(3);
      return <a key={i} href={href} target="_blank" rel="noopener noreferrer" style={{ color: C.teal, textDecoration: 'underline' }}>{part}</a>;
    }
    return part;
  });
}

// Demo plan with detailed weights and exact welcome message
function getDetailedDemoPlan(lang, firstName, country) {
  const days = lang === 'ar'
    ? ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const mealsWithWeights = {
    breakfast: {
      ar: [
        'بيض مسلوق (2 بيضة) + خبز أسمر (50g) + خيار (50g)',
        'شوفان (40g) مع حليب (200ml) وموزة (100g)',
        'فول مدمس (150g) + خبز بلدي (50g) + طماطم (50g)'
      ],
      en: [
        '2 boiled eggs + 50g whole wheat bread + 50g cucumber',
        '40g oats with 200ml milk + 100g banana',
        '150g fava beans + 50g local bread + 50g tomato'
      ]
    },
    lunch: {
      ar: [
        'صدر دجاج مشوي (150g) + أرز مصري مطبوخ (200g) + سلطة خضراء (100g)',
        'سمك بلطي مشوي (200g) + خضار مسلوقة (150g) + أرز (150g)',
        'عدس (100g) + أرز (150g) + خيار وطماطم (100g)'
      ],
      en: [
        '150g grilled chicken breast + 200g cooked local rice + 100g green salad',
        '200g grilled tilapia + 150g boiled vegetables + 150g rice',
        '100g lentils + 150g rice + 100g cucumber/tomato'
      ]
    },
    dinner: {
      ar: [
        'زبادي (200g) + خيار (100g) + خبز أسمر (50g)',
        'جبنة قريش (150g) + طماطم (100g) + خس (50g)',
        'شوربة عدس (250ml) + خبز بلدي (50g)'
      ],
      en: [
        '200g yogurt + 100g cucumber + 50g whole wheat bread',
        '150g cottage cheese + 100g tomato + 50g lettuce',
        '250ml lentil soup + 50g local bread'
      ]
    },
    snack: {
      ar: ['تفاحة (150g)', 'موزة (120g)', 'برتقال (150g)', 'حفنة فول سوداني (30g)'],
      en: ['150g apple', '120g banana', '150g orange', '30g unsalted peanuts']
    }
  };

  const workoutByDay = {
    ar: [
      'تمرين خفيف: مشي سريع 20 دقيقة + تمارين إطالة (بعد الفطار)',
      'تمارين منزلية: ضغط (3×10)، قرفصاء (3×15)، بلانك 30 ثانية (بعد العشاء)',
      'كارديو: قفز بالحبل 15 دقيقة + تمارين بطن (بعد الفطار)',
      'يوغا أو تمدد عميق 20 دقيقة (في أي وقت)',
      'تمارين مقاومة باستخدام زجاجات ماء (3×15) (بعد الغداء)',
      'تمارين كارديو منزلية: قفز النجم، ركض في المكان (15 دقيقة) (بعد الفطار)',
      'تمارين شاملة: ضغط، قرفصاء، بلانك، كارديو خفيف (20 دقيقة) (بعد العشاء)'
    ],
    en: [
      'Light exercise: 20 min brisk walk + stretching (after breakfast)',
      'Home workout: push-ups 3x10, squats 3x15, plank 30s (after dinner)',
      'Cardio: 15 min jump rope + abs (after breakfast)',
      'Yoga/deep stretch 20 min (anytime)',
      'Resistance with water bottles 3x15 (after lunch)',
      'Home cardio: star jumps, jog in place 15 min (after breakfast)',
      'Full workout: push-ups, squats, plank, light cardio 20 min (after dinner)'
    ]
  };

  const weeklyPlan = days.map((day, idx) => ({
    day: day,
    breakfast: { options: mealsWithWeights.breakfast[lang], macros: 'بروتين: 20g | كارب: 35g | دهون: 12g' },
    lunch: { options: mealsWithWeights.lunch[lang], macros: 'بروتين: 35g | كارب: 45g | دهون: 15g' },
    dinner: { options: mealsWithWeights.dinner[lang], macros: 'بروتين: 20g | كارب: 25g | دهون: 8g' },
    snack: { options: mealsWithWeights.snack[lang], macros: 'بروتين: 5g | كارب: 20g | دهون: 5g' },
    workout: workoutByDay[lang][idx % 7],
    exercise_time: workoutByDay[lang][idx % 7].match(/\((.*?)\)/)?.[1] || (idx % 2 === 0 ? 'بعد الفطار' : 'بعد العشاء')
  }));

  const welcomeMessage = lang === 'ar'
    ? `✦ خطتك أصبحت جاهزة ✦

مرحباً ${firstName || ''}،
بعد مراجعة جميع بياناتك بدقة — العمر، الوزن، الطول، مستوى النشاط، الحالة الصحية، العادات الغذائية، وتوفر المنتجات المحلية في بلدك — قمنا بإعداد خطة مخصصة لك بالكامل بهدف خسارة 5 كجم خلال 10 أسابيع بإذن الله.

نحن لا نقدم "رجيم مؤقت"، بل برنامج عملي يناسب حياتك اليومية ويعتمد على أبسط وأرخص المكونات المتوفرة محلياً، بدون أي تكاليف إضافية أو منتجات مبالغ في سعرها. هدفنا أن تستمر بسهولة، وليس أن تتعب ثم تتوقف.

✦ ما يميز برنامجك:
• متابعة شخصية خاصة بك أسبوعياً
• تعديل الخطة حسب تقدمك ووزنك
• دعم وتحفيز مستمر خطوة بخطوة
• خصوصية تامة لبياناتك ونتائجك
• نظام مرن يناسب نمط حياتك الحقيقي

تذكر دائماً:
النتائج الكبيرة تبدأ بخطوات صغيرة ثابتة، ونحن سنكون معك في كل خطوة حتى تصل لهدفك بثقة وراحة.

للتواصل المباشر مع المتخصص والمتابعة الشخصية:
https://wa.me/96598002104`
    : `✦ Your plan is ready ✦

Hello ${firstName || ''},
After carefully reviewing all your data — age, weight, height, activity level, health status, eating habits, and availability of local products in your country — we have prepared a fully personalized plan with the goal of losing 5 kg in 10 weeks, God willing.

We do not offer a "temporary diet", but a practical program that fits your daily life and relies on the simplest and cheapest locally available ingredients, with no extra costs or overpriced products. Our goal is for you to continue easily, not to get tired and stop.

✦ What makes your program special:
• Personal weekly follow-up
• Plan adjustment based on your progress and weight
• Continuous support and motivation step by step
• Complete privacy of your data and results
• Flexible system that suits your real lifestyle

Always remember:
Great results start with small consistent steps, and we will be with you every step of the way until you reach your goal with confidence and comfort.

For direct contact with the specialist and personal follow-up:
https://wa.me/96598002104`;

  return {
    human_intro: welcomeMessage,
    target_calories: 1800,
    daily_macros: { protein: '120g', carbs: '150g', fats: '50g' },
    weight_to_lose: 5,
    expected_weeks: 10,
    weekly_plan: weeklyPlan,
    tips: [
      '🍽️ تناول 4 وجبات صغيرة يومياً بدلاً من وجبتين كبيرتين.',
      '💧 اشرب كوب ماء قبل كل وجبة بـ 10 دقائق.',
      '🍽️ استخدم طبقاً أصغر للتحكم في كمية الطعام.',
      '🚶 امش 10 دقائق بعد الوجبات الرئيسية.',
      '🍎 تناول الفواكه الكاملة بدلاً من العصائر.'
    ],
    specialist_notes: ''
  };
}

export default function PlanScreen() {
  const { /* all context values */ } = useApp();
  // Use the detailed demo plan (or replace with API data if needed)
  const plan = getDetailedDemoPlan(lang, answers.first_name, answers.country);
  // ... rest of the component exactly as before, but using `plan` from above
  // (keep all the rendering logic, but ensure workout and exercise_time are displayed)
}

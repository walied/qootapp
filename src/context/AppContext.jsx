import { supabase } from "../lib/supabaseClient";
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { searchCountry, useDebounce } from "../utils";
import { T } from "../constants";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [lang, setLang] = useState("ar");
  const [screen, setScreen] = useState("landing");
  const [answers, setAnswers] = useState({});
  const [currentQ, setCurrentQ] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [selected, setSelected] = useState([]);
  const [plan, setPlan] = useState(null);
  const [loadMsg, setLoadMsg] = useState("");
  const [approved, setApproved] = useState(false);
  const [activeDay, setActiveDay] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [gamification, setGamification] = useState({ level: 1, xp: 0, streak: 0, badges: [] });
  const [customTarget, setCustomTarget] = useState("");
  const [targetMode, setTargetMode] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countrySelected, setCountrySelected] = useState("");
  const [weekNum, setWeekNum] = useState(1);
  const [followUp, setFollowUp] = useState({});
  const [followStep, setFollowStep] = useState(0);
  const [followApproved, setFollowApproved] = useState(false);
  const [paid, setPaid] = useState(false);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState("");
  const [role, setRole] = useState("customer");
  const [loginPass, setLoginPass] = useState("");
  const inputRef = useRef(null);
  const [uid, setUid] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [viewedUserId, setViewedUserId] = useState(null);

  // ========== Google Sign-In ==========
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err.message };
    }
  };

  // ========== Supabase Auth – restore session + listen for changes ==========
  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUid(session.user.id);
        localStorage.setItem("qoot_uid", session.user.id);
        // Get or create user profile
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUserProfile(data);
            } else {
              const newUser = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split("@")[0],
                email: session.user.email,
                xp: 0,
                level: 1,
                streak: 0,
                badges: [],
                paid: false,
              };
              supabase.from("users").upsert(newUser).then(() => setUserProfile(newUser));
            }
          });
        // If user is authenticated and on landing/auth, move to quiz
        if (screen === "landing" || screen === "auth") {
          setScreen("quiz");
        }
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUid(session.user.id);
        localStorage.setItem("qoot_uid", session.user.id);
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setUserProfile(data);
            } else {
              const newUser = {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split("@")[0],
                email: session.user.email,
                xp: 0,
                level: 1,
                streak: 0,
                badges: [],
                paid: false,
              };
              supabase.from("users").upsert(newUser).then(() => setUserProfile(newUser));
            }
          });
        if (screen === "landing" || screen === "auth") {
          setScreen("quiz");
        }
      } else {
        setUid(null);
        setUserProfile(null);
        localStorage.removeItem("qoot_uid");
      }
    });

    return () => subscription.unsubscribe();
  }, [screen]);

  // ========== Load saved plan from localStorage ==========
  useEffect(() => {
    const savedPlan = localStorage.getItem("qoot_plan");
    const savedAnswers = localStorage.getItem("qoot_answers");
    if (savedPlan && savedAnswers) {
      setPlan(JSON.parse(savedPlan));
      setAnswers(JSON.parse(savedAnswers));
      setScreen("plan");
      const savedPaid = localStorage.getItem("qoot_paid");
      if (savedPaid === "true") setPaid(true);
    }
  }, []);

  // ========== RTL/LTR ==========
  useEffect(() => {
    document.body.className = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // ========== Loading messages ==========
  const MSGS = [
    T.common.loading[lang], T.common.loading2[lang], T.common.loading3[lang],
    T.common.loading4[lang], T.common.loading5[lang], T.common.loading6[lang]
  ];

  // ========== Derived data ==========
  const QUESTIONS = T.questions;
  const q = QUESTIONS[currentQ];

  const debouncedSearch = useDebounce(countrySearch, 200);
  const countryResults = useMemo(() => searchCountry(debouncedSearch), [debouncedSearch]);

  const hw = useMemo(() => {
    if (q?.type !== "smart_target" || !answers.height) return null;
    const h = parseFloat(answers.height) / 100;
    return { min: Math.round(18.5 * h * h), max: Math.round(24.9 * h * h), ideal: Math.round(22 * h * h) };
  }, [q?.type, answers.height]);

  const bmiInfo = useMemo(() => {
    if (!answers.height || !answers.current_weight) return null;
    const h = parseFloat(answers.height) / 100, w = parseFloat(answers.current_weight);
    const v = (w / (h * h)).toFixed(1);
    const label = v < 18.5 ? (lang === "ar" ? "نقص في الوزن" : "Underweight") : v < 25 ? (lang === "ar" ? "وزن طبيعي" : "Normal") : v < 30 ? (lang === "ar" ? "زيادة في الوزن" : "Overweight") : (lang === "ar" ? "سمنة" : "Obese");
    return { v, label };
  }, [answers.height, answers.current_weight, lang]);

  const canNext = useMemo(() => {
    if (!q) return false;
    if (q.type === "smart_target") return targetMode === "healthy" || (targetMode === "custom" && customTarget.trim() !== "");
    if (q.type === "country_search") return countrySelected !== "";
    if (["multichoice_notes", "multichoice", "choice"].includes(q.type)) return selected.length > 0;
    if (q.type === "notes_only") return true;
    if (q.required) return inputVal.trim() !== "";
    return true;
  }, [q, targetMode, customTarget, countrySelected, selected, inputVal]);

  // ========== Reset fields ==========
  const resetFields = useCallback(() => {
    setInputVal(""); setSelected([]); setTargetMode(""); setCustomTarget("");
    setCountrySearch(""); setCountrySelected(""); setHealthNotes("");
  }, []);

  // ========== Toggle selection ==========
  const toggle = useCallback((opt) => {
    const qType = QUESTIONS[currentQ]?.type;
    if (!qType) return;
    const noneOptions = lang === "ar" ? ["لا يوجد", "كل شيء", "لا أمارس رياضة"] : ["None", "Everything", "No exercise"];
    if (qType === "choice") { setSelected([opt]); return; }
    if (noneOptions.includes(opt)) { setSelected([opt]); return; }
    setSelected(p => {
      const f = p.filter(o => !noneOptions.includes(o));
      return f.includes(opt) ? f.filter(o => o !== opt) : [...f, opt];
    });
  }, [currentQ, lang]);

  // ========== Helper ==========
  const inp = (extra = {}) => ({
    width: "100%", background: "#1E293B", border: `2px solid #334155`, borderRadius: 12,
    padding: "15px 18px", fontSize: 16, color: "#F8FAFC",
    fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",
    outline: "none", direction: lang === "ar" ? "rtl" : "ltr", transition: "border 0.2s", ...extra
  });

  const value = {
    lang, setLang,
    screen, setScreen,
    answers, setAnswers,
    currentQ, setCurrentQ,
    inputVal, setInputVal,
    selected, setSelected,
    plan, setPlan,
    loadMsg, setLoadMsg,
    approved, setApproved,
    activeDay, setActiveDay,
    errorMsg, setErrorMsg,
    healthNotes, setHealthNotes,
    gamification, setGamification,
    customTarget, setCustomTarget,
    targetMode, setTargetMode,
    countrySearch, setCountrySearch,
    countrySelected, setCountrySelected,
    weekNum, setWeekNum,
    followUp, setFollowUp,
    followStep, setFollowStep,
    followApproved, setFollowApproved,
    paid, setPaid,
    isSimulatingPayment, setIsSimulatingPayment,
    isSendingWhatsApp, setIsSendingWhatsApp,
    whatsappSent, setWhatsappSent,
    receiptNumber, setReceiptNumber,
    role, setRole,
    loginPass, setLoginPass,
    inputRef,
    uid, setUid,
    userProfile, setUserProfile,
    viewedUserId, setViewedUserId,
    signInWithGoogle, // <-- expose Google sign-in function
    MSGS, QUESTIONS, q,
    debouncedSearch, countryResults,
    hw, bmiInfo, canNext,
    resetFields, toggle, inp,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

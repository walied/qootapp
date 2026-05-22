import { useApp } from "../context/AppContext";
import { C, T } from "../constants";
import { safeParseJSON } from "../utils";

export default function FollowUpScreen() {
  const {
    lang, setScreen, followUp, setFollowUp, followStep, setFollowStep,
    weekNum, answers, setAnswers, setPlan, setApproved, setActiveDay,
    loadMsg, setLoadMsg, MSGS, setErrorMsg, inp
  } = useApp();

  const fq = T.followup.questions[followStep];
  const fProgress = (followStep / T.followup.questions.length) * 100;
  const fInput = followUp[`_inp_${followStep}`] || "";
  const setFInput = (v) => setFollowUp(p => ({ ...p, [`_inp_${followStep}`]: v }));
  const rawSel = followUp[`_sel_${followStep}`];
  const fSel = Array.isArray(rawSel) ? rawSel : (rawSel ? [rawSel] : []);
  const setFSel = (v) => setFollowUp(p => ({ ...p, [`_sel_${followStep}`]: typeof v === "function" ? v(Array.isArray(p[`_sel_${followStep}`]) ? p[`_sel_${followStep}`] : []) : v }));

  const fCanNext = fq?.required === false ? true :
    fq?.type === "number" ? fInput.trim() !== "" :
    fq?.type === "textarea" ? true :
    fq?.type === "multichoice" ? fSel.length > 0 : fSel.length > 0;

  const fToggle = (opt) => {
    const noneOpts = lang === "ar" ? ["لا شيء", "لا يوجد"] : ["Nothing", "None"];
    if (fq.type === "choice") { setFSel([opt]); return; }
    if (noneOpts.some(n => opt.includes(n))) { setFSel([opt]); return; }
    setFSel(p => { const f = p.filter(o => !noneOpts.some(n => o.includes(n))); return f.includes(opt) ? f.filter(o => o !== opt) : [...f, opt]; });
  };

  const fNext = async () => {
    if (!fCanNext) return;
    let val = fq.type === "number" || fq.type === "textarea" ? fInput.trim() || (lang === "ar" ? "لم يُذكر" : "Not mentioned") :
      fq.type === "multichoice" ? fSel : fSel[0];
    const upd = { ...followUp, [fq.id]: val };
    setFollowUp(upd);
    if (followStep < T.followup.questions.length - 1) { setFollowStep(followStep + 1); return; }
    
    setScreen("generating");
    let i = 0; setLoadMsg(MSGS[0]);
    const iv = setInterval(() => { i = (i + 1) % MSGS.length; setLoadMsg(MSGS[i]); }, 1800);
    
    try {
      // ✅ Call your secure backend endpoint instead of DeepSeek directly
      const res = await fetch("/api/followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          followUpData: upd, 
          lang, 
          oldPlan: plan,   // if you need to pass the previous plan
          answers 
        })
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const newPlan = safeParseJSON(data.plan);
      
      // Update answers with new weight
      setAnswers(p => ({ ...p, current_weight: upd.new_weight }));
      setPlan(newPlan);
      setWeekNum(w => w + 1);
      setApproved(false);
      setActiveDay(0);
      clearInterval(iv);
      setScreen("followup_plan");
    } catch (e) {
      clearInterval(iv);
      setErrorMsg(e.message || "Error");
      setScreen("error");
    }
  };

  return (
    <div className="has-bottom-bar" style={{minHeight:"100vh",background:C.bg,fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",direction: lang === "ar" ? "rtl" : "ltr",display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 16px"}}>
      <div style={{width:"100%",maxWidth:540,marginBottom:20,marginTop:20,display:"flex",alignItems:"center",gap:10}}>
        <img src="https://i.imgur.com/QMj8XdO.jpeg" alt="Qoot Logo" style={{ height: 40 }} />
        <div><div style={{fontSize:14,fontWeight:700,color:C.text}}>{T.followup.title[lang]} {weekNum+1}</div></div>
      </div>
      <div style={{width:"100%",maxWidth:540,marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
          <span style={{fontSize:13,color:C.muted}}>{T.followup.progress[lang]} {followStep+1} {T.quiz.of[lang]} {T.followup.questions.length}</span>
          <span style={{fontSize:13,color:C.teal,fontWeight:600}}>{Math.round(fProgress)}%</span>
        </div>
        <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
          <div style={{height:"100%",width:`${fProgress}%`,background:`linear-gradient(90deg,${C.teal},${C.tealDark})`,borderRadius:2,transition:"width 0.4s ease"}}/>
        </div>
      </div>
      <div className="fu" key={followStep} style={{width:"100%",maxWidth:540,background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px 24px"}}>
        <div style={{fontSize:26,marginBottom:8}}>{fq.icon}</div>
        <div style={{fontSize:"clamp(1rem,2.5vw,1.25rem)",fontWeight:600,color:C.text,lineHeight:1.4,marginBottom:8}}>{fq.title[lang]}</div>
        {fq.sub && <div style={{fontSize:13,color:C.muted,lineHeight:1.6,marginBottom:16}}>{fq.sub[lang]}</div>}
        {fq.type === "number" && (
          <div style={{position:"relative",marginBottom:4}}>
            <input type="number" placeholder={lang === "ar" ? "مثال: 87" : "Example: 87"} value={fInput}
              onChange={e=>setFInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&fCanNext&&fNext()}
              style={{...inp({paddingLeft:55,borderColor:fInput.trim()?C.teal:C.border})}}
              onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=fInput.trim()?C.teal:C.border}/>
            {fq.unit && <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:12,color:C.muted,background:C.border,borderRadius:6,padding:"3px 8px"}}>{fq.unit[lang]}</div>}
          </div>
        )}
        {["choice","multichoice"].includes(fq.type) && (
          <div>
            <div style={{display:"grid",gridTemplateColumns:fq.options[lang]?.length>4?"1fr 1fr":"1fr",gap:8,marginBottom:8}}>
              {fq.options[lang]?.map(opt=>{
                const active=fSel.includes(opt);
                return(
                  <button key={opt} onClick={()=>fToggle(opt)}
                    style={{background:active?C.tealGlow:C.cardLight,border:`2px solid ${active?C.teal:C.border}`,borderRadius:12,padding:"12px 14px",fontSize:14,color:active?C.teal:C.text,fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",cursor:"pointer",textAlign:"right",transition:"all 0.15s",fontWeight:active?600:400,display:"flex",alignItems:"center",gap:8}}>
                    <span style={{width:18,height:18,borderRadius:5,border:`2px solid ${active?C.teal:C.border}`,background:active?C.teal:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                      {active&&<span style={{color:"#fff",fontSize:10,fontWeight:700}}>✓</span>}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {fq.type!=="choice"&&<div style={{fontSize:12,color:C.muted}}>{T.quiz.multiHint[lang]}</div>}
          </div>
        )}
        {fq.type === "textarea" && (
          <textarea value={fInput} onChange={e=>setFInput(e.target.value)} rows={4}
            style={{width:"100%",background:C.cardLight,border:`2px solid ${C.border}`,borderRadius:12,padding:"14px 14px",fontSize:14,color:C.text,fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",outline:"none",direction: lang === "ar" ? "rtl" : "ltr",resize:"none",lineHeight:1.8,transition:"border 0.2s"}}
            onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
        )}
      </div>
      <div className="bottom-bar" style={{display:"flex",gap:12,alignItems:"center",justifyContent:"center"}}>
        {followStep>0 && <button onClick={()=>setFollowStep(followStep-1)} style={{background:C.cardLight,border:`1px solid ${C.border}`,color:C.text,borderRadius:12,padding:"16px 20px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"}}>{T.quiz.back[lang]}</button>}
        <button onClick={fNext} disabled={!fCanNext}
          style={{flex:1,maxWidth:400,background:fCanNext?`linear-gradient(135deg,${C.teal},${C.tealDark})`:C.border,color:fCanNext?"#fff":C.muted,border:"none",borderRadius:12,padding:"16px",fontSize:16,fontWeight:700,cursor:fCanNext?"pointer":"default",fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",boxShadow:fCanNext?`0 4px 14px ${C.tealGlow}`:"none"}}>
          {followStep===T.followup.questions.length-1 ? T.followup.generateBtn[lang] : T.quiz.next[lang]}
        </button>
      </div>
    </div>
  );
}

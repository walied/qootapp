import { useApp } from "../context/AppContext";
import { C, T } from "../constants";
import { safeParseJSON, normalizePlan } from "../utils";

export default function QuizScreen() {
  const {
    lang, setScreen, answers, setAnswers,
    currentQ, setCurrentQ, inputVal, setInputVal,
    selected, setSelected, plan, setPlan, loadMsg, setLoadMsg,
    healthNotes, setHealthNotes,
    customTarget, setCustomTarget, targetMode, setTargetMode,
    countrySearch, setCountrySearch, countrySelected, setCountrySelected,
    weekNum, inputRef,
    MSGS, QUESTIONS, q, countryResults,
    hw, bmiInfo, canNext, resetFields, toggle, inp
  } = useApp();

  const progress = (currentQ / QUESTIONS.length) * 100;
  const tq = T.questions.find(t => t.id === q?.id);

  const next = () => {
    if (!canNext) return;
    let val;
    if (q.type === "smart_target") val = targetMode === "healthy" ? String(hw?.ideal || "") : customTarget;
    else if (q.type === "country_search") val = countrySelected?.nameAr || countrySelected;
    else if (q.type === "notes_only") val = inputVal.trim() || (lang === "ar" ? "لم يُذكر" : "Not mentioned");
    else if (["multichoice_notes", "multichoice", "choice"].includes(q.type)) val = selected;
    else val = inputVal.trim();
    const upd = { ...answers, [q.id]: val };
    if (q.id === "health_conditions") upd.health_notes = healthNotes;
    setAnswers(upd);
    resetFields();
    setTimeout(() => inputRef.current?.focus(), 80);
    if (currentQ < QUESTIONS.length - 1) setCurrentQ(currentQ + 1);
    else generate(upd);
  };

  const generate = async (all) => {
    localStorage.setItem("qoot_answers", JSON.stringify(all));
    setScreen("generating");
    let i = 0; setLoadMsg(MSGS[0]);
    const iv = setInterval(() => { i = (i + 1) % MSGS.length; setLoadMsg(MSGS[i]); }, 1800);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userData: all, lang: lang })
      });
      if (!res.ok) { const errData = await res.json().catch(() => ({})); throw new Error(errData.error || `HTTP error! status: ${res.status}`); }
      const data = await res.json();
      const rawWithFix = data.plan;
      let planData = safeParseJSON(rawWithFix);
      planData = normalizePlan(planData, all, lang);
      setPlan(planData);
      localStorage.setItem("qoot_plan", JSON.stringify(planData));
      clearInterval(iv);
      setScreen("plan");
    } catch (e) {
      clearInterval(iv);
      console.error("Generate error:", e.message);
      setScreen("error");
    }
  };

  if (!q) return null;

  return (
    <>
      <div className="has-bottom-bar" style={{minHeight:"100vh",background:C.bg,fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",direction: lang === "ar" ? "rtl" : "ltr",display:"flex",flexDirection:"column",alignItems:"center",padding:"24px 16px"}}>
        <div style={{width:"100%",maxWidth:540,marginBottom:24,marginTop:20}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
            <span style={{fontSize:13,color:C.muted}}>{T.quiz.question[lang]} {currentQ+1} {T.quiz.of[lang]} {QUESTIONS.length}</span>
            <span style={{fontSize:13,color:C.teal,fontWeight:600}}>{Math.round(progress)}%</span>
          </div>
          <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${progress}%`,background:`linear-gradient(90deg,${C.teal},${C.tealDark})`,borderRadius:2,transition:"width 0.4s ease"}}/>
          </div>
        </div>

        <div className="fu" key={currentQ} style={{width:"100%",maxWidth:540,background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px 24px"}}>
          <div style={{fontSize:26,marginBottom:8}}>{q.icon}</div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16}}>
            <div style={{fontSize:"clamp(1rem,2.5vw,1.25rem)",fontWeight:600,color:C.text,lineHeight:1.4}}>{tq?.label?.[lang] || q.label?.[lang] || q.label}</div>
            {!q.required&&<span style={{fontSize:11,color:C.muted,background:C.cardLight,border:`1px solid ${C.border}`,borderRadius:8,padding:"2px 8px",flexShrink:0,whiteSpace:"nowrap"}}>{T.quiz.optional[lang]}</span>}
          </div>

          {q.warn&&<div style={{background:`${C.danger}12`,border:`1px solid ${C.danger}33`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:8}}><span style={{flexShrink:0}}>⚠️</span><span style={{fontSize:13,color:C.danger,lineHeight:1.6}}>{typeof q.warn === 'object' ? q.warn[lang] : q.warn}</span></div>}
          {q.hint&&!q.warn&&<div style={{background:C.tealGlow,border:`1px solid ${C.teal}33`,borderRadius:10,padding:"10px 14px",marginBottom:14,display:"flex",gap:8}}><span style={{flexShrink:0}}>💡</span><span style={{fontSize:13,color:C.teal,lineHeight:1.6}}>{typeof q.hint === 'object' ? q.hint[lang] : q.hint}</span></div>}

          {/* Text / Number / Phone */}
          {["text","number","tel"].includes(q.type)&&(
            <div style={{position:"relative",marginBottom:4}}>
              <input ref={inputRef} type={q.type==="tel"?"tel":q.type} placeholder={typeof q.placeholder === 'object' ? q.placeholder[lang] : q.placeholder} value={inputVal}
                onChange={e=>{ if (q.type === "tel") { setInputVal(e.target.value.replace(/[^\d\+\-\s]/g, '')); } else { setInputVal(e.target.value); } }} 
                onKeyDown={e=>e.key==="Enter"&&canNext&&next()}
                style={{...inp({paddingLeft:q.unit?60:18,borderColor:inputVal.trim()?C.teal:C.border})}}
                onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=inputVal.trim()?C.teal:C.border}/>
              {q.unit&&<div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:12,color:C.muted,background:C.border,borderRadius:6,padding:"3px 8px"}}>{typeof q.unit === 'object' ? q.unit[lang] : q.unit}</div>}
              {q.type === "tel" && inputVal && !/^[\d\+\-\s]{7,}$/.test(inputVal) && (
                <div style={{fontSize:11,color:C.danger,marginTop:4}}>{T.quiz.phoneHint[lang]}</div>
              )}
            </div>
          )}

          {/* Choices – FIXED mouse click */}
          {["choice","multichoice","multichoice_notes"].includes(q.type)&&(
            <div>
              <div style={{display:"grid",gridTemplateColumns:q.options?.length>4?"1fr 1fr":"1fr",gap:8,marginBottom:8}}>
                {(typeof q.options === 'object' && !Array.isArray(q.options) ? q.options[lang] : q.options)?.map(opt=>{
                  const active=selected.includes(opt);
                  return(
                    <button
                      key={opt}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggle(opt);
                      }}
                      style={{
                        background:active?C.tealGlow:C.cardLight,
                        border:`2px solid ${active?C.teal:C.border}`,
                        borderRadius:12,
                        padding:"12px 14px",
                        fontSize:14,
                        color:active?C.teal:C.text,
                        fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",
                        cursor:"pointer",
                        textAlign:"right",
                        transition:"all 0.15s",
                        fontWeight:active?600:400,
                        display:"flex",
                        alignItems:"center",
                        gap:8,
                        width:"100%",
                        userSelect:"none"
                      }}>
                      <span style={{width:18,height:18,borderRadius:5,border:`2px solid ${active?C.teal:C.border}`,background:active?C.teal:"none",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                        {active&&<span style={{color:"#fff",fontSize:10,fontWeight:700}}>✓</span>}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {q.type!=="choice"&&<div style={{fontSize:12,color:C.muted,marginBottom:10}}>{T.quiz.multiHint[lang]}</div>}
              {q.id==="health_conditions"&&(
                <div style={{marginTop:6}}>
                  <div style={{fontSize:13,color:C.amber,fontWeight:600,marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{T.quiz.healthNoteTitle[lang]} <span style={{fontSize:11,color:C.muted,fontWeight:400}}>({T.quiz.optional[lang]})</span></div>
                  <div style={{position:"relative"}}>
                    <textarea value={healthNotes} onChange={e=>setHealthNotes(e.target.value)}
                      placeholder={q.notePlaceholder ? q.notePlaceholder[lang] : (lang === "ar" ? "أدخل التفاصيل..." : "Enter details...")}
                      rows={3} style={{width:"100%",background:C.cardLight,border:`2px solid ${healthNotes.trim()?C.amber:C.border}`,borderRadius:12,padding:"12px 14px",fontSize:13,color:C.text,fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",outline:"none",direction: lang === "ar" ? "rtl" : "ltr",resize:"none",lineHeight:1.7,transition:"border 0.2s"}}
                      onFocus={e=>e.target.style.borderColor=C.amber} onBlur={e=>e.target.style.borderColor=healthNotes.trim()?C.amber:C.border}/>
                    {healthNotes.trim()&&<div style={{fontSize:11,color:C.green,marginTop:4,display:"flex",alignItems:"center",gap:4}}>{T.quiz.healthNoteSent[lang]}</div>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes only */}
          {q.type==="notes_only"&&(
            <div style={{position:"relative"}}>
              <textarea ref={inputRef} value={inputVal} onChange={e=>setInputVal(e.target.value)} placeholder={typeof q.placeholder === 'object' ? q.placeholder[lang] : q.placeholder} rows={4}
                style={{width:"100%",background:C.cardLight,border:`2px solid ${C.border}`,borderRadius:12,padding:"14px 14px",paddingTop:36,fontSize:14,color:C.text,fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",outline:"none",direction: lang === "ar" ? "rtl" : "ltr",resize:"none",lineHeight:1.8,transition:"border 0.2s"}}
                onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=C.border}/>
              <div style={{position:"absolute",top:10,right:12,fontSize:11,color:C.muted,background:C.cardLight,border:`1px solid ${C.border}`,borderRadius:6,padding:"2px 8px"}}>{T.quiz.optional[lang]}</div>
            </div>
          )}

          {/* Smart target */}
          {q.type==="smart_target"&&hw&&(
            <div>
              {bmiInfo&&(
                <div style={{background:C.cardLight,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 16px",marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:12,color:C.muted,marginBottom:4}}>{T.quiz.currentStatus[lang]}</div><div style={{fontSize:15,fontWeight:600,color:C.text}}>{bmiInfo.label}</div></div>
                  <div style={{textAlign:"center"}}><div style={{fontSize:26,fontWeight:700,color:C.teal}}>{bmiInfo.v}</div><div style={{fontSize:11,color:C.muted}}>{T.quiz.bmi[lang]}</div></div>
                </div>
              )}
              <button onClick={()=>setTargetMode("healthy")} style={{width:"100%",background:targetMode==="healthy"?`${C.green}12`:C.cardLight,border:`2px solid ${targetMode==="healthy"?C.green:C.border}`,borderRadius:12,padding:"15px 16px",marginBottom:10,cursor:"pointer",textAlign:"right",transition:"all 0.15s",fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div><div style={{fontSize:12,color:C.muted,marginBottom:4}}>{T.quiz.healthyWeight[lang]}</div><div style={{fontSize:18,fontWeight:700,color:targetMode==="healthy"?C.green:C.text}}>{hw.ideal} {lang === "ar" ? "كجم" : "kg"}</div><div style={{fontSize:12,color:C.muted,marginTop:2}}>{T.quiz.healthyRange[lang]}: {hw.min} — {hw.max} {lang === "ar" ? "كجم" : "kg"}</div></div>
                  <span style={{fontSize:22}}>{targetMode==="healthy"?"✅":"⚖️"}</span>
                </div>
              </button>
              <button onClick={()=>setTargetMode("custom")} style={{width:"100%",background:targetMode==="custom"?C.amberGlow:C.cardLight,border:`2px solid ${targetMode==="custom"?C.amber:C.border}`,borderRadius:12,padding:"13px 16px",marginBottom:targetMode==="custom"?10:0,cursor:"pointer",textAlign:"right",transition:"all 0.15s",fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:14,fontWeight:600,color:targetMode==="custom"?C.amber:C.text}}>{T.quiz.customTarget[lang]}</span>
                  <span style={{fontSize:18}}>{targetMode==="custom"?"✏️":"➕"}</span>
                </div>
              </button>
              {targetMode==="custom"&&(
                <div style={{position:"relative"}}>
                  <input ref={inputRef} type="number" placeholder={lang === "ar" ? "مثال: 75" : "Example: 75"} value={customTarget} onChange={e=>setCustomTarget(e.target.value)} autoFocus
                    style={{...inp({paddingLeft:55,borderColor:C.amber})}}/>
                  <div style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:12,color:C.muted,background:C.border,borderRadius:6,padding:"3px 8px"}}>{lang === "ar" ? "كجم" : "kg"}</div>
                </div>
              )}
            </div>
          )}

          {/* Country search */}
          {q.type==="country_search"&&(
            <div>
              <div style={{position:"relative",marginBottom:10}}>
                <input ref={inputRef} type="text" placeholder={typeof q.placeholder === 'object' ? q.placeholder[lang] : q.placeholder} value={countrySearch}
                  onChange={e=>{setCountrySearch(e.target.value);setCountrySelected("");}}
                  style={{...inp({paddingRight:44,borderColor:countrySelected?C.green:C.border})}}
                  onFocus={e=>e.target.style.borderColor=C.teal} onBlur={e=>e.target.style.borderColor=countrySelected?C.green:C.border}/>
                <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:16}}>🔍</span>
              </div>
              {countrySelected&&(
                <div style={{background:`${C.green}12`,border:`2px solid ${C.green}44`,borderRadius:12,padding:"12px 14px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span>✅</span>
                    <span style={{fontSize:15,fontWeight:600,color:C.green}}>
                      <img src={countrySelected.flag} alt="" style={{width:24,height:18,verticalAlign:"middle",marginRight:6}} />
                      {lang === "ar" ? countrySelected.nameAr : countrySelected.nameEn}
                    </span>
                  </div>
                  <button onClick={()=>{setCountrySelected("");setCountrySearch("");}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:16}}>✕</button>
                </div>
              )}
              {countrySearch.trim()&&!countrySelected&&(()=>{
                const r=countryResults;
                return r.length>0?(
                  <div style={{background:C.cardLight,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",maxHeight:220,overflowY:"auto"}}>
                    {r.map((c,i)=>(
                      <button key={c.nameAr} onClick={()=>{setCountrySelected(c);setCountrySearch("");}}
                        style={{width:"100%",background:"none",border:"none",borderBottom:i<r.length-1?`1px solid ${C.border}`:"none",padding:"12px 16px",fontSize:14,color:C.text,fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",cursor:"pointer",textAlign:"right",transition:"background 0.1s",display:"flex",alignItems:"center",gap:8}}
                        onMouseEnter={e=>e.currentTarget.style.background=C.border}
                        onMouseLeave={e=>e.currentTarget.style.background="none"}>
                        <img src={c.flag} alt="" style={{width:24,height:18,flexShrink:0}} />
                        <span>{lang === "ar" ? c.nameAr : c.nameEn}</span>
                      </button>
                    ))}
                  </div>
                ):<div style={{background:C.cardLight,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px",textAlign:"center",color:C.muted,fontSize:14}}>{T.quiz.noResults[lang]}</div>;
              })()}
            </div>
          )}
        </div>

        <div className="bottom-bar" style={{display:"flex",gap:12,alignItems:"center",justifyContent:"center"}}>
          {currentQ>0&&<button onClick={()=>{setCurrentQ(currentQ-1);resetFields();}} style={{background:C.cardLight,border:`1px solid ${C.border}`,color:C.text,borderRadius:12,padding:"16px 20px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",transition:"all 0.2s"}}>{T.quiz.back[lang]}</button>}
          <button onClick={next} disabled={!canNext}
            style={{flex:1,maxWidth:400,background:canNext?`linear-gradient(135deg,${C.teal},${C.tealDark})`:C.border,color:canNext?"#fff":C.muted,border:"none",borderRadius:12,padding:"16px",fontSize:16,fontWeight:700,cursor:canNext?"pointer":"default",fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif",transition:"all 0.2s",boxShadow:canNext?`0 4px 14px ${C.tealGlow}`:"none"}}>
            {currentQ===QUESTIONS.length-1?T.quiz.generate[lang]:T.quiz.next[lang]}
          </button>
        </div>
      </div>
    </>
  );
}

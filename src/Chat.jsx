import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#0B0F19", card: "#151C2C", cardLight: "#1E293B", border: "#334155",
  teal: "#145952", text: "#F8FAFC", muted: "#94A3B8", amber: "#C2952A"
};

export default function Chat({ lang, plan, answers, currentDay, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    // Simulate AI reply for now
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", content: lang === "ar" ? "أنا هنا لمساعدتك!" : "I'm here to help!" }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif" }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
            <div style={{ maxWidth: "80%", background: msg.role === "user" ? C.teal : C.cardLight, border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 14px", fontSize: 14, color: C.text, lineHeight: 1.6 }}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder={lang === "ar" ? "اكتب رسالتك..." : "Type your message..."}
          style={{ flex: 1, background: C.cardLight, border: `1px solid ${C.border}`, borderRadius: 12, padding: "12px 14px", fontSize: 14, color: C.text, outline: "none" }} />
        <button onClick={send} disabled={loading}
          style={{ background: C.teal, color: "#fff", border: "none", borderRadius: 12, padding: "12px 18px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
          {lang === "ar" ? "إرسال" : "Send"}
        </button>
      </div>
    </div>
  );
}

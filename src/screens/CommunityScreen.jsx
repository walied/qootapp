import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { C, T } from "../constants";
import { supabase } from "../lib/supabaseClient";

export default function CommunityScreen() {
  const { lang, setScreen, setViewedUserId, userProfile } = useApp();
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(20);
      if (p) setPosts(p);
      const { data: l } = await supabase.from("users").select("id,name,xp").order("xp", { ascending: false }).limit(10);
      if (l) setLeaderboard(l);
    })();
  }, []);

  const handleUpload = async () => {
    if (!newPostText && !newPostImage) return;
    let imageUrl = "";
    if (newPostImage) {
      const { data: uploadData } = await supabase.storage.from("posts").upload(`${userProfile?.id || "anonymous"}/${Date.now()}`, newPostImage);
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("posts").getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
    }
    const { error } = await supabase.from("posts").insert({
      user_id: userProfile?.id || "anonymous",
      text: newPostText,
      image_url: imageUrl,
      created_at: new Date(),
    });
    if (!error) {
      setNewPostText("");
      setNewPostImage(null);
      fileRef.current.value = "";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr", padding: 20 }}>
      <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", marginBottom: 10 }}>← {lang === "ar" ? "لوحة التحكم" : "Dashboard"}</button>
      <h2>{T.community.title[lang]}</h2>
      <div style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <textarea placeholder={T.community.postPlaceholder[lang]} value={newPostText} onChange={e => setNewPostText(e.target.value)}
          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, marginBottom: 10 }} rows={3} />
        <input type="file" accept="image/*" ref={fileRef} onChange={e => setNewPostImage(e.target.files[0])} style={{ marginBottom: 10 }} />
        <button onClick={handleUpload} style={{ background: C.teal, border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontWeight: 700, cursor: "pointer" }}>{T.community.publish[lang]}</button>
      </div>
      <div style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <h3>{T.community.leaderboard[lang]}</h3>
        {leaderboard.map((user, idx) => (
          <div key={user.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ cursor: "pointer" }} onClick={() => { setViewedUserId(user.id); setScreen("profile"); }}>
              <span style={{ fontWeight: 700 }}>{idx+1}. {user.name}</span>
            </div>
            <span>{user.xp} XP</span>
          </div>
        ))}
      </div>
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{post.user_name || "مستخدم"}</div>
            {post.text && <p style={{ marginBottom: 10 }}>{post.text}</p>}
            {post.image_url && <img src={post.image_url} style={{ maxWidth: "100%", borderRadius: 8 }} alt="post" />}
          </div>
        ))}
      </div>
    </div>
  );
}

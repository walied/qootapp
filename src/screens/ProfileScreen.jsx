import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { C, T } from "../constants";
import { supabase } from "../lib/supabaseClient";

export default function ProfileScreen() {
  const { lang, setScreen, viewedUserId } = useApp();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!viewedUserId) return;
    (async () => {
      const { data: p } = await supabase.from("users").select("*").eq("id", viewedUserId).single();
      if (p) setProfile(p);
      const { data: po } = await supabase.from("posts").select("*").eq("user_id", viewedUserId).order("created_at", { ascending: false });
      if (po) setPosts(po);
    })();
  }, [viewedUserId]);

  if (!profile) return <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: 20 }}>جاري التحميل...</div>;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: 20 }}>
      <button onClick={() => setScreen("community")} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>← {lang === "ar" ? "رجوع" : "Back"}</button>
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <div style={{ fontSize: 50, marginBottom: 10 }}>👤</div>
        <h2>{profile.name}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10 }}>
          <div><strong>{profile.xp}</strong> XP</div>
          <div><strong>{profile.level}</strong> {lang === "ar" ? "مستوى" : "Level"}</div>
          <div><strong>{profile.streak}</strong> 🔥</div>
        </div>
      </div>
      <h3 style={{ marginTop: 30 }}>{T.community.posts[lang]}</h3>
      {posts.map(post => (
        <div key={post.id} style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 16, marginTop: 10 }}>
          {post.text && <p>{post.text}</p>}
          {post.image_url && <img src={post.image_url} style={{ maxWidth: "100%", borderRadius: 8 }} alt="post" />}
        </div>
      ))}
    </div>
  );
}

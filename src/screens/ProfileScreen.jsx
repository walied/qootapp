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
    fetchProfile();
    fetchUserPosts();
  }, [viewedUserId]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", viewedUserId)
      .single();
    if (data) setProfile(data);
  };

  const fetchUserPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("user_id", viewedUserId)
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  };

  if (!profile) {
    return (
      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: 20, textAlign: "center", paddingTop: 50 }}>
        {lang === "ar" ? "جاري التحميل..." : "Loading..."}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: 20 }}>
      <button onClick={() => setScreen("community")} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer" }}>
        ← {lang === "ar" ? "رجوع" : "Back"}
      </button>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <div style={{ fontSize: 50, marginBottom: 10 }}>👤</div>
        <h2 style={{ marginBottom: 10 }}>{profile.name || "مستخدم"}</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10, fontSize: 16 }}>
          <div><strong style={{ color: C.amber }}>{profile.xp || 0}</strong> XP</div>
          <div><strong style={{ color: C.teal }}>{profile.level || 1}</strong> {lang === "ar" ? "مستوى" : "Level"}</div>
          <div><strong style={{ color: C.danger }}>{profile.streak || 0}</strong> 🔥</div>
        </div>
      </div>

      <h3 style={{ marginTop: 30, marginBottom: 15 }}>{T.community.posts[lang]}</h3>
      {posts.map(post => (
        <div key={post.id} style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          {post.text && <p style={{ lineHeight: 1.6 }}>{post.text}</p>}
          {post.image_url && (
            <img src={post.image_url} style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }} alt="post" />
          )}
        </div>
      ))}
      {posts.length === 0 && (
        <div style={{ color: C.muted, textAlign: "center", padding: 20 }}>{lang === "ar" ? "لا توجد منشورات" : "No posts"}</div>
      )}
    </div>
  );
}

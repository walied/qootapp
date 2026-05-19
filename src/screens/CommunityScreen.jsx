import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { C, T } from "../constants";
import { supabase } from "../lib/supabaseClient";

export default function CommunityScreen() {
  const { lang, setScreen, setViewedUserId, uid } = useApp();
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    fetchPosts();
    fetchLeaderboard();
  }, []);

  const fetchPosts = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
    if (data) setPosts(data);
  };

  const fetchLeaderboard = async () => {
    const { data } = await supabase
      .from("users")
      .select("id, name, xp, level")
      .order("xp", { ascending: false })
      .limit(10);
    if (data) setLeaderboard(data);
  };

  const handleUpload = async () => {
    if (!newPostText && !newPostImage) return;
    setUploading(true);
    
    let imageUrl = "";
    if (newPostImage) {
      const fileName = `${uid || "anonymous"}/${Date.now()}-${newPostImage.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(fileName, newPostImage);

      if (uploadError) {
        console.error("Upload error:", uploadError);
      } else if (uploadData) {
        const { data: urlData } = supabase.storage
          .from("posts")
          .getPublicUrl(uploadData.path);
        imageUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.from("posts").insert({
      user_id: uid || "anonymous",
      text: newPostText,
      image_url: imageUrl,
      created_at: new Date().toISOString(),
    });

    if (!error) {
      setNewPostText("");
      setNewPostImage(null);
      if (fileRef.current) fileRef.current.value = "";
      fetchPosts();
    }
    setUploading(false);
  };

  const viewProfile = (userId) => {
    setViewedUserId(userId);
    setScreen("profile");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: lang === "ar" ? "'Alexandria',sans-serif" : "'Inter',sans-serif", direction: lang === "ar" ? "rtl" : "ltr", padding: 20 }}>
      <button onClick={() => setScreen("dashboard")} style={{ background: "none", border: "none", color: C.muted, fontSize: 20, cursor: "pointer", marginBottom: 10 }}>
        ← {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
      </button>

      <h2 style={{ marginBottom: 20 }}>{T.community.title[lang]}</h2>

      {/* Create Post */}
      <div style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <textarea
          placeholder={T.community.postPlaceholder[lang]}
          value={newPostText}
          onChange={e => setNewPostText(e.target.value)}
          style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, color: C.text, marginBottom: 10, fontSize: 14 }}
          rows={3}
        />
        <input type="file" accept="image/*" ref={fileRef} onChange={e => setNewPostImage(e.target.files[0])} style={{ marginBottom: 10, color: C.text }} />
        <button onClick={handleUpload} disabled={uploading}
          style={{ background: uploading ? C.border : C.teal, border: "none", borderRadius: 8, padding: "10px 20px", color: "#fff", fontWeight: 700, cursor: uploading ? "not-allowed" : "pointer" }}>
          {uploading ? (lang === "ar" ? "جاري النشر..." : "Publishing...") : T.community.publish[lang]}
        </button>
      </div>

      {/* Leaderboard */}
      <div style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 12 }}>{T.community.leaderboard[lang]}</h3>
        {leaderboard.map((user, idx) => (
          <div key={user.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
            <div style={{ cursor: "pointer" }} onClick={() => viewProfile(user.id)}>
              <span style={{ fontWeight: 700 }}>{idx + 1}. {user.name || "مستخدم"}</span>
            </div>
            <span style={{ color: C.amber }}>{user.xp || 0} XP</span>
          </div>
        ))}
        {leaderboard.length === 0 && (
          <div style={{ color: C.muted, textAlign: "center", padding: 10 }}>{lang === "ar" ? "لا يوجد متصدرون بعد" : "No leaderboard yet"}</div>
        )}
      </div>

      {/* Posts */}
      <div>
        {posts.map(post => (
          <div key={post.id} style={{ background: C.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8, cursor: "pointer", color: C.teal }} onClick={() => viewProfile(post.user_id)}>
              {post.user_name || "مستخدم"}
            </div>
            {post.text && <p style={{ marginBottom: 10, lineHeight: 1.6 }}>{post.text}</p>}
            {post.image_url && (
              <img src={post.image_url} style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }} alt="post" />
            )}
          </div>
        ))}
        {posts.length === 0 && (
          <div style={{ color: C.muted, textAlign: "center", padding: 20 }}>{lang === "ar" ? "لا توجد منشورات بعد" : "No posts yet"}</div>
        )}
      </div>
    </div>
  );
}

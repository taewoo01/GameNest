import { useEffect, useState } from "react";

type NewsItem = {
  id: string;
  gameName: string;
  title: string;
  summary: string;
  link: string;
  date?: string | null;
  image?: string | null;
  video?: string | null;
};

const API_BASE = import.meta.env.VITE_API_BASE || ""; 
// dev에서는 "" (프록시로 /api → Flask)
// 배포/협업자 서버로 바꿀 땐 .env에서 VITE_API_BASE만 바꾸면 됨

export default function SteamNews() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setErr(null);

      const res = await fetch(`${API_BASE}/api/news/all`, { cache: "no-store" });

      // 디버깅용: JSON 아닌 응답을 바로 알아차리기
      const ct = res.headers.get("content-type") || "";
      if (!ct.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Expected JSON but got ${res.status} ${ct}\n${text.slice(0, 200)}`);
      }

      const data = await res.json();
      if (data?.error) throw new Error(data.detail || data.error);
      setItems((data?.items || []) as NewsItem[]);
    } catch (e: any) {
      setErr(String(e?.message || e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div style={{ background:"#0f0f0f", minHeight:"100vh", color:"#e6e6e6" }}>
      <div style={{ maxWidth: 1100, margin:"0 auto", padding:"24px 16px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Steam 뉴스</h1>

        <button
          onClick={load}
          style={{ background:"#5a8dff", color:"#fff", border:0, borderRadius:8,
                   padding:"8px 14px", cursor:"pointer", marginBottom:16 }}
        >
          새로고침
        </button>

        {loading && <div>불러오는 중…</div>}
        {err && <div style={{ color:"#ff6b6b", whiteSpace:"pre-wrap" }}>에러: {err}</div>}

        <ul style={{ display:"grid", gap:14 }}>
          {items.map((n) => {
            const hasMedia = Boolean(n.video || n.image);
            return (
              <li
                key={n.id}
                style={{
                  background:"#151515",
                  border:"1px solid #222",
                  borderRadius:12,
                  padding:16,
                  display:"grid",
                  gridTemplateColumns: hasMedia ? "1fr 320px" : "1fr",
                  gap: hasMedia ? 16 : 0,
                }}
              >
                {/* 왼쪽 텍스트 */}
                <div>
                  <div style={{ fontSize:14, opacity:0.85, marginBottom:6 }}>{n.gameName}</div>
                  <a
                    href={n.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color:"#fff", fontSize:18, fontWeight:700, lineHeight:1.3 }}
                  >
                    {n.title}
                  </a>
                  <div style={{ fontSize:12, opacity:0.6, marginTop:4 }}>{n.date || ""}</div>
                  {n.summary && (
                    <p style={{ marginTop:10, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{n.summary}</p>
                  )}
                </div>

                {/* 오른쪽 미디어 (있을 때만) */}
                {hasMedia && (
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {n.video ? (
                      <iframe
                        src={n.video!}
                        title="video"
                        width="100%"
                        height="180"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius:10, border:"none", background:"#000" }}
                      />
                    ) : (
                      <img
                        src={n.image!}
                        alt="thumbnail"
                        style={{ width:"100%", height:"180px", objectFit:"cover", borderRadius:10 }}
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

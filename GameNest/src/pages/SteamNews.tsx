// // // // // // // // import { useEffect, useState } from "react";

// // // // // // // // type NewsItem = {
// // // // // // // //   id: string;
// // // // // // // //   gameName: string;
// // // // // // // //   title: string;
// // // // // // // //   summary: string;
// // // // // // // //   link: string;
// // // // // // // //   date?: string | null;
// // // // // // // //   image?: string | null;
// // // // // // // //   video?: string | null;
// // // // // // // // };

// // // // // // // // const API_BASE = import.meta.env.VITE_API_BASE || ""; 
// // // // // // // // // dev에서는 "" (프록시로 /api → Flask)
// // // // // // // // // 배포/협업자 서버로 바꿀 땐 .env에서 VITE_API_BASE만 바꾸면 됨

// // // // // // // // export default function SteamNews() {
// // // // // // // //   const [items, setItems] = useState<NewsItem[]>([]);
// // // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // // //   const [err, setErr] = useState<string | null>(null);

// // // // // // // //   const load = async () => {
// // // // // // // //     try {
// // // // // // // //       setLoading(true);
// // // // // // // //       setErr(null);

// // // // // // // //       const res = await fetch(`${API_BASE}/api/news/all`, { cache: "no-store" });

// // // // // // // //       // 디버깅용: JSON 아닌 응답을 바로 알아차리기
// // // // // // // //       const ct = res.headers.get("content-type") || "";
// // // // // // // //       if (!ct.includes("application/json")) {
// // // // // // // //         const text = await res.text();
// // // // // // // //         throw new Error(`Expected JSON but got ${res.status} ${ct}\n${text.slice(0, 200)}`);
// // // // // // // //       }

// // // // // // // //       const data = await res.json();
// // // // // // // //       if (data?.error) throw new Error(data.detail || data.error);
// // // // // // // //       setItems((data?.items || []) as NewsItem[]);
// // // // // // // //     } catch (e: any) {
// // // // // // // //       setErr(String(e?.message || e));
// // // // // // // //     } finally {
// // // // // // // //       setLoading(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   useEffect(() => { load(); }, []);

// // // // // // // //   return (
// // // // // // // //     <div style={{ background:"#0f0f0f", minHeight:"100vh", color:"#e6e6e6" }}>
// // // // // // // //       <div style={{ maxWidth: 1100, margin:"0 auto", padding:"24px 16px" }}>
// // // // // // // //         <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>Steam 뉴스</h1>

// // // // // // // //         <button
// // // // // // // //           onClick={load}
// // // // // // // //           style={{ background:"#5a8dff", color:"#fff", border:0, borderRadius:8,
// // // // // // // //                    padding:"8px 14px", cursor:"pointer", marginBottom:16 }}
// // // // // // // //         >
// // // // // // // //           새로고침
// // // // // // // //         </button>

// // // // // // // //         {loading && <div>불러오는 중…</div>}
// // // // // // // //         {err && <div style={{ color:"#ff6b6b", whiteSpace:"pre-wrap" }}>에러: {err}</div>}

// // // // // // // //         <ul style={{ display:"grid", gap:14 }}>
// // // // // // // //           {items.map((n) => {
// // // // // // // //             const hasMedia = Boolean(n.video || n.image);
// // // // // // // //             return (
// // // // // // // //               <li
// // // // // // // //                 key={n.id}
// // // // // // // //                 style={{
// // // // // // // //                   background:"#151515",
// // // // // // // //                   border:"1px solid #222",
// // // // // // // //                   borderRadius:12,
// // // // // // // //                   padding:16,
// // // // // // // //                   display:"grid",
// // // // // // // //                   gridTemplateColumns: hasMedia ? "1fr 320px" : "1fr",
// // // // // // // //                   gap: hasMedia ? 16 : 0,
// // // // // // // //                 }}
// // // // // // // //               >
// // // // // // // //                 {/* 왼쪽 텍스트 */}
// // // // // // // //                 <div>
// // // // // // // //                   <div style={{ fontSize:14, opacity:0.85, marginBottom:6 }}>{n.gameName}</div>
// // // // // // // //                   <a
// // // // // // // //                     href={n.link}
// // // // // // // //                     target="_blank"
// // // // // // // //                     rel="noreferrer"
// // // // // // // //                     style={{ color:"#fff", fontSize:18, fontWeight:700, lineHeight:1.3 }}
// // // // // // // //                   >
// // // // // // // //                     {n.title}
// // // // // // // //                   </a>
// // // // // // // //                   <div style={{ fontSize:12, opacity:0.6, marginTop:4 }}>{n.date || ""}</div>
// // // // // // // //                   {n.summary && (
// // // // // // // //                     <p style={{ marginTop:10, lineHeight:1.6, whiteSpace:"pre-wrap" }}>{n.summary}</p>
// // // // // // // //                   )}
// // // // // // // //                 </div>

// // // // // // // //                 {/* 오른쪽 미디어 (있을 때만) */}
// // // // // // // //                 {hasMedia && (
// // // // // // // //                   <div style={{ display:"flex", alignItems:"center", justifyContent:"center" }}>
// // // // // // // //                     {n.video ? (
// // // // // // // //                       <iframe
// // // // // // // //                         src={n.video!}
// // // // // // // //                         title="video"
// // // // // // // //                         width="100%"
// // // // // // // //                         height="180"
// // // // // // // //                         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
// // // // // // // //                         allowFullScreen
// // // // // // // //                         style={{ borderRadius:10, border:"none", background:"#000" }}
// // // // // // // //                       />
// // // // // // // //                     ) : (
// // // // // // // //                       <img
// // // // // // // //                         src={n.image!}
// // // // // // // //                         alt="thumbnail"
// // // // // // // //                         style={{ width:"100%", height:"180px", objectFit:"cover", borderRadius:10 }}
// // // // // // // //                         loading="lazy"
// // // // // // // //                       />
// // // // // // // //                     )}
// // // // // // // //                   </div>
// // // // // // // //                 )}
// // // // // // // //               </li>
// // // // // // // //             );
// // // // // // // //           })}
// // // // // // // //         </ul>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }


// // // // // // // ////////////////////////////////

// // // // // // // import React, { useEffect, useState } from "react";

// // // // // // // type NewsItem = {
// // // // // // //   title: string;
// // // // // // //   link: string;
// // // // // // //   contentSnippet?: string;
// // // // // // //   pubDate?: string | number | Date | null;
// // // // // // // };

// // // // // // // const SteamNews: React.FC = () => {
// // // // // // //   const [news, setNews] = useState<NewsItem[]>([]);

// // // // // // //   useEffect(() => {
// // // // // // //     const load = async () => {
// // // // // // //       try {
// // // // // // //         const res = await fetch("/steam/news/all"); 
// // // // // // //         const json = await res.json();

// // // // // // //         // 응답이 배열이든 { items: [] }든 안전하게 정규화
// // // // // // //         const raw: any[] = Array.isArray(json) ? json : json?.items ?? [];

// // // // // // //         const normalized: NewsItem[] = raw.map((x) => ({
// // // // // // //           title: x.title ?? "",
// // // // // // //           link: x.link ?? "#",
// // // // // // //           contentSnippet: x.contentSnippet ?? x.summary ?? "",
// // // // // // //           pubDate: x.pubDate ?? x.date ?? null,
// // // // // // //         }));

// // // // // // //         setNews(normalized);
// // // // // // //       } catch (err) {  
// // // // // // //         console.error("뉴스 불러오기 실패:", err);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     load();
// // // // // // //   }, []);

// // // // // // //   return (
// // // // // // //     <div className="p-6">
// // // // // // //       <h1 className="text-2xl font-bold mb-4">📰 Steam 뉴스</h1>
// // // // // // //       <ul className="space-y-4">
// // // // // // //         {news.map((item, idx) => (
// // // // // // //           <li key={item.link ?? idx} className="border p-4 rounded-lg shadow">
// // // // // // //             <a
// // // // // // //               href={item.link}
// // // // // // //               target="_blank"
// // // // // // //               rel="noopener noreferrer"
// // // // // // //               className="text-xl font-semibold text-blue-600 hover:underline"
// // // // // // //             >
// // // // // // //               {item.title}
// // // // // // //             </a>
// // // // // // //             {item.contentSnippet && (
// // // // // // //               <p className="text-gray-600 mt-2">{item.contentSnippet}</p>
// // // // // // //             )}
// // // // // // //             {item.pubDate && (
// // // // // // //               <p className="text-sm text-gray-400 mt-1">
// // // // // // //                 {new Date(item.pubDate).toLocaleString()}
// // // // // // //               </p>
// // // // // // //             )}
// // // // // // //           </li>
// // // // // // //         ))}
// // // // // // //       </ul>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default SteamNews;


// // // // // // // src/pages/News.tsx
// // // // // // // import React, { useEffect, useState } from "react";
// // // // // // // import axiosInstance from "../axiosInstance";

// // // // // // // interface SteamNewsItem {
// // // // // // //   title: string;
// // // // // // //   link: string;
// // // // // // //   pubDate: string;
// // // // // // //   contentSnippet: string;
// // // // // // // }

// // // // // // // const News: React.FC = () => {
// // // // // // //   const [news, setNews] = useState<SteamNewsItem[]>([]);
// // // // // // //   const [loading, setLoading] = useState(true);

// // // // // // //   useEffect(() => {
// // // // // // //     const fetchNews = async () => {
// // // // // // //       try {
// // // // // // //         const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all"); // axiosInstance 사용
// // // // // // //         setNews(res.data);
// // // // // // //       } catch (err) {
// // // // // // //         console.error("뉴스 가져오기 실패:", err);
// // // // // // //       } finally {
// // // // // // //         setLoading(false);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     fetchNews();
// // // // // // //   }, []);

// // // // // // //   if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

// // // // // // //   return (
// // // // // // //     <div className="max-w-5xl mx-auto p-4">
// // // // // // //       <h1 className="text-3xl font-bold mb-6">Steam 전체 뉴스</h1>
// // // // // // //       <div className="grid gap-4">
// // // // // // //         {news.map((item, index) => (
// // // // // // //           <div
// // // // // // //             key={index}
// // // // // // //             className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
// // // // // // //             onClick={() => window.open(item.link, "_blank")}
// // // // // // //           >
// // // // // // //             <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
// // // // // // //             <p className="text-gray-600 text-sm mb-2">{new Date(item.pubDate).toLocaleString()}</p>
// // // // // // //             <p className="text-gray-800">{item.contentSnippet}</p>
// // // // // // //           </div>
// // // // // // //         ))}
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default News;





// // // // // // // src/pages/News.tsx
// // // // // // import React, { useEffect, useState } from "react";
// // // // // // import axiosInstance from "../axiosInstance";

// // // // // // interface SteamNewsItem {
// // // // // //   title: string;
// // // // // //   link: string;
// // // // // //   pubDate: string;
// // // // // //   contentSnippet: string;
// // // // // // }

// // // // // // const News: React.FC = () => {
// // // // // //   const [news, setNews] = useState<SteamNewsItem[]>([]);
// // // // // //   const [loading, setLoading] = useState(true);

// // // // // //   useEffect(() => {
// // // // // //     const fetchNews = async () => {
// // // // // //       try {
// // // // // //         const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all"); // axiosInstance 사용
// // // // // //         setNews(res.data);
// // // // // //       } catch (err) {
// // // // // //         console.error("뉴스 가져오기 실패:", err);
// // // // // //       } finally {
// // // // // //         setLoading(false);
// // // // // //       }
// // // // // //     };

// // // // // //     fetchNews();
// // // // // //   }, []);

// // // // // //   if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

// // // // // //   return (
// // // // // //     <div className="max-w-5xl mx-auto p-4">
// // // // // //       <h1 className="text-3xl font-bold mb-6">Steam 전체 뉴스</h1>
// // // // // //       <div className="grid gap-4">
// // // // // //         {news.map((item, index) => (
// // // // // //           <div
// // // // // //             key={index}
// // // // // //             className="border p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
// // // // // //             onClick={() => window.open(item.link, "_blank")}
// // // // // //           >
// // // // // //             <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
// // // // // //             <p className="text-gray-600 text-sm mb-2">{new Date(item.pubDate).toLocaleString()}</p>
// // // // // //             <p className="text-gray-800">{item.contentSnippet}</p>
// // // // // //           </div>
// // // // // //         ))}
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // export default News;



// // // // // // src/pages/News.tsx
// // // // // import React, { useEffect, useState } from "react";
// // // // // import axiosInstance from "../axiosInstance";

// // // // // interface SteamNewsItem {
// // // // //   title: string;
// // // // //   title_ko: string;
// // // // //   contentSnippet: string;
// // // // //   contentSnippet_ko: string;
// // // // //   link: string;
// // // // //   pubDate: string;
// // // // //   image?: string;
// // // // // }

// // // // // const News: React.FC = () => {
// // // // //   const [news, setNews] = useState<SteamNewsItem[]>([]);
// // // // //   const [loading, setLoading] = useState(true);

// // // // //   useEffect(() => {
// // // // //     const fetchNews = async () => {
// // // // //       try {
// // // // //         const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all");
// // // // //         setNews(res.data);
// // // // //       } catch (err) {
// // // // //         console.error("뉴스 가져오기 실패:", err);
// // // // //       } finally {
// // // // //         setLoading(false);
// // // // //       }
// // // // //     };

// // // // //     fetchNews();
// // // // //   }, []);

// // // // //   if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

// // // // //   return (
// // // // //     <div className="max-w-5xl mx-auto p-4">
// // // // //       <h1 className="text-3xl font-bold mb-6">Steam 전체 뉴스</h1>
// // // // //       <div className="grid gap-6">
// // // // //         {news.map((item, index) => (
// // // // //           <div
// // // // //             key={index}
// // // // //             className="border rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
// // // // //             onClick={() => window.open(item.link, "_blank")}
// // // // //           >
// // // // //             {item.image && (
// // // // //               <img
// // // // //                 src={item.image}
// // // // //                 alt={item.title}
// // // // //                 className="w-full h-48 object-cover"
// // // // //               />
// // // // //             )}
// // // // //             <div className="p-4">
// // // // //               <h2 className="text-xl font-semibold mb-2">{item.title_ko || item.title}</h2>
// // // // //               <p className="text-gray-600 text-sm mb-2">
// // // // //                 {new Date(item.pubDate).toLocaleString()}
// // // // //               </p>
// // // // //               <p className="text-gray-800">
// // // // //                 {item.contentSnippet_ko || item.contentSnippet}
// // // // //               </p>
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default News;


// // // // import React, { useEffect, useState } from "react";
// // // // import axiosInstance from "../axiosInstance";
// // // // // (선택) 서버에서 video 필드를 줄 경우 사용하려면 설치 후 주석 해제
// // // // // import ReactPlayer from "react-player";

// // // // interface SteamNewsItem {
// // // //   title: string;
// // // //   title_ko: string;
// // // //   contentSnippet: string;
// // // //   contentSnippet_ko: string;
// // // //   link: string;
// // // //   pubDate: string;
// // // //   image?: string;
// // // //   video?: string; // 선택 필드: 있으면 우측 미디어에 노출
// // // // }

// // // // const News: React.FC = () => {
// // // //   const [news, setNews] = useState<SteamNewsItem[]>([]);
// // // //   const [loading, setLoading] = useState(true);

// // // //   useEffect(() => {
// // // //     const fetchNews = async () => {
// // // //       try {
// // // //         const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all");
// // // //         setNews(res.data);
// // // //       } catch (err) {
// // // //         console.error("뉴스 가져오기 실패:", err);
// // // //       } finally {
// // // //         setLoading(false);
// // // //       }
// // // //     };

// // // //     fetchNews();
// // // //   }, []);

// // // //   if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

// // // //   // "게임명 - 제목" 또는 "게임명: 제목" 형태 분리
// // // //   const splitTitle = (raw: string) => {
// // // //     const byDash = raw.split(" - ");
// // // //     if (byDash.length >= 2) {
// // // //       return { game: byDash[0].trim(), headline: byDash.slice(1).join(" - ").trim() };
// // // //     }
// // // //     const byColon = raw.split(": ");
// // // //     if (byColon.length >= 2) {
// // // //       return { game: byColon[0].trim(), headline: byColon.slice(1).join(": ").trim() };
// // // //     }
// // // //     return { game: "", headline: raw.trim() };
// // // //   };

// // // //   return (
// // // //     <div className="max-w-[960px] mx-auto p-6">
// // // //       <h1 className="text-3xl font-bold mb-6">Steam 전체 뉴스</h1>

// // // //       <div className="flex flex-col gap-6">
// // // //         {news.map((item, index) => {
// // // //           const titleText = item.title_ko || item.title || "";
// // // //           const { game, headline } = splitTitle(titleText);
// // // //           const hasImage = Boolean(item.image);
// // // //           const hasVideo = Boolean(item.video);
// // // //           const hasMedia = hasImage || hasVideo;

// // // //           return (
// // // //             <div
// // // //               key={index}
// // // //               className="bg-[#111] text-white border border-[#333] rounded-[10px] shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
// // // //               onClick={() => window.open(item.link, "_blank")}
// // // //             >
// // // //               <div className="flex flex-col md:flex-row gap-4 p-4">
// // // //                 {/* 왼쪽 텍스트 영역 */}
// // // //                 <div className="flex-1">
// // // //                   {/* 1) 게임 이름 (있을 때만) */}
// // // //                   {game && (
// // // //                     <div className="text-sm text-[#9aa4b2] mb-1">
// // // //                       {game}
// // // //                     </div>
// // // //                   )}

// // // //                   {/* 2) 업데이트/이벤트 제목 */}
// // // //                   <h2 className="text-xl font-semibold">
// // // //                     {headline || titleText}
// // // //                   </h2>

// // // //                   {/* 날짜 */}
// // // //                   <p className="text-xs text-[#9aa4b2] mt-1">
// // // //                     {new Date(item.pubDate).toLocaleString()}
// // // //                   </p>

// // // //                   {/* 3) 상세 내용 */}
// // // //                   <p className="mt-2 leading-relaxed text-[#d1d5db]">
// // // //                     {item.contentSnippet_ko || item.contentSnippet}
// // // //                   </p>
// // // //                 </div>

// // // //                 {/* 우측 미디어 영역 (이미지/영상 중 하나라도 있으면 렌더) */}
// // // //                 {hasMedia && (
// // // //                   <div className="md:w-[240px] w-full md:shrink-0 md:items-start items-center flex">
// // // //                     {hasImage && (
// // // //                       <img
// // // //                         src={item.image as string}
// // // //                         alt={headline || titleText}
// // // //                         className="w-full md:w-[240px] h-[140px] object-cover rounded-[8px]"
// // // //                         onClick={(e) => {
// // // //                           e.stopPropagation();
// // // //                           window.open(item.link, "_blank");
// // // //                         }}
// // // //                       />
// // // //                     )}

// // // //                     {/* (선택) 영상 표시: react-player 사용 시 주석 해제 */}
// // // //                     {/* {hasVideo && !hasImage && (
// // // //                       <ReactPlayer
// // // //                         url={item.video as string}
// // // //                         width="240px"
// // // //                         height="140px"
// // // //                         controls
// // // //                         onClick={(e) => e.stopPropagation()}
// // // //                       />
// // // //                     )} */}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           );
// // // //         })}
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // export default News;





// // // // src/pages/News.tsx
// // // import React, { useEffect, useState } from "react";
// // // import axiosInstance from "../axiosInstance";
// // // // (선택) 서버가 video URL을 줄 경우 영상 표시하려면 설치 후 주석 해제
// // // // import ReactPlayer from "react-player";

// // // interface SteamNewsItem {
// // //   title: string;
// // //   link: string;
// // //   pubDate: string;
// // //   snippet: string; // 본문 요약
// // //   image?: string;
// // //   video?: string; // 선택: 있으면 우측에 영상 표시
// // // }

// // // const News: React.FC = () => {
// // //   const [news, setNews] = useState<SteamNewsItem[]>([]);
// // //   const [loading, setLoading] = useState(true);

// // //   useEffect(() => {
// // //     const fetchNews = async () => {
// // //       try {
// // //         const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all");
// // //         setNews(res.data);
// // //       } catch (err) {
// // //         console.error("뉴스 가져오기 실패:", err);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };
// // //     fetchNews();
// // //   }, []);

// // //   if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

// // //   // "게임이름 - 제목" 또는 "게임이름: 제목" 형태를 분리 (없으면 전체를 제목으로 사용)
// // //   const splitTitle = (raw: string) => {
// // //     const byDash = raw.split(" - ");
// // //     if (byDash.length >= 2) {
// // //       return { game: byDash[0].trim(), headline: byDash.slice(1).join(" - ").trim() };
// // //     }
// // //     const byColon = raw.split(": ");
// // //     if (byColon.length >= 2) {
// // //       return { game: byColon[0].trim(), headline: byColon.slice(1).join(": ").trim() };
// // //     }
// // //     return { game: "", headline: raw.trim() };
// // //   };

// // //   return (
// // //     <div className="max-w-[960px] mx-auto p-6">
// // //       <h1 className="text-3xl font-bold mb-6 text-white">Steam 전체 뉴스</h1>

// // //       <div className="flex flex-col gap-6">
// // //         {news.map((item, index) => {
// // //           const { game, headline } = splitTitle(item.title);
// // //           const hasImage = Boolean(item.image);
// // //           const hasVideo = Boolean(item.video);
// // //           const hasMedia = hasImage || hasVideo;

// // //           return (
// // //             <div
// // //               key={index}
// // //               className="bg-[#111] text-white border border-[#333] rounded-[10px] shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
// // //               onClick={() => window.open(item.link, "_blank")}
// // //             >
// // //               <div className="flex flex-col md:flex-row gap-4 p-4">
// // //                 {/* 왼쪽: 게임 이름 / 제목 / 날짜 / 상세 */}
// // //                 <div className="flex-1">
// // //                   {/* 게임 이름 (있을 때만) */}
// // //                   {game && (
// // //                     <div className="text-sm text-[#9aa4b2] mb-1">
// // //                       {game}
// // //                     </div>
// // //                   )}

// // //                   {/* 업데이트/이벤트 제목 */}
// // //                   <h2 className="text-xl font-semibold">
// // //                     {headline || item.title}
// // //                   </h2>

// // //                   {/* 날짜 */}
// // //                   <p className="text-xs text-[#9aa4b2] mt-1">
// // //                     {new Date(item.pubDate).toLocaleString()}
// // //                   </p>

// // //                   {/* 상세 내용 */}
// // //                   <p className="mt-2 leading-relaxed text-[#d1d5db]">
// // //                     {item.snippet}
// // //                   </p>
// // //                 </div>

// // //                 {/* 오른쪽: 미디어 (이미지/영상이 하나라도 있으면 노출) */}
// // //                 {hasMedia && (
// // //                   <div className="md:w-[240px] w-full md:shrink-0 md:items-start items-center flex">
// // //                     {hasImage && (
// // //                       <img
// // //                         src={item.image as string}
// // //                         alt={headline || item.title}
// // //                         className="w-full md:w-[240px] h-[140px] object-cover rounded-[8px]"
// // //                         onClick={(e) => {
// // //                           e.stopPropagation();
// // //                           window.open(item.link, "_blank");
// // //                         }}
// // //                       />
// // //                     )}

// // //                     {/* (선택) 영상 지원: react-player 사용 시 위 import 주석 해제 */}
// // //                     {/* {hasVideo && !hasImage && (
// // //                       <ReactPlayer
// // //                         url={item.video as string}
// // //                         width="240px"
// // //                         height="140px"
// // //                         controls
// // //                         onClick={(e) => e.stopPropagation()}
// // //                       />
// // //                     )} */}
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           );
// // //         })}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default News;



// // // src/pages/News.tsx
// // import React, { useEffect, useState } from "react";
// // import axiosInstance from "../axiosInstance";
// // // import ReactPlayer from "react-player"; // (선택) 영상 표시 시

// // interface SteamNewsItem {
// //   title: string;
// //   link: string;
// //   pubDate: string;
// //   snippet: string; // 본문 요약
// //   image?: string;
// //   video?: string; // 선택: 있으면 우측에 영상 표시
// // }

// // type FilterType = "all" | "update" | "event";

// // const News: React.FC = () => {
// //   const [news, setNews] = useState<SteamNewsItem[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [filter, setFilter] = useState<FilterType>("all"); // ✅ 추가: 필터 상태

// //   useEffect(() => {
// //     const fetchNews = async () => {
// //       try {
// //         const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all");
// //         setNews(res.data);
// //       } catch (err) {
// //         console.error("뉴스 가져오기 실패:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchNews();
// //   }, []);

// //   if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

// //   // ✅ 업데이트/이벤트 분류: 제목/요약 키워드 기반 간단 추론
// //   const classifyType = (title: string, snippet: string): "update" | "event" => {
// //     const txt = `${title} ${snippet}`.toLowerCase();
// //     const eventKeys = [
// //       "이벤트","축제","기념","토너먼트","대회","보상","프로모션",
// //       "event","festival","anniversary","tournament","competition","reward","promo"
// //     ];
// //     const updateKeys = [
// //       "업데이트","패치","패치노트","버전","밸런스","조정","점검",
// //       "update","patch","patch notes","hotfix","release notes","balance","maintenance"
// //     ];
// //     const isEvent = eventKeys.some(k => txt.includes(k));
// //     const isUpdate = updateKeys.some(k => txt.includes(k));

// //     if (isEvent && !isUpdate) return "event";
// //     if (!isEvent && isUpdate) return "update";

// //     // 둘 다/둘 다 아님 → 제목 재판단 후 모호하면 업데이트로 폴백
// //     const t = title.toLowerCase();
// //     const eventHit = eventKeys.some(k => t.includes(k));
// //     const updateHit = updateKeys.some(k => t.includes(k));
// //     if (eventHit && !updateHit) return "event";
// //     return "update";
// //   };

// //   // "게임이름 - 제목" 또는 "게임이름: 제목" 형태를 분리 (없으면 전체를 제목으로 사용)
// //   const splitTitle = (raw: string) => {
// //     const byDash = raw.split(" - ");
// //     if (byDash.length >= 2) {
// //       return { game: byDash[0].trim(), headline: byDash.slice(1).join(" - ").trim() };
// //     }
// //     const byColon = raw.split(": ");
// //     if (byColon.length >= 2) {
// //       return { game: byColon[0].trim(), headline: byColon.slice(1).join(": ").trim() };
// //     }
// //     return { game: "", headline: raw.trim() };
// //   };

// //   // ✅ 필터 적용된 목록
// //   const filteredNews = news.filter((n) => {
// //     if (filter === "all") return true;
// //     const kind = classifyType(n.title, n.snippet);
// //     return kind === filter;
// //   });

// //   return (
// //     <div className="max-w-[960px] mx-auto p-6">
// //       <h1 className="text-3xl font-bold mb-6 text-white">Steam 전체 뉴스</h1>

// //       {/* ✅ 필터 버튼 바 */}
// //       <div className="flex gap-2 mb-5">
// //         {(["all","update","event"] as FilterType[]).map((f) => (
// //           <button
// //             key={f}
// //             onClick={() => setFilter(f)}
// //             className={`px-3 py-2 rounded border text-sm
// //               ${filter === f
// //                 ? "bg-[#5a8dff] text-white border-transparent"
// //                 : "bg-[#1a1a1a] text-[#aaa] border-[#444] hover:border-[#666]"}`}
// //           >
// //             {f === "all" ? "전체" : f === "update" ? "업데이트" : "이벤트"}
// //           </button>
// //         ))}
// //       </div>

// //       <div className="flex flex-col gap-6">
// //         {filteredNews.map((item, index) => {
// //           const { game, headline } = splitTitle(item.title);
// //           const hasImage = Boolean(item.image);
// //           const hasVideo = Boolean(item.video);
// //           const hasMedia = hasImage || hasVideo;

// //           return (
// //             <div
// //               key={index}
// //               className="bg-[#111] text-white border border-[#333] rounded-[10px] shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
// //               onClick={() => window.open(item.link, "_blank")}
// //             >
// //               <div className="flex flex-col md:flex-row gap-4 p-4">
// //                 {/* 왼쪽: 게임 이름 / 제목 / 날짜 / 상세 */}
// //                 <div className="flex-1">
// //                   {/* (선택) 타입 배지 표시하고 싶으면 주석 해제
// //                   <div className="mb-1">
// //                     <span className={`px-2 py-[2px] text-xs rounded mr-2
// //                       ${classifyType(item.title, item.snippet) === "event"
// //                         ? "bg-[#5a8dff] text-white"
// //                         : "bg-[#2a2a2a] text-[#ddd]"}`}>
// //                       {classifyType(item.title, item.snippet) === "event" ? "이벤트" : "업데이트"}
// //                     </span>
// //                   </div>
// //                   */}
// //                   {game && (
// //                     <div className="text-sm text-[#9aa4b2] mb-1">{game}</div>
// //                   )}

// //                   <h2 className="text-xl font-semibold">
// //                     {headline || item.title}
// //                   </h2>

// //                   <p className="text-xs text-[#9aa4b2] mt-1">
// //                     {new Date(item.pubDate).toLocaleString()}
// //                   </p>

// //                   <p className="mt-2 leading-relaxed text-[#d1d5db]">
// //                     {item.snippet}
// //                   </p>
// //                 </div>

// //                 {/* 오른쪽: 미디어 (이미지/영상이 하나라도 있으면 노출) */}
// //                 {hasMedia && (
// //                   <div className="md:w-[240px] w-full md:shrink-0 md:items-start items-center flex">
// //                     {hasImage && (
// //                       <img
// //                         src={item.image as string}
// //                         alt={headline || item.title}
// //                         className="w-full md:w-[240px] h-[140px] object-cover rounded-[8px]"
// //                         onClick={(e) => {
// //                           e.stopPropagation();
// //                           window.open(item.link, "_blank");
// //                         }}
// //                       />
// //                     )}
// //                     {/* {hasVideo && !hasImage && (
// //                       <ReactPlayer
// //                         url={item.video as string}
// //                         width="240px"
// //                         height="140px"
// //                         controls
// //                         onClick={(e) => e.stopPropagation()}
// //                       />
// //                     )} */}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           );
// //         })}

// //         {filteredNews.length === 0 && (
// //           <div className="text-[#aaa]">해당 조건의 뉴스가 없습니다.</div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default News;


// // src/pages/News.tsx
// import React, { useEffect, useState } from "react";
// import axiosInstance from "../axiosInstance";
// // import ReactPlayer from "react-player"; // (선택) 영상 표시 시

// interface SteamNewsItem {
//   title: string;
//   link: string;
//   pubDate: string;
//   snippet: string; // 본문 요약
//   image?: string;
//   video?: string; // 선택: 있으면 우측에 영상 표시
// }

// type FilterType = "all" | "update" | "event";

// const News: React.FC = () => {
//   const [news, setNews] = useState<SteamNewsItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState<FilterType>("all"); // ✅ 추가: 필터 상태

//   useEffect(() => {
//     const fetchNews = async () => {
//       try {
//         const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all");
//         setNews(res.data);
//       } catch (err) {
//         console.error("뉴스 가져오기 실패:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchNews();
//   }, []);

//   if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

//   // ✅ 업데이트/이벤트 분류: 제목/요약 키워드 기반 간단 추론
//   const classifyType = (title: string, snippet: string): "update" | "event" => {
//     const txt = `${title} ${snippet}`.toLowerCase();

//     // 🔼 이벤트 키워드 확장 (할인/세일/무료/드롭/쿠폰/번들 등 추가)
//     const eventKeys = [
//       "이벤트", "축제", "기념", "토너먼트", "대회", "보상", "프로모션",
//       "할인", "세일", "특가", "주말 할인", "주간 할인", "할인 행사",
//       "무료", "무료 주말", "무료 플레이", "무료 체험",
//       "증정", "경품", "드랍", "드롭", "트위치 드롭스", "쿠폰", "바우처", "번들",
//       "event", "festival", "anniversary", "tournament", "competition", "reward", "promo",
//       "discount", "sale", "deal", "promotion", "bundle", "free", "free weekend", "free-to-play",
//       "giveaway", "drops", "coupon", "voucher", "off"
//     ];

//     const updateKeys = [
//       "업데이트", "패치", "패치노트", "버전", "밸런스", "조정", "점검",
//       "update", "patch", "patch notes", "hotfix", "release notes", "balance", "maintenance"
//     ];

//     const isEvent = eventKeys.some(k => txt.includes(k));
//     const isUpdate = updateKeys.some(k => txt.includes(k));

//     if (isEvent && !isUpdate) return "event";
//     if (!isEvent && isUpdate) return "update";

//     // 둘 다/둘 다 아님 → 제목 재판단 후 모호하면 업데이트로 폴백
//     const t = title.toLowerCase();
//     const eventHit = eventKeys.some(k => t.includes(k));
//     const updateHit = updateKeys.some(k => t.includes(k));
//     if (eventHit && !updateHit) return "event";
//     return "update";
//   };

//   // "게임이름 - 제목" 또는 "게임이름: 제목" 형태를 분리 (없으면 전체를 제목으로 사용)
//   const splitTitle = (raw: string) => {
//     const byDash = raw.split(" - ");
//     if (byDash.length >= 2) {
//       return { game: byDash[0].trim(), headline: byDash.slice(1).join(" - ").trim() };
//     }
//     const byColon = raw.split(": ");
//     if (byColon.length >= 2) {
//       return { game: byColon[0].trim(), headline: byColon.slice(1).join(": ").trim() };
//     }
//     return { game: "", headline: raw.trim() };
//   };

//   // ✅ 필터 적용된 목록
//   const filteredNews = news.filter((n) => {
//     if (filter === "all") return true;
//     const kind = classifyType(n.title, n.snippet);
//     return kind === filter;
//   });

//   return (
//     <div className="max-w-[960px] mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-white">Steam 뉴스</h1>

//       {/* ✅ 필터 버튼 바 */}
//       <div className="flex gap-2 mb-5">
//         {(["all", "update", "event"] as FilterType[]).map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-3 py-2 rounded border text-sm
//               ${filter === f
//                 ? "bg-[#5a8dff] text-white border-transparent"
//                 : "bg-[#1a1a1a] text-[#aaa] border-[#444] hover:border-[#666]"}`}
//           >
//             {f === "all" ? "전체" : f === "update" ? "업데이트" : "이벤트"}
//           </button>
//         ))}
//       </div>

//       <div className="flex flex-col gap-6">
//         {filteredNews.map((item, index) => {
//           const { game, headline } = splitTitle(item.title);
//           const hasImage = Boolean(item.image);
//           const hasVideo = Boolean(item.video);
//           const hasMedia = hasImage || hasVideo;

//           return (
//             <div
//               key={index}
//               className="bg-[#111] text-white border border-[#333] rounded-[10px] shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
//               onClick={() => window.open(item.link, "_blank")}
//             >
//               <div className="flex flex-col md:flex-row gap-4 p-4">
//                 {/* 왼쪽: 게임 이름 / 제목 / 날짜 / 상세 */}
//                 <div className="flex-1">
//                   {/* (선택) 타입 배지 표시하고 싶으면 주석 해제
//                   <div className="mb-1">
//                     <span className={`px-2 py-[2px] text-xs rounded mr-2
//                       ${classifyType(item.title, item.snippet) === "event"
//                         ? "bg-[#5a8dff] text-white"
//                         : "bg-[#2a2a2a] text-[#ddd]"}`}>
//                       {classifyType(item.title, item.snippet) === "event" ? "이벤트" : "업데이트"}
//                     </span>
//                   </div>
//                   */}
//                   {game && (
//                     <div className="text-sm text-[#9aa4b2] mb-1">{game}</div>
//                   )}

//                   <h2 className="text-xl font-semibold">
//                     {headline || item.title}
//                   </h2>

//                   <p className="text-xs text-[#9aa4b2] mt-1">
//                     {new Date(item.pubDate).toLocaleString()}
//                   </p>

//                   <p className="mt-2 leading-relaxed text-[#d1d5db]">
//                     {item.snippet}
//                   </p>
//                 </div>

//                 {/* 오른쪽: 미디어 (이미지/영상이 하나라도 있으면 노출) */}
//                 {hasMedia && (
//                   <div className="md:w-[240px] w-full md:shrink-0 md:items-start items-center flex">
//                     {hasImage && (
//                       <img
//                         src={item.image as string}
//                         alt={headline || item.title}
//                         className="w-full md:w-[240px] h-[140px] object-cover rounded-[8px]"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           window.open(item.link, "_blank");
//                         }}
//                       />
//                     )}
//                     {/* {hasVideo && !hasImage && (
//                       <ReactPlayer
//                         url={item.video as string}
//                         width="240px"
//                         height="140px"
//                         controls
//                         onClick={(e) => e.stopPropagation()}
//                       />
//                     )} */}
//                   </div>
//                 )}
//               </div>
//             </div>
//           );
//         })}

//         {filteredNews.length === 0 && (
//           <div className="text-[#aaa]">해당 조건의 뉴스가 없습니다.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default News;


// src/pages/News.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
// import ReactPlayer from "react-player"; // (선택) 영상 표시 시

interface SteamNewsItem {
  title: string;
  link: string;
  pubDate: string;
  snippet: string; // 본문 요약
  image?: string;
  video?: string; // 선택: 있으면 우측에 영상 표시
}

type FilterType = "all" | "update" | "event";

const News: React.FC = () => {
  const [news, setNews] = useState<SteamNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all"); // ✅ 필터 상태
  const [search, setSearch] = useState<string>("");        // ✅ 검색 상태

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axiosInstance.get<SteamNewsItem[]>("/steam/news/all");
        setNews(res.data);
      } catch (err) {
        console.error("뉴스 가져오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <div className="text-center mt-10">뉴스 로딩 중...</div>;

  // ✅ 이벤트/업데이트 분류(키워드 휴리스틱)
  const classifyType = (title: string, snippet: string): "update" | "event" => {
    const txt = `${title} ${snippet}`.toLowerCase();

    const eventKeys = [
      "이벤트", "축제", "기념", "토너먼트", "대회", "보상", "프로모션",
      "할인", "세일", "특가", "주말 할인", "주간 할인", "할인 행사",
      "무료", "무료 주말", "무료 플레이", "무료 체험",
      "증정", "경품", "드랍", "드롭", "트위치 드롭스", "쿠폰", "바우처", "번들",
      "event", "festival", "anniversary", "tournament", "competition", "reward", "promo",
      "discount", "sale", "deal", "promotion", "bundle", "free", "free weekend", "free-to-play",
      "giveaway", "drops", "coupon", "voucher", "off"
    ];

    const updateKeys = [
      "업데이트", "패치", "패치노트", "버전", "밸런스", "조정", "점검",
      "update", "patch", "patch notes", "hotfix", "release notes", "balance", "maintenance"
    ];

    const isEvent = eventKeys.some(k => txt.includes(k));
    const isUpdate = updateKeys.some(k => txt.includes(k));

    if (isEvent && !isUpdate) return "event";
    if (!isEvent && isUpdate) return "update";

    const t = title.toLowerCase();
    const eventHit = eventKeys.some(k => t.includes(k));
    const updateHit = updateKeys.some(k => t.includes(k));
    if (eventHit && !updateHit) return "event";
    return "update";
  };

  // 제목 분리: "게임이름 - 제목" / "게임이름: 제목"
  const splitTitle = (raw: string) => {
    const byDash = raw.split(" - ");
    if (byDash.length >= 2) {
      return { game: byDash[0].trim(), headline: byDash.slice(1).join(" - ").trim() };
    }
    const byColon = raw.split(": ");
    if (byColon.length >= 2) {
      return { game: byColon[0].trim(), headline: byColon.slice(1).join(": ").trim() };
    }
    return { game: "", headline: raw.trim() };
  };

  // 1차: 탭 필터
  const filteredNews = news.filter((n) => {
    if (filter === "all") return true;
    const kind = classifyType(n.title, n.snippet);
    return kind === filter;
  });

  // 2차: 검색 필터 (제목/요약/게임명/헤드라인에 포함 여부)
  const visibleNews = filteredNews.filter((n) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    const { game, headline } = splitTitle(n.title || "");
    return [
      n.title?.toLowerCase() || "",
      n.snippet?.toLowerCase() || "",
      game.toLowerCase(),
      headline.toLowerCase(),
    ].some((s) => s.includes(term));
  });

  return (
    <div className="max-w-[960px] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">Steam 뉴스</h1>

      {/* 필터 + 검색 바 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-2">
          {(["all", "update", "event"] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded border text-sm
                ${filter === f
                  ? "bg-[#5a8dff] text-white border-transparent"
                  : "bg-[#1a1a1a] text-[#aaa] border-[#444] hover:border-[#666]"}`}
            >
              {f === "all" ? "전체" : f === "update" ? "업데이트" : "이벤트"}
            </button>
          ))}
        </div>

        {/* ✅ 검색 인풋 (구조 변경 없이 추가) */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="제목/내용/게임명 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm bg-[#1a1a1a] text-white border border-[#444] rounded outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-3 py-2 text-sm rounded border bg-[#2a2a2a] text-[#ddd] border-[#444] hover:border-[#666]"
            >
              초기화
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {visibleNews.map((item, index) => {
          const { game, headline } = splitTitle(item.title);
          const hasImage = Boolean(item.image);
          const hasVideo = Boolean(item.video);
          const hasMedia = hasImage || hasVideo;

          return (
            <div
              key={index}
              className="bg-[#111] text-white border border-[#333] rounded-[10px] shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
              onClick={() => window.open(item.link, "_blank")}
            >
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* 왼쪽: 게임 이름 / 제목 / 날짜 / 상세 */}
                <div className="flex-1">
                  {game && (
                    <div className="text-sm text-[#9aa4b2] mb-1">{game}</div>
                  )}

                  <h2 className="text-xl font-semibold">
                    {headline || item.title}
                  </h2>

                  <p className="text-xs text-[#9aa4b2] mt-1">
                    {new Date(item.pubDate).toLocaleString()}
                  </p>

                  <p className="mt-2 leading-relaxed text-[#d1d5db]">
                    {item.snippet}
                  </p>
                </div>

                {/* 오른쪽: 미디어 (이미지/영상이 하나라도 있으면 노출) */}
                {hasMedia && (
                  <div className="md:w-[240px] w-full md:shrink-0 md:items-start items-center flex">
                    {hasImage && (
                      <img
                        src={item.image as string}
                        alt={headline || item.title}
                        className="w-full md:w-[240px] h-[140px] object-cover rounded-[8px]"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(item.link, "_blank");
                        }}
                      />
                    )}
                    {/* {hasVideo && !hasImage && (
                      <ReactPlayer
                        url={item.video as string}
                        width="240px"
                        height="140px"
                        controls
                        onClick={(e) => e.stopPropagation()}
                      />
                    )} */}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {visibleNews.length === 0 && (
          <div className="text-[#aaa]">해당 조건의 뉴스가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default News;

import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { MessageList, Input } from "react-chat-elements";
import "react-chat-elements/dist/main.css";
import axiosInstance from "../axiosInstance";

interface ChatMessage {
  position: "left" | "right";
  type: "text";
  text: string;
  date: Date;
}

export default function Chat() {
  const [user, setUser] = useState<{ nickname: string; token: string } | null>(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // ✅ 스크롤 참조 및 맨아래 이동
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    const nickname = localStorage.getItem("nickname") || "익명";
    const token = localStorage.getItem("token") || "";
    if (!token) return;
  
    setUser({ nickname, token });
  
    const newSocket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:5000", {
      auth: { token: token }, // token이 빈 문자열이면 연결 안 됨
    });
  
    newSocket.on("connect_error", (err) => {
      console.error("Socket 연결 에러:", err.message);
    });
  
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    axiosInstance
      .get("/chat/messages", { headers: { Authorization: `Bearer ${user.token}` } })
      .then((res) => {
        const formatted: ChatMessage[] = res.data.map((msg: any) => ({
          position: msg.user === user.nickname ? "right" : "left",
          type: "text",
          text: `${msg.user}: ${msg.text}`,
          date: new Date(msg.date),
        }));
        setChat(formatted);
        requestAnimationFrame(() => scrollToBottom(false)); // 초기 맨밑
      })
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    if (!socket || !user) return;
  
    const handleNewMessage = (msg: { user: string; text: string; date: string }) => {
      const newMsg: ChatMessage = {
        position: msg.user === user.nickname ? "right" : "left",
        type: "text",
        text: `${msg.user}: ${msg.text}`,
        date: new Date(msg.date),
      };
      setChat((prev) => [...prev, newMsg]);
    };
  
    socket.on("chat message", handleNewMessage);
  
    return () => {
      socket.off("chat message", handleNewMessage);
    };
  }, [socket, user]);
  

  // 채팅 업데이트마다 맨아래
  useEffect(() => {
    scrollToBottom(true);
  }, [chat]);

  const sendMessage = () => {
    if (!user || !socket) return;
    if (!message.trim()) return;
    socket.emit("chat message", { text: message });
    setMessage("");
    requestAnimationFrame(() => scrollToBottom(true));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>로그인 후 채팅을 이용할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div className="h-[100svh] overflow-hidden grid grid-rows-[auto_1fr] bg-[#070b14]">
      {/* 헤더 */}
      <header className="sticky top-0 z-10">
        <div className="mx-auto w-full max-w-5xl px-4">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-700 to-purple-800 text-white shadow-lg px-4 py-3 flex items-center justify-between">
            <h1 className="text-lg md:text-xl font-semibold">오픈 채팅</h1>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              </span>
              <span className="hidden sm:inline">접속 중</span>
            </div>
          </div>
        </div>
      </header>

      {/* 본문: 내부 스크롤만 유지 */}
      <main className="overflow-hidden">
        <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-0 h-full">
          <div className="h-full overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm shadow-lg">
            {/* 부모는 flex column, 메시지영역은 flex-1 + overflow, 입력창은 아래에 배치 */}
            <div className="h-full flex flex-col min-h-0">
              {/* 채팅 리스트 (내부 스크롤) */}
              <div
                ref={scrollRef}
                className="flex-1 min-h-0 overflow-y-auto p-3 md:p-4"
                style={{ overscrollBehavior: "contain" }}
              >
                <MessageList
                  referance={scrollRef}
                  dataSource={chat as any[]}
                  lockable
                  toBottomHeight={0}
                  className="bg-transparent"
                />
              </div>

              {/* 입력칸: 스크롤 영역 아래, 항상 보임 */}
              <div className="border-t border-white/5 bg-black/40 shrink-0">
                <div className="px-2 py-2 md:px-3 md:py-2">
                  <div className="chat-input bg-[#0b1220] px-2 py-2 rounded-xl flex items-center gap-2">
                  <Input
                      placeholder="메시지를 입력하세요..."
                      value={message}
                      onChange={(e: { target: { value: string } }) => setMessage(e.target.value)}
                      rightButtons={[
                        <button
                          key="send"
                          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition text-white px-4 py-2 rounded-lg ml-2 shadow"
                          onClick={sendMessage}
                        >
                          전송
                        </button>
                      ]}
                      inputStyle={{
                        backgroundColor: "#0b1220",
                        color: "#e5e7eb",
                        borderRadius: "12px",
                      }}
                      className="flex-1"
                      maxHeight={100} // 필수 prop 추가 (react-chat-elements Input)
                    />
                  </div>
                </div>
              </div>
              {/* ↑ absolute 제거, padding-bottom 불필요(겹침 없음) */}
            </div>
          </div>
        </div>
      </main>

      {/* 스타일 오버라이드 */}
      <style>{`
        /* 하얀 박스 제거 */
        .chat-input .rce-container-input,
        .chat-input .rce-input,
        .chat-input .rce-input-buttons {
          background: transparent !important;
          border: 0 !important;
          box-shadow: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .chat-input .rce-input input {
          background: #0b1220 !important;
          color: #e5e7eb !important;
        }
        .chat-input .rce-input input::placeholder { color: #8a94a7 !important; }
        .chat-input button:focus { outline: none !important; box-shadow: none !important; }

        /* 말풍선 꼬리 제거 + 톤 */
        .message-list .rce-mbox-left-notch,
        .message-list .rce-mbox-right-notch { display: none !important; }

        .message-list .rce-mlist,
        .message-list .rce-container-mlist { background: transparent !important; }
        .message-list .rce-mlist .rce-mlist-item { margin: 8px 0 !important; }

        .message-list .rce-mbox {
          border-radius: 14px !important;
          box-shadow: 0 6px 18px rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.04);
        }
        .message-list .rce-mbox .rce-mbox-text { color: inherit !important; line-height: 1.5; }
        .message-list .rce-mbox-time { color: #7a8794 !important; }

        .message-list .rce-mbox:not(.rce-mbox-right) { background: #0f172a !important; color: #cbd5e1 !important; }
        .message-list .rce-mbox.rce-mbox-right { background: #1d4ed8 !important; color: #f8fafc !important; }
      `}</style>
    </div>
  );
}

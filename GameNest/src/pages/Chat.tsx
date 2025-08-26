import { useState, useEffect, useRef } from "react";
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = (smooth = true) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  // 로그인 정보 가져오기
  useEffect(() => {
    const nickname = localStorage.getItem("nickname") || "익명";
    const token = localStorage.getItem("token") || "";
    if (!token) return;
    setUser({ nickname, token });
  }, []);

  // 2초마다 메시지 폴링
  useEffect(() => {
    if (!user) return;

    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get("/chat/messages", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const formatted: ChatMessage[] = res.data.map((msg: any) => ({
          position: msg.user === user.nickname ? "right" : "left",
          type: "text",
          text: `${msg.user}: ${msg.text}`,
          date: new Date(msg.date),
        }));
        setChat(formatted);
        requestAnimationFrame(() => scrollToBottom(false));
      } catch (err) {
        console.error("채팅 불러오기 실패:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [user]);

  const sendMessage = async () => {
    if (!user || !message.trim()) return;

    try {
      await axiosInstance.post(
        "/chat/messages",
        { text: message },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessage("");
    } catch (err) {
      console.error("메시지 전송 실패:", err);
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [chat]);

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

      {/* 본문 */}
      <main className="overflow-hidden">
        <div className="mx-auto w-full max-w-5xl px-4 pt-4 pb-0 h-full">
          <div className="h-full overflow-hidden rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm shadow-lg">
            <div className="h-full flex flex-col min-h-0">
              {/* 메시지 영역 */}
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

              {/* 입력 영역 */}
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
                        </button>,
                      ]}
                      inputStyle={{
                        backgroundColor: "#0b1220",
                        color: "#e5e7eb",
                        borderRadius: "12px",
                      }}
                      className="flex-1"
                      maxHeight={100}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 스타일 오버라이드 */}
      <style>{`
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

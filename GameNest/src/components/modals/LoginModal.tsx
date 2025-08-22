import { useState } from "react";
import axiosInstance from "../../axiosInstance";

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  try {
    return atob(str);
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): { id?: number; [key: string]: any } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = base64UrlDecode(payload);
    if (!decoded) return null;
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

interface LoginModalProps {
  onClose: () => void;
  onOpenFindId: () => void;
  onOpenFindPassword: () => void;
  onOpenSignup: () => void;
  setNickname: (nickname: string) => void;
  setUserId?: (id: number | null) => void;
  onLogin?: (nickname: string, userId: number | null) => void;
}

const LoginModal = ({
  onClose,
  onOpenFindId,
  onOpenFindPassword,
  onOpenSignup,
  setNickname,
  setUserId,
  onLogin,
}: LoginModalProps) => {
  const [form, setForm] = useState({ user_login_id: "", user_password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { user_login_id, user_password } = form;

    if (!user_login_id || !user_password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/login", {
        user_login_id,
        user_password,
      });

      const token = res.data.token;
      const nickname = res.data.user_nickname;

      localStorage.setItem("token", token);
      localStorage.setItem("nickname", nickname);
      setNickname(nickname);

      const decoded = decodeJwtPayload(token);
      const userId = decoded?.id ?? null;

      if (setUserId) setUserId(userId);
      if (onLogin) onLogin(nickname, userId);

      onClose();

      // 필요하다면 전체 새로고침
      window.location.reload();
    } catch (err: any) {
      console.error("로그인 실패:", err);
      alert(err.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-black p-8 rounded-xl w-[360px] text-white shadow-lg relative">
        <div className="flex justify-center items-center mb-6 relative">
          <h4 className="text-2xl font-bold text-center">로그인</h4>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-white text-2xl leading-none hover:opacity-70 transition-opacity"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <input
            name="user_login_id"
            placeholder="아이디"
            value={form.user_login_id}
            onChange={handleChange}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder-gray-400 focus:outline-none"
          />
          <input
            name="user_password"
            placeholder="비밀번호"
            type="password"
            value={form.user_password}
            onChange={handleChange}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={handleSubmit}
            className="mt-2 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded-md text-base transition-colors"
          >
            로그인
          </button>
        </div>

        <div className="flex justify-around mt-5 text-xs text-gray-400">
          <span className="cursor-pointer hover:underline" onClick={onOpenSignup}>
            회원가입
          </span>
          <span className="cursor-pointer hover:underline" onClick={onOpenFindId}>
            아이디 찾기
          </span>
          <span className="cursor-pointer hover:underline" onClick={onOpenFindPassword}>
            비밀번호 찾기
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

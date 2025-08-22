// src/modals/FindPasswordModal.tsx
import { useState } from "react";
import axiosInstance from "../../axiosInstance";

interface FindPasswordModalProps {
  onClose: () => void;
  onSuccess: (userId: number) => void; // 성공 시 userId 전달
}

const FindPasswordModal = ({ onClose, onSuccess }: FindPasswordModalProps) => {
  const [userLoginId, setUserLoginId] = useState<string>(""); // state 이름 통일
  const [userEmail, setUserEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    // ✅ 입력값 확인
    console.log("입력값:", userLoginId, userEmail);

    if (!userLoginId.trim() || !userEmail.trim()) {
      alert("아이디와 이메일을 모두 입력하세요.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post("/auth/find-password", {
        user_login_id: userLoginId,
        user_email: userEmail,       
      });

      if (res.status === 200) {
        console.log("검증 성공:", res.data);
        // API 성공 시 ChangePasswordModal 열기
        onSuccess(res.data.userId);
        onClose();
      }
    } catch (err: any) {
      console.error("비밀번호 찾기 에러:", err);
      alert(err.response?.data?.message || "비밀번호 찾기 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex justify-center items-center">
      <div className="bg-black p-8 rounded-xl w-96 text-white shadow-lg">
        {/* 상단 타이틀 & 닫기 */}
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-bold text-center flex-1">비밀번호 찾기</h4>
          <button className="text-white text-2xl font-bold ml-4" onClick={onClose}>
            ×
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="text-sm">회원가입 시 입력한 아이디와 이메일을 입력하세요</div>
          <input
            type="text"
            placeholder="아이디"
            value={userLoginId}
            onChange={(e) => setUserLoginId(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder-gray-400 outline-none"
          />
          <input
            type="text"
            placeholder="이메일 주소"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder-gray-400 outline-none"
          />
          <button
            className="bg-red-700 text-white py-2 rounded-md font-bold text-sm mt-4 hover:bg-red-800 disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "검증 중..." : "정보 확인"}
          </button>
        </div>

        {/* 하단 링크 */}
        <div className="text-center text-gray-400 text-xs cursor-pointer" onClick={onClose}>
          로그인으로 돌아가기
        </div>
      </div>
    </div>
  );
};

export default FindPasswordModal;

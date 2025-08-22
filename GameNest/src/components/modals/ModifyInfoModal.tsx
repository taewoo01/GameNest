import { useState } from "react";
import axiosInstance from "../../axiosInstance"; // axiosInstance 경로 확인

interface ModifyModalProps {
  onClose: () => void;
  currentNickname: string;
  setNickname: (nickname: string) => void;
}

const ModifyInfoModal = ({ onClose, currentNickname: initialNickname, setNickname }: ModifyModalProps) => {
  const [currentNickname, setCurrentNickname] = useState(initialNickname);
  const [newNickname, setNewNickname] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("로그인이 필요합니다.");
        return;
      }

      await axiosInstance.patch(
        "/auth/update",
        { currentNickname, newNickname, currentEmail, newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess("정보가 성공적으로 변경되었습니다.");
      localStorage.setItem("nickname", newNickname || currentNickname);
      setNickname(newNickname || currentNickname);
      setTimeout(() => onClose(), 1000);
    } catch (err: any) {
      console.error("❌ 정보 수정 에러:", err);
      setError(err.response?.data?.message || "정보 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-black p-8 rounded-xl w-96 text-white shadow-lg">
        <h4 className="text-2xl font-bold text-center mb-6">정보 수정</h4>
        <div className="flex flex-col gap-4">
          <input
            placeholder="현재 닉네임"
            value={currentNickname}
            onChange={(e) => setCurrentNickname(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder:text-gray-400 outline-none"
          />
          <input
            placeholder="바꿀 닉네임"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder:text-gray-400 outline-none"
          />
          <input
            placeholder="현재 이메일 주소"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder:text-gray-400 outline-none"
          />
          <input
            placeholder="바꿀 이메일 주소"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder:text-gray-400 outline-none"
          />
        </div>

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-500 mt-2 text-sm">{success}</p>}

        <div className="flex justify-between mt-8 gap-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 rounded-md font-bold text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "저장 중..." : "저장하기"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-red-700 text-white py-2 rounded-md font-bold text-sm hover:bg-red-800"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModifyInfoModal;

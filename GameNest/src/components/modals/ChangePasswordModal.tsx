// src/components/ChangePasswordNoLoginModal.tsx
import React, { useState } from "react";
import axiosInstance from "../../axiosInstance";

interface ChangePasswordNoLoginModalProps {
  onClose: () => void;
  userId: number; // 비밀번호 찾기 후 전달된 userId
  onSuccess: () => void; // ✅ 성공 시 실행될 콜백
}

const ChangePasswordNoLoginModal: React.FC<ChangePasswordNoLoginModalProps> = ({
  onClose,
  userId,
  onSuccess,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async () => {
    setError(null);
    setSuccess(null);

    if (!newPassword || !confirmPassword) {
      setError("모든 입력란을 채워주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.put("/auth/update-password-no-login", {
        userId,
        newPassword,
      });

      setSuccess(res.data.message);

      // ✅ 비밀번호 변경 성공 시 onSuccess 호출
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("비밀번호 변경 실패:", err);
      setError(err.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center">
      <div className="bg-black p-8 rounded-xl w-96 text-white shadow-lg">
        <h4 className="text-2xl font-bold text-center mb-6">비밀번호 변경</h4>

        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder-gray-400 outline-none"
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder-gray-400 outline-none"
          />
        </div>

        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
        {success && <p className="text-green-500 mt-3 text-sm">{success}</p>}

        <div className="flex justify-between mt-8 gap-2">
          <button
            onClick={handleChangePassword}
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

export default ChangePasswordNoLoginModal;

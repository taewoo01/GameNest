import axios from "axios";
import { useState } from "react";

const FindIdModal = ({ onClose, onOpenLogin }: { onClose: () => void; onOpenLogin: () => void }) => {
  const [userEmail, setUserEmail] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [resultId, setResultId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFindId = async () => {
    setErrorMessage(null);
    setResultId(null);

    try {
      const res = await axios.post("http://192.168.0.4:5000/auth/find-id", {
        user_email: userEmail,
        user_nickname: userNickname
      });

      setResultId(res.data.user_login_id);
    } catch (err: any) {
      if (err.response) {
        setErrorMessage(err.response.data.message || "아이디를 찾을 수 없습니다.");
      } else {
        setErrorMessage("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex justify-center items-center">
      <div className="bg-black p-8 rounded-xl w-96 text-white shadow-lg relative">
        
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-bold">아이디 찾기</h4>
          <button
            className="text-white text-xl hover:text-gray-400"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* 본문 */}
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-300">
            회원가입 시 입력한 이메일과 닉네임을 입력하세요
          </div>
          <input
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="이메일"
            className="p-2 border-b border-white bg-transparent text-white outline-none text-sm placeholder-gray-400"
          />
          <input
            value={userNickname}
            onChange={(e) => setUserNickname(e.target.value)}
            placeholder="닉네임"
            className="p-2 border-b border-white bg-transparent text-white outline-none text-sm placeholder-gray-400"
          />
          <button
            onClick={handleFindId}
            className="mt-2 bg-red-700 hover:bg-red-800 text-white py-2 rounded-md font-bold text-sm"
          >
            아이디 찾기
          </button>

          {/* 결과/에러 메시지 */}
          {resultId && (
            <div className="mt-2 text-green-400 text-sm">
              회원님의 아이디: <strong>{resultId}</strong>
            </div>
          )}
          {errorMessage && (
            <div className="mt-2 text-red-400 text-sm">{errorMessage}</div>
          )}
        </div>

        {/* 하단 */}
        <div className="flex justify-center mt-6 text-xs text-gray-400">
          <span
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            className="cursor-pointer hover:underline"
          >
            로그인으로 돌아가기
          </span>
        </div>
      </div>
    </div>
  );
};

export default FindIdModal;

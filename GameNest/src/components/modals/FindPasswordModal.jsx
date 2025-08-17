// src/modals/FindPasswordModal.jsx
const FindPasswordModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] flex justify-center items-center">
            <div className="bg-black p-[30px] rounded-[12px] w-[400px] text-white shadow-[0_0_10px_#333]">
                {/* 헤더 (제목은 가운데, 닫기 버튼은 우측 상단) */}
                <div className="login-header relative mb-[25px]">
                    <h4 className="modal-title text-[24px] font-bold text-center">
                        비밀번호 찾기
                    </h4>
                    <button
                        className="close-btn absolute right-0 top-0 bg-transparent border-0 text-white text-[20px] cursor-pointer"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {/* 본문 */}
                <div className="modalSpace flex flex-col gap-[15px]">
                    <div>회원가입 시 입력한 아이디와 이메일을 입력하세요</div>

                    <input
                        placeholder="아이디"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        placeholder="이메일 주소"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />

                    {/* CSS의 .button 규격을 그대로 반영 */}
                    <button className="login-btn mt-5 bg-[#c62828] text-white p-[10px] border-0 rounded-[6px] cursor-pointer text-[15px] font-bold">
                        이메일로 비밀번호 보내기
                    </button>
                </div>

                {/* 하단 링크 */}
                <div className="account-options text-center text-[13px] mt-5 text-gray-500 cursor-pointer">
                    <span onClick={onClose}>로그인으로 돌아가기</span>
                </div>
            </div>
        </div>
    );
};

export default FindPasswordModal;

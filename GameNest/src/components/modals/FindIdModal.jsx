// src/modals/FindIdModal.jsx
const FindIdModal = ({ onClose }) => {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] flex justify-center items-center">
            <div className="bg-black p-[30px] rounded-[12px] w-[400px] text-white shadow-[0_0_10px_#333] relative">
                <div className="login-header flex justify-between items-center mb-[25px]">
                    <h4 className="modal-title text-[24px] font-bold">
                        아이디 찾기
                    </h4>
                    <button
                        className="close-btn bg-transparent border-0 text-white text-[20px] cursor-pointer"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="modalSpace flex flex-col gap-[15px]">
                    <div>회원가입 시 입력한 이름과 닉네임을 입력하시오</div>
                    <input
                        placeholder="이름"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        placeholder="닉네임"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <button className="login-btn mt-[10px] bg-[#c62828] text-white p-[10px] border-0 rounded-[6px] font-bold cursor-pointer text-[15px]">
                        아이디 찾기
                    </button>
                </div>

                <div className="account-options flex justify-center mt-5 text-[13px] text-gray-500">
                    <span className="cursor-pointer" onClick={onClose}>
                        로그인으로 돌아가기
                    </span>
                </div>
            </div>
        </div>
    );
};

export default FindIdModal;

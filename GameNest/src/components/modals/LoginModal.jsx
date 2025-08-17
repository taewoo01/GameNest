// src/modals/LoginModal.jsx
const LoginModal = ({
    onClose,
    onOpenFindId,
    onOpenFindPassword,
    onOpenSignup,
}) => {
    return (
        <div className="modal-overlay fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] flex justify-center items-center">
            <div className="modal bg-black p-[30px] rounded-[12px] w-[360px] text-white shadow-[0_0_10px_#333] relative">
                <div className="login-header flex justify-center items-center relative mb-[25px]">
                    <h4 className="modal-title text-[24px] font-bold text-center mb-0">
                        로그인
                    </h4>
                    <button
                        className="close-btn absolute top-0 right-0 bg-transparent border-0 text-white text-[20px] cursor-pointer"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <div className="modalSpace flex flex-col gap-[15px]">
                    <input
                        placeholder="아이디"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        placeholder="비밀번호"
                        type="password"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <button className="login-btn mt-[10px] bg-[#c62828] text-white p-[10px] border-0 rounded-[6px] font-bold cursor-pointer text-[15px]">
                        로그인
                    </button>
                </div>

                <div className="account-options flex justify-around mt-[20px] text-[12px] text-gray-500">
                    <span className="cursor-pointer" onClick={onOpenSignup}>
                        회원가입
                    </span>
                    <span className="cursor-pointer" onClick={onOpenFindId}>
                        아이디 찾기
                    </span>
                    <span
                        className="cursor-pointer"
                        onClick={onOpenFindPassword}
                    >
                        비밀번호 찾기
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;

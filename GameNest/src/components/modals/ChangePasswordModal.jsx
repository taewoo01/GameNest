import React from "react";

function ChangePasswordModal({ onClose }) {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] flex justify-center items-center">
            <div className="bg-black p-[30px] rounded-[12px] w-[400px] text-white shadow-[0_0_10px_#333]">
                <h4 className="text-[24px] font-bold text-center mb-[25px]">
                    비밀번호 변경
                </h4>

                <div className="flex flex-col gap-[15px]">
                    <input
                        type="password"
                        placeholder="이전 비밀번호"
                        className="p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        type="password"
                        placeholder="새로운 비밀번호"
                        className="p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        className="p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                </div>

                <div className="flex justify-between mt-[30px]">
                    <button className="bg-[green] text-white p-[10px] border-0 rounded-[6px] cursor-pointer flex-1 mr-[10px] text-[15px] font-bold">
                        저장하기
                    </button>
                    <button
                        className="bg-[#b82d2d] text-white p-[10px] border-0 rounded-[6px] cursor-pointer flex-1 text-[15px] font-bold"
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChangePasswordModal;

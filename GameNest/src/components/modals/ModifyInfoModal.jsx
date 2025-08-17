// src/modals/ModifyInfoModal.jsx
import React from "react";

const ModifyInfoModal = ({ onClose }) => {
    return (
        <div className="modal-overlay fixed inset-0 w-screen h-screen bg-[rgba(0,0,0,0.7)] z-[9999] flex justify-center items-center">
            <div className="modal bg-black p-[30px] rounded-[12px] w-[400px] text-white shadow-[0_0_10px_#333]">
                <h4 className="modal-title text-[24px] font-bold text-center mb-[25px]">
                    정보 수정
                </h4>

                <div className="modalSpace flex flex-col gap-[15px]">
                    <input
                        placeholder="이전 닉네임"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        placeholder="바꿀 닉네임"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        placeholder="현재 이메일 주소"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                    <input
                        placeholder="바꿀 이메일 주소"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder-[#bbb]"
                    />
                </div>

                <div className="button-row flex justify-between mt-[30px]">
                    <button className="save-btn bg-green-600 text-white p-[10px] border-0 rounded-[6px] cursor-pointer flex-1 mr-[10px] text-[15px] font-bold">
                        저장하기
                    </button>
                    <button
                        className="cancel-btn bg-[#b82d2d] text-white p-[10px] border-0 rounded-[6px] cursor-pointer flex-1 text-[15px] font-bold"
                        onClick={onClose}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModifyInfoModal;

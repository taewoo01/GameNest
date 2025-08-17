// src/modals/MyPageModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function MyPageModal({ onClose, onOpenModifyInfo, onOpenChangePassword }) {
    const navigate = useNavigate();

    const goTo = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div className="mypage-modal fixed top-[60px] right-[20px] bg-[#222] border border-[#444] text-white p-[15px] rounded-[8px] w-[200px] z-[1000] shadow-[0_0_10px_rgba(0,0,0,0.5)]">
            <div className="mypage-content">
                <div className="mypage-header flex justify-between items-center mb-[10px]">
                    <span>닉네임1님</span>
                    <button
                        className="close-btn bg-transparent border-0 text-white text-[16px] cursor-pointer"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <ul className="mypage-menu list-none p-0 m-0">
                    <li
                        className="py-[6px] cursor-pointer hover:text-[#ffa500]"
                        onClick={() => {
                            onClose();
                            onOpenModifyInfo(); // ✅ 정보 수정 모달 열기
                        }}
                    >
                        정보 수정
                    </li>
                    <li
                        className="py-[6px] cursor-pointer hover:text-[#ffa500]"
                        onClick={() => {
                            onClose();
                            onOpenChangePassword(); // ✅ 비밀번호 변경 모달 열기
                        }}
                    >
                        비밀번호 변경
                    </li>
                    <li
                        className="py-[6px] cursor-pointer hover:text-[#ffa500]"
                        onClick={() => goTo("/liked")}
                    >
                        찜한 게임
                    </li>
                    <hr />
                    <li
                        className="py-[6px] cursor-pointer hover:text-[#ffa500]"
                        onClick={() => goTo("/myposts")}
                    >
                        내가 쓴 게시글
                    </li>
                    <li
                        className="py-[6px] cursor-pointer hover:text-[#ffa500]"
                        onClick={() => goTo("/my-comments")}
                    >
                        내가 쓴 댓글
                    </li>
                    <li
                        className="py-[6px] cursor-pointer hover:text-[#ffa500]"
                        onClick={() => goTo("/scraps")}
                    >
                        스크랩한 게시글
                    </li>
                    <hr />
                    <li className="py-[6px] cursor-pointer hover:text-[#ffa500]">
                        로그아웃
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default MyPageModal;

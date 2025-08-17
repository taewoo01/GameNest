// src/modals/SignupModal.jsx
import React, { useState } from "react";
import axios from "axios";

const SignupModal = ({ onClose }) => {
    const [form, setForm] = useState({
        user_id: "",
        password: "",
        confirmPassword: "",
        nickname: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async () => {
        const { user_id, password, confirmPassword, nickname, email } = form;

        if (!user_id || !password || !confirmPassword || !nickname || !email) {
            alert("모든 항목을 입력해주세요.");
            return;
        }

        if (password !== confirmPassword) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            const res = await axios.post(
                "http://192.168.0.192:5000/auth/register",
                {
                    user_id,
                    password,
                    nickname,
                    email,
                }
            );

            alert(res.data.message); // MESSAGES.REGISTER_SUCCESS
            onClose(); // 가입 성공 시 모달 닫기
        } catch (err) {
            alert(err.response?.data?.message || "회원가입 실패");
        }
    };

    return (
        <div className="modal-overlay fixed inset-0 w-screen h-screen bg-black/70 z-[9999] flex justify-center items-center">
            <div className="modal bg-black p-[30px] rounded-[12px] w-[400px] text-white shadow-[0_0_10px_#333]">
                <div className="login-header flex justify-between items-center mb-[25px]">
                    <h4 className="modal-title text-[24px] font-bold">
                        회원가입
                    </h4>
                    <button
                        className="close-btn bg-transparent border-0 text-white text-[20px] cursor-pointer"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className="modalSpace flex flex-col gap-[15px]">
                    <input
                        name="user_id"
                        placeholder="아이디"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder:text-[#bbb]"
                        value={form.user_id}
                        onChange={handleChange}
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="비밀번호"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder:text-[#bbb]"
                        value={form.password}
                        onChange={handleChange}
                    />
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="비밀번호 확인"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder:text-[#bbb]"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    <input
                        name="nickname"
                        placeholder="닉네임"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder:text-[#bbb]"
                        value={form.nickname}
                        onChange={handleChange}
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="이메일 주소"
                        className="input p-[10px] border-0 border-b border-white bg-transparent text-white outline-none text-[14px] placeholder:text-[#bbb]"
                        value={form.email}
                        onChange={handleChange}
                    />
                    <button
                        className="login-btn mt-[10px] bg-[#c62828] text-white p-[10px] border-0 rounded-[6px] font-bold cursor-pointer text-[15px]"
                        onClick={handleSubmit}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignupModal;

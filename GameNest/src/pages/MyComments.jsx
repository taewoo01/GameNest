// src/pages/MyComments.jsx
import React from "react";
import { Link } from "react-router-dom";

const comments = [
    {
        id: 1,
        postId: 101,
        postTitle: "엘든링 보스 공략 어떻게 하세요?",
        content:
            "저는 출혈 무기로 잡았어요! 말레니아는 회피 타이밍이 진짜 중요하더라고요.",
        author: "닉네임1",
        createdAt: "2025-07-22",
    },
    {
        id: 2,
        postId: 102,
        postTitle: "스타듀밸리 멀티 재밌나요?",
        content:
            "멀티 진짜 꿀잼이에요! 친구랑 농사 나눠서 하면 덜 지루하고 금방 진도 나가요 ㅎㅎ",
        author: "닉네임1",
        createdAt: "2025-07-21",
    },
    {
        id: 3,
        postId: 103,
        postTitle: "디아4 야만용사 스킬 트리 질문",
        content:
            "소용돌이 요즘 상향 먹어서 괜찮던데요. 광분은 보스용에 더 좋은 것 같아요.",
        author: "닉네임1",
        createdAt: "2025-07-20",
    },
];

const MyComments = () => {
    return (
        <div className="p-[30px] max-w-[800px] mx-auto">
            <h2 className="text-[1.75rem] font-bold mb-[30px] text-white border-b-2 border-b-[#444] pb-[10px]">
                내가 쓴 댓글
            </h2>

            <ul className="list-none p-0 m-0">
                {comments.map((comment) => (
                    <li
                        key={comment.id}
                        className="bg-[#1e1e1e] border border-[#333] rounded-[8px] p-5 mb-5 transition-colors duration-200 hover:bg-[#2a2a2a]"
                    >
                        <div className="text-[1.2rem] font-semibold text-white mb-[10px]">
                            {comment.postTitle}
                        </div>

                        <div className="text-base text-[#ccc] mb-2">
                            {comment.content}
                        </div>

                        <div className="text-[0.85rem] text-[#888] mb-3">
                            {comment.createdAt}
                        </div>

                        <Link
                            to={`/community/post/${comment.postId}`}
                            className="text-[0.95rem] text-[#4ea1f3] no-underline font-medium hover:underline"
                        >
                            해당 게시글로 이동
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyComments;

// pages/PostDetail.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { posts } from "./Community"; // ✅ Community에서 posts 가져오기
import Comments from "../components/Comments"; // ✅ 댓글 컴포넌트

function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const post = posts.find((p) => p.id === Number(id));

    const [likes, setLikes] = useState(post?.likes || 0);
    const [liked, setLiked] = useState(false);
    const [scrapped, setScrapped] = useState(post?.scrapped || false); // ✅ 스크랩 상태

    const handleLike = () => {
        if (liked) {
            alert("좋아요는 한 번만 누를 수 있습니다.");
        } else {
            setLikes(likes + 1);
            setLiked(true);
        }
    };

    const toggleScrap = () => {
        setScrapped(!scrapped);
    };

    if (!post) {
        return <div className="p-5 text-white">게시글을 찾을 수 없습니다.</div>;
    }

    return (
        <div className="max-w-[800px] mx-auto p-10 text-[#ddd]">
            <button onClick={() => navigate(-1)} className="mb-5">
                ← 뒤로가기
            </button>

            <h2 className="text-[28px] mb-[10px]">{post.title}</h2>

            <div className="mb-[10px] text-[#aaa]">
                <span>작성자: {post.author}</span> |{" "}
                <span>날짜: {post.date}</span> |{" "}
                <span>조회수: {post.views}</span> |{" "}
                <span>추천: {post.likes}</span>
            </div>

            <hr className="my-5 border-t border-[#444]" />

            <div className="text-[18px] leading-[1.6]">{post.content}</div>

            {/* 🔸 스크랩 버튼 */}
            <div className="mt-[30px] flex justify-end">
                <button
                    onClick={toggleScrap}
                    className={`px-4 py-2 ${
                        scrapped ? "bg-[#28a745]" : "bg-[#6c757d]"
                    } text-white rounded-[5px] cursor-pointer text-[14px]`}
                >
                    {scrapped ? "스크랩됨" : "스크랩하기"}
                </button>
            </div>

            {/* 좋아요 버튼 */}
            <div className="mt-10 flex justify-center">
                <button
                    onClick={handleLike}
                    className={`px-5 py-2.5 ${
                        liked ? "bg-[#6c757d]" : "bg-[#007bff]"
                    } text-white rounded-[6px] cursor-pointer text-[16px]`}
                >
                    👍 좋아요 {likes}
                </button>
            </div>

            {/* 댓글 영역 */}
            <Comments />
        </div>
    );
}

export default PostDetail;

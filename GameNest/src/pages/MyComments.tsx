// src/pages/MyComments.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../axiosInstance";

interface Comment {
  id: number;
  postId: number;
  postTitle: string;
  content: string;
  createdAt: string;
  postType: "community" | "game"; // 댓글이 커뮤니티인지 게임인지 구분
}

const MyComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ API에서 내 댓글 가져오기
  const fetchMyComments = async () => {
    try {
      const res = await axiosInstance.get("/myComment"); // 통합 API 호출
      setComments(res.data);
    } catch (err) {
      console.error("내 댓글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyComments();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">불러오는 중...</p>;
  if (comments.length === 0) return <p className="text-white text-center mt-10">댓글이 없습니다.</p>;

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
              {new Date(comment.createdAt).toLocaleDateString()}
            </div>

            <Link
              to={
                comment.postType === "community"
                  ? `/community/${comment.postId}`
                  : `/game/${comment.postId}`
              }
              className="text-[0.95rem] text-[#4ea1f3] no-underline font-medium hover:underline"
            >
              해당 {comment.postType === "community" ? "게시글" : "게임"}으로 이동
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyComments;

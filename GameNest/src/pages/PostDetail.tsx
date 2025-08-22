import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import Comments from "../components/comments/comments";

interface Post {
  id: number;
  user_id: string;
  title: string;
  content: string;
  category: string;
  views: number;
  created_at: string;
  updated_at: string;
  scrapped: boolean;
  liked: boolean;
  likeCount: number;
}

function getUserIdFromToken(): number | null {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
}

function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);

  // ---------------- 게시글 조회 ----------------
  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/community/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        // boolean 보장
        const postData: Post = {
          ...res.data,
          scrapped: !!res.data.scrapped,
          liked: !!res.data.liked,
        };

        setPost(postData);
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
      }
    };

    fetchPost();
  }, [id]);

  // ---------------- 좋아요 / 스크랩 ----------------
  const handleAction = async (type: "like" | "scrap") => {
    const token = localStorage.getItem("token");
    if (!token) return alert("로그인이 필요합니다.");
    if (!post) return;

    try {
      const res = await axiosInstance.post(
        `/community/${id}/action`,
        { type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // boolean 변환
      const updatedPost: Post = {
        ...res.data,
        scrapped: !!res.data.scrapped,
        liked: !!res.data.liked,
      };

      setPost(updatedPost);
    } catch (err) {
      console.error(`${type} 처리 실패:`, err);
    }
  };

  if (!post)
    return (
      <div className="p-10 text-white text-center">게시글을 찾을 수 없습니다.</div>
    );

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition"
      >
        ← 뒤로가기
      </button>

      <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-400 text-sm">
        <span>
          작성자: <span className="text-white">{post.user_id}</span>
        </span>
        <span>
          카테고리: <span className="text-white">{post.category}</span>
        </span>
        <span>
          날짜:{" "}
          <span className="text-white">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
        </span>
        <span>
          조회수: <span className="text-white">{post.views}</span>
        </span>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => handleAction("scrap")}
          className={`px-4 py-2 rounded-md transition ${
            post.scrapped
              ? "bg-yellow-500 text-black"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          {post.scrapped ? "스크랩 완료" : "스크랩"}
        </button>

        <button
          onClick={() => handleAction("like")}
          className={`px-4 py-2 rounded-md transition ${
            post.liked
              ? "bg-red-500 text-white"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          ❤️ {post.likeCount}
        </button>
      </div>

      <hr className="border-gray-600 mb-8" />

      <div className="bg-gray-800 p-8 rounded-xl text-gray-200 text-lg leading-relaxed whitespace-pre-wrap shadow-lg mb-10">
        {post.content}
      </div>

      {/* ---------------- 댓글 영역 ---------------- */}
      <Comments
        type="community"
        id={id!}
        loggedUserId={getUserIdFromToken()}
      />
    </div>
  );
}

export default PostDetail;

// src/components/card/comment.tsx
import { useEffect, useState } from "react";
import axiosInstance from "../../axiosInstance";

interface CommentProps {
  type: "game" | "community";
  id: string;
  loggedUserId: number | null;
}

interface Comment {
  id: number;
  comment_content: string;
  created_at: string;
  user_id: number;
  user_nickname: string;
  parent_id: number | null;
  children?: Comment[];
}

const Comments = ({ type, id, loggedUserId }: CommentProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!loggedUserId;

  const getListEndpoint = () =>
    type === "game" ? `/gameComment/${id}/comments` : `/communityComment/${id}/comments`;

  const getItemEndpoint = (commentId: number) =>
    type === "game"
      ? `/gameComment/${id}/comments/${commentId}`
      : `/communityComment/${id}/comments/${commentId}`;

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(getListEndpoint());
      setComments(res.data); // ✅ API에서 트리 구조로 내려줌
    } catch (err) {
      console.error("댓글 불러오기 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content: string, parentId: number | null = null) => {
    if (!isLoggedIn) return alert("로그인 후 댓글 작성이 가능합니다.");
    if (!content.trim()) return;

    try {
      const res = await axiosInstance.post(getListEndpoint(), { content, parent_id: parentId });
      const addedComment = res.data;

      if (parentId) {
        setComments(prev =>
          prev.map(c =>
            c.id === parentId ? { ...c, children: [addedComment, ...(c.children || [])] } : c
          )
        );
      } else {
        setComments(prev => [addedComment, ...prev]);
      }
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (commentId: number, parentId: number | null = null) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(getItemEndpoint(commentId));
      if (parentId) {
        setComments(prev =>
          prev.map(c =>
            c.id === parentId ? { ...c, children: c.children?.filter(child => child.id !== commentId) } : c
          )
        );
      } else {
        setComments(prev => prev.filter(c => c.id !== commentId));
      }
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  const handleEditStart = (comment: Comment) => {
    setEditId(comment.id);
    setEditContent(comment.comment_content);
  };

  const handleEditCancel = () => {
    setEditId(null);
    setEditContent("");
  };

  const handleEditSave = async (commentId: number) => {
    if (!editContent.trim()) return;

    try {
      await axiosInstance.put(getItemEndpoint(commentId), { content: editContent });

      const update = (arr: Comment[]): Comment[] =>
        arr.map(c => {
          if (c.id === commentId) return { ...c, comment_content: editContent };
          if (c.children) return { ...c, children: update(c.children) };
          return c;
        });

      setComments(prev => update(prev));
      setEditId(null);
      setEditContent("");
    } catch (err) {
      console.error("댓글 수정 실패:", err);
      alert("댓글 수정에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id, type]);

  const CommentItem = ({ comment, parentId = null }: { comment: Comment; parentId?: number | null }) => {
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState("");

    return (
      <div
        className={`rounded-md border border-gray-700 ${
          parentId ? "ml-6 bg-gray-700 p-3" : "bg-gray-800 p-4"
        }`}
      >
        <div className="text-sm text-gray-400 mb-1">
          {comment.user_nickname || "익명"} · {new Date(comment.created_at).toLocaleString()}
        </div>

        {editId === comment.id ? (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={editContent}
              onChange={e => setEditContent(e.target.value)}
              className="w-full px-2 py-1 rounded-md bg-gray-700 text-white focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleEditSave(comment.id)}
                className="px-3 py-1 bg-green-600 rounded-md text-white hover:bg-green-500"
              >
                저장
              </button>
              <button
                onClick={handleEditCancel}
                className="px-3 py-1 bg-gray-500 rounded-md text-white hover:bg-gray-400"
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-200">{comment.comment_content}</p>
        )}

        <div className="flex gap-2 mt-2">
          {loggedUserId === comment.user_id && editId !== comment.id && (
            <>
              <button
                onClick={() => handleEditStart(comment)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                수정
              </button>
              <button
                onClick={() => handleDeleteComment(comment.id, parentId)}
                className="text-blue-400 hover:text-blue-3000 text-sm"
              >
                삭제
              </button>
            </>
          )}
          {isLoggedIn && (
            <button
              onClick={() => setReplying(prev => !prev)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              답글
            </button>
          )}
        </div>

        {replying && (
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="대댓글을 입력하세요"
              className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none"
            />
            <button
              onClick={() => {
                handleAddComment(replyText, comment.id);
                setReplyText("");
                setReplying(false);
              }}
              className="px-3 py-1 bg-blue-600 rounded-md text-white hover:bg-blue-500"
            >
              작성
            </button>
          </div>
        )}

        {comment.children?.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {comment.children.map(child => (
              <CommentItem key={child.id} comment={child} parentId={comment.id} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-white mb-4">댓글</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder={isLoggedIn ? "댓글을 입력하세요" : "로그인 후 댓글 작성 가능"}
          className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none"
          disabled={!isLoggedIn}
        />
        <button
          onClick={() => {
            handleAddComment(newComment);
            setNewComment("");
          }}
          disabled={!isLoggedIn}
          className={`px-4 py-2 rounded-md text-white transition ${
            isLoggedIn ? "bg-blue-600 hover:bg-blue-500" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          작성
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-gray-400">불러오는 중...</div>
        ) : (
          comments.map(c => <CommentItem key={c.id} comment={c} />)
        )}
      </div>
    </div>
  );
};

export default Comments;

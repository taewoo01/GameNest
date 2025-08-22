import { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import axiosInstance from '../axiosInstance';

const PAGE_SIZE = 20;

const BoardPage = () => {
  const [displayPosts, setDisplayPosts] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState('전체글');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allPosts, setAllPosts] = useState<any[]>([]);

  const navigate = useNavigate();

  // ✅ 게시글 불러오기
  const fetchPosts = async () => {
    try {
      const res = await axiosInstance.get('/community', {
        params: { category, search: searchKeyword },
      });
      const posts = res.data;
      setAllPosts(posts);
      setDisplayPosts(posts.slice(0, PAGE_SIZE));
      setVisibleCount(PAGE_SIZE);
      setHasMore(posts.length > PAGE_SIZE);
    } catch (err) {
      console.error('게시글 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category, searchKeyword]);

  // ✅ 무한스크롤 추가 로딩
  const fetchMoreData = () => {
    if (visibleCount >= allPosts.length) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setDisplayPosts((prev) => [
        ...prev,
        ...allPosts.slice(visibleCount, visibleCount + PAGE_SIZE),
      ]);
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }, 300);
  };

  // ✅ 게시글 클릭 시 상세로 이동 + 조회수 증가
  const handlePostClick = async (postId: number) => {
    try {
      await axiosInstance.post(`/community/${postId}`); // 조회수 +1
    } catch (err) {
      console.error('조회수 증가 실패:', err);
    }
    navigate(`/community/${postId}`); // 상세페이지 이동
  };

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen text-gray-200">
      {/* 상단 버튼 영역 */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex gap-2 flex-wrap">
          {['전체글', '인기글', '자유', '질문'].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-gray-700 rounded-lg bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => navigate('/write')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
          >
            글쓰기
          </button>
        </div>
      </div>

      {/* 게시글 목록 */}
      <InfiniteScroll
        dataLength={displayPosts.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className="text-center py-4 text-gray-400">불러오는 중...</h4>}
        endMessage={<p className="text-center py-4 text-gray-500">모든 글을 불러왔습니다.</p>}
      >
        <ul className="divide-y divide-gray-700">
          {displayPosts.map((post) => (
            <li
              key={post.id}
              onClick={() => handlePostClick(post.id)}
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 
                          transition rounded-md hover:bg-gray-800 cursor-pointer
                          ${post.views >= 50 ? 'bg-orange-900 border-l-4 border-orange-500' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {post.views >= 50 && (
                  <span className="text-orange-400 text-sm font-semibold">🔥 인기글</span>
                )}
                <span className="font-medium text-gray-200">{post.title}</span>
                <span className="text-xs text-gray-400">[{post.category}]</span>
              </div>
              <div className="flex gap-4 text-sm text-gray-400 mt-2 sm:mt-0">
                <span>{post.user_id}</span>
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
                <span>조회 {post.views}</span>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>
    </div>
  );
};

export default BoardPage;

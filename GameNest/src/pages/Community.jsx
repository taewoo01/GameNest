import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import InfiniteScroll from 'react-infinite-scroll-component';

/* ---------------- 게시글 데이터 ---------------- */
export const posts = [
  { id: 1, category: '자유', title: '오늘 뭐 하지?', user_id: '닉네임1', date: '2025.6.1', views: 12, likes: 3, content: '오늘 할 게임이 너무 많은데 뭐부터 해야 할까요? 추천 좀 해주세요!', scrapped: true },
  { id: 2, category: '질문', title: '디아블로4 괜찮아?', user_id: '닉네임2', date: '2025.6.2', views: 45, likes: 8, content: '디아블로4를 사볼까 고민 중인데, 재미있는지 궁금합니다.', scrapped: false },
  { id: 3, category: '자유', title: '스팀 추천 게임 모음', user_id: '닉네임3', date: '2025.6.3', views: 102, likes: 26, content: '제가 해본 스팀 추천 게임 리스트를 공유합니다!', scrapped: true },
  { id: 4, category: '자유', title: '엘든링 후기', user_id: '닉네임4', date: '2025.6.4', views: 9, likes: 1, content: '엘든링을 처음 해봤는데 진짜 재밌네요!', scrapped: false },
  { id: 5, category: '자유', title: '오늘 점심 뭐 먹지?', user_id: '닉네임5', date: '2025.6.5', views: 22, likes: 0, content: '게임하다가 점심시간 놓쳤어요... 뭐 먹을까요?', scrapped: true },
  { id: 6, category: '질문', title: '게이밍 노트북 추천 좀요', user_id: '닉네임6', date: '2025.6.6', views: 64, likes: 3, content: '200만원 이하 게이밍 노트북 추천 부탁드립니다.', scrapped: false },
  { id: 7, category: '자유', title: '갓 오브 워 재밌냐?', user_id: '닉네임7', date: '2025.6.7', views: 31, likes: 5, content: '갓 오브 워 라그나로크 플레이하려고 하는데 재미 어떤가요?', scrapped: true },
  { id: 8, category: '자유', title: '내가 뽑은 올해의 게임 TOP5', user_id: '닉네임8', date: '2025.6.8', views: 199, likes: 40, content: '개인적으로 너무 좋았던 게임 5개를 꼽아봤습니다.', scrapped: true },
  { id: 9, category: '질문', title: '롤 처음 시작하려는데 팁?', user_id: '닉네임9', date: '2025.6.9', views: 54, likes: 7, content: '롤 입문자입니다. 조언 부탁드려요!', scrapped: false },
  { id: 10, category: '자유', title: '오늘 날씨 너무 좋다 ☀️', user_id: '닉네임10', date: '2025.6.10', views: 16, likes: 2, content: '맑은 하늘 보니까 기분이 좋아요. 이런 날엔 어떤 게임이 어울릴까요?', scrapped: false },
  { id: 11, category: '질문', title: '닌텐도 스위치 아직도 할만함?', user_id: '닉네임11', date: '2025.6.11', views: 33, likes: 4, content: '요즘 닌텐도 스위치 여전히 재밌는 게임 많나요?', scrapped: false },
  { id: 12, category: '자유', title: '에어컨 켜도 될까요?', user_id: '닉네임12', date: '2025.6.12', views: 28, likes: 1, content: '날씨가 더운데 게임할 때 에어컨 틀어도 괜찮을까요?', scrapped: false },
  { id: 13, category: '자유', title: '한달에 3개 클리어한 후기', user_id: '닉네임13', date: '2025.6.13', views: 84, likes: 12, content: '지난 한 달 동안 세 개의 게임을 클리어했어요! 후기 남깁니다.', scrapped: false },
  { id: 14, category: '질문', title: '라오어 파트2 어떤가요?', user_id: '닉네임14', date: '2025.6.14', views: 39, likes: 6, content: '라스트 오브 어스 파트2 하려고 하는데 괜찮은가요?', scrapped: false },
  { id: 15, category: '자유', title: '게임하면서 마시는 음료는?', user_id: '닉네임15', date: '2025.6.15', views: 21, likes: 3, content: '게임할 때 마시기 좋은 음료 추천해주세요!', scrapped: false },
  { id: 16, category: '질문', title: '모니터 두 개 쓰면 좋아요?', user_id: '닉네임16', date: '2025.6.16', views: 41, likes: 2, content: '듀얼 모니터 셋업이 게임이나 작업에 도움이 될까요?', scrapped: false },
  { id: 17, category: '자유', title: '플스 게임 추천 좀 해줘', user_id: '닉네임17', date: '2025.6.17', views: 38, likes: 4, content: '최근에 재미있는 플스 게임 뭐 있었는지 알려주세요.', scrapped: false },
  { id: 18, category: '자유', title: '스팀 여름 할인 정리함', user_id: '닉네임18', date: '2025.6.18', views: 120, likes: 31, content: '2025년 여름 스팀 할인 정리해서 공유합니다!', scrapped: false },
  { id: 19, category: '질문', title: '무선 키보드 뭐가 좋아요?', user_id: '닉네임19', date: '2025.6.19', views: 26, likes: 3, content: '게임할 때 반응 좋은 무선 키보드 추천해 주세요!', scrapped: false },
  { id: 20, category: '자유', title: '요즘 할 게임 뭐 있어?', user_id: '닉네임20', date: '2025.6.20', views: 30, likes: 5, content: '슬슬 지겨운데 할만한 게임 뭐 없을까요?', scrapped: false },
  { id: 21, category: '질문', title: '스팀 덱 살만한가요?', user_id: '닉네임21', date: '2025.6.21', views: 58, likes: 7, content: '스팀 덱을 사려고 하는데 실제 사용해본 분들 어때요?', scrapped: true },
  { id: 22, category: '자유', title: '엔딩 보고 공허하다', user_id: '닉네임22', date: '2025.6.22', views: 19, likes: 1, content: '감동적인 게임 엔딩 보고 허전함이 밀려와요...', scrapped: false },
  { id: 23, category: '자유', title: '이번 주말 할인 정리', user_id: '닉네임23', date: '2025.6.23', views: 121, likes: 18, content: '이번 주말 할인하는 게임 리스트 정리했습니다!', scrapped: true },
  { id: 24, category: '질문', title: '메타버스 게임 뭐 있음?', user_id: '닉네임24', date: '2025.6.24', views: 66, likes: 9, content: '메타버스 기반의 재밌는 게임 추천 부탁드려요.', scrapped: false },
  { id: 25, category: '자유', title: '라면 추천 레시피', user_id: '닉네임25', date: '2025.6.25', views: 41, likes: 6, content: '게임하면서 먹기 좋은 라면 레시피 공유할게요!', scrapped: false },
  { id: 26, category: '자유', title: '인생겜 리스트 공유', user_id: '닉네임26', date: '2025.6.26', views: 143, likes: 23, content: '내 인생의 게임들 TOP10 공유합니다. 다들 동의하실까요?', scrapped: false },
  { id: 27, category: '질문', title: '그래픽 카드 업글 시기?', user_id: '닉네임27', date: '2025.6.27', views: 54, likes: 8, content: '그래픽카드 언제쯤 바꾸는 게 가장 효율적일까요?', scrapped: false },
  { id: 28, category: '자유', title: 'OST 좋은 게임 추천', user_id: '닉네임28', date: '2025.6.28', views: 25, likes: 2, content: '사운드트랙이 끝내주는 게임들 추천해 주세요!', scrapped: false },
  { id: 29, category: '자유', title: '스포일러 없는 후기', user_id: '닉네임29', date: '2025.6.29', views: 90, likes: 11, content: '최대한 스포일러 없이 간단히 소감 남겨봅니다.', scrapped: false },
  { id: 30, category: '질문', title: '콘솔 초보 추천 게임?', user_id: '닉네임30', date: '2025.6.30', views: 47, likes: 6, content: '콘솔 처음인데 입문자용 게임 추천 좀 해주세요.', scrapped: false },
  { id: 31, category: '자유', title: '새벽에 할 게임?', user_id: '닉네임31', date: '2025.7.1', views: 39, likes: 4, content: '불 꺼놓고 새벽에 하기 좋은 게임 있나요?', scrapped: false },
  { id: 32, category: '자유', title: '멀티 플레이 구해요', user_id: '닉네임32', date: '2025.7.2', views: 74, likes: 10, content: '같이 멀티플레이 하실 분 구해요! 장르는 상관없습니다.', scrapped: false },
  { id: 33, category: '질문', title: '헤드셋 추천 부탁', user_id: '닉네임33', date: '2025.7.3', views: 63, likes: 9, content: '가성비 좋은 게이밍 헤드셋 뭐가 있을까요?', scrapped: false },
  { id: 34, category: '자유', title: '공포게임 혼자 클리어', user_id: '닉네임34', date: '2025.7.4', views: 118, likes: 21, content: '무서워 죽는 줄 알았지만 끝까지 해냈습니다...', scrapped: false },
  { id: 35, category: '질문', title: '프레임 드랍 해결법?', user_id: '닉네임35', date: '2025.7.5', views: 29, likes: 3, content: '갑자기 프레임이 떨어지는데 해결 방법 있을까요?', scrapped: false },
  { id: 36, category: '자유', title: '리메이크 기대작 정리', user_id: '닉네임36', date: '2025.7.6', views: 71, likes: 8, content: '다가오는 리메이크 게임 정리해봤습니다.', scrapped: false },
  { id: 37, category: '자유', title: '패치 후 변화 공유', user_id: '닉네임37', date: '2025.7.7', views: 88, likes: 13, content: '이번 패치로 바뀐 점들 정리해봤어요.', scrapped: false },
  { id: 38, category: '질문', title: 'VPN 쓰면 핑 좋아지나요?', user_id: '닉네임38', date: '2025.7.8', views: 52, likes: 7, content: 'VPN 쓰면 게임 핑이 낮아질 수 있을까요?', scrapped: false },
  { id: 39, category: '자유', title: '디자인이 미친 게임', user_id: '닉네임39', date: '2025.7.9', views: 110, likes: 19, content: 'UI나 그래픽 디자인이 예술인 게임 추천!', scrapped: false },
  { id: 40, category: '자유', title: '쿠폰 코드 나눔', user_id: '닉네임40', date: '2025.7.10', views: 62, likes: 8, content: '남는 쿠폰 코드 나눔합니다. 댓글 선착순!', scrapped: false },
  { id: 41, category: '질문', title: '패드 vs 키보드?', user_id: '닉네임41 ऑफिस', date: '2025.7.11', views: 45, likes: 6, content: '게임할 때 패드랑 키보드 중에 뭐가 더 좋나요?', scrapped: false },
  { id: 42, category: '자유', title: '맵 디자인 TOP3', user_id: '닉네임42', date: '2025.7.12', views: 81, likes: 12, content: '내가 꼽은 최고의 맵 디자인 TOP3 공유!', scrapped: false },
  { id: 43, category: '자유', title: '클리어 스크린샷 자랑', user_id: '닉네임43', date: '2025.7.13', views: 124, likes: 22, content: '게임 엔딩 클리어한 스크린샷 자랑해봅니다.', scrapped: false },
  { id: 44, category: '질문', title: '세이브 데이터 공유 방법?', user_id: '닉네임44', date: '2025.7.14', views: 33, likes: 4, content: '세이브 파일 공유하려면 어떻게 해야 하나요?', scrapped: false },
  { id: 45, category: '자유', title: '이벤트 던전 후기', user_id: '닉네임45', date: '2025.7.15', views: 95, likes: 14, content: '이번에 새로 열린 이벤트 던전 후기 남깁니다.', scrapped: false },
  { id: 46, category: '자유', title: '레트로 게임 추천', user_id: '닉네임46', date: '2025.7.16', views: 27, likes: 3, content: '요즘 다시 해보는 레트로 명작 게임들 추천합니다.', scrapped: false },
  { id: 47, category: '질문', title: '사양 낮은 노트북 게임?', user_id: '닉네임47', date: '2025.7.17', views: 58, likes: 8, content: '사양 낮은 노트북에서도 잘 돌아가는 게임 있을까요?', scrapped: false },
  { id: 48, category: '자유', title: '엔딩 크레딧에서 눈물', user_id: '닉네임48', date: '2025.7.18', views: 142, likes: 25, content: '진짜 감동적인 게임 엔딩... 눈물 나네요.', scrapped: false },
  { id: 49, category: '자유', title: '패치노트 요약', user_id: '닉네임49', date: '2025.7.19', views: 36, likes: 5, content: '이번 패치노트 요약본 공유드립니다.', scrapped: false },
  { id: 50, category: '질문', title: '게임 패스 가치 있을까?', user_id: '닉네임50', date: '2025.7.20', views: 69, likes: 10, content: '게임패스 구독할 만한 가치가 있을까요?', scrapped: false },
  { id: 101, category: '질문', title: '엘든링 보스 공략 어떻게 하세요?', user_id: '닉네임101', date: '2025.7.22', views: 154, likes: 21, content: '말레니아에서 자꾸 죽는데 어떤 무기나 전략이 좋은가요?', scrapped: false },
  { id: 102, category: '자유', title: '스타듀밸리 멀티 재밌나요?', user_id: '닉네임102', date: '2025.7.21', views: 97, likes: 14, content: '혼자서 하다 보니 지루해지네요. 멀티 하면 더 재밌을까요?', scrapped: false },
  { id: 103, category: '질문', title: '디아4 야만용사 스킬 트리 질문', user_id: '닉네임103', date: '2025.7.20', views: 122, likes: 17, content: '소용돌이랑 광분 중에 어떤 스킬 트리가 더 효율적일까요?', scrapped: false },
];

/* ---------------- 설정 ---------------- */
const categories = ['전체글', '인기글', '자유', '질문'];
const isPopular = (p) => p.views >= 50 || p.likes >= 10;
const PAGE_SIZE = 20;

const fuse = new Fuse(posts, {
  keys: ['title'],
  threshold: 0.3,
  ignoreLocation: true,
});

function Community() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('전체글');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const topPopularPosts = useMemo(() => {
    return [...posts]
      .filter(isPopular)
      .sort((a, b) => (b.views + b.likes) - (a.views + a.likes))
      .slice(0, 5);
  }, []);

  const filteredPosts = useMemo(() => {
    const base = searchKeyword.trim()
      ? fuse.search(searchKeyword).map((r) => r.item)
      : posts;

    return base
      .filter((p) => {
        if (selectedCategory === '전체글') return true;
        if (selectedCategory === '인기글') return isPopular(p);
        return p.category === selectedCategory;
      })
      .filter((p) => !topPopularPosts.find((tp) => tp.id === p.id)); // 인기글 제외
  }, [selectedCategory, searchKeyword, topPopularPosts]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visiblePosts.length < filteredPosts.length;
  const fetchMore = () => setTimeout(() => setVisibleCount((v) => v + PAGE_SIZE), 400);

  return (
    <div className="max-w-[960px] mx-auto pt-6 px-4 pb-16 bg-[#0d0d0d] text-white">
      <h1 className="text-[1.75rem] font-bold mb-5">커뮤니티</h1>

      {/* 탭 + 검색 */}
      <div className="flex flex-wrap gap-3 items-center mb-3">
        <div className="flex gap-[6px] flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              className={
                `bg-[#1a1a1a] text-[#b3b3b3] px-[14px] py-[6px] border border-[#333] rounded-[6px] text-[0.9rem] cursor-pointer transition-[background] duration-150
                 hover:bg-[#2a2a2a] hover:text-white` +
                (selectedCategory === cat
                  ? ' bg-[#5a8dff] text-white font-semibold border-[#5a8dff]'
                  : '')
              }
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(PAGE_SIZE);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <input
            className="w-[140px] px-2 py-1 border border-[#333] rounded-[6px] bg-[#1a1a1a] text-white text-sm focus:outline focus:outline-2 focus:outline-[#5a8dff]"
            placeholder="검색어 입력"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
          />
          <button className="px-[14px] py-[6px] text-[0.9rem] rounded-[6px] border border-[#333] bg-[#1a1a1a] text-white cursor-pointer transition-colors duration-150 hover:bg-[#2a2a2a]">
            검색
          </button>
          <button
            className="px-[14px] py-[6px] text-[0.9rem] rounded-[6px] border border-[#5a8dff] bg-[#5a8dff] text-white cursor-pointer hover:brightness-110"
            onClick={() => navigate('/write')}
          >
            글쓰기
          </button>
        </div>
      </div>

      {/* 게시판 */}
      <div className="flex flex-col gap-0 text-[0.9rem]">
        <div className="grid [grid-template-columns:5fr_1fr_1.2fr_0.8fr_0.8fr] px-[6px] py-2 bg-[#2a2a2a] font-semibold border-b border-[#333]">
          <div>제목</div>
          <div>작성자</div>
          <div>작성일</div>
          <div>조회</div>
          <div>추천</div>
        </div>

        {/* 🔥 인기글 상단 고정 */}
        {topPopularPosts.map((p) => (
          <div
            key={p.id}
            className="grid [grid-template-columns:5fr_1fr_1.2fr_0.8fr_0.8fr] gap-[6px] px-[6px] py-2 border-b border-[#333] items-center bg-[#222] hover:bg-[#2a2a2a] cursor-pointer"
            onClick={() => navigate(`/community/post/${p.id}`)}
          >
            <div className="truncate whitespace-nowrap">
              <span className="mr-1">🔥</span>
              <span className="text-[#5a8dff] font-semibold mr-1">[{p.category}]</span>
              {p.title}
            </div>
            <div>{p.user_id}</div>
            <div>{p.date}</div>
            <div>{p.views}</div>
            <div>{p.likes}</div>
          </div>
        ))}

        {/* 📜 나머지 글 무한스크롤 */}
        {filteredPosts.length === 0 && (
          <div className="py-6 text-center text-[#b3b3b3]">게시글이 없습니다.</div>
        )}

        <InfiniteScroll
          dataLength={visiblePosts.length}
          next={fetchMore}
          hasMore={hasMore}
          loader={<p style={{ textAlign: 'center', padding: 10 }}>불러오는 중…</p>}
          endMessage={<p style={{ textAlign: 'center', padding: 10 }}>모든 글을 불러왔습니다.</p>}
        >
          {visiblePosts.map((p) => (
            <div
              key={p.id}
              className="grid [grid-template-columns:5fr_1fr_1.2fr_0.8fr_0.8fr] gap-[6px] px-[6px] py-2 border-b border-[#333] items-center hover:bg-[#2a2a2a] cursor-pointer"
              onClick={() => navigate(`/community/post/${p.id}`)}
            >
              <div className="truncate whitespace-nowrap">
                {isPopular(p) && <span className="mr-1">🔥</span>}
                <span className="text-[#5a8dff] font-semibold mr-1">[{p.category}]</span>
                {p.title}
              </div>
              <div>{p.user_id}</div>
              <div>{p.date}</div>
              <div>{p.views}</div>
              <div>{p.likes}</div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Community;

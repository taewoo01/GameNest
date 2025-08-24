// src/components/Nav.tsx
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import LoginModal from "../components/modals/LoginModal";
import SignupModal from "../components/modals/SignupModal";
import FindIdModal from "../components/modals/FindIdModal";
import FindPasswordModal from "../components/modals/FindPasswordModal";
import ModifyInfoModal from "../components/modals/ModifyInfoModal";
import ChangePasswordModal from "../components/modals/updatePWModal";
import ChangePasswordNoLoginModal from "../components/modals/ChangePasswordModal";

const menuData: Record<string, { type: string; items: string[] }> = {
  "장르 별 게임": { type: "tag", items: ["액션", "어드벤쳐", "롤플레잉", "시뮬레이션", "스포츠/레이싱", "퍼즐/보드", "리듬"] },
  "테마 별 게임": { type: "tag", items: ["판타지","공상과학","공포","역사/고대","현대/일상","디스토피아/아포칼립스","추리/스릴러","캐주얼"] },
  "플랫폼 별 게임": { type: "platform", items: ["PC","콘솔 게임","모바일 게임","웹 게임","클라우드 게임","VR/AR 게임","아케이드 게임"] },
  "플레이방식 별 게임": { type: "mode", items: ["LAN","MMO","로컬 및 파티","멀티","싱글","온라인 경쟁","협동"] },
  "진행 방식 별 게임": { type: "tag", items: ["오픈월드","샌드박스","로그라이크","턴제/전략","웨이브/생존","리듬"] },
};

// JWT 페이로드 안전 디코딩
function decodeJwtPayload(token: string): { id?: number; nickname?: string } | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

const Nav: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showFindIdModal, setShowFindIdModal] = useState(false);
  const [showFindPasswordModal, setShowFindPasswordModal] = useState(false);
  const [showModifyInfoModal, setShowModifyInfoModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showChangePasswordNoLoginModal, setShowChangePasswordNoLoginModal] = useState(false);
  const [nickname, setNickname] = useState<string | null>(localStorage.getItem("nickname"));
  const [userId, setUserId] = useState<number | null>(null);
  const [findPwUserId, setFindPwUserId] = useState<number | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
        setOpenSubMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJwtPayload(token);
      setUserId(decoded?.id ?? null);
      setNickname(decoded?.nickname ?? localStorage.getItem("nickname"));
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
    setOpenSubMenu(null);
  };

  const handleSubMenuToggle = (category: string) => {
    setOpenSubMenu(prev => (prev === category ? null : category));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    setNickname(null);
    setUserId(null);
    window.location.reload();
  };

  const userMenuItems = [
    { label: "정보 수정", type: "button", action: () => setShowModifyInfoModal(true) },
    { label: "비밀번호 변경", type: "button", action: () => setShowChangePasswordModal(true) },
    { label: "찜한 게임", type: "link", link: "/likeGame" },
    { label: "내가 쓴 게시글", type: "link", link: "/myPosts" },
    { label: "내가 쓴 댓글", type: "link", link: "/myComment" },
    { label: "스크랩한 게시글", type: "link", link: "/myScrap" },
    { label: "로그아웃", type: "button", action: handleLogout }
  ];

  return (
    <nav className="w-full bg-black text-white py-4 shadow-md relative">
      {/* 상단 네비 */}
      <div className="container mx-auto px-4 flex items-center justify-between mb-8">
        <Link to={"/"}>
          <h1 className="text-3xl font-bold text-center flex-1">GameNest</h1>
        </Link>

        <button onClick={toggleMenu} className="text-white text-2xl focus:outline-none">카테고리</button>
        <Link to="/community" className="text-white text-2xl">커뮤니티</Link>
        <Link to="/steamnews" className="text-white text-2xl">뉴스</Link>
        <Link to="/chat" className="text-white text-2xl">채팅</Link>

        {userId ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(prev => !prev)}
              className="text-white border px-3 py-1 rounded hover:bg-white hover:text-gray-800 transition"
            >
              {nickname} 님 ▼
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 flex flex-col py-1">
                <div className="px-4 py-2 text-sm text-white font-semibold">{nickname} 님</div>

                <hr className="border-t bordde-white" />

                {userMenuItems.map((item, idx) => {
                  const prevItem = userMenuItems[idx - 1];
                  const addBorder = prevItem && prevItem.type !== item.type ? "border-t border-gray-600" : "";

                  if (item.type === "link") {
                    return (
                      <Link
                        key={idx}
                        to={item.link!}
                        onClick={() => setIsUserMenuOpen(false)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-white transition ${addBorder}`}
                      >
                        {item.label}
                      </Link>
                    );
                  } else {
                    return (
                      <button
                        key={idx}
                        onClick={() => { item.action?.(); setIsUserMenuOpen(false); }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-white transition ${addBorder}`}
                      >
                        {item.label}
                      </button>
                    );
                  }
                })}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="text-white border px-3 py-1 rounded hover:bg-white hover:text-gray-800 transition"
          >
            로그인
          </button>
        )}
      </div>

      {/* 카테고리 드롭다운 */}
      {isMenuOpen && (
        <div className="flex justify-center">
          <div ref={menuRef} className="container w-11/12 bg-black text-gray-300 font-bold text-2xl shadow-lg rounded mt-2">
            <ul>
              {Object.entries(menuData).map(([category, { type, items }]) => (
                <li key={category} className="px-4 py-2 cursor-pointer hover:bg-gray-700">
                  <div onClick={() => handleSubMenuToggle(category)} className="flex justify-between items-center">
                    {category}
                    <span>{openSubMenu === category ? "-" : "+"}</span>
                  </div>

                  {openSubMenu === category && (
                    <ul className="ml-4 mt-2 text-lg text-gray-400">
                      {items.map(item => (
                        <li key={item} className="py-1 hover:text-white">
                          <Link
                            to={`/category/${type}/${item}`}
                            onClick={() => {
                              setIsMenuOpen(false);
                              setOpenSubMenu(null);
                            }}
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* 모달 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onOpenFindId={() => { setShowLoginModal(false); setShowFindIdModal(true); }}
          onOpenFindPassword={() => { setShowLoginModal(false); setShowFindPasswordModal(true); }}
          onOpenSignup={() => { setShowLoginModal(false); setShowSignupModal(true); }}
          setNickname={setNickname}
          setUserId={setUserId}
          onLogin={(nickname, id) => { setNickname(nickname); setUserId(id); }}
        />
      )}

      {showSignupModal && <SignupModal onClose={() => setShowSignupModal(false)} />}
      {showFindIdModal && <FindIdModal onClose={() => setShowFindIdModal(false)} onOpenLogin={() => setShowLoginModal(true)} />}
      {showFindPasswordModal && (
        <FindPasswordModal
          onClose={() => setShowFindPasswordModal(false)}
          onSuccess={(userId: number) => {
            setFindPwUserId(userId);
            setShowChangePasswordNoLoginModal(true);
          }}
        />
      )}
      {showModifyInfoModal && <ModifyInfoModal onClose={() => setShowModifyInfoModal(false)} currentNickname={nickname || ""} setNickname={setNickname} />}
      {showChangePasswordModal && <ChangePasswordModal onClose={() => setShowChangePasswordModal(false)} />}
      {showChangePasswordNoLoginModal && findPwUserId && (
        <ChangePasswordNoLoginModal
          userId={findPwUserId}
          onClose={() => {
            setShowChangePasswordNoLoginModal(false);
            setFindPwUserId(null);
          }}
          onSuccess={() => {
            setShowLoginModal(true);
            setShowChangePasswordNoLoginModal(false);
            setFindPwUserId(null);
          }}
        />
      )}
    </nav>
  );
};

export default Nav;

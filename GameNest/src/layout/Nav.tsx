import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const menuData: Record<string, { type: string; items: string[] }> = {
    "장르 별 게임": { type: "genre", items: ["액션", "어드벤쳐", "롤플레잉", "시뮬레이션", "스포츠/레이싱", "퍼즐/보드", "리듬"] },
    "테마 별 게임": { type: "theme", items: ["판타지", "공상과학", "공포", "역사/고대", "현대/일상", "디스토피아/아포칼립스", "추리/스릴러", "캐주얼"] },
    "플랫폼 별 게임": { type: "platform", items: ["PC 게임", "콘솔 게임", "모바일 게임", "웹 게임", "클라우드 게임", " VR/AR 게임", "아케이드 게임"] },
    "플레이방식 별 게임": { type: "play", items: ["LAN", "MMO", "로컬 및 파티", "멀티 플레이어", "싱글 플레이어", "온라인 경쟁", "협동"] },
    "진행 방식 별 게임": { type: "flow", items: ["오픈월드", "샌드박스", "로그라이크", "턴제/전략", "웨이브/생존", "리듬"] }
};

const Nav: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
                setOpenSubMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(prev => !prev);
        setOpenSubMenu(null);
    };

    const handleSubMenuToggle = (category: string) => {
        setOpenSubMenu(prev => (prev === category ? null : category));
    };

    return (
        <nav className="w-full bg-black text-white py-4 shadow-md relative">
            <div className="container mx-auto px-4 flex items-center justify-between mb-8">
                <Link to={"/"}>
                    <h1 className="text-3xl font-bold text-center flex-1">
                        GameNest
                    </h1>
                </Link>

                <button onClick={toggleMenu} className="text-white focus:outline-none text-2xl">
                    카테고리
                </button>
                <div className="text-white focus:outline-none text-2xl">커뮤니티</div>
                <div className="text-white focus:outline-none text-2xl">뉴스</div>
                <div className="text-white focus:outline-none text-2xl">채팅</div>

                <button className="text-white border border-white px-3 py-1 rounded hover:bg-white hover:text-gray-800 transition">
                    로그인
                </button>
            </div>
            <div className="container mx-auto px-4 mt-4 mb-4">
                <div className="flex">
                    <input
                        type="search"
                        placeholder="원하는 게임을 입력하세요"
                        className="flex-grow px-4 py-2 rounded-2xl border border-gray-600 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                    />
                </div>
            </div>
            {isMenuOpen && (
                <div className="flex justify-center">
                    <div
                        ref={menuRef}
                        className="container top-full w-11/12 bg-black text-gray-300 font-bold text-2xl shadow-lg rounded mt-2"
                    >
                        <ul>
                            {Object.entries(menuData).map(([category, { type, items }]) => (
                                <li key={category} className="px-4 py-2 cursor-pointer hover:bg-gray-700">
                                    <div onClick={() => handleSubMenuToggle(category)} className="flex justify-between items-center">
                                        {category}
                                        <span>{openSubMenu === category ? "-" : "+"}</span>
                                    </div>

                                    {openSubMenu === category && (
                                        <ul className="ml-4 mt-2 text-lg text-gray-400">
                                            {items.map((value) => (
                                                <li key={value} className="py-1 hover:text-white">
                                                    <Link
                                                        to={`/category/${type}/${value}`}
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            setOpenSubMenu(null);
                                                        }}
                                                    >
                                                        {value}
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
        </nav>
    );
};

export default Nav;

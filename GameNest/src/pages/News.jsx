import React, { useState } from "react";
import ReactPlayer from "react-player";
import Fuse from "fuse.js";
import dayjs from "dayjs";
import clsx from "clsx";

const newsData = [
    {
        id: 1,
        type: "update",
        title: "오버워치",
        subtitle: "업데이트 소식",
        date: "2025-05-06",
        content:
            "역대급 스킨으로 호평 받는 이번 7시즌의 새로운 스킨들을 확인하고, 다양한 이벤트 소식까지 한눈에 확인할 수 있도록 메인 페이지가 새롭게 업데이트되었습니다.",
        image: "https://cdn.asoworld.com/img/8a7e02d6d5334ba297598fe9e62cf49a.jpg",
    },
    {
        id: 2,
        type: "event",
        title: "오버워치",
        subtitle: "이벤트 안내",
        date: "2025-06-20",
        content:
            "여름 한정 이벤트가 진행 중입니다. 기간 내 접속 시 특별한 보상을 획득하세요!",
        video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },
    {
        id: 3,
        type: "update",
        title: "리그 오브 레전드",
        subtitle: "12.14 패치노트",
        date: "2025-07-01",
        content:
            "챔피언 밸런스 조정과 신규 아이템 추가가 이루어졌습니다. 정글 메타 변화에 주의하세요.",
        image: "https://cdn.gameple.co.kr/news/photo/202501/211554_232322_4045.jpg",
    },
    {
        id: 4,
        type: "event",
        title: "발로란트",
        subtitle: "여름맞이 토너먼트 개최",
        date: "2025-07-10",
        content:
            "커뮤니티와 함께하는 여름 토너먼트가 시작됩니다. 우승자는 특별한 총기 스킨을 획득할 수 있습니다.",
        video: "https://www.youtube.com/watch?v=3GwjfUFyY6M",
    },
    {
        id: 5,
        type: "update",
        title: "스타크래프트",
        subtitle: "리마스터 UI 개선",
        date: "2025-07-02",
        content:
            "유저 편의성을 높이기 위해 인터페이스가 전면 개편되었습니다. 다양한 해상도 지원도 포함됩니다.",
        image: "https://i.namu.wiki/i/nx8FVJ53L3TZKuugmj3e3E6gcANi3GpkB01DOzrTBLAot1P_eJs_PEL86pwJigtryGvFJHYRqzbzhR1ECAF5kw.webp",
    },
    {
        id: 6,
        type: "event",
        title: "디아블로 4",
        subtitle: "신규 시즌 시작",
        date: "2025-06-28",
        content:
            "신규 시즌이 시작되며, 새로운 전설 아이템과 시즌 여정이 도입됩니다.",
        image: "https://res09.bignox.com/moniqi-blog/kr-bignox-blog/2023/04/%EB%94%94%EC%95%84%EB%B8%94%EB%A1%9C4001-1.jpg",
    },
    {
        id: 7,
        type: "update",
        title: "배틀그라운드",
        subtitle: "신규 맵 - 버디치 출시",
        date: "2025-07-04",
        content:
            '도심형 전장을 배경으로 한 새로운 맵 "버디치"가 출시되었습니다. 전술적 플레이가 요구됩니다.',
        image: "https://t1.kakaocdn.net/gamepub/daumgame/common/meta_tag_pubg.png",
    },
    {
        id: 8,
        type: "event",
        title: "GTA 온라인",
        subtitle: "독립기념일 이벤트",
        date: "2025-07-04",
        content:
            "독립기념일을 기념하여 특별 이벤트가 진행 중입니다. 불꽃놀이, 특별 차량 등 다양한 콘텐츠를 즐기세요.",
        video: "https://www.youtube.com/watch?v=9bZkp7q19f0",
    },
    {
        id: 9,
        type: "update",
        title: "엘든링",
        subtitle: "DLC: 그림자의 왕국",
        date: "2025-06-15",
        content:
            '새로운 지역과 보스가 포함된 대규모 DLC "그림자의 왕국"이 출시되었습니다.',
        image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Elden_Ring_Box_art.jpg",
    },
    {
        id: 10,
        type: "event",
        title: "몬스터헌터 라이즈",
        subtitle: "헌터 대회 이벤트",
        date: "2025-07-05",
        content:
            "최강 헌터를 가리는 토너먼트 이벤트가 시작되었습니다. 참가자 전원 보상 제공!",
        video: "https://www.youtube.com/watch?v=XfR9iY5y94s",
    },
];

const fuseOptions = {
    keys: ["title", "subtitle", "content"],
    threshold: 0.3,
};

const News = () => {
    const [selectedTab, setSelectedTab] = useState("update");
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearch, setTempSearch] = useState("");

    const fuse = new Fuse(
        newsData.filter((item) => item.type === selectedTab),
        fuseOptions
    );
    const filtered = searchTerm
        ? fuse.search(searchTerm).map((res) => res.item)
        : newsData.filter((item) => item.type === selectedTab);

    return (
        <div className="max-w-[960px] mx-auto p-6 text-white">
            {/* 탭 + 검색 한 줄 */}
            <div className="flex justify-between items-center mb-5 flex-wrap gap-3">
                <div className="flex gap-2">
                    {["update", "event"].map((tab) => (
                        <button
                            key={tab}
                            className={clsx(
                                "bg-[#1a1a1a] text-[#aaa] py-2 px-[14px] border border-[#444] rounded-[6px] text-[0.9rem] cursor-pointer",
                                selectedTab === tab &&
                                    "bg-[#5a8dff] text-white font-semibold"
                            )}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab === "update" ? "업데이트" : "이벤트"}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="검색어 입력"
                        value={tempSearch}
                        onChange={(e) => setTempSearch(e.target.value)}
                        className="px-[10px] py-[6px] text-[0.9rem] bg-[#222] border border-[#444] rounded-[6px] text-white"
                    />
                    <button
                        onClick={() => setSearchTerm(tempSearch)}
                        className="px-3 py-[6px] bg-[#5a8dff] text-white font-semibold rounded-[6px] cursor-pointer border-0"
                    >
                        검색
                    </button>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                {filtered.map((item) => (
                    <div
                        className="flex justify-between gap-4 bg-[#111] p-4 rounded-[8px]"
                        key={item.id}
                    >
                        <div className="flex-1 break-words">
                            <h3>{item.title}</h3>
                            <h4>{item.subtitle}</h4>
                            <p className="mt-1 leading-[1.6] text-[#ccc]">
                                {dayjs(item.date).format("YYYY.MM.DD")}
                            </p>
                            <p className="mt-1 leading-[1.6] text-[#ccc]">
                                {item.content}
                            </p>
                        </div>
                        <div className="shrink-0 flex items-center">
                            {item.image && (
                                <img
                                    src={item.image}
                                    alt="썸네일"
                                    className="w-[220px] h-auto rounded-[6px] object-cover"
                                />
                            )}
                            {item.video && (
                                <ReactPlayer
                                    url={item.video}
                                    width="220px"
                                    height="124px"
                                    controls
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;

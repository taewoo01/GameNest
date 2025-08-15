// pages/MyScraps.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { posts } from "./Community";

const MyScraps = () => {
    const navigate = useNavigate();

    const scrappedPosts = posts.filter((post) => post.scrapped === true);

    return (
        <div className="max-w-[960px] mx-auto px-4 pt-6 pb-16 text-white">
            <h2 className="text-[1.5rem] font-bold mb-5">스크랩한 게시글</h2>

            {scrappedPosts.length === 0 ? (
                <p className="text-[#cccccc] p-4">
                    스크랩한 게시글이 없습니다.
                </p>
            ) : (
                <div className="flex flex-col text-[0.9rem]">
                    <div className="grid [grid-template-columns:5fr_1.2fr_1fr_1fr] gap-[6px] py-[10px] px-[6px] border-b border-[#333] items-center bg-[#2a2a2a] font-semibold">
                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                            제목
                        </div>
                        <div className="text-left">작성일</div>
                        <div className="text-left">조회</div>
                        <div className="text-left">추천</div>
                    </div>

                    {scrappedPosts.map((post) => (
                        <div
                            key={post.id}
                            className="grid [grid-template-columns:5fr_1.2fr_1fr_1fr] gap-[6px] py-[10px] px-[6px] border-b border-[#333] items-center hover:bg-[#2a2a2a] cursor-pointer"
                            onClick={() =>
                                navigate(`/community/post/${post.id}`)
                            }
                        >
                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                <span className="text-[#5a8dff] font-semibold mr-[6px]">
                                    [{post.category}]
                                </span>
                                {post.title}
                            </div>
                            <div className="text-left">{post.date}</div>
                            <div className="text-left">{post.views}</div>
                            <div className="text-left">{post.likes}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyScraps;

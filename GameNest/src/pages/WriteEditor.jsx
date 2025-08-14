import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Extension } from "@tiptap/core";

import {
    MdFormatBold,
    MdFormatItalic,
    MdFormatUnderlined,
    MdStrikethroughS,
    MdHighlight,
    MdFormatColorText,
    MdFormatSize,
    MdLooksOne,
    MdLooksTwo,
    MdFormatListBulleted,
    MdFormatListNumbered,
    MdInsertLink,
    MdInsertPhoto,
} from "react-icons/md";

/* ------ 폰트 크기 확장 ------ */
const FontSize = Extension.create({
    name: "fontSize",
    addOptions() {
        return { types: ["textStyle"] };
    },
    addAttributes() {
        return {
            fontSize: {
                default: null,
                parseHTML: (el) => el.style.fontSize?.replace("px", ""),
                renderHTML: (attrs) =>
                    attrs.fontSize
                        ? { style: `font-size:${attrs.fontSize}px` }
                        : {},
            },
        };
    },
    addCommands() {
        return {
            setFontSize:
                (size) =>
                ({ chain }) =>
                    chain().setMark("textStyle", { fontSize: size }).run(),
        };
    },
});

export default function WriteEditor() {
    const nav = useNavigate();
    const [title, setTitle] = useState("");
    const [cat, setCat] = useState("자유");

    /* --- TipTap 에디터 --- */
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextStyle,
            Color,
            FontSize,
            Underline,
            Highlight,
            Heading.configure({ levels: [1, 2] }),
            BulletList,
            OrderedList,
            Link,
            Image,
        ],
        content: "",
        editorProps: {
            attributes: {
                // 원래 .write-editor .ProseMirror 스타일 (min-height, padding, color 등)
                class: "min-h-[320px] p-[14px] text-white outline-none text-base",
            },
        },
    });

    const save = () => {
        console.log({
            title,
            category: cat,
            html: editor?.getHTML(),
        });
        nav(-1);
    };
    const insertImg = () => {
        const url = prompt("이미지 URL");
        if (url) editor?.chain().focus().setImage({ src: url }).run();
    };

    /* ---------- 렌더링 ---------- */
    return (
        <div className="write-wrapper max-w-[860px] mx-auto p-6 text-white bg-[#0d0d0d]">
            <h2>글쓰기</h2>

            {/* 제목 */}
            <input
                className="title-input w-full px-[12px] py-[10px] text-base sm:text-xl border-0 border-b-2 border-[#333] bg-[#1a1a1a] text-white box-border rounded-t-[6px] focus:outline-none focus:border-[#5a8dff]"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            {/* 카테고리 */}
            <div className="category-group my-4">
                {["자유", "질문"].map((c) => (
                    <button
                        key={c}
                        className={
                            `category-btn h-[36px] px-[14px] mr-2 border border-[#333] bg-[#1a1a1a] text-[#cccccc] rounded-[6px] cursor-pointer text-[0.9rem] transition-colors duration-200
               hover:bg-[#2a2a2a] hover:text-white` +
                            (cat === c
                                ? " bg-[#5a8dff] text-white border-[#5a8dff] font-semibold"
                                : "")
                        }
                        onClick={() => setCat(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {/* 툴바 */}
            <div className="toolbar flex flex-wrap items-center gap-2 bg-[#1a1a1a] py-[6px] px-2 border border-[#333] rounded-[6px] mb-3 overflow-x-auto">
                {/* ① 서식 */}
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("bold")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    title="굵게"
                >
                    <MdFormatBold />
                </button>
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("italic")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    title="기울임"
                >
                    <MdFormatItalic />
                </button>
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("underline")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() =>
                        editor?.chain().focus().toggleUnderline().run()
                    }
                    title="밑줄"
                >
                    <MdFormatUnderlined />
                </button>
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("strike")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                    title="취소선"
                >
                    <MdStrikethroughS />
                </button>
                <span className="divider w-px h-6 bg-[#333] mx-1" />

                {/* ② 하이라이트 & 색상 */}
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("highlight")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() =>
                        editor?.chain().focus().toggleHighlight().run()
                    }
                    title="형광"
                >
                    <MdHighlight />
                </button>

                <label
                    className="color-picker relative flex items-center w-[18px] h-8 cursor-pointer text-[18px]"
                    title="글자색"
                >
                    <MdFormatColorText />
                    <input
                        type="color"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) =>
                            editor
                                ?.chain()
                                .focus()
                                .setColor(e.target.value)
                                .run()
                        }
                    />
                </label>
                <span className="divider w-px h-6 bg-[#333] mx-1" />

                {/* ③ 글자크기 셀렉트 */}
                <label
                    className="size-select relative flex items-center w-[18px] h-8 cursor-pointer text-[18px]"
                    title="글자크기"
                >
                    <MdFormatSize />
                    <select
                        defaultValue=""
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={(e) =>
                            e.target.value &&
                            editor
                                ?.chain()
                                .focus()
                                .setFontSize(Number(e.target.value))
                                .run()
                        }
                    >
                        <option value="">size</option>
                        {[12, 14, 16, 18, 24, 32].map((s) => (
                            <option key={s} value={s}>
                                {s}
                            </option>
                        ))}
                    </select>
                </label>
                <span className="divider w-px h-6 bg-[#333] mx-1" />

                {/* ④ 제목 & 리스트 */}
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("heading", { level: 1 })
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                    }
                    title="제목1"
                >
                    <MdLooksOne />
                </button>
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("heading", { level: 2 })
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                    }
                    title="제목2"
                >
                    <MdLooksTwo />
                </button>
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("bulletList")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() =>
                        editor?.chain().focus().toggleBulletList().run()
                    }
                    title="불릿 목록"
                >
                    <MdFormatListBulleted />
                </button>
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("orderedList")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() =>
                        editor?.chain().focus().toggleOrderedList().run()
                    }
                    title="번호 목록"
                >
                    <MdFormatListNumbered />
                </button>
                <span className="divider w-px h-6 bg-[#333] mx-1" />

                {/* ⑤ 링크 & 이미지 */}
                <button
                    className={
                        "tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white" +
                        (editor?.isActive("link")
                            ? " bg-[#5a8dff] text-white"
                            : "")
                    }
                    onClick={() =>
                        editor
                            ?.chain()
                            .focus()
                            .extendMarkRange("link")
                            .setLink({ href: prompt("URL 입력") || "" })
                            .run()
                    }
                    title="링크"
                >
                    <MdInsertLink />
                </button>
                <button
                    className="tbtn flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 text-[16px] sm:text-[18px] rounded-[6px] bg-[#2a2a2a] text-[#cccccc] transition-colors duration-200 hover:bg-[#5a8dff] hover:text-white"
                    onClick={insertImg}
                    title="이미지"
                >
                    <MdInsertPhoto />
                </button>
            </div>

            {/* 본문 */}
            <EditorContent
                editor={editor}
                className="write-editor bg-[#1a1a1a] border border-[#333] rounded-[6px]"
            />

            <button
                className="write-btn mt-[18px] inline-flex items-center justify-center h-[36px] px-6 bg-[#28a745] rounded-[6px] font-semibold text-white text-[0.95rem] cursor-pointer transition hover:brightness-110 w-full sm:w-auto"
                onClick={save}
            >
                작성 완료
            </button>
        </div>
    );
}

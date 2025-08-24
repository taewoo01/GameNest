import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';
import axiosInstance from '../axiosInstance';
import {
  MdFormatBold, MdFormatItalic, MdFormatUnderlined, MdStrikethroughS,
  MdHighlight, MdFormatColorText, MdFormatSize, MdLooksOne, MdLooksTwo,
  MdFormatListBulleted, MdFormatListNumbered, MdInsertLink, MdInsertPhoto,
} from 'react-icons/md';

/* ------ 폰트 크기 확장 ------ */
const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() { return { types: ['textStyle'] }; },
  // @ts-expect-error: addAttributes is not in ExtensionConfig type, but is supported by tiptap
  addAttributes() {
    return {
      fontSize: {
        default: null,
        parseHTML: (el: HTMLElement) => el.style.fontSize?.replace('px','') || null,
        renderHTML: (attrs: { fontSize?: string | number | null }) =>
          attrs.fontSize ? { style: `font-size:${attrs.fontSize}px` } : {},
      },
    };
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize }).run(),
    };
  },
});

const WriteEditor: React.FC = () => {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [cat, setCat] = useState('자유');
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle, Color, FontSize,
      Underline, Highlight,
      Heading.configure({ levels: [1, 2] }),
      BulletList, OrderedList,
      Link, Image,
    ],
    content: '',
  });

  const insertImg = () => {
    const url = prompt('이미지 URL');
    if (url) editor?.chain().focus().setImage({ src: url }).run();
  };

  // 🔹 글 저장 (axiosInstance 사용)
  const save = async () => {
    if (!title || !editor) return alert('제목과 내용을 입력해주세요.');
    setLoading(true);
    try {
      const user_id = 1; // 로그인 시 실제 유저 ID
      const content = editor.getHTML();

      const res = await axiosInstance.post('/community/write', {
        user_id,
        title,
        content,
        category: cat,
      });

      if (res.status === 201) {
        alert('글이 작성되었습니다!');
        nav(-1);
      }
    } catch (err) {
      console.error(err);
      alert('글 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toolbarBtnClass =
    'flex items-center justify-center w-8 h-8 text-lg text-gray-300 hover:text-white transition rounded-md';

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center p-6">
      <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4">
        <h2 className="text-3xl font-bold text-white text-center mb-4">글쓰기</h2>

        {/* 제목 */}
        <input
          placeholder="제목을 입력하세요"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-3 text-xl rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 카테고리 */}
        <div className="flex gap-3 flex-wrap">
          {['자유', '질문'].map(c => (
            <button
              key={c}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                cat === c
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
              }`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* 툴바 */}
        <div className="flex flex-wrap items-center gap-2 bg-gray-700 p-2 rounded-lg overflow-x-auto">
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleBold().run()} title="굵게"><MdFormatBold /></button>
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleItalic().run()} title="기울임"><MdFormatItalic /></button>
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleUnderline().run()} title="밑줄"><MdFormatUnderlined /></button>
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleStrike().run()} title="취소선"><MdStrikethroughS /></button>
          <div className="w-px h-6 bg-gray-600" />
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleHighlight().run()} title="형광"><MdHighlight /></button>
          <label className="relative flex items-center w-7 h-8 cursor-pointer">
            <MdFormatColorText className="absolute left-0 text-gray-300" />
            <input type="color" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => editor?.chain().focus().setColor(e.target.value).run()} />
          </label>
          <label className="relative flex items-center w-7 h-8 cursor-pointer">
            <MdFormatSize className="absolute left-0 text-gray-300" />
            <select
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e =>
                e.target.value &&
                editor?.chain().focus().setFontSize(e.target.value).run()
              }
            >
              <option value="">size</option>
              {[12, 14, 16, 18, 24, 32].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
          <div className="w-px h-6 bg-gray-600" />
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} title="제목1"><MdLooksOne /></button>
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} title="제목2"><MdLooksTwo /></button>
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleBulletList().run()} title="불릿 목록"><MdFormatListBulleted /></button>
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().toggleOrderedList().run()} title="번호 목록"><MdFormatListNumbered /></button>
          <div className="w-px h-6 bg-gray-600" />
          <button className={toolbarBtnClass} onClick={() => editor?.chain().focus().extendMarkRange('link').setLink({ href: prompt('URL 입력') || '' }).run()} title="링크"><MdInsertLink /></button>
          <button className={toolbarBtnClass} onClick={insertImg} title="이미지"><MdInsertPhoto /></button>
        </div>

        {/* 에디터 */}
        <div className="bg-gray-700 rounded-lg p-4 min-h-[400px]">
          {editor && <EditorContent editor={editor} className="min-h-[360px] text-white text-base" />}
        </div>

        {/* 작성 버튼 */}
        <button
          onClick={save}
          disabled={loading}
          className="self-end mt-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition disabled:opacity-50"
        >
          {loading ? '작성 중...' : '작성 완료'}
        </button>
      </div>
    </div>
  );
};

export default WriteEditor;

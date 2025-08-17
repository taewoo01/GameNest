// src/components/Comments.jsx
import React, { useState } from 'react';

const Comments = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const handleAddComment = () => {
        if (newComment.trim() !== '') {
            setComments([...comments, newComment.trim()]);
            setNewComment('');
        }
    };

    return (
        <div style={{ marginTop: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600' }}>댓글</h2>

            {/* 입력창 */}
            <div style={{ marginTop: '10px' }}>
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                    rows={3}
                    style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        resize: 'none',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        border: '1px solid #444',
                    }}
                />
                <button
                    onClick={handleAddComment}
                    style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                >
                    댓글 작성
                </button>
            </div>

            {/* 목록 */}
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '20px' }}>
                {comments.length === 0 ? (
                    <li style={{ color: '#888' }}>아직 댓글이 없습니다.</li>
                ) : (
                    comments.map((comment, idx) => (
                        <li
                            key={idx}
                            style={{
                                background: '#1a1a1a',
                                color: '#fff',
                                padding: '10px',
                                borderRadius: '4px',
                                marginBottom: '10px',
                                border: '1px solid #333',
                            }}
                        >
                            {comment}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Comments;

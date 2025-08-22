import { useState } from 'react';
import axiosInstance from '../../axiosInstance';

const inputs = [
  { name: 'user_login_id', placeholder: '아이디', type: 'text' },
  { name: 'user_password', placeholder: '비밀번호', type: 'password' },
  { name: 'confirmPassword', placeholder: '비밀번호 확인', type: 'password' },
  { name: 'user_nickname', placeholder: '닉네임', type: 'text' },
  { name: 'user_email', placeholder: '이메일 주소', type: 'email' },
];

interface SignupModalProps {
  onClose: () => void;
}

const SignupModal = ({ onClose }: SignupModalProps) => {
  const [form, setForm] = useState({
    user_login_id: '',
    user_password: '',
    confirmPassword: '',
    user_nickname: '',
    user_email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { user_login_id, user_password, confirmPassword, user_nickname, user_email } = form;

    if ([user_login_id, user_password, confirmPassword, user_nickname, user_email].some(v => !v.trim())) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    if (user_password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await axiosInstance.post('/auth/register', {
        user_login_id,
        user_password,
        user_nickname,
        user_email,
      });

      alert(res.data.message || '회원가입 성공!');
      onClose();
    } catch (err: any) {
      console.error('회원가입 실패:', err);
      alert(
        err.response?.data?.message ||
        err.message ||
        '회원가입 실패'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="bg-black p-8 rounded-xl w-[400px] text-white shadow-lg">
        <header className="flex justify-between items-center mb-6">
          <h4 className="text-2xl font-bold">회원가입</h4>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-white text-2xl hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        </header>

        <div className="flex flex-col gap-4">
          {inputs.map(({ name, placeholder, type }) => (
            <input
              key={name}
              name={name}
              placeholder={placeholder}
              type={type}
              value={(form as any)[name]}
              onChange={handleChange}
              className="bg-transparent border-b border-white text-white px-2 py-2 text-sm placeholder-gray-400 focus:outline-none"
              autoComplete="off"
            />
          ))}

          <button
            onClick={handleSubmit}
            className="mt-3 bg-red-700 hover:bg-red-800 text-white font-bold py-2 rounded-md text-base transition-colors"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;

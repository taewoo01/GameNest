import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰 만료 또는 인증 실패
      // localStorage 초기화 후 로그인 모달 열기
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      window.dispatchEvent(new Event("tokenExpired")); // 이벤트로 모달 열기 트리거
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

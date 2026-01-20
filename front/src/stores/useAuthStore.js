import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/user' // [중요] api 파일 임포트 필요 (Login.vue 참고함)

const useAuthStore = defineStore('auth', () => {
  const isLogin = ref(false)

  const login = (userInfo) => {
    isLogin.value = true
    localStorage.setItem('USERINFO', userInfo)
  }

  const checkLogin = () => {
    const userInfo = localStorage.getItem('USERINFO')
    if (userInfo) {
      isLogin.value = true
    }
    return isLogin.value
  }

  // [수정] 로그아웃 로직 개선
  const logout = async () => {
    try {
      // 1. 서버에 로그아웃 요청 (서버에서 쿠키를 만료시키도록 함)
      // api.user.js에 logout 함수가 정의되어 있어야 합니다.
      if (api.logout) {
        await api.logout();
      }
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    } finally {
      // 2. 클라이언트 데이터 삭제 (토큰 등)
      localStorage.removeItem('USERINFO');
      
      // 3. 상태 초기화 (이게 빠지면 화면이 안 바뀜)
      isLogin.value = false;
      
      // 4. (선택) 메모리에 남은 데이터까지 깔끔하게 날리려면 새로고침
      // window.location.href = '/login'; 
    }
  }

  const getUsername = () => {
    // 예외 처리 추가 (데이터가 없을 때 에러 방지)
    const stored = localStorage.getItem('USERINFO')
    if (!stored) return ''
    
    try {
      const userInfo = JSON.parse(stored)
      return userInfo.userName || userInfo.username // 대소문자 주의
    } catch (e) {
      return ''
    }
  }

  return { isLogin, checkLogin, login, getUsername, logout }
})

export default useAuthStore
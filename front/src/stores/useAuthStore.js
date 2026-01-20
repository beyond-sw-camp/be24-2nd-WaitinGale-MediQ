import { ref } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/user'

const useAuthStore = defineStore('auth', () => {
  const userInfo = ref(null) 
  const isLogin = ref(false)

  const login = (userString) => {
    isLogin.value = true
    localStorage.setItem('USERINFO', userString) 
    // 문자열을 받아서 스토어에는 객체로 저장 (마이페이지를 위해)
    try {
      userInfo.value = JSON.parse(userString)
    } catch (e) {
      console.error('파싱 에러', e)
    }
  }

  const checkLogin = () => {
    const storedUser = localStorage.getItem('USERINFO')
    if (storedUser) {
      isLogin.value = true
      try {
        userInfo.value = JSON.parse(storedUser)
      } catch (e) {
        userInfo.value = null
      }
    }
    return isLogin.value
  }

  const logout = async () => {
    try {
      if (api.logout) await api.logout();
    } catch (error) {
      console.error('로그아웃 에러:', error);
    } finally {
      localStorage.removeItem('USERINFO');
      isLogin.value = false;
      userInfo.value = null;
    }
  }

  const getUsername = () => {
    // 스토어에 있으면 그거 쓰고, 없으면 로컬스토리지 확인 후 리턴
    if (userInfo.value?.userName) return userInfo.value.userName;
    
    const stored = localStorage.getItem('USERINFO')
    if (!stored) return ''
    try {
      const parsed = JSON.parse(stored)
      return parsed.userName || parsed.username
    } catch (e) {
      return ''
    }
  }

  return { isLogin, userInfo, checkLogin, login, logout, getUsername }
})

export default useAuthStore
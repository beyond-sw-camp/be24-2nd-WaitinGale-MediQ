import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 로그인 상태나 유저 정보를 여기에 저장합니다
    isAuthenticated: false,
    user: null,
  }),
  actions: {
    login(userData) {
      this.isAuthenticated = true
      this.user = userData
    },
    logout() {
      this.isAuthenticated = false
      this.user = null
    },
  },
})

export default useAuthStore
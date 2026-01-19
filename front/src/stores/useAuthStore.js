import { ref } from 'vue'

import { defineStore } from 'pinia'

const useAuthStore = defineStore('auth', () => {
  const isLogin = ref(false)

  const login = (userInfo) => {
    isLogin.value = true
    localStorage.setItem('USERINFO', userInfo)
  }

  const checkLogin = () => {
    if (localStorage.getItem('USERINFO')) {
      isLogin.value = true
    }
    return isLogin.value
  }

  const logout = () => {
    localStorage.removeItem('USERINFO')
  }

  const getUsername = () => {
    const userInfo = JSON.parse(localStorage.getItem('USERINFO'))
    return userInfo.userName
  }
  return { isLogin, checkLogin, login, getUsername, logout }
})

export default useAuthStore

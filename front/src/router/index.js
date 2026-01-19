// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'home',
      path: '/', // 앞에 슬래시(/) 붙여서 독립 경로로 만듦
      meta: { title: 'home' },
      component: () => import('../views/user/HomeView.vue'), // 레이지 로딩 유지
    },
    {
      name: 'login',
      path: '/login', 
      meta: { title: '로그인' },
      component: () => import('../views/user/UserLogin.vue'), // 레이지 로딩 유지
    },
    {
      name: 'UserFindId',
      path: '/UserFindId',
      meta: { title: '아이디 찾기' },
      component: () => import('../views/user/UserFindId.vue'), // 레이지 로딩 유지
    },
    {
      name: 'UserFindPassword',
      path: '/UserFindPassword',
      meta: { title: '비밀번호 찾기' },
      component: () => import('../views/user/UserFindPassword.vue'), // 레이지 로딩 유지
    },
    {
      name: 'signup',
      path: '/signup',
      meta: { title: '회원가입' },
      component: () => import('../views/user/UserSignup.vue'), // 레이지 로딩 유지
    },
    {
      name: 'UserMain',
      path: '/UserMain',
      meta: { title: 'UserMain' },
      component: () => import('../views/UserMain.vue'), // 레이지 로딩 유지
    },

      {
      name: 'HomeView',
      path: '/HomeView',
      meta: { title: 'MEDI-Q : 메인 페이지' },
      component: () => import('@/views/user/HomeView.vue'),
    },
  ],
})

export default router
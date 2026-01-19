<template>
  <aside class="hidden md:flex w-64 flex-col bg-white border-r border-slate-200 z-20 h-full">
    
    <div class="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
      <a href="#" class="flex items-center gap-2">
        <img src="./mediQ_logo.png" onerror="this.style.display='none'" alt="Logo" class="w-8 h-8 object-contain">
        <span class="text-xl font-black tracking-tight text-slate-900">MediQ</span>
      </a>
    </div>

    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <p class="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Main Menu</p>

      <button 
        @click="changeTab('hospital')"
        :class="[
          'w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl transition-all',
          currentTab === 'hospital' 
            ? 'bg-indigo-50 text-indigo-700' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        ]"
      >
        <i class="fa-solid fa-map-location-dot w-6 text-center text-lg mr-2 group-hover:scale-110 transition"></i>
        내 주변 병원
      </button>

      <button 
        @click="changeTab('pharmacy')"
        :class="[
          'w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl transition-all',
          currentTab === 'pharmacy' 
            ? 'bg-indigo-50 text-indigo-700' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        ]"
      >
        <i class="fa-solid fa-pills w-6 text-center text-lg mr-2 group-hover:scale-110 transition"></i>
        주변 약국
      </button>

      <button 
        @click="changeTab('reservation')"
        :class="[
          'w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl transition-all',
          currentTab === 'reservation' 
            ? 'bg-indigo-50 text-indigo-700' 
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        ]"
      >
        <i class="fa-solid fa-calendar-check w-6 text-center text-lg mr-2 group-hover:scale-110 transition"></i>
        나의 예약
        <span class="ml-auto bg-indigo-100 text-indigo-700 py-0.5 px-2 rounded-full text-xs font-black">1</span>
      </button>

      <div class="pt-6 mt-6 border-t border-slate-100">
        <p class="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Account</p>
        <button class="w-full group flex items-center px-3 py-2.5 text-sm font-semibold rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all">
          <i class="fa-solid fa-user-gear w-6 text-center text-lg mr-2"></i>
          마이페이지
        </button>
      </div>
    </nav>

    <div class="p-4 border-t border-slate-100 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
          <i class="fa-solid fa-user"></i>
        </div>
        <div>
          <p class="text-sm font-extrabold text-slate-900">게스트</p>
          <RouterLink to="/login" class="text-xs text-indigo-600 hover:underline">
            로그인하기
          </RouterLink>
        </div>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { ref } from 'vue';

// 부모에게 "메뉴 바꼈다"고 알리기 위함
const emit = defineEmits(['change-tab']);

// 현재 선택된 탭 상태
const currentTab = ref('hospital');

const changeTab = (tabName) => {
  currentTab.value = tabName;
  emit('change-tab', tabName); // 부모에게 알림
};
</script>
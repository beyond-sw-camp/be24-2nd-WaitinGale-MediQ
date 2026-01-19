<template>
  <header class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-10 shrink-0">
    
    <button class="md:hidden text-slate-500 mr-4">
      <i class="fa-solid fa-bars text-xl"></i>
    </button>

    <div class="flex-1 max-w-xl">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
        </div>

        <input type="text" 
               v-model="keyword"
               @keyup.enter="onSearch"
               class="block w-full pl-10 pr-20 py-2.5 border border-slate-200 rounded-2xl bg-white shadow-sm
                      text-slate-900 placeholder-slate-400
                      focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-300 transition
                      sm:text-sm font-semibold"
               placeholder="증상, 병원명, 진료과 검색">

        <button @click="onSearch"
                class="absolute inset-y-0 right-2 my-1.5 px-4 rounded-xl
                       text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm">
          검색
        </button>
      </div>
    </div>

    <div class="flex items-center gap-4 ml-4">
      <button class="text-slate-400 hover:text-slate-600 relative">
        <i class="fa-regular fa-bell text-xl"></i>
        <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['search']);
const keyword = ref('');

const onSearch = () => {
  if (!keyword.value.trim()) {
    alert('검색어를 입력해주세요');
    return;
  }
  // 부모(App.vue)로 검색어 전달
  emit('search', keyword.value);
};
</script>
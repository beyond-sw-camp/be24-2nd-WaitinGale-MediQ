<template>
  <div class="flex h-screen w-screen overflow-hidden bg-slate-50">
    <LeftSideBar @change-tab="changeMode" :current-tab="mode" />

    <div class="flex-1 flex flex-col h-full relative">
      <Header @search="handleSearch" />
      
      <main class="flex-1 flex relative overflow-hidden">
        
        <template v-if="mode === 'hospital' || mode === 'pharmacy'">
          <div class="flex-1 bg-slate-100 relative z-0 transition-all duration-300">
            <MainMap
              ref="mapRef" 
              :favorites="favorites"
              :mode="mode" 
              @update-hospitals="updateList" 
              @toggle-favorite="handleToggleFavorite"
              @switch-mode-to-pharmacy="mode = 'pharmacy'"
              @switch-mode-to-hospital="mode = 'hospital'"
              @select-hospital="handleSelectPlace" 
            />

            <button v-if="!isListOpen" 
                    @click="isListOpen = true"
                    class="absolute top-4 right-4 z-[50] bg-white border border-slate-200 text-slate-700 
                           px-4 py-2.5 rounded-xl shadow-lg font-bold text-sm hover:bg-slate-50 transition flex items-center gap-2">
              <i class="fa-solid fa-list-ul text-indigo-600"></i> 목록 보기
            </button>
          </div>
          
          <transition name="slide-fade">
            <MainList 
              v-show="isListOpen"
              :hospitals="places" 
              :favorites="favorites"
              :mode="mode"
              :selected-place="selectedPlace"
              @item-click="focusPlace" 
              @toggle-favorite="handleToggleFavorite" 
              @close-list="isListOpen = false"
              @close-detail="clearSelection"
            />
          </transition>
        </template>

        <div v-else-if="mode === 'reservation'" class="flex-1 bg-white p-10 overflow-y-auto z-10">
           <h2 class="text-2xl font-black text-slate-900 mb-6">나의 예약 내역</h2>
           <div class="space-y-4">
             <div class="p-12 border border-slate-200 rounded-3xl bg-slate-50 text-center text-slate-500 flex flex-col items-center justify-center gap-4">
               <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                 <i class="fa-regular fa-calendar-check text-2xl text-indigo-400"></i>
               </div>
               <p class="font-bold">아직 예약된 내역이 없습니다.</p>
             </div>
           </div>
        </div>

      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import LeftSideBar from '@/components/layout/LeftSideBar.vue';
import Header from '@/components/layout/Header.vue';
import MainMap from '@/components/MainMap.vue';
import MainList from '@/components/MainList.vue';

const mode = ref('hospital'); 
const mapRef = ref(null);
const places = ref([]);
const isListOpen = ref(true);
const selectedPlace = ref(null);
const favorites = ref([]);

const handleSearch = (keyword) => {
  if (mapRef.value) mapRef.value.searchPlaces(keyword);
};

const updateList = (data) => {
  places.value = data;
};

const focusPlace = (place) => {
  if (mapRef.value) mapRef.value.openCard(place);
};

const handleSelectPlace = (place) => {
  selectedPlace.value = place;
  if (place) isListOpen.value = true;
};

const clearSelection = () => {
  selectedPlace.value = null;
  if (mapRef.value) mapRef.value.closeCard();
};

const handleToggleFavorite = (item) => {
  const idx = favorites.value.findIndex(f => f.id === item.id);
  if (idx > -1) favorites.value.splice(idx, 1);
  else favorites.value.push(item);
  localStorage.setItem('myFavorites', JSON.stringify(favorites.value));
};

const changeMode = (newMode) => {
  mode.value = newMode;
  places.value = []; 
  isListOpen.value = true;
  selectedPlace.value = null; 
  // if (mapRef.value) mapRef.value.resetToGeneralMode();
};

watch(isListOpen, () => {
  setTimeout(() => {
    if (mapRef.value) {
      mapRef.value.resizeMap();
    }
  }, 350);
});

onMounted(() => {
  const saved = localStorage.getItem('myFavorites');
  if (saved) favorites.value = JSON.parse(saved);
});
</script>

<style scoped>
.slide-fade-enter-active, .slide-fade-leave-active { transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); }
.slide-fade-enter-from, .slide-fade-leave-to { transform: translateX(100%); opacity: 0; }
</style>
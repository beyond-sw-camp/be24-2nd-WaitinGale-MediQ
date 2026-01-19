<script setup>

</script>

<template>


  <header class="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 z-[200] shrink-0 relative">
    
    <button class="md:hidden text-slate-500 mr-4">
      <i class="fa-solid fa-bars text-xl"></i>
    </button>

    <div class="hidden md:flex w-60 flex-col bg-white z-20">
         <div class="w-64 h-16 flex items-center px-0 border-b border-slate-100">

            <a href="#" class="flex items-center gap-2">
             <img src="@/assets/image/mediQ_logo.png" alt="Logo" class="w-8 h-8 object-contain" @error="e => (e.target.src = 'https://via.placeholder.com/32')">
             <span class="text-xl font-black tracking-tight text-slate-900">MediQ</span>
             </a>
         </div>
      </div>


      <div class="flex-none pl-0 mr-80">

        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fa-solid fa-magnifying-glass text-slate-400"></i>
          </div>


          <input type="text" id="search-keyword"

                 onkeyup="if(window.event.keyCode==13){searchHospitals()}"
                 class="block w-[800px] pl-10 pr-28 py-2.5 border border-slate-200 rounded-2xl bg-white shadow-sm
                        text-slate-900 placeholder-slate-400 padding
                        focus:outline-none focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-300 transition
                        sm:text-sm font-semibold"
                 placeholder="증상, 병원명, 진료과 검색 (예: 배아파, 세브란스)">
          
          <button onclick="searchHospitals()"
                  class="absolute inset-y-0 right-2 my-1.5 px-4 rounded-xl
                         text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm">
            검색
          </button>

        </div>
      </div>

      <div class="flex items-center gap-4 px-4 ml-20">
        <button class="text-slate-400 hover:text-slate-600 relative">
          <i class="fa-regular fa-bell text-xl"></i>
          <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
        </button>
      </div>
    </header>
    

</template>

<style scoped>
    

</style>
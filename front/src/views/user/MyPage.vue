<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 라우터경로 지정, 로그아웃하면 메인으로 이동 
const goToMain = () => {
    router.push('/');
};

const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.clear();
    router.push('/');
};

//탭 상태 관리 반응형 이동
const currentTab = ref('medical-history'); // 기본으로 띄워지는 탭

const tabs = [
    { id: 'medical-history', label: '진료 기록', icon: 'fa-heart-pulse', color: 'rose' },
    { id: 'prescriptions', label: '처방전', icon: 'fa-file-prescription', color: 'indigo' },
    { id: 'billing', label: '결제/영수증', icon: 'fa-file-invoice-dollar', color: 'emerald' },
    { id: 'results', label: '검사 결과', icon: 'fa-square-poll-vertical', color: 'amber' }
];

//데이터들

// 진료 기록 데이터
const medicalHistoryData = ref([
    {
        hospital: "서울대학교병원",
        department: "내과",
        date: "2023-10-27",
        doctor: "김철수 교수",
        diagnosis: "급성 위염",
        prescription: "위장약 5일분"
    },
    {
        hospital: "세브란스 병원",
        department: "정형외과",
        date: "2023-03-02",
        doctor: "박민준 전문의",
        diagnosis: "발목 염좌",
        prescription: "물리치료 3회"
    }
]);

// 다음 병원 일정 데이터 (이거 안떠서 4시간동안 싸움)
const hospitalSchedule = ref([
    {
        month: '11월',
        day: '15',
        hospital: '연세세브란스 (피부과)',
        description: '정기 레이저 치료 · 오후 04:00',
        bgClass: 'bg-indigo-50 text-indigo-600',
    },
    {
        month: '12월',
        day: '20',
        hospital: '아이사랑 치과',
        description: '스케일링 예약 · 오전 10:30',
        bgClass: 'bg-slate-50 text-slate-500',
    }
]);

// 가족 구성원 데이터 (이거 안떠서 4시간동안 싸움)
const familyMembers = ref([
    {
        name: '김하늘',
        icon: '👶',
        iconBg: 'bg-amber-100',
        status: '진료 중',
        statusClass: 'bg-rose-100 text-rose-600',
        hospital: '아이사랑 소아과'
    },
    {
        name: '이영희',
        icon: '👩',
        iconBg: 'bg-indigo-100',
        status: '건강함',
        statusClass: 'bg-emerald-100 text-emerald-600',
        hospital: '최근 진료: 3개월 전'
    }
    
]);
// --- 팝업(모달) 상태 관리 ---
const showModal = ref(false); // 팝업 표시 여부
const newMemberName = ref(''); // 입력받을 이름

// 팝업 열기
const openAddModal = () => {
    newMemberName.value = ''; // 입력창 초기화
    showModal.value = true;   // 팝업 켜기
};

// 팝업 닫기
const closeAddModal = () => {
    showModal.value = false;
};

// 가족 저장하기
const saveFamilyMember = () => {
    if (!newMemberName.value.trim()) {
        alert("이름을 입력해주세요!");
        return;
    }

    // 새 가족 데이터 생성
    const newMember = {
        name: newMemberName.value,
        icon: '🙂', // 기본 아이콘
        iconBg: 'bg-indigo-100',
        status: '등록됨',
        statusClass: 'bg-slate-100 text-slate-500',
        hospital: '진료 기록 없음'
    };

    familyMembers.value.push(newMember); // 리스트에 추가
    closeAddModal(); // 저장 후 팝업 닫기
};

//말풍선 세모 이동하는거 (반응형)
const arrowPosition = ref('12.5%');

const updateArrowPosition = () => {
    const index = tabs.findIndex(t => t.id === currentTab.value) + 1;
    if (window.innerWidth < 768) {
        // 모바일 (2열)
        if (index === 1 || index === 3) arrowPosition.value = "25%";
        else arrowPosition.value = "75%";
    } else {
        // 데스크탑 (4열)
        arrowPosition.value = (index * 25 - 12.5) + "%";
    }
};

const showDateModal = ref(false);
const editingIndex = ref(null); // 수정 중인 일정의 인덱스 저장
const selectedDate = ref('');   // <input type="date">와 연결될 변수

// 달력 아이콘 클릭 시 실행될 함수
const openDateModal = (index) => {
    editingIndex.value = index; // "몇 번째 일정을 수정 중인지" 기억
    showDateModal.value = true; // 팝업 열기
    
    // (선택 사항) 현재 일정의 날짜를 가져와서 date input 초기값으로 설정하는 로직이 필요하다면 여기에 추가
    // 예: selectedDate.value = "2026-01-18"; 
};

// 변경된 날짜 저장 함수
const saveNewDate = () => {
    if (!selectedDate.value) return; // 날짜 선택 안했으면 종료

    // input date의 값은 "2026-01-18" 형태의 문자열로 들어옴.
    // 이걸 잘라서 기존 데이터 양식(월, 일)에 맞춰 넣어준다.
    const [year, month, day] = selectedDate.value.split('-'); 

    // 데이터 업데이트 (반응형으로 화면도 바로 바뀜)
    hospitalSchedule.value[editingIndex.value].month = `${parseInt(month)}월`;
    hospitalSchedule.value[editingIndex.value].day = day;
    
    // 팝업 닫기
    showDateModal.value = false;
    selectedDate.value = ''; // 초기화
};

const selectTab = (tabId) => {
    currentTab.value = tabId;
    updateArrowPosition();
};

onMounted(() => {
    window.addEventListener('resize', updateArrowPosition);
    updateArrowPosition();
});

onUnmounted(() => {
    window.removeEventListener('resize', updateArrowPosition);
});
</script>

<template>
    <main class="w-full h-full overflow-y-auto bg-slate-50">
        <div class="max-w-7xl mx-auto px-6 py-10">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                    <button @click="router.back()" class="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition shadow-sm cursor-pointer">
                        <i class="fa-solid fa-arrow-left"></i>
                    </button>
                    <h1 class="text-2xl font-bold">마이페이지</h1>
                </div>
                <button @click="goToMain" class="text-slate-400 hover:text-indigo-600 transition cursor-pointer">
                    <i class="fa-solid fa-gear text-xl"></i>
                </button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
                <div class="lg:col-span-4 space-y-6">
                    <div class="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                        <div class="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                        <div class="relative flex flex-col items-center">
                            <div class="w-24 h-24 rounded-full bg-white p-1 mb-4 shadow-lg">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-full h-full rounded-full bg-slate-100" alt="profile">
                            </div>
                            <h2 class="text-xl font-bold">김메디 <span class="text-sm font-normal text-slate-400">님</span></h2>
                            <p class="text-sm text-slate-500 mb-6">medi_kim@example.com</p>
                            
                            <div class="grid grid-cols-3 gap-2 w-full text-center mb-6">
                                <div class="bg-slate-50 p-3 rounded-2xl">
                                    <p class="text-[10px] text-slate-400 uppercase font-bold">나이</p>
                                    <p class="font-bold text-slate-700">28세</p>
                                </div>
                                <div class="bg-slate-50 p-3 rounded-2xl">
                                    <p class="text-[10px] text-slate-400 uppercase font-bold">혈액형</p>
                                    <p class="font-bold text-slate-700">A+</p>
                                </div>
                                <div class="bg-slate-50 p-3 rounded-2xl">
                                    <p class="text-[10px] text-slate-400 uppercase font-bold">성별</p>
                                    <p class="font-bold text-slate-700">남성</p>
                                </div>
                            </div>
                            <button class="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition cursor-pointer">내 정보 수정</button>
                        </div>
                    </div>

                    <div class="bg-rose-50 rounded-[32px] p-6 border border-rose-100">
                        <div class="flex items-center gap-2 mb-4">
                            <i class="fa-solid fa-notes-medical text-rose-500"></i>
                            <h3 class="font-bold text-rose-800">기저질환 및 알러지</h3>
                        </div>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-3 py-1 bg-white text-rose-500 text-xs font-bold rounded-full border border-rose-100 shadow-sm">페니실린 알러지</span>
                            <span class="px-3 py-1 bg-white text-slate-500 text-xs font-bold rounded-full border border-slate-100 shadow-sm">천식(경미)</span>
                        </div>
                    </div>

                    <button @click="logout" class="w-full py-4 text-slate-400 font-bold border border-slate-200 rounded-2xl hover:bg-slate-50 hover:text-rose-500 transition cursor-pointer">
                        <i class="fa-solid fa-right-from-bracket mr-2"></i> 로그아웃
                    </button>
                </div>

                <div class="lg:col-span-8 space-y-10">
                    <section>
                        <h3 class="text-lg font-bold mb-5 px-2 text-slate-800">내 의료 지갑</h3>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <button 
                                v-for="tab in tabs" 
                                :key="tab.id"
                                @click="selectTab(tab.id)"
                                :class="[
                                    'tab-btn p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md flex flex-col items-center gap-3 group transition-all duration-300 cursor-pointer',
                                    currentTab === tab.id ? 'active-btn bg-white' : 'bg-white',
                                    `text-${tab.color}-600`
                                ]"
                            >
                                <div :class="`w-12 h-12 rounded-2xl bg-${tab.color}-50 flex items-center justify-center group-hover:scale-110 transition-transform`">
                                    <i :class="['fa-solid text-xl', tab.icon]"></i>
                                </div>
                                <span class="text-sm font-bold text-slate-600">{{ tab.label }}</span>
                            </button>
                        </div>

                        <div class="speech-bubble border border-slate-100 p-8 min-h-[350px]" :style="{ '--arrow-left': arrowPosition }">
                            
                            <div v-show="currentTab === 'medical-history'">
                                <div class="flex items-center justify-between mb-6">
                                    <h4 class="text-xl font-bold flex items-center gap-2 text-rose-600">
                                        <i class="fa-solid fa-heart-pulse"></i> 나의 진료 기록
                                    </h4>
                                    <span class="text-xs text-slate-400">최근 1년 기준</span>
                                </div>
                                <div class="space-y-4">
                                    <div v-for="(item, index) in medicalHistoryData" :key="index" 
                                         class="bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:border-rose-200 transition-colors">
                                        <div class="flex justify-between items-start mb-3">
                                            <div>
                                                <span class="text-[10px] font-bold text-rose-500 bg-rose-100/50 px-2 py-1 rounded-md mr-2">{{ item.department }}</span>
                                                <h5 class="inline font-bold text-slate-800">{{ item.hospital }}</h5>
                                            </div>
                                            <span class="text-xs text-slate-400 font-medium">{{ item.date }}</span>
                                        </div>
                                        <div class="grid grid-cols-2 gap-y-2 text-sm">
                                            <div class="text-slate-500">진단명</div>
                                            <div class="text-slate-800 font-medium">{{ item.diagnosis }}</div>
                                            <div class="text-slate-500">처방</div>
                                            <div class="text-slate-800 font-medium text-xs">{{ item.prescription }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div v-show="currentTab === 'prescriptions'">
                                <h4 class="text-xl font-bold mb-6 flex items-center gap-2 text-indigo-600">
                                    <i class="fa-solid fa-capsules"></i> 발행된 처방전
                                </h4>
                                <div class="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <p class="text-slate-600 text-sm leading-relaxed">
                                        현재 보관된 처방전이 <strong class="text-indigo-600">2건</strong> 있습니다.<br>
                                        약국 제출용 QR 코드를 확인하거나 PDF로 다운로드할 수 있습니다.
                                    </p>
                                </div>
                            </div>

                            <div v-show="currentTab === 'billing'">
                                <h4 class="text-xl font-bold mb-6 flex items-center gap-2 text-emerald-600">
                                    <i class="fa-solid fa-receipt"></i> 결제 내역
                                </h4>
                                <p class="text-slate-600 text-sm">최근 결제 내역: 15,400원 (2023.10.28). 연말정산용 서류 출력이 가능합니다.</p>
                                <p class="text-slate-600 text-sm">최근 결제 내역: 25,400원 (2023.12.28). 연말정산용 서류 출력이 가능합니다.</p>
                                <p class="text-slate-600 text-sm">최근 결제 내역: 55,400원 (2024.2.28). 연말정산용 서류 출력이 가능합니다.</p>
                                <p class="text-slate-600 text-sm">최근 결제 내역: 235,400원 (2025.5.28). 연말정산용 서류 출력이 가능합니다.</p>
                            </div>

                            <div v-show="currentTab === 'results'">
                                <h4 class="text-xl font-bold mb-6 flex items-center gap-2 text-amber-600">
                                    <i class="fa-solid fa-chart-line"></i> 검사 결과 보고서
                                </h4>
                                <p class="text-slate-600 text-sm">혈액 검사 결과가 업데이트되었습니다. 정상 범위를 벗어난 항목이 1건 있습니다.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 class="text-lg font-bold mb-4 px-2 flex items-center justify-between">
                            <span>내 다음 병원 일정</span>
                            <a href="#" class="text-xs text-slate-400 hover:text-indigo-600 transition">전체보기</a>
                        </h3>
                        <div class="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm space-y-4">
                            <div v-for="(schedule, index) in hospitalSchedule" :key="index" 
                                 class="flex items-center gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                <div :class="['flex flex-col items-center justify-center w-14 h-14 rounded-2xl shrink-0', schedule.bgClass]">
                                    <span class="text-[10px] font-bold uppercase">{{ schedule.month }}</span>
                                    <span class="text-xl font-bold">{{ schedule.day }}</span>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-bold text-slate-900">{{ schedule.hospital }}</h4>
                                    <p class="text-xs text-slate-500">{{ schedule.description }}</p>
                                </div>
                                <button @click="openDateModal(index)" class="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-indigo-600 transition">
                                    <i class="fa-regular fa-calendar-check"></i>
                                </button>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 class="text-lg font-bold mb-4 px-2">가족 구성원 관리</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div v-for="(member, index) in familyMembers" :key="index" 
                                 class="bg-white border border-slate-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition cursor-pointer group">
                                <div :class="['w-12 h-12 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform', member.iconBg]">
                                    {{ member.icon }}
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-0.5">
                                        <h4 class="font-bold text-slate-900">{{ member.name }}</h4>
                                        <span :class="['px-2 py-0.5 text-[10px] font-bold rounded-full', member.statusClass]">{{ member.status }}</span>
                                    </div>
                                    <p class="text-xs text-slate-500">{{ member.hospital }}</p>
                                </div>
                                <i class="fa-solid fa-chevron-right text-slate-300 text-xs"></i>
                            </div>

                            <button @click="openAddModal" 
                                class="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex items-center justify-center gap-2 text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition min-h-[88px] cursor-pointer"
                            >
                                <i class="fa-solid fa-plus"></i>
                                <span class="text-sm font-bold">가족 추가하기</span>
                            </button>
                            
                            <button @click="goToMain" class="border border-slate-200 rounded-2xl p-5 text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition flex items-center justify-center gap-2 cursor-pointer">
                                메인으로 돌아가기
                            </button>
                        </div>
                        <div v-if="showDateModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
                            <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="showDateModal = false"></div>

                            <div class="relative bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl">
                                <h3 class="text-xl font-bold text-slate-900 mb-4 text-center">일정 변경</h3>
                                
                                <div class="mb-6">
                                    <label class="block text-xs font-bold text-slate-500 mb-1 ml-2">날짜 선택</label>
                                    <input 
                                        type="date" 
                                        v-model="selectedDate"
                                        class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 font-bold text-slate-800"
                                    >
                                </div>

                                <div class="grid grid-cols-2 gap-3">
                                    <button @click="showDateModal = false" class="py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100">취소</button>
                                    <button @click="saveNewDate" class="py-3.5 rounded-xl font-bold text-white bg-indigo-600">변경하기</button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center px-4">
    
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" @click="closeAddModal"></div>

    <div class="relative bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl transform transition-all scale-100">
        <button @click="closeAddModal" class="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
            <i class="fa-solid fa-xmark text-xl"></i>
        </button>

        <div class="text-center mb-6">
            <div class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600 text-2xl">
                <i class="fa-solid fa-user-plus"></i>
            </div>
            <h3 class="text-xl font-bold text-slate-900">가족 구성원 추가</h3>
            <p class="text-sm text-slate-500 mt-2">등록할 가족의 이름을 입력해주세요.</p>
        </div>

        <div class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-500 mb-1 ml-2">이름</label>
                <input 
                    v-model="newMemberName" 
                    @keyup.enter="saveFamilyMember"
                    type="text" 
                    placeholder="예: 이성계" 
                    class="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition font-bold text-slate-800"
                    autoFocus
                >
            </div>

            <div class="grid grid-cols-2 gap-3 pt-2">
                <button 
                    @click="closeAddModal" 
                    class="py-3.5 rounded-xl font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 transition"
                >
                    취소
                </button>
                <button 
                    @click="saveFamilyMember" 
                    class="py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                >
                    등록하기
                </button>
            </div>
        </div>
    </div>
</div>
    </main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@400;500;600;700&display=swap');

/* 말풍선 효과 */
.speech-bubble {
    position: relative;
    background: white;
    border-radius: 2rem;
    filter: drop-shadow(0 4px 12px rgba(0,0,0,0.05));
    transition: all 0.3s ease;
}
.speech-bubble::before {
    content: '';
    position: absolute;
    top: -10px;
    left: var(--arrow-left, 12.5%);
    transform: translateX(-50%);
    border-left: 12px solid transparent;
    border-right: 12px solid transparent;
    border-bottom: 12px solid white;
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 활성화된 버튼 스타일 */
.active-btn {
    border-color: currentColor !important;
    box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
}
</style>
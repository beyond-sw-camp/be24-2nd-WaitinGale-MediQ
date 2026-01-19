<script setup>
import { reactive, computed, ref } from 'vue' //  ref 추가됨
import api from '@/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()

//  주민번호 뒷자리 입력창을 제어하기 위한 변수
const nationalId2Input = ref(null)

const signupForm = reactive({
  name: '',
  email: '',
  password: '',
  // 주민번호를 2개로 나눔
  nationalId1: '', 
  nationalId2: '',
  // 서버로 보낼 합쳐진 값
  nationalId: ''
})

const signupInputError = reactive({
  name: { errorMessage: '', isValid: false },
  email: { errorMessage: '', isValid: false },
  password: { errorMessage: '', isValid: false },
  nationalId: { errorMessage: '', isValid: false },
})

// 1. 비밀번호 강도 계산
const passwordStrength = computed(() => {
  const pw = signupForm.password
  if (!pw) return { score: 0, label: '', color: 'text-slate-400', bg: 'bg-slate-200' }

  const hasLength = pw.length >= 8
  const hasUpperLetter = /[A-Z]/.test(pw)
  const hasLowerLetter = /[a-z]/.test(pw)
  const hasNumber = /[0-9]/.test(pw)
  const hasSpecial = /[!@$]/.test(pw)

  let score = 0
  if (hasLength) score++
  if (hasUpperLetter) score++
  if (hasLowerLetter) score++
  if (hasNumber) score++
  if (hasSpecial) score++

  if (score <= 1) return { score: 1, label: '하 (약함)', color: 'text-red-500', bg: 'bg-red-500' }
  if (score <= 3) return { score: 2, label: '중 (보통)', color: 'text-yellow-500', bg: 'bg-yellow-500' }
  return { score: 3, label: '상 (강함)', color: 'text-green-500', bg: 'bg-green-500' }
})

// 2. 유효성 검사 규칙들

// [이름]
const nameRules = () => {
  if (signupForm.name.length < 2) { 
    signupInputError.name.errorMessage = '이름은 2글자 이상 입력해야 합니다.'
    signupInputError.name.isValid = false
    return false
  }
  signupInputError.name.errorMessage = ''
  signupInputError.name.isValid = true
  return true
}

// [이메일]
const emailRules = () => {
  const email = signupForm.email
  if (!email) {
    signupInputError.email.errorMessage = '이메일을 입력해주세요.'
    signupInputError.email.isValid = false
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    signupInputError.email.errorMessage = '이메일 형식이 올바르지 않습니다.'
    signupInputError.email.isValid = false
    return false
  }
  signupInputError.email.errorMessage = ''
  signupInputError.email.isValid = true
  return true
}

// [비밀번호]
const passwordRules = () => {
  if (signupForm.password.length < 8) {
    signupInputError.password.errorMessage = '비밀번호는 8글자 이상 입력해야 합니다.'
    signupInputError.password.isValid = false
    return false
  }

  const hasUpperLetter = /[A-Z]/.test(signupForm.password)
  const hasLowerLetter = /[a-z]/.test(signupForm.password)
  const hasNumber = /[0-9]/.test(signupForm.password)
  const hasSpecial = /[!@$]/.test(signupForm.password)

  if (!(hasUpperLetter && hasLowerLetter && hasNumber && hasSpecial)) {
    signupInputError.password.errorMessage = '영문 대/소문자, 숫자, 특수문자(!@$)를 모두 포함해야 합니다.'
    signupInputError.password.isValid = false
    return false
  }

  signupInputError.password.errorMessage = ''
  signupInputError.password.isValid = true
  return true
}

// ★ [주민번호] - 두 칸을 합쳐서 검사하는 로직
const nationalIdRules = () => {
  // 1. 앞, 뒤 칸이 비어있는지 확인
  if (!signupForm.nationalId1 || !signupForm.nationalId2) {
    signupInputError.nationalId.errorMessage = '주민번호를 모두 입력해주세요.'
    signupInputError.nationalId.isValid = false
    return false
  }

  // 2. 합쳐서 정규식 검사 (숫자6자리-숫자7자리)
  const combinedId = signupForm.nationalId1 + '-' + signupForm.nationalId2
  const idRegex = /^\d{6}-?[1-4]\d{6}$/

  if (!idRegex.test(combinedId)) {
    signupInputError.nationalId.errorMessage = '올바른 주민번호 형식이 아닙니다.'
    signupInputError.nationalId.isValid = false
    return false
  }

  // 3. 통과하면 서버 전송용 변수에 저장
  signupForm.nationalId = combinedId
  
  signupInputError.nationalId.errorMessage = ''
  signupInputError.nationalId.isValid = true
  return true
}

// ★ 앞자리 6개 다 치면 자동으로 뒷자리로 넘어가는 함수
const handleId1Input = () => {
  if (signupForm.nationalId1.length >= 6) {
    // 뒷자리 입력창으로 포커스 이동
    nationalId2Input.value.focus()
  }
}

// 폼 전체 유효성 검사
const isFormValid = () => {
  return signupInputError.name.isValid && 
         signupInputError.email.isValid && 
         signupInputError.password.isValid &&
         signupInputError.nationalId.isValid
}

// 3. 회원가입 실행 함수
const signup = async () => {
  const isNameValid = nameRules()
  const isEmailValid = emailRules()
  const isPwValid = passwordRules()
  const isIdValid = nationalIdRules()

  if (!isNameValid || !isEmailValid || !isPwValid || !isIdValid) {
    alert("입력 정보를 다시 확인해주세요.")
    return
  }

  if (passwordStrength.value.score < 2) {
    alert("비밀번호 보안 수준을 '중' 이상으로 설정해주세요.")
    return
  }

  try {
    const res = await api.signup(signupForm)
    console.log('Signup Result:', res)
    if (res.status === 200) {
      alert("가입 성공!")
      router.push({ name: 'login' })
    }
  } catch (error) {
    console.error(error)
    alert("회원가입 중 오류가 발생했습니다.")
  }
}
</script>

<template>
  <div class="bg-slate-50 flex items-center justify-center min-h-screen py-10">
    <div class="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200">
      <div class="flex items-center gap-3 mb-8">
        <RouterLink to="/user/login" class="text-slate-400 hover:text-slate-600">
          <i class="fa-solid fa-arrow-left"></i>
        </RouterLink>
        <h1 class="text-2xl font-bold">회원가입</h1>
      </div>
      
      <form @submit.prevent="signup" class="space-y-5 mb-10">
        
        <div>
          <label for="name" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">이름</label>
          <input
            @blur="nameRules()" 
            v-model="signupForm.name"
            type="text" id="name" placeholder="실명을 입력해주세요"
            class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm"
          />
          <p v-if="signupInputError.name.errorMessage" class="text-red-500 text-xs mt-1 ml-1">
            {{ signupInputError.name.errorMessage }}
          </p>
        </div>

        <div>
          <label for="email" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">이메일</label>
          <input
            @blur="emailRules()" 
            v-model="signupForm.email"
            type="email" id="email" placeholder="example@gmail.com"
            class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm"
          />
          <p v-if="signupInputError.email.errorMessage" class="text-red-500 text-xs mt-1 ml-1">
            {{ signupInputError.email.errorMessage }}
          </p>
        </div>

        <div>
          <label for="password" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">비밀번호</label>
          <input
            @blur="passwordRules()"
            v-model="signupForm.password"
            type="password" id="password" placeholder="8자 이상, 영문/숫자/특수문자"
            class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm"
          />
          <p v-if="signupInputError.password.errorMessage" class="text-red-500 text-xs mt-1 ml-1">
            {{ signupInputError.password.errorMessage }}
          </p>
        </div>

        <div v-if="signupForm.password" class="mt-2 ml-1 flex items-center gap-3">
          <div class="flex gap-1">
             <div :class="['h-1 w-6 rounded-full transition-colors', passwordStrength.score >= 1 ? passwordStrength.bg : 'bg-slate-200']"></div>
             <div :class="['h-1 w-6 rounded-full transition-colors', passwordStrength.score >= 2 ? passwordStrength.bg : 'bg-slate-200']"></div>
             <div :class="['h-1 w-6 rounded-full transition-colors', passwordStrength.score >= 3 ? passwordStrength.bg : 'bg-slate-200']"></div>
          </div>
          <span :class="['text-[10px] font-bold uppercase tracking-tighter', passwordStrength.color]">
            보안도: {{ passwordStrength.label }}
          </span>
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">주민번호</label>
          
          <div class="flex items-center gap-2">
            <input
              v-model="signupForm.nationalId1"
              @input="handleId1Input"
              maxlength="6"
              type="text" 
              placeholder="생년월일"
              class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm text-center tracking-widest"
            />
            
            <span class="text-slate-400 font-bold">-</span>
            
            <input
              ref="nationalId2Input"
              v-model="signupForm.nationalId2"
              @blur="nationalIdRules()"
              maxlength="7"
              type="password" 
              placeholder="뒤 7자리"
              class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm text-center tracking-widest"
            />
          </div>

          <p v-if="signupInputError.nationalId.errorMessage" class="text-red-500 text-xs mt-1 ml-1">
            {{ signupInputError.nationalId.errorMessage }}
          </p>
        </div>

        <button 
          type="submit" 
          :disabled="!isFormValid()" 
          :class="['w-full py-4 rounded-2xl font-bold transition shadow-lg text-white', isFormValid() ? 'bg-slate-900 hover:bg-slate-800' : 'bg-slate-300 cursor-not-allowed']"
        >
          계정 생성
        </button>
            
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
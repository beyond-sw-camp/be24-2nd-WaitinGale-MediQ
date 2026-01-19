<script setup>
import { reactive } from 'vue'
// import api from '@/api/user'
import { useRouter } from 'vue-router'

const router = useRouter()
const signupForm = reactive({
  name: '',
  email: '',
  password: '',
  nationalId: '',
})

const signup = async () => {
  if (!signupForm.email || !signupForm.password) {
    signupInputError.password.errorMessage = '모든 항목을 입력하세요.'
    signupInputError.password.isValid = false
    return
  }

  const hasUpperLetter = /[A-Z]/.test(signupForm.password)
  const hasLowerLetter = /[a-z]/.test(signupForm.password)
  const hasNumber = /[0-9]/.test(signupForm.password)
  const hasSpecial = /[!@$]/.test(signupForm.password)

  if (!(hasUpperLetter && hasLowerLetter && hasNumber && hasSpecial)) {
    signupInputError.password.errorMessage =
    '비밀번호는 영문 대소문자, 숫자, 특수문자(!@$)를 모두 포함하여야 합니다.'
    signupInputError.password.isVaild = false
    return
  }

  try {
    const res = await api.signup(signupForm)
    if (res.status === 200) {
      router.push('/login')
    }
  } catch (err) {
    console.error(err)
  }
}



//const signup = async () => {
//  const res = await api.signup(signupForm)
//  console.log('Signup.vue에서 res 변수 : ', res)

//  if (res.status == 200) {
//    router.push({ name: 'login' })
//  }
//}
</script>

<template>
    <div class="bg-slate-50 flex items-center justify-center min-h-screen py-10">
    <div class="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl shadow-slate-200">
        <div class="flex items-center gap-3 mb-8">
            <RouterLink to="/login" class="text-slate-400 hover:text-slate-600"><i class="fa-solid fa-arrow-left"></i></RouterLink>
            <h1 class="text-2xl font-bold">회원가입</h1>
        </div>


      <form novalidate @submit.prevent="signup" class="space-y-5 mb-10">


        <div>
          <label for="name" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">이름</label>
          <input
            @blur=""
            v-model="signupForm.name"
            type="email"
            id="name"
            placeholder="실명을 입력해주세요"
            class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm"
          />
        </div>

        <div>
          <label for="email" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">이메일</label>
          <input
            @blur=""
            v-model="signupForm.email"
            type="text"
            id="email"
            placeholder="example@gmail.com"
            class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm"
          />
        </div>

        <div>
          <label for="password" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">비밀번호</label>
          <input
            v-model="signupForm.password"
            type="password"
            id="password"
            placeholder="8자 이상, 영문/숫자 조합"
            class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm"
          />
        </div>

        <div>
          <label for="nationalId" class="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">주민번호</label>
          <input
            @blur=""
            v-model="signupForm.nationalId"
            type="password"
            id="nationalId"
            placeholder="000000-0000000"
            class="bg-slate-50 w-full rounded-2xl px-4 py-3 border border-slate-100 outline-none text-sm"
          />
        </div>
            <button type="submit" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg">계정 생성</button>
        </form>
    </div>
</div>
</template>

<style scoped>

</style>
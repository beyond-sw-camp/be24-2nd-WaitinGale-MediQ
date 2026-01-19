import api from '@/plugins/axiosinterceptor'

const login = async (req) => {
  const res = await api.post('/user/login', req)

  return res
}

const signup = async (req) => {
  const res = await api.post('/user/join', req)

  return res
}

const profile = async (req) => {
  // 보안상 안전하지 않은 방식이라 실무에서는 절대 사용 안함
  // const token = localStorage.getItem('ATOKEN')
  const res = await api.get('/user/profile', {
    withCredentials: true,
  })

  return res
}

export default { login, signup, profile }

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

const wsUri = 'ws://127.0.0.1:8080/ws/chat'
let websocket = null

const connected = ref(false)

const currentNickname = ref('')
const nicknameConfirmed = ref(false)

const hospital = reactive({
  id: 'hospital1',
  name: '서면 연세 청소년 소아과',
  queue: []
})

const AVG_MIN_PER_PERSON = 7 

function connectWebSocket() {
  websocket = new WebSocket(wsUri)

  websocket.onopen = () => (connected.value = true)
  websocket.onclose = () => (connected.value = false)

  websocket.onmessage = (e) => {
    try {
      const payload = JSON.parse(e.data).payload
      const data = JSON.parse(payload)
      handleQueueUpdate(data)
    } catch (err) {
      console.error(err)
    }
  }
}

function handleQueueUpdate({ action, nickname, queue }) {
  if (action === 'join') addToQueue(nickname)
  if (action === 'cancel') removeFromQueue(nickname)
  if (action === 'sync' && queue) {
    hospital.queue = queue
    updatePositions()
  }
}

function addToQueue(nickname) {
  if (hospital.queue.some(q => q.nickname === nickname)) return

  hospital.queue.push({
    nickname,
    timestamp: new Date().toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    position: hospital.queue.length + 1
  })
}

function removeFromQueue(nickname) {
  const idx = hospital.queue.findIndex(q => q.nickname === nickname)
  if (idx === -1) return
  hospital.queue.splice(idx, 1)
  updatePositions()
}

function updatePositions() {
  hospital.queue.forEach((q, i) => (q.position = i + 1))
}

const myQueue = computed(() =>
  hospital.queue.find(q => q.nickname === currentNickname.value)
)

const estimatedWaitTime = computed(() => {
  if (!myQueue.value) return 0
  return (myQueue.value.position - 1) * AVG_MIN_PER_PERSON
})

function joinQueue() {
  websocket.send(JSON.stringify({
    action: 'join',
    hospital: hospital.id,
    nickname: currentNickname.value
  }))
  addToQueue(currentNickname.value)
}

function cancelQueue() {
  if (!confirm('대기를 취소하시겠습니까?')) return
  websocket.send(JSON.stringify({
    action: 'cancel',
    hospital: hospital.id,
    nickname: currentNickname.value
  }))
  removeFromQueue(currentNickname.value)
}
function setNickname() {
  if (currentNickname.value.trim().length < 2) {
    alert('이름은 두 글자 이상 입력하세요')
    return
  }
  nicknameConfirmed.value = true
}
onMounted(connectWebSocket)
</script>

<template>
  <div class="page">

    <h1>병원 대기 현황</h1>

    <section class="card">
      
      <div class="row">
        <input
          v-model="currentNickname"
          :disabled="nicknameConfirmed"
          placeholder="이름 입력"
        />
        <button @click="setNickname" class="register-btn" :disabled="nicknameConfirmed">
          등록
        </button>
      </div>
    </section>

    <section class="card">
      <h2>{{ hospital.name }}</h2>
      <p class="count">현재 대기 {{ hospital.queue.length }}명</p>

      <div v-if="myQueue" class="my-box">
        <p>내 순번 <strong>{{ myQueue.position }}번</strong></p>
        <p>
          예상 대기시간
          <strong>{{ estimatedWaitTime }}분</strong>
        </p>
      </div>

      <button
        v-if="!myQueue"
        class="primary"
        :disabled="!nicknameConfirmed"
        @click="joinQueue"
      >
        대기 등록
      </button>

      <button
        v-else
        class="danger"
        @click="cancelQueue"
      >
        대기 취소
      </button>

      <ul class="queue">
        <li
          v-for="q in hospital.queue"
          :key="q.nickname"
          :class="{ me: q.nickname === currentNickname }"
        >
          <span>{{ q.position }}</span>
          <span>{{ q.nickname }}</span>
          <span>{{ q.timestamp }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #faf7f2; 
  padding: 24px;
  font-family: system-ui, -apple-system, 'Apple SD Gothic Neo', sans-serif;
  color: #374151;
}

h1 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 26px;
  color: #2f2f2f;
}

.card {
  background: #ffffff;
  border-radius: 16px;
  padding: 22px;
  margin-bottom: 22px;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
}

.card h2 {
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.count {
  font-size: 14px;
  color: #ea580c; 
  font-weight: 600;
}

.row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

input {
  flex: 1;
  padding: 11px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  font-size: 15px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #fb923c;
}

button {
  border: none;
  border-radius: 12px;
  padding: 11px 18px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-btn {
  background: linear-gradient(135deg, #fb923c, #f97316);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(249, 115, 22, 0.35);
}

.register-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(249, 115, 22, 0.45);
}

.register-btn:disabled {
  background: #fed7aa;
  color: #9a3412;
  box-shadow: none;
  cursor: not-allowed;
}

.primary {
  width: 100%;
  margin-top: 14px;
  background: linear-gradient(135deg, #34d399, #10b981);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
}

.primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(16, 185, 129, 0.45);
}

.danger {
  width: 100%;
  margin-top: 14px;
  background: #f87171;
  color: #ffffff;
}

.danger:hover {
  background: #ef4444;
}

.my-box {
  background: #fff7ed;
  border-left: 5px solid #fb923c;
  border-radius: 12px;
  padding: 14px;
  margin: 14px 0;
}

.my-box strong {
  color: #ea580c;
}

.queue {
  margin-top: 16px;
}

.queue li {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fef3c7;
  margin-bottom: 8px;
  font-size: 14px;
}

.queue li.me {
  background: #dcfce7;
  font-weight: 700;
}

.status {
  position: fixed;
  top: 16px;
  right: 16px;
  font-size: 14px;
  font-weight: 700;
}

.status.on {
  color: #16a34a;
}

.status.off {
  color: #dc2626;
}
</style>


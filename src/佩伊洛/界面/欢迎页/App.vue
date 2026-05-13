<template>
  <div class="welcome-page">
    <div class="welcome-card">
      <div class="accent-bar" />

      <div class="card-inner">
        <h1 class="title fade-in">澜景市 · 三月的相遇</h1>
        <p class="subtitle fade-in d1">现代都市 · 樱花季 · 日系校园</p>

        <div class="divider fade-in d2">
          <span class="dot" />
        </div>

        <div class="intro-block fade-in d3">
          <p>
            三月的澜景市，樱花沿着清江两岸次第绽放，映湖区的住宅街安静得只听见远处电车的鸣笛。晨光洒落在石阶上，空气里混着淡淡的花香与面包房的黄油味——又一个平凡而温柔的早晨。
          </p>
        </div>

        <div class="char-block fade-in d4">
          <p>
            住在对门的白发少女，红色的眼瞳里总映着一点倦意与温柔。她会在每个清晨按响你家的门铃，递上还带着温度的面包，然后假装若无其事地说「只是刚好多出来了」。
          </p>
        </div>

        <div class="tag-row fade-in d5">
          <span class="tag">青梅竹马</span>
          <span class="tag">galgame 体验</span>
          <span class="tag">主线事件系统</span>
          <span class="tag">MVU 变量追踪</span>
        </div>

        <div class="btn-row fade-in d6">
          <button class="btn-start" :disabled="starting" @click="handleStart">
            {{ starting ? '加载中…' : '▶ 开始' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const starting = ref(false);

async function handleStart() {
  if (starting.value) return;
  starting.value = true;
  try {
    await setChatMessages([{ message_id: 0, swipe_id: 1 }]);
  } catch {
    starting.value = false;
  }
}
</script>

<style scoped>
.welcome-page {
  max-width: 640px;
  margin: 0 auto;
  padding: 16px;
  font-family: 'Noto Sans SC', sans-serif;
  color: #2c3e50;
  line-height: 1.7;
}

.welcome-card {
  position: relative;
  background: #fefefe;
  border: 1px solid #e8e8e8;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.accent-bar {
  height: 3px;
  background: linear-gradient(90deg, #ffb6c1, #87ceeb);
}

.card-inner {
  padding: 32px 24px;
  text-align: center;
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 13px;
  color: #999;
  letter-spacing: 2px;
}

.divider {
  margin: 20px auto;
  width: 120px;
  height: 1px;
  background: #eee;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffb6c1;
}

.intro-block,
.char-block {
  text-align: left;
  font-size: 14px;
  color: #555;
  margin: 16px 0;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin: 20px 0;
}

.tag {
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  background: #f8f0f4;
  color: #c06;
  border: 1px solid #f0d0e0;
}

.btn-row {
  margin-top: 24px;
}

.btn-start {
  padding: 10px 32px;
  font-size: 15px;
  border: none;
  border-radius: 24px;
  background: linear-gradient(135deg, #ffb6c1, #ff8fa3);
  color: #fff;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.btn-start:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 143, 163, 0.4);
}

.btn-start:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Fade-in animations */
.fade-in {
  opacity: 0;
  transform: translateY(12px);
  animation: fadeUp 0.5s ease forwards;
}

.d1 {
  animation-delay: 0.1s;
}
.d2 {
  animation-delay: 0.2s;
}
.d3 {
  animation-delay: 0.3s;
}
.d4 {
  animation-delay: 0.4s;
}
.d5 {
  animation-delay: 0.5s;
}
.d6 {
  animation-delay: 0.6s;
}

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

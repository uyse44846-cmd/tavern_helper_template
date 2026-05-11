<template>
  <div class="welcome-page">
    <div class="welcome-card">
      <div class="accent-bar" />

      <div class="petal-field" aria-hidden="true">
        <span v-for="i in 6" :key="i" class="petal" :class="`petal--${i}`" />
      </div>

      <div class="card-inner">
        <h1 ref="titleRef" class="title">澜景市 · 三月的相遇</h1>

        <p ref="subtitleRef" class="subtitle">现代都市 · 樱花季 · 日系校园</p>

        <svg ref="dividerRef" class="divider" viewBox="0 0 200 12" fill="none">
          <path
            d="M0 6 Q40 0 60 6 T100 6 T140 6 T200 6"
            stroke="var(--c-sakura-light)"
            stroke-width="1.2"
            stroke-linecap="round"
          />
          <circle cx="100" cy="6" r="2.5" fill="var(--c-sakura)" />
        </svg>

        <div ref="introRef" class="intro-block">
          <p>
            三月的澜景市，樱花沿着清江两岸次第绽放，映湖区的住宅街安静得只听见远处电车的鸣笛。晨光洒落在石阶上，空气里混着淡淡的花香与面包房的黄油味——又一个平凡而温柔的早晨。
          </p>
        </div>

        <div ref="charRef" class="char-block">
          <div class="char-icon">
            <i class="fa-solid fa-heart" />
          </div>
          <p>
            住在对门的白发少女，红色的眼瞳里总映着一点倦意与温柔。她会在每个清晨按响你家的门铃，递上还带着温度的面包，然后假装若无其事地说「只是刚好多出来了」。
          </p>
          <p class="char-block__closing">
            十六岁的春天，有些话还说不出口——但她的指尖，从来不会说谎。
          </p>
        </div>

        <div ref="tagsRef" class="tag-row">
          <span class="tag tag--sakura">青梅竹马</span>
          <span class="tag tag--accent">galgame 体验</span>
          <span class="tag tag--sakura">主线事件系统</span>
          <span class="tag tag--accent">Vue 立绘界面</span>
          <span class="tag tag--sakura">MVU 变量追踪</span>
        </div>

        <div ref="btnRef" class="btn-row">
          <button class="btn-start" :disabled="starting" @click="handleStart">
            <i class="fa-solid" :class="starting ? 'fa-spinner fa-spin' : 'fa-play'" />
            <span>{{ starting ? '加载中…' : '开始' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';

const titleRef = ref<HTMLElement>();
const subtitleRef = ref<HTMLElement>();
const dividerRef = ref<SVGElement>();
const introRef = ref<HTMLElement>();
const charRef = ref<HTMLElement>();
const tagsRef = ref<HTMLElement>();
const btnRef = ref<HTMLElement>();
const starting = ref(false);

onMounted(() => {
  const targets = [
    titleRef.value,
    subtitleRef.value,
    dividerRef.value,
    introRef.value,
    charRef.value,
    tagsRef.value,
    btnRef.value,
  ].filter(Boolean);

  gsap.set(targets, { opacity: 0, y: 14 });

  gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.12,
    delay: 0.15,
  });
});

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

<style lang="scss" scoped>
.welcome-page {
  max-width: 640px;
  margin: 0 auto;
  padding: clamp(8px, 2vw, 16px);
  font-family: var(--font-main);
  color: var(--c-text);
  line-height: 1.7;
}

.welcome-card {
  position: relative;
  background: var(--c-cloud);
  border: 1px solid var(--c-border);
  border-radius: 18px;
  box-shadow:
    0 6px 28px rgba(44, 62, 80, 0.07),
    0 1.5px 6px rgba(107, 178, 224, 0.08);
  overflow: hidden;
}

.accent-bar {
  height: 3px;
  background: linear-gradient(90deg, var(--c-sakura), var(--c-accent), var(--c-sakura));
  opacity: 0.75;
}

// --- floating petals ---
.petal-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.petal {
  position: absolute;
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50% 0 50% 50%;
  background: var(--c-sakura-light);
  opacity: 0;
  animation: petal-drift 9s ease-in-out infinite;

  &--1 { top: -6%; left: 12%; animation-delay: 0s; }
  &--2 { top: -6%; left: 38%; animation-delay: 1.6s; width: 6px; height: 6px; }
  &--3 { top: -6%; left: 62%; animation-delay: 3.2s; }
  &--4 { top: -6%; left: 82%; animation-delay: 4.8s; width: 7px; height: 7px; }
  &--5 { top: -6%; left: 25%; animation-delay: 6.0s; width: 5px; height: 5px; }
  &--6 { top: -6%; left: 55%; animation-delay: 7.5s; width: 6px; height: 6px; }
}

@keyframes petal-drift {
  0% {
    opacity: 0;
    transform: translateY(0) translateX(0) rotate(0deg);
  }
  10% { opacity: 0.55; }
  90% { opacity: 0.35; }
  100% {
    opacity: 0;
    transform: translateY(420px) translateX(30px) rotate(180deg);
  }
}

// --- content ---
.card-inner {
  position: relative;
  padding: clamp(20px, 5vw, 36px) clamp(16px, 4vw, 32px);
}

.title {
  font-size: clamp(20px, 5vw, 28px);
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
  color: var(--c-text);
}

.subtitle {
  font-size: clamp(12px, 2.8vw, 15px);
  color: var(--c-sakura-dark);
  text-align: center;
  letter-spacing: 3px;
  margin-top: clamp(4px, 1vw, 8px);
}

.divider {
  display: block;
  width: clamp(140px, 50%, 240px);
  margin: clamp(12px, 3vw, 20px) auto;
}

.intro-block {
  background: linear-gradient(135deg, rgba(246, 168, 195, 0.06), rgba(107, 178, 224, 0.05));
  border-left: 3px solid var(--c-sakura);
  border-radius: 0 10px 10px 0;
  padding: clamp(12px, 3vw, 18px) clamp(14px, 3.5vw, 22px);
  font-size: clamp(12px, 2.6vw, 14px);
  color: var(--c-text-sub);
  line-height: 1.9;
}

.char-block {
  margin-top: clamp(14px, 3.5vw, 22px);
  padding: clamp(14px, 3.5vw, 20px);
  background: linear-gradient(135deg, rgba(107, 178, 224, 0.05), rgba(246, 168, 195, 0.04));
  border-radius: 12px;
  border: 1px solid rgba(144, 205, 244, 0.2);
  font-size: clamp(12px, 2.6vw, 14px);
  color: var(--c-text-sub);
  line-height: 1.9;

  &__closing {
    margin-top: clamp(6px, 1.5vw, 10px);
    color: var(--c-sakura-dark);
    font-style: italic;
  }
}

.char-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--c-sakura-light), var(--c-blush));
  margin-bottom: clamp(6px, 1.5vw, 10px);
  font-size: 12px;
  color: var(--c-sakura-dark);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(6px, 1.5vw, 8px);
  justify-content: center;
  margin-top: clamp(16px, 4vw, 24px);
}

.tag {
  display: inline-block;
  padding: 3px clamp(10px, 2.5vw, 14px);
  font-size: clamp(10px, 2.2vw, 12px);
  border-radius: 12px;
  letter-spacing: 0.5px;
  user-select: none;

  &--sakura {
    background: rgba(246, 168, 195, 0.12);
    color: var(--c-sakura-dark);
    border: 1px solid rgba(246, 168, 195, 0.3);
  }

  &--accent {
    background: rgba(107, 178, 224, 0.1);
    color: var(--c-accent-dark);
    border: 1px solid rgba(107, 178, 224, 0.25);
  }
}

.btn-row {
  display: flex;
  justify-content: center;
  margin-top: clamp(20px, 5vw, 32px);
}

.btn-start {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: clamp(10px, 2.5vw, 13px) clamp(28px, 7vw, 40px);
  font-size: clamp(13px, 3vw, 16px);
  font-family: var(--font-main);
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, var(--c-sakura), var(--c-accent));
  border: none;
  border-radius: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(107, 178, 224, 0.3);
  transition: box-shadow 0.25s, transform 0.2s, opacity 0.2s;
  min-height: 44px;
  touch-action: manipulation;
  user-select: none;

  &:hover:not(:disabled) {
    box-shadow: 0 6px 22px rgba(107, 178, 224, 0.45);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 3px 12px rgba(107, 178, 224, 0.25);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  i {
    font-size: 0.85em;
  }
}

@media (max-width: 420px) {
  .tag-row {
    gap: 5px;
  }

  .tag {
    padding: 2px 8px;
  }
}
</style>

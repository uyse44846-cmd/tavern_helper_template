<template>
  <div class="portrait-card">
    <div class="status-bar">
      <span class="status-item">
        <i class="fa-solid fa-calendar-day"></i>
        {{ store.data.世界.当前日期 }}
      </span>
      <span class="status-item">
        <i class="fa-solid fa-clock"></i>
        {{ store.data.世界.当前时间 }}
      </span>
      <span class="status-item">
        <i class="fa-solid fa-cloud-sun"></i>
        {{ store.data.世界.当前天气 }}
      </span>
      <span class="status-item">
        <i class="fa-solid fa-location-dot"></i>
        {{ store.data.世界.当前地点 }}
      </span>
    </div>

    <div class="scene-container">
      <img
        v-if="backgroundUrl"
        :src="backgroundUrl"
        class="bg-image"
        @error="bgLoadFailed = true"
      />
      <div v-else class="bg-gradient" />

      <img
        v-if="portraitUrl"
        :src="portraitUrl"
        class="portrait-image"
      />
    </div>

    <div v-if="store.data.主线事件.当前状态 === '进行中'" class="event-bar">
      <i class="fa-solid fa-bolt"></i>
      {{ store.data.主线事件.主题 }} — {{ store.data.主线事件.描述 }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBackgroundUrl, getPortraitUrl } from '../../imageMapping';
import { useDataStore } from './store';

const store = useDataStore();
const bgLoadFailed = ref(false);

const portraitUrl = computed(() =>
  getPortraitUrl(store.data.佩伊洛.当前服装, store.data.佩伊洛.当前表情),
);

const backgroundUrl = computed(() => {
  if (bgLoadFailed.value) return null;
  return getBackgroundUrl(store.data.世界.当前地点, store.data.世界.时间阶段);
});
</script>

<style lang="scss" scoped>
.portrait-card {
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  font-family: var(--font-main);
  color: var(--c-text);
  font-size: 13px;
  overflow: hidden;
  border-radius: 12px;
}

.status-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 12px;
  background: var(--c-frost);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(144, 205, 244, 0.3);
}

.status-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--c-text);

  i {
    color: var(--c-accent);
    font-size: 11px;
  }
}

.scene-container {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--c-sky) 0%, var(--c-blush) 100%);
}

.portrait-image {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-height: 95%;
  max-width: 90%;
  object-fit: contain;
}

.event-bar {
  padding: 6px 12px;
  background: var(--c-frost);
  backdrop-filter: blur(12px);
  font-size: 12px;
  color: var(--c-text-sub);
  border-top: 1px solid rgba(144, 205, 244, 0.3);

  i {
    color: var(--c-accent);
    margin-right: 4px;
  }
}

@media (max-width: 480px) {
  .status-bar {
    gap: 4px;
    padding: 6px 8px;
  }

  .status-item {
    font-size: 11px;
  }

  .scene-container {
    aspect-ratio: 9 / 16;
  }
}
</style>

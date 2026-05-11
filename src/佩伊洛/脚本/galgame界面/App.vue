<template>
  <div class="galgame-root">
    <img v-if="backgroundUrl" :src="backgroundUrl" class="bg-layer" />
    <div v-else class="bg-fallback" />

    <img v-if="portraitUrl" :src="portraitUrl" class="portrait-layer" />

    <div class="status-bar">
      <span>{{ location }}</span>
      <span>{{ time }}</span>
      <span>{{ weather }}</span>
    </div>

    <div v-if="showTextBox && displayHtml" class="text-box" @click.self="showTextBox = false">
      <div class="text-content" v-html="displayHtml" />
      <div v-if="context.during_streaming" class="streaming-indicator" />
    </div>

    <button v-if="!showTextBox && displayHtml" class="toggle-btn" @click="showTextBox = true">
      <i class="fa-solid fa-comment" />
    </button>

    <div v-if="eventText" class="event-badge">
      <i class="fa-solid fa-bolt" />
      {{ eventText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectStreamingMessageContext } from '@util/streaming';
import { getBackgroundUrl, getPortraitUrl } from '../../imageMapping';

const context = injectStreamingMessageContext();
const showTextBox = ref(true);

function getPrevAiMvuData() {
  for (let i = context.message_id - 1; i >= 0; i--) {
    const msg = SillyTavern.chat[i];
    if (msg && !msg.is_user && !msg.is_system) {
      try {
        return Mvu.getMvuData({ type: 'message', message_id: i });
      } catch {
        return null;
      }
    }
  }
  return null;
}

function getCurrentMvuData() {
  try {
    return Mvu.getMvuData({ type: 'message', message_id: context.message_id });
  } catch {
    return null;
  }
}

const mvuData = computed(() => {
  if (context.during_streaming) {
    return getPrevAiMvuData();
  }
  return getCurrentMvuData() ?? getPrevAiMvuData();
});

const portraitUrl = computed(() => {
  const outfit = mvuData.value?.佩伊洛?.当前服装 ?? '校服';
  const expr = mvuData.value?.佩伊洛?.当前表情 ?? '微笑';
  return getPortraitUrl(outfit, expr);
});

const backgroundUrl = computed(() => {
  const loc = mvuData.value?.世界?.当前地点 ?? '';
  const time = mvuData.value?.世界?.时间阶段 ?? '白天';
  return getBackgroundUrl(loc, time);
});

const location = computed(() => mvuData.value?.世界?.当前地点 ?? '');
const time = computed(() => mvuData.value?.世界?.当前时间 ?? '');
const weather = computed(() => mvuData.value?.世界?.当前天气 ?? '');

const eventText = computed(() => {
  const evt = mvuData.value?.主线事件;
  if (evt?.当前状态 === '进行中' && evt.主题) {
    return `${evt.主题} — ${evt.描述 || ''}`;
  }
  return '';
});

const cleanedMessage = computed(() => {
  let text = context.message;
  text = text.replace(/<StatusPlaceHolderImpl\s*\/>/gi, '');
  text = text.replace(/<update(?:variable)?>\s*[\s\S]*?<\/update(?:variable)?>/gi, '');
  text = text.replace(/<update(?:variable)?>\s*[\s\S]*$/gi, '');
  return text.trim();
});

const displayHtml = computed(() => {
  if (!cleanedMessage.value) return '';
  return formatAsDisplayedMessage(cleanedMessage.value, { message_id: context.message_id });
});
</script>

<style lang="scss" scoped>
.galgame-root {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  background: #1a1a2e;
}

.bg-layer {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bg-fallback {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #e8f4fd 0%, #ffe4ec 100%);
}

.portrait-layer {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  max-height: 90%;
  max-width: 60%;
  object-fit: contain;
  z-index: 1;
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 12px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  z-index: 2;
}

.text-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 40%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(144, 205, 244, 0.4);
  z-index: 3;
  overflow-y: auto;
  cursor: default;
}

.text-content {
  font-size: 14px;
  line-height: 1.7;
  color: #2d3748;

  :deep(p) {
    margin-bottom: 0.5em;
  }
}

.streaming-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #90cdf4;
  border-radius: 50%;
  animation: pulse 1s infinite;
  margin-left: 4px;
  vertical-align: middle;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.toggle-btn {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(8px);
  color: #4a5568;
  font-size: 16px;
  cursor: pointer;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
  }
}

.event-badge {
  position: absolute;
  top: 28px;
  right: 8px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  color: rgba(255, 255, 255, 0.85);
  font-size: 11px;
  border-radius: 4px;
  z-index: 2;

  i {
    color: #90cdf4;
    margin-right: 4px;
  }
}

@media (max-width: 480px) {
  .galgame-root {
    aspect-ratio: 9 / 16;
  }

  .portrait-layer {
    max-width: 80%;
  }

  .text-box {
    max-height: 50%;
    padding: 12px 14px;
  }

  .text-content {
    font-size: 13px;
  }
}
</style>

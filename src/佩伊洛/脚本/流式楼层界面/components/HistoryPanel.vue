<template>
  <div class="history-panel" @click.stop>
    <div class="history-header">
      <span class="history-icon">✦</span>
      <h3 class="history-title">𝓛𝓸𝓰</h3>
      <button type="button" class="history-close" aria-label="关闭日志" @click.stop="store.history_opened = false">
        ⊗
      </button>
    </div>

    <div ref="content" class="history-content">
      <div v-if="store.history_dialogs.length === 0" class="history-empty">暂无对话历史</div>

      <div v-for="(dialog, index) in store.history_dialogs" :key="index" class="history-item">
        <div v-if="dialog.speaker" class="history-speaker">
          <span class="history-dot">●</span>
          <span>{{ dialog.speaker }}</span>
        </div>
        <div class="history-speech">{{ dialog.speech }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGalgameStore } from '../store';

const store = useGalgameStore();
const content_ref = useTemplateRef('content');

// 打开时自动滚到底部
onMounted(() => {
  if (content_ref.value) {
    content_ref.value.scrollTop = content_ref.value.scrollHeight;
  }
});

watch(
  () => store.history_dialogs.length,
  async () => {
    await nextTick();
    if (content_ref.value) {
      content_ref.value.scrollTop = content_ref.value.scrollHeight;
    }
  },
);
</script>

<style scoped>
.history-panel {
  position: absolute;
  top: 5%;
  left: 5%;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 90%;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, rgba(254, 252, 250, 0.97), rgba(248, 232, 235, 0.97));
  box-shadow:
    0 12px 36px rgba(112, 80, 95, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: linear-gradient(to right, rgba(212, 97, 111, 0.85) 0%, rgba(91, 136, 168, 0.85) 100%);
  color: #fefcfa;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

.history-icon {
  font-size: 18px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.history-title {
  flex: 1;
  margin: 0 12px;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.12em;
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
}

.history-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  opacity: 0.85;
  transition: all 0.2s ease;
  font-family: inherit;
}
.history-close:hover {
  transform: scale(1.1);
  opacity: 1;
}

.history-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  color: #3d2b35;
}

.history-empty {
  text-align: center;
  padding: 30px 0;
  color: #8a7f85;
  font-size: 14px;
}

.history-item {
  margin-bottom: 14px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 10px;
  border-left: 3px solid rgba(212, 97, 111, 0.4);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  transition: transform 0.2s ease;
}
.history-item:hover {
  transform: translateX(2px);
}

.history-speaker {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-weight: 700;
  color: #b54858;
  font-size: 14px;
  letter-spacing: 0.04em;
}

.history-dot {
  color: #d4616f;
  font-size: 10px;
  text-shadow: 0 0 6px rgba(212, 97, 111, 0.4);
}

.history-speech {
  font-size: 14px;
  line-height: 1.65;
  color: #3d2b35;
  letter-spacing: 0.02em;
  overflow-wrap: anywhere;
}
</style>

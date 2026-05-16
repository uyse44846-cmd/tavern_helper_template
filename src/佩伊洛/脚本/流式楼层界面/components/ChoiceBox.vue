<template>
  <Transition name="choice-fade" appear>
    <div v-if="store.options.length > 0" class="choice-overlay" @click.stop>
      <div class="choice-list">
        <button
          v-for="(option, index) in store.options"
          :key="`${index}-${option}`"
          type="button"
          class="choice-item"
          @click.stop="() => onSelect(option)"
        >
          <span class="choice-title">◆ 选项 {{ index + 1 }}</span>
          <span class="choice-content">{{ option }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { injectStreamingMessageContext } from '@util/streaming';
import { useGalgameStore } from '../store';

const context = injectStreamingMessageContext();
const store = useGalgameStore();

/**
 * 点击选项 → 调用 SillyTavern 内置斜杠命令 /setinput，
 * 将选项内容填入酒馆输入框（#send_textarea），不自动发送。
 * 与现有 sprite 选择框（内嵌选择框标签.txt 中的 fillInput）行为一致。
 */
function onSelect(option: string) {
  // 仅在最后一条消息上响应选择，避免历史消息点击导致状态混乱
  if (context.message_id !== getLastMessageId()) {
    return;
  }
  triggerSlash(`/setinput ${option}`);
}
</script>

<style scoped>
.choice-overlay {
  position: absolute;
  inset: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8%;
  /* 略微变暗背景，让选择框更突出 */
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(1px);
  -webkit-backdrop-filter: blur(1px);
}

.choice-list {
  width: 100%;
  max-width: 580px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.choice-item {
  position: relative;
  background: rgba(254, 252, 250, 0.94);
  border: 1px solid rgba(212, 97, 111, 0.2);
  border-radius: 14px;
  padding: 14px 20px 14px 32px;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: #3d2b35;
  letter-spacing: 0.04em;
  font-weight: 500;
  line-height: 1.55;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(8px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-family: inherit;
}

/* 左侧红蓝渐变线 */
.choice-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, #d4616f, #5b88a8);
  border-radius: 14px 0 0 14px;
}
/* 红色发光圆点（红瞳意象） */
.choice-item::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d4616f;
  box-shadow: 0 0 8px rgba(212, 97, 111, 0.5);
}

.choice-item:hover {
  transform: translateY(-3px);
  background: rgba(254, 252, 250, 1);
  border-color: rgba(212, 97, 111, 0.6);
  box-shadow: 0 10px 28px rgba(212, 97, 111, 0.2);
}
.choice-item:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(212, 97, 111, 0.15);
}

.choice-title {
  font-size: 12px;
  color: #b54858;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.choice-content {
  color: #3d2b35;
}

/* 进出动画 */
.choice-fade-enter-active,
.choice-fade-leave-active {
  transition:
    opacity 280ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 280ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.choice-fade-enter-from,
.choice-fade-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.985);
}
.choice-fade-enter-to,
.choice-fade-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .choice-fade-enter-active,
  .choice-fade-leave-active {
    transition: none;
  }
}
</style>

<template>
  <div class="galgame-root" @click="handleAdvance">
    <div class="galgame-frame">
      <!-- 顶部标题栏 -->
      <div class="galgame-titlebar">
        <span class="title-ornament">✦</span>
        <span class="title-text">𝓟𝓮𝔂𝓻𝓸 · 佩&nbsp;伊&nbsp;洛</span>
        <span class="title-ornament">✦</span>
      </div>

      <div class="galgame-stage">
        <!-- 场景：背景 + 立绘 -->
        <SceneStage />

        <!-- 装饰元素：蝴蝶 + 雪花 -->
        <div class="decor decor-butterfly" aria-hidden="true">🦋</div>
        <div class="decor decor-snowflake" aria-hidden="true">❄</div>

        <!-- 控制栏 -->
        <ControlBar />

        <!-- 选择框（galgame 播放完毕后显示） -->
        <ChoiceBox v-if="store.has_ended" />

        <!-- 对话框 -->
        <DialogBox v-show="store.dialog_opened" ref="dialog_box" />

        <!-- 历史日志面板 -->
        <template v-if="store.history_opened">
          <div class="history-mask" @click.stop="store.history_opened = false" />
          <HistoryPanel />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { injectStreamingMessageContext } from '@util/streaming';

import ChoiceBox from './components/ChoiceBox.vue';
import ControlBar from './components/ControlBar.vue';
import DialogBox from './components/DialogBox.vue';
import HistoryPanel from './components/HistoryPanel.vue';
import SceneStage from './components/SceneStage.vue';

import { useGalgameStore } from './store';

const context = injectStreamingMessageContext();
const dialog_box_ref = useTemplateRef('dialog_box');
const store = useGalgameStore();

// 双向同步：流式状态 + 消息内容
watchImmediate(
  () => context.during_streaming,
  new_during_streaming => {
    store.during_streaming = new_during_streaming;
  },
);

watchImmediate(
  () => context.message,
  new_message => {
    store.loadMessage(new_message);
  },
);

/**
 * 容器点击处理：
 *   - 历史面板打开 / 已结束 → 不响应
 *   - 正在打字 → 立即跳过打字
 *   - 否则 → 推进到下一句
 */
function handleAdvance() {
  if (store.history_opened || store.has_ended) return;

  if (dialog_box_ref.value?.is_typing) {
    dialog_box_ref.value.stopTyping();
    return;
  }
  store.advance();
}
</script>

<style scoped>
.galgame-root {
  width: 100%;
  margin: 0 auto;
  user-select: none;
  cursor: pointer;
  max-width: 1200px;
}

.galgame-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 14px;
  overflow: hidden;
  background: #000;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(212, 97, 111, 0.15);
}

/* 窄屏切换为竖屏 */
@media (max-width: 768px) {
  .galgame-frame {
    aspect-ratio: 3 / 4;
  }
}

/* 顶部标题栏 */
.galgame-titlebar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 36px;
  z-index: 60;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: linear-gradient(to right, rgba(212, 97, 111, 0.85) 0%, rgba(91, 136, 168, 0.85) 100%);
  color: #fefcfa;
  font-size: 13px;
  letter-spacing: 0.18em;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.18);
}
.title-ornament {
  font-size: 16px;
  color: #fff;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
.title-text {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-style: italic;
}

/* 舞台区域：背景、立绘、对话框、选择框等都放在这里 */
.galgame-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* 装饰元素 */
.decor {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  opacity: 0.6;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.5);
}
.decor-butterfly {
  top: 64px;
  right: 28px;
  font-size: 24px;
  color: #5b88a8;
}
.decor-snowflake {
  bottom: 200px;
  left: 28px;
  font-size: 20px;
  color: #d4dfe8;
}

/* 历史面板背景蒙版 */
.history-mask {
  position: absolute;
  inset: 0;
  z-index: 900;
  background: rgba(0, 0, 0, 0.35);
  transition: opacity 0.2s ease;
}
</style>

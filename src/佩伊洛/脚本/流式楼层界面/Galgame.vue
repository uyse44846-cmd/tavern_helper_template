<template>
  <div class="galgame-root" @click="advance">
    <div class="galgame-bg" :style="{ backgroundImage: bgUrl }"></div>
    <img v-if="tachieUrl" :src="tachieUrl" class="galgame-tachie" />
    <div class="galgame-dialogue">
      <div v-if="current" class="galgame-speaker">{{ current.speaker }}</div>
      <div v-if="current" class="galgame-speech">{{ current.speech }}</div>
      <div class="galgame-progress">{{ idx + 1 }} / {{ chats.length }}</div>
    </div>
    <!-- 内嵌选择框：在最后一帧时显示 -->
    <div v-if="isLastFrame && options.length > 0" class="galgame-choices" @click.stop>
      <div v-for="(option, i) in options" :key="option.title" class="galgame-choice" @click="handleChoiceClick(option)">
        <span class="galgame-choice-num">{{ circleNums[i] || `${i + 1}` }}</span>
        <span class="galgame-choice-text">{{ option.content }}</span>
      </div>
    </div>
    <div v-else-if="idx < chats.length - 1" class="galgame-hint">点击继续</div>
  </div>
</template>

<script setup lang="ts">
import YAML from 'yaml';

const CDN = 'https://testingcf.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template@main/dist/佩伊洛';

interface Chat {
  speaker: string;
  speech: string;
  background: string;
  tachie?: string;
}

interface Option {
  title: string;
  content: string;
}

const props = defineProps<{ message: string }>();

const circleNums = ['①', '②', '③', '④', '⑤'];

const chats = ref<Chat[]>([]);
const idx = ref(0);

const options = ref<Option[]>(
  (() => {
    const text = props.message.match(/<roleplay_options>(.*?)<\/roleplay_options>/s)?.[1] ?? '';
    return [...text.matchAll(/(.+?)[:：]\s*(.+)/gm)].map(m => ({
      title: m[1],
      content: m[2].replace(/^\$\{(.+)\}$/, '$1').replace(/^「(.+)」$/, '$1'),
    }));
  })(),
);

onMounted(() => {
  const yaml = props.message.match(/<galgame>\s*```yaml\s*([\s\S]*?)```\s*<\/galgame>/)?.[1] ?? '';
  try {
    chats.value = YAML.parse(yaml) ?? [];
  } catch {
    chats.value = [];
  }
});

const current = computed(() => chats.value[idx.value]);
const isLastFrame = computed(() => idx.value >= chats.value.length - 1);
const bgUrl = computed(() => {
  if (!current.value?.background) return 'none';
  return `url(${CDN}/背景/${current.value.background})`;
});
const tachieUrl = computed(() => {
  if (!current.value?.tachie) return '';
  return `${CDN}/角色立绘/${current.value.tachie}`;
});

function advance() {
  if (idx.value < chats.value.length - 1) idx.value++;
}

async function handleChoiceClick(item: Option) {
  await createChatMessages([{ role: 'user', message: item.content }]);
  triggerSlash('/trigger');
}
</script>

<style scoped>
.galgame-root {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  border-radius: 8px;
  margin: 12px 0;
  cursor: pointer;
  user-select: none;
}
.galgame-bg {
  position: absolute;
  inset: 0;
  background: center/cover no-repeat #1a1a2e;
  transition: background-image 0.5s ease;
}
.galgame-tachie {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 85%;
  object-fit: contain;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.galgame-dialogue {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
  padding: 40px 24px 20px;
  min-height: 30%;
}
.galgame-speaker {
  font-size: 14px;
  font-weight: 600;
  color: #ffb6c1;
  margin-bottom: 6px;
}
.galgame-speech {
  font-size: 15px;
  line-height: 1.7;
  color: #f0f0f0;
}
.galgame-progress {
  position: absolute;
  top: 12px;
  right: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}
.galgame-hint {
  position: absolute;
  bottom: 8px;
  right: 16px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  animation: blink 1.5s infinite;
}

/* 内嵌选择框样式 - 方案A：清新粉蓝 */
.galgame-choices {
  position: absolute;
  bottom: 12px;
  left: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  cursor: default;
}
.galgame-choice {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 182, 193, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);
}
.galgame-choice:hover {
  background: rgba(255, 240, 245, 0.25);
  border-color: rgba(255, 182, 193, 0.5);
  transform: translateX(4px);
}
.galgame-choice:active {
  transform: translateX(2px);
}
.galgame-choice-num {
  color: #ffb6c1;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}
.galgame-choice-text {
  font-size: 13px;
  color: #f0f0f0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
</style>

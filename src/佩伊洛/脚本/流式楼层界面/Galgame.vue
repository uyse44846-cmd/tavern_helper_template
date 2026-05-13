<template>
  <div class="galgame-root" @click="advance">
    <div class="galgame-bg" :style="{ backgroundImage: bgUrl }"></div>
    <img v-if="tachieUrl" :src="tachieUrl" class="galgame-tachie" />
    <div class="galgame-dialogue">
      <div v-if="current" class="galgame-speaker">{{ current.speaker }}</div>
      <div v-if="current" class="galgame-speech">{{ current.speech }}</div>
      <div class="galgame-progress">{{ idx + 1 }} / {{ chats.length }}</div>
    </div>
    <div v-if="idx < chats.length - 1" class="galgame-hint">点击继续</div>
  </div>
</template>

<script setup lang="ts">
import YAML from 'yaml';

const CDN = 'https://testingcf.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template/dist/佩伊洛';

interface Chat {
  speaker: string;
  speech: string;
  background: string;
  tachie?: string;
}

const props = defineProps<{ message: string }>();

const chats = ref<Chat[]>([]);
const idx = ref(0);

onMounted(() => {
  const yaml = props.message.match(/<galgame>\s*```yaml\s*([\s\S]*?)```\s*<\/galgame>/)?.[1] ?? '';
  try {
    chats.value = YAML.parse(yaml) ?? [];
  } catch {
    chats.value = [];
  }
});

const current = computed(() => chats.value[idx.value]);
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

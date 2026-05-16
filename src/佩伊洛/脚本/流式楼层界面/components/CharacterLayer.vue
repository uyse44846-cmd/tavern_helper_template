<template>
  <template v-for="character in rendered_characters" :key="character.id">
    <img
      class="character-image"
      :class="{ 'character-not-speaking': !character.is_speaking }"
      :style="{ left: character.position }"
      :src="character.url"
      @error="onTachieError($event)"
    />
  </template>
</template>

<script setup lang="ts">
import { getTachieUrl } from '../image';
import { useGalgameStore } from '../store';

const store = useGalgameStore();

interface RenderedCharacter {
  id: string;
  url: string;
  position: string;
  is_speaking: boolean;
}

const rendered_characters = computed<RenderedCharacter[]>(() => {
  const characters = store.current_dialog?.characters ?? [];

  // 多角色按 (index+1)/(n+1) 比例分布，单角色居中
  return characters
    .map((character, index) => ({
      id: character.id,
      url: getTachieUrl(character.tachie),
      is_speaking: store.current_dialog?.speaker === character.id,
      position: `${Math.round(((index + 1) / (characters.length + 1)) * 100)}%`,
    }))
    .filter(character => character.url);
});

/** 立绘加载失败时直接隐藏，不影响整体显示 */
function onTachieError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
}
</script>

<style scoped>
.character-image {
  position: absolute;
  bottom: 0;
  height: 95%;
  max-height: 95%;
  width: auto;
  object-fit: contain;
  transform: translateX(-50%);
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.25));
  transition:
    opacity 0.5s ease,
    transform 0.5s ease,
    filter 0.5s ease,
    left 0.5s ease;
  pointer-events: none;
}

/* 非说话角色：略微暗化 */
.character-not-speaking {
  filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.25)) brightness(0.85) contrast(0.95);
}
</style>

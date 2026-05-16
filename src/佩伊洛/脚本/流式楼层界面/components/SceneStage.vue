<template>
  <div class="scene-stage">
    <Transition :name="store.current_index > 0 ? 'bg-fade' : 'bg-instant'">
      <img
        v-if="background_url"
        :key="background_id"
        :src="background_url"
        :class="['scene-bg', { 'scene-bg-cg': store.is_cg }]"
        @error="onBgError"
      />
    </Transition>

    <!-- CG 模式但图片加载失败时显示的兜底 -->
    <div v-if="bg_error && store.is_cg" class="scene-cg-fallback">
      <div class="scene-cg-fallback-inner">
        <div class="scene-cg-fallback-icon">✦</div>
        <div class="scene-cg-fallback-text">
          （CG 图片加载失败）<br />
          <span class="scene-cg-fallback-sub">{{ background_id }}</span>
        </div>
      </div>
    </div>

    <div class="scene-character-layer">
      <CharacterLayer v-if="!store.is_cg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getBackgroundUrl } from '../image';
import { useGalgameStore } from '../store';
// eslint-disable-next-line import-x/no-unresolved
import CharacterLayer from './CharacterLayer.vue';

const store = useGalgameStore();

const background_id = computed(() => store.current_dialog?.background ?? '');
const background_url = computed(() => getBackgroundUrl(background_id.value));

const bg_error = ref(false);
function onBgError() {
  bg_error.value = true;
}
watch(background_id, () => {
  bg_error.value = false;
});
</script>

<style scoped>
.scene-stage {
  position: absolute;
  inset: 0;
}

.scene-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* CG 模式：保持比例 */
.scene-bg-cg {
  object-fit: contain;
  background-color: #0a0610;
}

.scene-cg-fallback {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0610;
  z-index: 1;
}
.scene-cg-fallback-inner {
  text-align: center;
  color: #fefcfa;
  opacity: 0.6;
}
.scene-cg-fallback-icon {
  font-size: 48px;
  color: #d4616f;
  margin-bottom: 12px;
  text-shadow: 0 0 16px rgba(212, 97, 111, 0.5);
}
.scene-cg-fallback-text {
  font-size: 14px;
  letter-spacing: 0.1em;
}
.scene-cg-fallback-sub {
  font-size: 12px;
  opacity: 0.6;
  font-family: monospace;
}

.scene-character-layer {
  pointer-events: none;
  position: absolute;
  inset: 0;
}

/* 背景切换动画 */
.bg-instant-enter-active,
.bg-instant-leave-active {
  transition: none;
}
.bg-instant-enter-from,
.bg-instant-enter-to,
.bg-instant-leave-from,
.bg-instant-leave-to {
  opacity: 1;
}
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 1.2s ease-in-out;
}
.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}
.bg-fade-enter-to,
.bg-fade-leave-from {
  opacity: 1;
}
</style>

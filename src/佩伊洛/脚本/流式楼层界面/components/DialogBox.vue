<template>
  <div ref="box" class="dialog-box" :class="{ 'is-cg': store.is_cg }">
    <div class="dialog-inner">
      <!-- 发言人名字：旁白/独白时 speaker 为空字符串，使用透明占位维持布局 -->
      <div class="dialog-speaker" :style="{ visibility: store.current_dialog?.speaker ? 'visible' : 'hidden' }">
        {{ store.current_dialog?.speaker || '·' }}
      </div>
      <div class="dialog-divider" />

      <div ref="content" class="dialog-speech">
        {{ store.current_dialog?.speech }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useGalgameStore } from '../store';

const store = useGalgameStore();
const content_ref = useTemplateRef('content');

// ------ 打字效果 ------
gsap.registerPlugin(SplitText);
let split: SplitText | undefined;
let animation: gsap.core.Tween | undefined;
const is_typing = ref(false);

async function startTyping() {
  stopTyping();
  await nextTick();
  if (!content_ref.value) return;

  is_typing.value = true;
  split = SplitText.create(content_ref.value, { type: 'chars' });
  animation = gsap.from(split.chars, {
    opacity: 0,
    duration: 0.1,
    ease: 'power4',
    stagger: 0.04,
    onComplete: () => {
      is_typing.value = false;
    },
  });
}

function stopTyping() {
  is_typing.value = false;
  split?.revert();
  split?.kill();
  split = undefined;
  animation?.revert();
  animation?.kill();
  animation = undefined;
}

watch(() => store.current_index, startTyping);
onMounted(() => {
  startTyping();
});
onBeforeUnmount(() => {
  stopTyping();
});

// 暴露给 App.vue 用于点击时立即跳过打字
defineExpose({
  is_typing,
  stopTyping,
});
</script>

<style scoped>
.dialog-box {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  z-index: 30;
  padding-top: 60px;
  background: linear-gradient(
    to bottom,
    rgba(254, 252, 250, 0) 0px,
    rgba(254, 252, 250, 0.93) 60px,
    rgba(254, 252, 250, 0.95) 100%
  );
}

/* CG 模式：深色对话框 */
.dialog-box.is-cg {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0px, rgba(0, 0, 0, 0.75) 60px, rgba(0, 0, 0, 0.85) 100%);
}

.dialog-inner {
  padding: 0 8% 4%;
}

.dialog-speaker {
  font-size: 20px;
  font-weight: 700;
  color: #b54858;
  letter-spacing: 0.06em;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
  min-height: 1.5em;
}
.dialog-box.is-cg .dialog-speaker {
  color: #ffb0b8;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
}

.dialog-divider {
  height: 1px;
  background: linear-gradient(to right, rgba(212, 97, 111, 0.7) 0%, rgba(91, 136, 168, 0.7) 100%);
  margin-bottom: 10px;
}
.dialog-box.is-cg .dialog-divider {
  background: linear-gradient(to right, rgba(255, 176, 184, 0.5) 0%, rgba(178, 201, 222, 0.5) 100%);
}

.dialog-speech {
  font-size: 15px;
  line-height: 1.7;
  color: #3d2b35;
  letter-spacing: 0.02em;
  min-height: 3.4em;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.6);
  overflow-wrap: anywhere;
}
.dialog-box.is-cg .dialog-speech {
  color: #fefcfa;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
}
</style>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div v-if="transformed_message" v-html="html"></div>
</template>

<script setup lang="ts">
import { injectStreamingMessageContext } from '@util/streaming';

/**
 * 用于在 galgame 标签之外渲染原始正文。
 * 通过 transformer 提供"截取消息的哪部分"的逻辑：
 *   - 用于 galgame 标签前面的部分: msg => msg.slice(0, msg.lastIndexOf('<galgame>')).trim()
 *   - 用于 galgame 标签后面的部分: msg => 去除 </galgame> 之前的所有内容 + 去除 roleplay_options 段
 */
const props = defineProps<{ transformer: (message: string) => string }>();

const context = injectStreamingMessageContext();

const transformed_message = computed(() => props.transformer(context.message));

const html = computed(() =>
  formatAsDisplayedMessage(transformed_message.value, { message_id: context.message_id }).replaceAll(
    'mes_text',
    'mes_streaming',
  ),
);
</script>

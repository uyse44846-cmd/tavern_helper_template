<template>
  <div v-if="hasGalgame && !context.during_streaming">
    <Galgame :message="context.message" />
  </div>
  <div v-else-if="hasGalgame && context.during_streaming" class="mes_streaming" v-html="streamingHtml"></div>
</template>

<script setup lang="ts">
import { injectStreamingMessageContext } from '@util/streaming';
import Galgame from './Galgame.vue';

const context = injectStreamingMessageContext();

const hasGalgame = computed(() => /<galgame>/.test(context.message));

const streamingHtml = computed(() => {
  return formatAsDisplayedMessage(context.message, { message_id: context.message_id }).replaceAll(
    'mes_text',
    'mes_streaming',
  );
});
</script>

<template>
  <div v-if="hasGalgame && !context.during_streaming">
    <Galgame :message="context.message" />
  </div>
  <div v-else-if="hasGalgame && context.during_streaming" v-html="streamingHtml" class="mes_streaming"></div>
  <template v-else>
    <div v-if="beforeHtml" v-html="beforeHtml" class="mes_streaming"></div>
    <RoleplayOptions v-if="hasClosedOptions" :message="context.message" />
    <div v-else-if="hasOptions" v-html="optionsStreamingHtml" class="mes_streaming"></div>
    <div v-if="afterHtml" v-html="afterHtml" class="mes_streaming"></div>
  </template>
</template>

<script setup lang="ts">
import { injectStreamingMessageContext } from '@util/streaming';
import Galgame from './Galgame.vue';
import RoleplayOptions from './RoleplayOptions.vue';

const context = injectStreamingMessageContext();

const hasGalgame = computed(() => /<galgame>/.test(context.message));
const hasOptions = computed(() => /<roleplay_options>/.test(context.message));
const hasClosedOptions = computed(() => /<\/roleplay_options>/.test(context.message));

const beforeIndex = computed(() => context.message.lastIndexOf('<roleplay_options>'));
const afterIndex = computed(() => context.message.lastIndexOf('</roleplay_options>'));

const beforeHtml = computed(() => {
  if (!hasOptions.value) return null;
  const text = context.message.slice(0, beforeIndex.value).trim();
  if (!text) return null;
  return formatAsDisplayedMessage(text, { message_id: context.message_id }).replaceAll('mes_text', 'mes_streaming');
});

const afterHtml = computed(() => {
  if (afterIndex.value === -1) return null;
  const text = context.message.slice(afterIndex.value + 19).trim();
  if (!text) return null;
  return formatAsDisplayedMessage(text, { message_id: context.message_id }).replaceAll('mes_text', 'mes_streaming');
});

const streamingHtml = computed(() => {
  return formatAsDisplayedMessage(context.message, { message_id: context.message_id }).replaceAll('mes_text', 'mes_streaming');
});

const optionsStreamingHtml = computed(() => {
  return formatAsDisplayedMessage(context.message.slice(beforeIndex.value), { message_id: context.message_id }).replaceAll('mes_text', 'mes_streaming');
});
</script>

<template>
  <div class="roleplay_options">
    <div class="roleplay_options_back">
      <div
        v-for="option in options"
        :key="option.title"
        class="roleplay_options_item"
        tabindex="1"
        @click="handleClick(option)"
      >
        <span class="roleplay_options_title"
          ><strong>{{ option.title }}</strong></span
        >
        <hr class="roleplay_options_hr" />
        <span class="roleplay_options_content">{{ option.content }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ message: string }>();

interface Option {
  title: string;
  content: string;
}

const options = ref<Option[]>(
  (() => {
    const text = props.message.match(/<roleplay_options>(.*?)<\/roleplay_options>/s)?.[1] ?? '';
    return [...text.matchAll(/(.+?)[:：]\s*(.+)/gm)].map(m => ({
      title: m[1],
      content: m[2].replace(/^\$\{(.+)\}$/, '$1').replace(/^「(.+)」$/, '$1'),
    }));
  })(),
);

async function handleClick(item: Option) {
  await createChatMessages([{ role: 'user', message: item.content }]);
  triggerSlash('/trigger');
}
</script>

<style lang="scss" scoped>
.roleplay_options {
  &_back {
    background: linear-gradient(160deg, rgba(45, 45, 45, 0.75), rgba(35, 35, 35, 0.85));
    border-radius: 14px;
    box-shadow:
      0 10px 28px rgba(0, 0, 0, 0.15),
      0 3px 10px rgba(0, 0, 0, 0.12);
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid rgba(255, 255, 255, 0.06);
    margin: 20px 0;
  }
  &_title {
    font-size: 0.94em;
    font-weight: 600;
    color: #f0f0f0;
    margin-bottom: 4px;
  }
  &_content {
    font-size: 0.94em;
    line-height: 1.55;
    color: #c6c6c6;
  }
  &_hr {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    margin: 6px 0;
  }
  &_item {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      transform: translateY(-1px);
    }
    &:active {
      transform: translateY(0);
    }
  }
}
</style>

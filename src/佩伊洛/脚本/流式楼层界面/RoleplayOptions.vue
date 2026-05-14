<template>
  <div class="roleplay_options">
    <div class="roleplay_options_grid">
      <div
        v-for="(option, index) in options"
        :key="option.title"
        class="roleplay_options_block"
        :class="{ 'roleplay_options_block--full': isLastOdd(index) }"
        tabindex="1"
        @click="handleClick(option)"
      >
        <div class="roleplay_options_block_bar"></div>
        <div class="roleplay_options_block_content">
          <span class="roleplay_options_block_indicator">▸</span>
          <div class="roleplay_options_block_text">
            <strong class="roleplay_options_block_title">{{ option.title }}</strong>
            <span class="roleplay_options_block_desc">{{ option.content }}</span>
          </div>
        </div>
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

function isLastOdd(index: number): boolean {
  return options.value.length % 2 === 1 && index === options.value.length - 1;
}

async function handleClick(item: Option) {
  await createChatMessages([{ role: 'user', message: item.content }]);
  triggerSlash('/trigger');
}
</script>

<style lang="scss" scoped>
.roleplay_options {
  margin: 16px 0;

  &_grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  &_block {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    border: 1px solid #f0d0e0;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;

    &--full {
      grid-column: 1 / -1;
    }

    &:hover {
      background: rgba(255, 244, 248, 1);
      border-color: #ffb6c1;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(246, 168, 195, 0.2);
    }

    &:active {
      transform: translateY(0);
    }

    &_bar {
      height: 3px;
      background: linear-gradient(90deg, #ffb6c1, #fad2dc, #90cdf4);
      opacity: 0.8;
    }

    &_content {
      display: flex;
      align-items: flex-start;
      padding: 12px 14px;
      gap: 8px;
    }

    &_indicator {
      color: #f6a8c3;
      font-size: 14px;
      line-height: 1.4;
      flex-shrink: 0;
      margin-top: 1px;
    }

    &_text {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    &_title {
      font-size: 0.9em;
      font-weight: 600;
      color: #2c3e50;
      line-height: 1.4;
    }

    &_desc {
      font-size: 0.82em;
      line-height: 1.5;
      color: #666;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
}
</style>

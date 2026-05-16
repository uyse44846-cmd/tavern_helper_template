<template>
  <div class="control-bar" @click.stop>
    <button type="button" class="ctrl-btn" @click.stop="store.restart()">
      {{
        store.has_ended
          ? '重播'
          : `${store.current_index + 1}/${store.dialogs.length}${store.during_streaming ? '?' : ''}`
      }}
    </button>
    <button type="button" class="ctrl-btn" @click.stop="store.history_opened = true">日志</button>
    <button type="button" class="ctrl-btn" @click.stop="store.dialog_opened = !store.dialog_opened">
      {{ store.dialog_opened ? '隐藏UI' : '显示UI' }}
    </button>
    <button v-if="store.is_cg && cg_url" type="button" class="ctrl-btn ctrl-btn-cg" @click.stop="enlargeBackground">
      放大
    </button>
  </div>
</template>

<script setup lang="ts">
import { getBackgroundUrl } from '../image';
import { useGalgameStore } from '../store';

const store = useGalgameStore();

const cg_url = computed(() => (store.is_cg ? getBackgroundUrl(store.current_dialog?.background) : ''));

/**
 * 放大 CG 图片：用 SillyTavern.Popup 打开大图查看，点击空白处关闭。
 */
function enlargeBackground() {
  if (!cg_url.value) return;
  try {
    const $image = $('<img>')
      .addClass('img_enlarged')
      .attr('src', cg_url.value)
      .on('click', function (event) {
        $(this).toggleClass('zoomed');
        event.stopPropagation();
      });
    const $image_container = $('<div>')
      .addClass('img_enlarged_container')
      .append($('<div>').addClass('img_enlarged_holder').append($image));
    const popup = new SillyTavern.Popup($image_container[0], SillyTavern.POPUP_TYPE.DISPLAY, '', {
      large: true,
      transparent: true,
    });
    popup.dlg.style.width = 'unset';
    popup.dlg.style.height = 'unset';
    popup.dlg.addEventListener('click', () => {
      popup.completeCancelled();
    });
    popup.show();
  } catch (e) {
    console.error('[佩伊洛 galgame] enlargeBackground 失败', e);
  }
}
</script>

<style scoped>
.control-bar {
  position: absolute;
  top: 50px;
  right: 16px;
  z-index: 50;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.ctrl-btn {
  background: rgba(254, 252, 250, 0.88);
  border: 1px solid rgba(212, 97, 111, 0.25);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #6d4555;
  cursor: pointer;
  letter-spacing: 0.08em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  transition: all 0.2s ease;
  font-family: inherit;
  white-space: nowrap;
}
.ctrl-btn:hover {
  transform: translateY(-2px);
  background: rgba(254, 252, 250, 1);
  border-color: rgba(212, 97, 111, 0.5);
}
.ctrl-btn:active {
  transform: translateY(-1px);
}

/* CG 模式的"放大"按钮：红底白字突出 */
.ctrl-btn-cg {
  background: rgba(212, 97, 111, 0.85);
  color: #fff;
  border-color: rgba(255, 176, 184, 0.6);
}
.ctrl-btn-cg:hover {
  background: rgba(212, 97, 111, 1);
}
</style>

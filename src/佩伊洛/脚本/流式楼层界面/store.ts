import { parseString } from '@util/common';
import { Dialog } from './type';

/**
 * 解析 <galgame>...</galgame> 中的对话序列。
 * 同时兼容：
 *   - 完整闭合的 `<galgame>...</galgame>`
 *   - 流式中未闭合的开放尾部
 *   - 内部可选的 ```yaml ... ``` 代码块包裹
 * 单条对话用 `Dialog.or('failed').catch('failed')` 容错，失败的过滤掉。
 */
function parseDialogsFromMessage(message: string): {
  dialogs: Dialog[];
  type: 'full' | 'partial' | 'error';
} {
  // 去除变量更新占位符
  message = message.replace('<StatusPlaceHolderImpl/>', '');

  const full_match = message.match(/<(galgame)>\s*(?:```.*\n)?((?:(?!<\1>)[\s\S])*?)(?:\n```)?\s*<\/\1>/im);
  const partial_match = message.match(/<(galgame)>(?!.*<\/\1>)\s*(?:```[^\n]*\n)?(.*?)\s*(?:```.*)?$/is);
  const content = full_match?.[2] ?? partial_match?.[2] ?? '';

  const onError = (title: string, error: unknown) => ({
    dialogs: [
      {
        speaker: '系统提示',
        speech: `${title}: ${error instanceof Error ? error.message : String(error)}`,
        background: '',
        characters: [] as Array<{ id: string; tachie: string }>,
      } as Dialog,
    ],
    type: 'error' as const,
  });

  let parsed: unknown;
  try {
    parsed = parseString(content);
  } catch (error) {
    return onError('解析数据失败', error);
  }

  try {
    return {
      dialogs: z
        .array(Dialog.or(z.literal('failed')).catch('failed'))
        .min(1)
        .parse(parsed, { reportInput: true })
        .filter((dialog): dialog is Dialog => dialog !== 'failed'),
      type: full_match ? 'full' : 'partial',
    };
  } catch (error) {
    return onError('加载对话数据失败', error);
  }
}

/**
 * 解析 <roleplay_options>...</roleplay_options> 中的选项。
 * 形如 `标题: 内容` 的每一行被识别为一个选项，仅保留 content 部分。
 */
function parseOptionsFromMessage(message: string): string[] {
  const FULL_REGEX = /<(roleplay_options)>\s*(?:```.*\n)?((?:(?!<\1>)[\s\S])*?)(?:\n```)?\s*<\/\1>/im;
  const PARTIAL_REGEX = /<(roleplay_options)>(?!.*<\/\1>)\s*(?:```[^\n]*\n)?(.*?)\s*(?:```.*)?$/is;
  const content = message.match(FULL_REGEX)?.[2] ?? message.match(PARTIAL_REGEX)?.[2] ?? '';

  return [...content.matchAll(/(.+?)[:：]\s*(.+)/gm)].map(match =>
    match[2]
      .trim()
      .replace(/^\$\{(.+)\}$/, '$1')
      .replace(/^「(.+)」$/, '"$1"')
      .replace(/^"(.+)"$/, '"$1"')
      .replace(/^`(.+)`$/, '$1'),
  );
}

/**
 * 佩伊洛 galgame 界面 store。
 *
 * - dialogs: 当前解析出的对话序列
 * - options: 当前解析出的选项
 * - current_index: 当前播放到第几句
 * - during_streaming: 是否还在流式生成中
 * - has_ended: 已播放到最后一句（用于显示选择框）
 * - dialog_opened: 是否显示对话框（用于"隐藏UI"功能）
 * - history_opened: 是否打开历史日志面板
 */
export const useGalgameStore = defineStore('peyro-galgame', () => {
  const dialogs = ref<Dialog[]>([
    {
      speaker: '系统提示',
      speech: '尚未加载消息',
      background: '',
      characters: [],
    } as Dialog,
  ]);
  const options = ref<string[]>([]);

  const current_index = ref(0);
  const during_streaming = ref(false);
  const has_ended = ref(false);

  function loadMessage(message: string) {
    const { dialogs: new_dialogs, type } = parseDialogsFromMessage(message);

    // 流式中解析失败 → 保留上次成功结果，避免界面闪烁
    if (during_streaming.value && type === 'error') {
      return;
    }
    // 流式结束但只解析出部分（消息截断）→ 追加提示
    if (!during_streaming.value && type === 'partial') {
      new_dialogs.push({
        speaker: '系统提示',
        speech: '消息截断了……请重新生成',
        background: '',
        characters: [],
      } as Dialog);
    }
    dialogs.value = new_dialogs;
    options.value = parseOptionsFromMessage(message);
  }

  const current_dialog = computed(() => dialogs.value[current_index.value]);
  const history_dialogs = computed(() => dialogs.value.slice(0, current_index.value + 1));

  /** 是否处于 CG 模式（current_dialog.background 以 "CG/" 开头） */
  const is_cg = computed(() => {
    const bg = current_dialog.value?.background ?? '';
    return /^CG\//i.test(bg);
  });

  /** 推进到下一句对话；到达末尾且非流式中则触发 has_ended → 显示选择框 */
  function advance() {
    if (has_ended.value) return;

    const next_index = current_index.value + 1;
    if (next_index >= dialogs.value.length) {
      if (!during_streaming.value) {
        has_ended.value = true;
      }
      return;
    }
    current_index.value = next_index;
  }

  /** 重新从第一句开始播放 */
  function restart() {
    current_index.value = 0;
    has_ended.value = false;
  }

  const dialog_opened = ref(true);
  const history_opened = ref(false);

  return {
    dialogs,
    options,
    loadMessage,

    current_index,
    during_streaming,
    has_ended,
    current_dialog,
    history_dialogs,
    is_cg,
    advance,
    restart,

    dialog_opened,
    history_opened,
  };
});

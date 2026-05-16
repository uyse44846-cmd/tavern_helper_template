import { mountStreamingMessages } from '@util/streaming';
import App from './App.vue';
import Text from './Text.vue';

/**
 * 佩伊洛专属流式 galgame 界面入口。
 *
 * 参照 galgame角色卡示例/脚本/galgame/index.ts，同时挂载 3 个流式组件：
 *   1. Text.vue：渲染 <galgame> 标签之前的正文（如有）
 *   2. App.vue：galgame 主界面（背景 + 立绘 + 对话框 + 选择框 + 控制栏）
 *   3. Text.vue：渲染 </galgame> 之后的正文，去除 <roleplay_options> 段
 *
 * filter 仅匹配含 <galgame> 的消息 —— sprite 模式的消息（含 <sprite>）
 * 不会被本流式界面接管，由现有的正则+iframe（内嵌选择框标签.txt）处理。
 */
$(() => {
  const filter = (_message_id: number, message: string) => message.includes('<galgame>');

  const unmount_list: Array<() => void> = [];

  // 1) galgame 之前的正文
  unmount_list.push(
    mountStreamingMessages(
      () => {
        // eslint-disable-next-line vue/one-component-per-file
        return createApp(Text, {
          transformer: (message: string) => {
            const index = message.lastIndexOf('<galgame>');
            return message.slice(0, index === -1 ? undefined : index).trim();
          },
        });
      },
      { host: 'div', filter },
    ).unmount,
  );

  // 2) galgame 主界面（iframe 隔离样式，可用 tailwindcss）
  unmount_list.push(
    mountStreamingMessages(
      () => {
        return createApp(App).use(createPinia());
      },
      { filter },
    ).unmount,
  );

  // 3) galgame 之后的正文（去除 roleplay_options 段）
  unmount_list.push(
    mountStreamingMessages(
      () => {
        // eslint-disable-next-line vue/one-component-per-file
        return createApp(Text, {
          transformer: (message: string) => {
            const index = message.lastIndexOf('</galgame>');
            if (index === -1) return '';
            return (
              message
                .slice(index + 10)
                // 去掉 roleplay_options 整块（含未闭合的情况）
                .replace(/<(roleplay_options)>(?:(?!.*<\/\1>)(?:(?!<\1>).)*$|(?:(?!<\1>).)*<\/\1?>)/gis, '')
                .trim()
            );
          },
        });
      },
      { host: 'div', filter },
    ).unmount,
  );

  $(window).on('pagehide', () => {
    unmount_list.forEach(unmount => unmount());
  });
});

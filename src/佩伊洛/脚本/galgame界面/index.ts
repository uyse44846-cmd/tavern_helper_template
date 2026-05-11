import { mountStreamingMessages } from '@util/streaming';
import App from './App.vue';

$(() => {
  const { unmount } = mountStreamingMessages(() => createApp(App).use(createPinia()), {
    host: 'iframe',
    filter: message_id => {
      for (let i = message_id - 1; i >= 0; i--) {
        const msg = SillyTavern.chat[i];
        if (msg && !msg.is_user && !msg.is_system) {
          try {
            const data = Mvu.getMvuData({ type: 'message', message_id: i });
            return data?.世界?.下一回合界面选择 === 'galgame';
          } catch {
            return false;
          }
        }
      }
      return false;
    },
  });
  $(window).on('pagehide', () => unmount());
});

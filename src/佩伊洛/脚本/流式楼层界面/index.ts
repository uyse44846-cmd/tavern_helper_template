import { mountStreamingMessages } from '@util/streaming';
import App from './App.vue';

$(() => {
  const { unmount } = mountStreamingMessages(() => createApp(App), {
    host: 'div',
    filter: (_id, message) => /<galgame>/.test(message) || /<roleplay_options>/.test(message),
  });
  $(window).on('pagehide', () => unmount());
});

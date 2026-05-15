import { mountStreamingMessages } from '@util/streaming';
import App from './App.vue';

$(() => {
  const { unmount: unmountGalgame } = mountStreamingMessages(() => createApp(App), {
    host: 'div',
    filter: (_id, message) => /<galgame>/.test(message),
  });

  $(window).on('pagehide', () => {
    unmountGalgame();
  });
});

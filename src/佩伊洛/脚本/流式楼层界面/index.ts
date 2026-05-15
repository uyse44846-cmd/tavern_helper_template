import { mountStreamingMessages } from '@util/streaming';
import App from './App.vue';
import RoleplayOptions from './RoleplayOptions.vue';

$(() => {
  const { unmount: unmountGalgame } = mountStreamingMessages(() => createApp(App), {
    host: 'div',
    filter: (_id, message) => /<galgame>/.test(message),
  });

  const renderOptions = async (message_id: number) => {
    const $mes = $(`.mes[mesid='${message_id}']`);
    if ($mes.length === 0) return;

    const message = getChatMessages(message_id)[0]?.message ?? '';
    if (!/<\/roleplay_options>/.test(message)) return;

    const containerId = `roleplay-options-${message_id}`;
    if ($mes.find(`#${containerId}`).length > 0) return;

    const $mes_text = $mes.find('.mes_text');

    // 隐藏正则生成的代码块（包含 <roleplay_options> 文本的 <pre><code> 元素）
    $mes_text.find('pre code').each((_i, el) => {
      if (el.textContent?.includes('<roleplay_options>')) {
        $(el).closest('pre').addClass('hidden');
      }
    });

    const $container = $('<div>').attr('id', containerId).insertAfter($mes_text);

    const worldbookName = getCharWorldbookNames('current').primary;
    let directSend = true;
    if (worldbookName) {
      const entries = await getWorldbook(worldbookName);
      const entry = entries.find(e => e.name.includes('选择框触发方式'));
      if (entry) directSend = entry.enabled;
    }

    const app = createApp(RoleplayOptions, { message, directSend });
    app.mount($container[0]);

    const observer = new MutationObserver(() => {
      const $edit = $('#chat').find('#curEditTextarea');
      if ($edit.parent().is($mes_text)) {
        $container.addClass('hidden');
      } else if ($edit.length === 0) {
        $container.removeClass('hidden');
      }
    });
    observer.observe($mes_text[0] as HTMLElement, { childList: true });

    return { app, observer, $container };
  };

  const optionsStates = new Map<
    number,
    { app: ReturnType<typeof createApp>; observer: MutationObserver; $container: JQuery }
  >();

  const renderAllOptions = async () => {
    $('#chat')
      .children(".mes[is_user='false'][is_system='false']")
      .each((_i, node) => {
        const mid = Number($(node).attr('mesid'));
        if (!isNaN(mid) && !optionsStates.has(mid)) {
          renderOptions(mid).then(state => {
            if (state) optionsStates.set(mid, state);
          });
        }
      });
  };

  const destroyOptions = (mid: number) => {
    const state = optionsStates.get(mid);
    if (state) {
      state.app.unmount();
      state.observer.disconnect();
      state.$container.remove();
      optionsStates.delete(mid);
    }
  };

  const stops: Array<() => void> = [];
  stops.push(
    eventOn(tavern_events.CHARACTER_MESSAGE_RENDERED, (mid: number) => {
      destroyOptions(mid);
      renderOptions(mid).then(state => {
        if (state) optionsStates.set(mid, state);
      });
    }).stop,
  );
  stops.push(
    eventOn(tavern_events.MESSAGE_EDITED, (mid: number) => {
      destroyOptions(mid);
      renderOptions(mid).then(state => {
        if (state) optionsStates.set(mid, state);
      });
    }).stop,
  );
  stops.push(
    eventOn(tavern_events.MESSAGE_SWIPED, (mid: number) => {
      destroyOptions(mid);
      renderOptions(mid).then(state => {
        if (state) optionsStates.set(mid, state);
      });
    }).stop,
  );
  stops.push(
    eventOn(tavern_events.MESSAGE_DELETED, (mid: number) => {
      destroyOptions(mid);
    }).stop,
  );
  stops.push(
    eventOn('chatLoaded' as EventType, () => {
      optionsStates.forEach((_, mid) => destroyOptions(mid));
      renderAllOptions();
    }).stop,
  );

  renderAllOptions();

  $(window).on('pagehide', () => {
    unmountGalgame();
    optionsStates.forEach((_, mid) => destroyOptions(mid));
    stops.forEach(s => s());
  });
});

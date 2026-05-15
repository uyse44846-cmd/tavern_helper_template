$(async () => {
  await waitGlobalInitialized('Mvu');

  // 读取"始终使用galgame界面"开关状态的辅助函数
  async function isAlwaysGalgameEnabled(): Promise<boolean> {
    try {
      const worldbookName = getCharWorldbookNames('current').primary;
      if (!worldbookName) return false;
      const entries = await getWorldbook(worldbookName);
      const entry = entries.find(e => e.name.includes('始终使用galgame界面'));
      return entry?.enabled ?? false;
    } catch {
      return false;
    }
  }

  eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, async (new_variables, old_variables) => {
    // 始终使用galgame界面：强制覆盖下一回合界面选择
    const alwaysGalgame = await isAlwaysGalgameEnabled();
    if (alwaysGalgame) {
      _.set(new_variables, 'stat_data.世界.下一回合界面选择', 'galgame');
    }

    const old_status = _.get(old_variables, 'stat_data.主线事件.当前状态', '未触发');
    const new_status = _.get(new_variables, 'stat_data.主线事件.当前状态', '未触发');

    // 不允许 AI 自行激活主线事件，激活由 EJS 主线事件控制器的 setvar 完成
    if (old_status === '未触发' && new_status === '进行中') {
      _.set(new_variables, 'stat_data.主线事件.当前状态', '未触发');
      console.warn('[变量守护] 主线事件激活被拒绝：仅允许由控制器脚本触发');
    }

    // 主线事件完成时，归档到已完成事件列表并重置主线事件
    if (new_status === '已完成' && old_status !== '已完成') {
      const 事件ID = _.get(new_variables, 'stat_data.主线事件.事件ID', '');
      const 主题 = _.get(new_variables, 'stat_data.主线事件.主题', '');
      const 描述 = _.get(new_variables, 'stat_data.主线事件.描述', '');
      const 已完成事件 = _.get(new_variables, 'stat_data.已完成事件', []);

      已完成事件.push({ 事件ID, 主题, 结局摘要: 描述 });
      _.set(new_variables, 'stat_data.已完成事件', 已完成事件);

      // 重置主线事件为未触发状态，并设置冷却
      _.set(new_variables, 'stat_data.主线事件.事件ID', '');
      _.set(new_variables, 'stat_data.主线事件.当前状态', '未触发');
      _.set(new_variables, 'stat_data.主线事件.当前阶段', '引入');
      _.set(new_variables, 'stat_data.主线事件.主题', '');
      _.set(new_variables, 'stat_data.主线事件.描述', '');
      _.set(new_variables, 'stat_data.主线事件.冷却回合', 20);
      _.set(new_variables, 'stat_data.主线事件.大纲', { 引入: '', 发展: '', 高潮: '', 结局: '' });

      console.info(`[变量守护] 主线事件「${主题}」(${事件ID}) 已归档到已完成事件`);
    }

    // 冷却回合自动递减
    const cooldown = _.get(new_variables, 'stat_data.主线事件.冷却回合', 0);
    if (cooldown > 0 && new_status !== '已完成') {
      _.set(new_variables, 'stat_data.主线事件.冷却回合', cooldown - 1);
      console.info(`[变量守护] 主线事件冷却回合: ${cooldown} → ${cooldown - 1}`);
    }
  });

  console.info('[变量守护] 已加载');
});

export const Schema = z.object({
  世界: z.object({
    当前日期: z.string(),
    当前时间: z.string(),
    时间阶段: z.string(),
    当前天气: z.string(),
    当前地点: z.string(),
    是否NSFW: z.boolean().prefault(false),
    下一回合界面选择: z.enum(['立绘', 'galgame']).prefault('立绘'),
  }),

  佩伊洛: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
    当前服装: z.enum(['校服', '便服', '睡衣', '连衣裙']).prefault('校服'),
    当前表情: z
      .enum(['微笑', '害羞', '惊讶', '生气', '哭泣', '坏笑', '微微脸红', '拥抱', '擦眼泪', '星星眼', '晕晕眼', '流口水'])
      .prefault('微笑'),
  }),

  主线事件: z
    .object({
      事件ID: z.string().prefault(''),
      当前状态: z.enum(['未触发', '进行中', '已完成']).prefault('未触发'),
      当前阶段: z.enum(['引入', '发展', '高潮', '结局']).prefault('引入'),
      主题: z.string().prefault(''),
      描述: z.string().prefault(''),
      冷却回合: z.coerce
        .number()
        .transform(v => Math.max(v, 0))
        .prefault(0),
      大纲: z
        .object({
          引入: z.string().prefault(''),
          发展: z.string().prefault(''),
          高潮: z.string().prefault(''),
          结局: z.string().prefault(''),
        })
        .prefault({}),
    })
    .prefault({}),

  已完成事件: z
    .array(
      z.object({
        事件ID: z.string(),
        主题: z.string(),
        结局摘要: z.string(),
      }),
    )
    .prefault([]),
});
export type Schema = z.output<typeof Schema>;

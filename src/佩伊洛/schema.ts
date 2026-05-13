export const Schema = z.object({
  世界: z.object({
    当前日期: z.string(),
    当前时间: z.string(),
    时间阶段: z.string(),
    当前天气: z.string(),
    当前地点: z.string(),
    是否NSFW: z.boolean().prefault(false),
    下一回合界面选择: z.enum(['sprite', 'galgame']).prefault('sprite'),
  }),

  佩伊洛: z.object({
    好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)),
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

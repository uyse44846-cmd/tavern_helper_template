/**
 * 佩伊洛 galgame 界面的数据类型定义。
 * 参考 galgame角色卡示例/脚本/galgame/type.ts，针对佩伊洛进行适配：
 *   - speaker '独白' 会自动加上中文括号（旁白则保持原样）
 *   - speaker 为 '独白'/'旁白' 时 speaker 被清空（用于不显示发言人名字）
 *   - 兼容旧的 tachie 字段（自动转 characters 数组）
 *   - speech 中的 「...」/"..." 自动替换为中文双引号
 */

export const Character = z.object({
  id: z.string(),
  tachie: z.string(),
});
export type Character = z.infer<typeof Character>;

/**
 * 旧版兼容：speaker + speech + background + tachie 单字段形式。
 * 转换为标准 characters 数组：以 speaker（佩伊洛）作为单一在场角色。
 */
const 单立绘兼容 = z
  .object({
    speaker: z.string(),
    speech: z.string(),
    background: z.string(),
    tachie: z.string(),
  })
  .transform(data => ({
    ..._.omit(data, 'tachie'),
    characters: [{ id: '佩伊洛', tachie: data.tachie }],
  }));

export const Dialog = z
  .union([
    单立绘兼容,
    z.object({
      speaker: z.string(),
      speech: z.string().transform(text => text.replace(/^「(.+)」$/, '"$1"').replace(/^"(.+)"$/, '"$1"')),
      background: z.string(),
      characters: z.array(Character).prefault([]).catch([]),
    }),
  ])
  .transform(data => {
    // 独白：以 user 名字作为 speaker，并自动包裹中文括号
    if (data.speaker === '独白') {
      data.speaker = substitudeMacros('<user>');
      data.speech = data.speech.startsWith('（') || data.speech.startsWith('(') ? data.speech : `（${data.speech}）`;
    }
    // 独白与旁白都清空 speaker，让对话框不显示发言人名字
    if (data.speaker === '独白' || data.speaker === '旁白') {
      data.speaker = '';
    }
    return data;
  });
export type Dialog = z.infer<typeof Dialog>;

/**
 * 佩伊洛资源 CDN 路径解析工具。
 *
 * AI 输出的 YAML 字段（如 `background: 家中玄关/白天.jpg` 或 `tachie: 校服/微笑.png`）
 * 在前端解析为完整的 CDN URL。
 *
 * 与现有 [src/佩伊洛/脚本/流式楼层界面/Galgame.vue](src/佩伊洛/脚本/流式楼层界面/Galgame.vue:17)
 * 中的 `CDN` 常量一致。
 *
 * CG 模式：`background` 以 `CG/` 开头时仍走相同路径解析，由前端层处理样式差异。
 */

export const CDN_BASE = 'https://cdn.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template@v1/dist/佩伊洛' as const;

/**
 * 获取背景图片 URL。
 * @param id 形如 `家中玄关/白天.jpg` 或 `CG/告白时刻.jpg`
 */
export function getBackgroundUrl(id: string | null | undefined): string {
  if (!id) return '';
  return `${CDN_BASE}/背景/${id}`;
}

/**
 * 获取角色立绘图片 URL。
 * @param tachie 形如 `校服/微笑.png` 或 `便服/害羞.png`
 */
export function getTachieUrl(tachie: string | null | undefined): string {
  if (!tachie) return '';
  return `${CDN_BASE}/角色立绘/${tachie}`;
}

/**
 * 判断 background 是否是 CG（用于切换 CG 模式的 UI 风格）。
 */
export function isCgBackground(background: string | null | undefined): boolean {
  return !!background && /^CG\//i.test(background);
}

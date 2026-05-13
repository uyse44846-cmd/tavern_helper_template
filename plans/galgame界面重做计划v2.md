# 佩伊洛角色卡 galgame 界面重做 · 最终实施计划

## 架构总览（混合方案）

| 界面                 | 实现机制                   | 触发方式                           | 说明                               |
| -------------------- | -------------------------- | ---------------------------------- | ---------------------------------- |
| **欢迎页**           | 独立前端界面 iframe        | 正则匹配 `<WelcomePageImpl/>`      | 保留不动                           |
| **sprite**           | 纯酒馆正则 + HTML/CSS 替换 | 正则匹配 `<sprite>...</sprite>`    | 用 `$1/$2/$3` 拼出背景+立绘+信息卡 |
| **galgame**          | 流式楼层脚本 + Vue 组件    | 脚本检测 `<galgame>` 标签          | 全屏对话序列，点击翻页             |
| **roleplay_options** | 流式楼层脚本 + Vue 组件    | 脚本检测 `<roleplay_options>` 标签 | 可点击选项                         |

### 数据流

```
AI 楼层消息文本
    ├─ <WelcomePageImpl/> → 酒馆正则 → iframe 欢迎页
    ├─ <sprite>...</sprite> → 酒馆正则 → 直接替换为 HTML/CSS 立绘界面
    ├─ <galgame>...</galgame> → 流式楼层脚本 → Galgame Vue 组件
    ├─ <roleplay_options>...</roleplay_options> → 流式楼层脚本 → 选择框 Vue 组件
    └─ 其他正文 → formatAsDisplayedMessage 渲染
```

### 最终文件结构

```
src/佩伊洛/
├── 界面/
│   └── 欢迎页/                    (保留不动)
├── 脚本/
│   ├── MVU/                       (保留)
│   ├── 变量结构/                   (保留)
│   ├── 变量守护/                   (保留)
│   └── 流式楼层界面/                (新建)
│       ├── index.ts
│       ├── App.vue
│       ├── Galgame.vue
│       └── RoleplayOptions.vue
├── 世界书/                         (已完成，保留)
├── 第一条消息/
│   ├── 0.txt                      (保留)
│   └── 1.txt                      (修复 sprite 位置)
├── index.yaml                     (更新正则+脚本库)
└── schema.ts                      (保留)
```

---

## 步骤 5：重命名 dist 中的资源文件

### 背景文件重命名规则

当前格式：`dist/佩伊洛/背景/{地点}/{地点}{时间情况}.jpg`
目标格式：`dist/佩伊洛/背景/{地点}/{时间情况}.jpg`

示例映射：

- `教室/教室白天.jpg` → `教室/白天.jpg`
- `教室/教室傍晚.jpg` → `教室/傍晚.jpg`
- `教室/教室夜晚关灯.jpg` → `教室/夜晚关灯.jpg`
- `家中玄关/家中玄关白天.jpg` → `家中玄关/白天.jpg`
- `公园/公园.jpg` → `公园/公园.jpg`（特殊：保持不变，因为世界书示例就是这样）
- `电车内/电车白天.jpg` → `电车内/电车白天.jpg`（特殊：保持不变）
- `商店街/商业街白天.jpg` → `商店街/商业街白天.jpg`（特殊：保持不变）

注意：部分文件名不遵循 `地点+时间` 的规则（如公园、电车内、商店街），需要对照世界书调用示例逐一确认。

### 立绘文件重命名规则

当前格式：`dist/佩伊洛/角色立绘/{服装全名}/{服装简称}{表情}.png`
目标格式：`dist/佩伊洛/角色立绘/{服装简称}/{表情}.png`

服装映射：

- `少女白色水手服校服/` → `校服/`
- `奶白毛衣格子裙便服/` → `便服/`
- `少女粉色长袖居家睡衣/` → `睡衣/`
- `淡蓝色V领长袖雪纺连衣裙/` → `连衣裙/`

文件名映射（以便服为例）：

- `奶白毛衣格子裙便服/格子裙坏笑.png` → `便服/坏笑.png`
- `奶白毛衣格子裙便服/格子裙微笑.png` → `便服/微笑.png`
- 等等...

需要用户手动重命名并重新推送到 GitHub。

---

## 步骤 6-7：删除错建文件夹

- 删除 `src/佩伊洛/界面/sprite界面/`（sprite 用纯正则，不需要独立前端界面）
- 删除 `src/佩伊洛/界面/galgame界面/`（galgame 放流式楼层脚本里）

---

## 步骤 8：修复第一条消息 1.txt

当前状态：`<sprite>` 在文件开头（第1-4行），且格式错误（用 `background:`/`tachie:` 而非 `立绘:`/`场景:`/`时间:`）

修复后：

- 移除文件开头的 `<sprite>` 块
- 在正文末尾追加正确格式的 `<sprite>` 标签

```
（正文内容...）

<sprite>
立绘: 校服/微笑.png
场景: 家中玄关/白天.jpg
时间: 清晨
</sprite>
```

---

## 步骤 9：sprite 正则（参照络络 [美化]背景与立绘）

### 查找表达式

```regex
<sprite>\s*(?:立绘:\s*(\S*)|[\s\S]*?)\s*(?:场景:\s*(\S*)|[\s\S]*?)\s*(?:时间:\s*(\S*)|[\s\S]*?)\s*(?:<\/sprite>|$)
```

### 替换内容

一整段 `<style>...</style><div class="portrait">...</div>`：

- `$1` = 立绘路径 → `https://testingcf.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template/dist/佩伊洛/角色立绘/$1`
- `$2` = 场景路径 → `https://testingcf.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template/dist/佩伊洛/背景/$2`
- `$3` = 时间文字 → 信息卡时间行

### CSS 布局（参照络络，适配移动端）

- 桌面端：背景全宽，立绘居中底部 85% 高，右下角信息卡（毛玻璃）
- 移动端：4:3 比例，信息卡变为底部横条

### 正则配置

```yaml
- 正则名称: '[界面]sprite'
  id: (生成新UUID)
  启用: true
  查找表达式: <sprite>\s*(?:立绘:\s*(\S*)|[\s\S]*?)\s*(?:场景:\s*(\S*)|[\s\S]*?)\s*(?:时间:\s*(\S*)|[\s\S]*?)\s*(?:<\/sprite>|$)
  内容: (CSS+HTML模板，用$1/$2/$3填充)
  来源:
    用户输入: true
    AI输出: true
  作用于:
    仅格式显示: true
    仅格式提示词: false
```

---

## 步骤 10-13：流式楼层界面

### index.ts

```typescript
import { mountStreamingMessages } from '@util/streaming';
import App from './App.vue';

$(() => {
  const { unmount } = mountStreamingMessages(
    () => createApp(App),
    {
      host: 'div',
      filter: (_id, message) =>
        /<galgame>/.test(message) || /<roleplay_options>/.test(message),
    },
  );
  $(window).on('pagehide', () => unmount());
});
```

使用 `host: 'div'` 继承酒馆样式，通过 `filter` 只对包含 galgame 或 roleplay_options 标签的楼层生效。

### App.vue 逻辑

```
if (hasClosedGalgame):
  渲染 Galgame 组件（全屏替换）
  如果同时有 roleplay_options，在 galgame 结束后显示
else:
  用 formatAsDisplayedMessage 渲染正文（过滤掉 sprite/update 标签）
  如果有闭合的 roleplay_options，追加 RoleplayOptions 组件
  如果 roleplay_options 未闭合（流式中），显示原始文本
```

### Galgame.vue

- 解析 `<galgame>` 标签内的 YAML（Chat[] 数组）
- 全屏显示：背景图 + 立绘 + 对话框（底部半透明）
- 点击屏幕翻页（currentIndex++）
- 到最后一页后显示"结束"或自动关闭

### RoleplayOptions.vue

- 解析 `<roleplay_options>` 标签内的 `标题: 内容` 格式
- 渲染为可点击卡片列表
- 点击后 `createChatMessages([{ role: 'user', message: 内容 }])` + `triggerSlash('/trigger')`

---

## 步骤 14：更新 index.yaml

### 正则部分

- 保留：`[折叠]变量更新中`、`[折叠]完整变量更新`、`[界面]欢迎页`
- 新增：`[界面]sprite`
- 删除：`[界面]状态栏`（如果还在的话）

### 脚本库部分

- 保留：`mvu`、`变量结构`、`变量守护`
- 替换：`galgame界面` → `流式楼层界面`

```yaml
- 名称: 流式楼层界面
  id: 64b783a9-7c0d-4c66-9ef0-1ec72b87c3d5
  启用: true
  类型: 脚本
  内容: |-
    import 'https://testingcf.jsdelivr.net/gh/uyse44846-cmd/tavern_helper_template/dist/佩伊洛/脚本/流式楼层界面/index.js';
```

---

## 步骤 15-16：构建与推送

1. `pnpm build` 验证无报错
2. 推送到新分支
3. 用户手动重命名 dist 中的资源文件并推送

---

## 注意事项

1. **流式渲染兼容**：标签未闭合时不渲染对应 UI，继续显示文本进度
2. **sprite 正则不处理 galgame 内的 tachie**：galgame 内的立绘由 Vue 组件自行加载
3. **CDN 缓存**：jsdelivr 有缓存，重命名文件后可能需要等待或用 purge
4. **无人立绘**：当 AI 输出 `立绘: 无人.png` 时，立绘 img 加载失败会隐藏（CSS `onerror` 或 `object-fit` 处理）

# 修复始终galgame界面变量冲突问题

## 问题描述

当开启"始终使用galgame界面"功能后，AI在输出galgame界面后会误以为下一回合应该输出sprite格式，导致界面选择混乱。

## 问题根源分析

### 当前系统架构

系统涉及三个关键组件：

1. **[`始终galgame界面控制器.txt`](../src/佩伊洛/世界书/始终galgame界面控制器.txt)**
   - 使用 `@@generate_before` 标记，在AI生成前执行
   - 强制设置 `stat_data.世界.下一回合界面选择` 为 `'galgame'`
   - 使用 `scope: 'local'`（仅当前回合生效）

2. **[`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml)** 第40-49行
   - 定义了 `下一回合界面选择` 的更新规则
   - 第47行：`reset to 'sprite' when the current value is not 'sprite'`
   - 当开启"始终使用galgame界面"时，规则变为：`必须始终设为 'galgame'，禁止设为其他值`

3. **[`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt)**
   - 第9行：根据 `getvar('stat_data.世界.下一回合界面选择')` 的值决定输出格式
   - 第38-40行：要求AI在输出galgame后更新变量为 `'sprite'`（仅在未开启"始终使用galgame界面"时）

### 时序流程分析

#### 正常流程（未开启"始终使用galgame界面"）

```
回合N：
1. AI读取变量：下一回合界面选择 = 'galgame'
2. AI输出galgame界面
3. AI在<UpdateVariable>中将变量更新为 'sprite'
4. 变量持久化保存

回合N+1：
1. AI读取变量：下一回合界面选择 = 'sprite'
2. AI输出sprite格式（正文+sprite标签）
3. 变量保持为 'sprite'
```

#### 问题流程（开启"始终使用galgame界面"）

```
回合N：
1. @@generate_before 执行：setvar('stat_data.世界.下一回合界面选择', 'galgame', {scope: 'local'})
2. AI读取变量：下一回合界面选择 = 'galgame'（local值）
3. AI输出galgame界面
4. AI在<UpdateVariable>中按照变量更新规则第47行，将变量重置为 'sprite' ❌
5. 变量持久化保存为 'sprite'

回合N+1：
1. AI首先读取持久化的变量：下一回合界面选择 = 'sprite' ❌
2. @@generate_before 执行：setvar('stat_data.世界.下一回合界面选择', 'galgame', {scope: 'local'})
3. 但在"下一回合界面选择.txt"的第9行条件判断时，AI可能已经读取了初始的'sprite'值
4. AI进入sprite分支，输出错误格式 ❌
```

### 核心矛盾

1. **变量更新规则的滞后性**：AI在回合N输出galgame后，按照变量更新规则第47行将变量重置为'sprite'，这个值会持久化保存
2. **控制器的临时性**：`@@generate_before` 使用 `scope: 'local'` 只在当前回合生效，无法覆盖持久化的错误值
3. **条件判断的时机问题**：AI在读取"下一回合界面选择.txt"时，可能先看到持久化的'sprite'值，然后才被控制器覆盖

## 解决方案

### 方案1：修改变量更新规则（推荐 ⭐）

**核心思路**：在变量更新规则中明确禁止AI违反"始终使用galgame界面"的设定

**修改文件**：[`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml)

**修改内容**：

```yaml
下一回合界面选择:
  type: |-
    <%= getvar('始终使用galgame界面') ? "'galgame'" : "'sprite' | 'galgame'" %>
  check: <%_ if (getvar('始终使用galgame界面')) { _%>
    - 必须始终设为 'galgame'，禁止设为其他值
    - 即使当前值已经是 'galgame'，也必须保持为 'galgame'，不要重置为 'sprite'
    <%_ } else { _%>
    - default to 'sprite' if no special situation
    - reset to 'sprite' when the current value is not 'sprite'
    - set to 'galgame' when the storyline reaches an emotional peak, climax CG scene, confession, farewell, reconciliation, or NSFW scene
    <%_ } _%>
```

**优点**：
- 直接在源头解决问题，防止AI输出错误的变量值
- 不改变系统架构，只是强化规则描述
- 对现有功能无副作用

**缺点**：
- 依赖AI理解和遵守规则，可能仍有小概率出错

### 方案2：修改控制器使用持久化scope

**核心思路**：让控制器的设置持久化，而不是仅在当前回合生效

**修改文件**：[`始终galgame界面控制器.txt`](../src/佩伊洛/世界书/始终galgame界面控制器.txt)

**修改内容**：

```javascript
@@generate_before
<%_
// 始终使用galgame界面控制器
// 当"始终使用galgame界面"开关开启时，强制将下一回合界面选择设为galgame
if (getvar('始终使用galgame界面')) {
  setvar('stat_data.世界.下一回合界面选择', 'galgame'); // 移除 scope: 'local'
}
_%>
```

**优点**：
- 强制覆盖AI可能输出的错误值
- 确保每回合开始时变量都是正确的

**缺点**：
- 可能与AI的UpdateVariable产生冲突（AI更新为sprite，控制器又改回galgame）
- 增加了系统的复杂性

### 方案3：在"下一回合界面选择.txt"中添加二次检查

**核心思路**：在条件判断前再次检查"始终使用galgame界面"开关

**修改文件**：[`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt)

**修改内容**：

```
你必须输出判断{{format_message_variable::stat_data.世界.下一回合界面选择}}对应的界面，因此必须最优先地遵守以下内容:
  <%_
  // 二次检查：如果开启了"始终使用galgame界面"，强制进入galgame分支
  const forceGalgame = getvar('始终使用galgame界面');
  const interfaceChoice = forceGalgame ? 'galgame' : getvar('stat_data.世界.下一回合界面选择');
  if (interfaceChoice === 'sprite') {
  _%>
  sprite:
    ...
  <%_ } else { _%>
  galgame:
    ...
  <%_ } _%>
```

**优点**：
- 在最终决策点进行强制修正
- 即使变量值错误，也能输出正确格式

**缺点**：
- 逻辑变得更复杂
- 可能导致变量值与实际输出不一致

### 方案4：组合方案（最推荐 ⭐⭐⭐）

**核心思路**：结合方案1和方案3，多层防护

**修改内容**：

1. **强化变量更新规则**（方案1）
2. **在"下一回合界面选择.txt"中添加保护性检查**（方案3的简化版）
3. **在"下一回合界面选择强调.txt"中添加额外强调**

**具体实施**：

#### 修改1：[`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml)

```yaml
下一回合界面选择:
  type: |-
    <%= getvar('始终使用galgame界面') ? "'galgame'" : "'sprite' | 'galgame'" %>
  check: <%_ if (getvar('始终使用galgame界面')) { _%>
    - **CRITICAL**: 必须始终保持为 'galgame'，严禁设为 'sprite' 或其他任何值
    - 即使当前值已经是 'galgame'，也不要改动，保持原值
    - 这是强制规则，不受剧情发展影响
    <%_ } else { _%>
    - default to 'sprite' if no special situation
    - reset to 'sprite' when the current value is not 'sprite'
    - set to 'galgame' when the storyline reaches an emotional peak, climax CG scene, confession, farewell, reconciliation, or NSFW scene
    <%_ } _%>
```

#### 修改2：[`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt) 第8行后添加

```
<%_ if (getvar('始终使用galgame界面')) { _%>
  **OVERRIDE**: 由于"始终使用galgame界面"开关已开启，本次必须输出galgame格式，忽略变量当前值
<%_ } _%>
```

#### 修改3：[`下一回合界面选择强调.txt`](../src/佩伊洛/世界书/下一回合界面选择强调.txt) 开头添加

```yaml
<%_ if (getvar('始终使用galgame界面')) { _%>
强制galgame模式:
  status: ENABLED
  rule: "始终使用galgame界面开关已开启，本次响应必须使用galgame格式，不得使用sprite格式"
<%_ } _%>
```

**优点**：
- 多层防护，最大程度避免错误
- 即使AI误读变量，也有后续检查纠正
- 对现有功能影响最小

**缺点**：
- 需要修改多个文件
- 增加了一定的复杂度

## 推荐方案

**推荐使用方案4（组合方案）**，理由如下：

1. **可靠性最高**：通过多层防护确保系统正确运行
2. **向后兼容**：不破坏现有的正常流程
3. **易于调试**：如果出现问题，可以通过日志看到每一层的检查结果
4. **渐进式修复**：可以先实施方案1，如果仍有问题再添加方案3的检查

## 实施步骤

1. 修改 [`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml) 第43-49行
2. 修改 [`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt) 第8行后添加检查
3. 修改 [`下一回合界面选择强调.txt`](../src/佩伊洛/世界书/下一回合界面选择强调.txt) 开头添加强调
4. 测试验证：
   - 开启"始终使用galgame界面"
   - 进行多轮对话
   - 检查每次AI输出的格式是否都是galgame
   - 检查变量值是否始终保持为'galgame'

## 测试用例

### 测试1：正常galgame输出
- 前置条件：开启"始终使用galgame界面"
- 操作：进行一次对话
- 预期结果：AI输出galgame格式，变量保持为'galgame'

### 测试2：连续多轮对话
- 前置条件：开启"始终使用galgame界面"
- 操作：连续进行5轮对话
- 预期结果：每次都输出galgame格式，变量始终为'galgame'

### 测试3：关闭开关后恢复正常
- 前置条件：关闭"始终使用galgame界面"
- 操作：进行对话，触发情感高潮场景
- 预期结果：AI能正常在sprite和galgame之间切换

## 附录：相关文件清单

- [`始终galgame界面控制器.txt`](../src/佩伊洛/世界书/始终galgame界面控制器.txt)
- [`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml)
- [`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt)
- [`下一回合界面选择强调.txt`](../src/佩伊洛/世界书/下一回合界面选择强调.txt)

# 修复始终galgame界面变量冲突问题 v2

## 问题重新分析

### 用户反馈的关键信息

1. [`变量守护/index.ts`](../src/佩伊洛/脚本/变量守护/index.ts)脚本已经在监听`VARIABLE_UPDATE_ENDED`事件，会在变量更新后强制覆盖为'galgame'
2. 问题表现：**AI在生成时读取到的变量更新规则显示为'sprite'，但实际变量值被脚本改为'galgame'，导致AI混淆并输出错误的sprite格式**

### 真正的问题根源

#### 时序流程分析

```
回合N（输出galgame）：
1. @@generate_before执行：setvar('stat_data.世界.下一回合界面选择', 'galgame', {scope: 'local'})
2. AI读取变量：下一回合界面选择 = 'galgame'
3. AI读取变量更新规则：看到"reset to 'sprite' when the current value is not 'sprite'"
4. AI输出galgame界面
5. AI在<UpdateVariable>中按规则将变量更新为'sprite' ✓（AI认为这是正确的）
6. MVU系统触发VARIABLE_UPDATE_ENDED事件
7. 变量守护脚本强制覆盖：_.set(new_variables, 'stat_data.世界.下一回合界面选择', 'galgame') ✓
8. 变量最终保存为'galgame' ✓

回合N+1（问题发生）：
1. @@generate_before执行：setvar('stat_data.世界.下一回合界面选择', 'galgame', {scope: 'local'})
2. AI读取变量：下一回合界面选择 = 'galgame' ✓（变量值正确）
3. AI读取变量更新规则：看到"reset to 'sprite' when the current value is not 'sprite'" ❌
4. AI产生认知混淆：
   - 变量值是'galgame'（正确）
   - 但变量更新规则说"当值不是sprite时要重置为sprite"
   - AI推理：上一回合我输出了galgame，按规则应该已经重置为sprite了
   - AI困惑：为什么变量还是galgame？是不是我理解错了？
5. AI在读取"下一回合界面选择.txt"时：
   - 看到第9行条件：if (getvar('stat_data.世界.下一回合界面选择') === 'sprite')
   - AI误判：虽然变量是galgame，但按照更新规则逻辑，我应该进入sprite分支
6. AI输出sprite格式 ❌
```

### 核心矛盾

**变量更新规则与变量守护脚本的逻辑冲突**：

1. **变量更新规则**告诉AI："当值不是sprite时要重置为sprite"
2. **变量守护脚本**实际上会强制覆盖为'galgame'
3. AI看到的规则和实际执行的逻辑不一致，导致认知混淆

这就像告诉AI"红灯停，绿灯行"，但实际上有个隐藏的交警会把所有红灯都改成绿灯。AI会困惑："为什么我看到的规则说要停，但实际上一直是绿灯？"

## 解决方案

### 方案1：修改变量更新规则，与变量守护脚本保持一致（推荐 ⭐⭐⭐）

**核心思路**：让AI看到的规则与实际执行的逻辑一致

**修改文件**：[`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml) 第40-49行

**当前内容**：
```yaml
下一回合界面选择:
  type: |-
    <%= getvar('始终使用galgame界面') ? "'galgame'" : "'sprite' | 'galgame'" %>
  check: <%_ if (getvar('始终使用galgame界面')) { _%>
    - 必须始终设为 'galgame'，禁止设为其他值
    <%_ } else { _%>
    - default to 'sprite' if no special situation
    - reset to 'sprite' when the current value is not 'sprite'
    - set to 'galgame' when the storyline reaches an emotional peak, climax CG scene, confession, farewell, reconciliation, or NSFW scene
    <%_ } _%>
```

**修改为**：
```yaml
下一回合界面选择:
  type: |-
    <%= getvar('始终使用galgame界面') ? "'galgame'" : "'sprite' | 'galgame'" %>
  check: <%_ if (getvar('始终使用galgame界面')) { _%>
    - **CRITICAL**: 必须始终保持为 'galgame'，严禁设为其他任何值
    - 即使当前值已经是 'galgame'，也不要改动，保持原值
    - 注意：变量守护脚本会自动强制覆盖为 'galgame'，因此你无需手动重置
    - 在<UpdateVariable>中保持此字段为 'galgame' 即可
    <%_ } else { _%>
    - default to 'sprite' if no special situation
    - reset to 'sprite' when the current value is not 'sprite'
    - set to 'galgame' when the storyline reaches an emotional peak, climax CG scene, confession, farewell, reconciliation, or NSFW scene
    <%_ } _%>
```

**优点**：
- 直接解决认知混淆问题
- AI看到的规则与实际执行逻辑一致
- 不改变系统架构，只是澄清规则描述

**缺点**：
- 需要AI理解并遵守规则

### 方案2：在"下一回合界面选择.txt"中添加强制检查（辅助方案）

**核心思路**：在条件判断前强制检查"始终使用galgame界面"开关，覆盖AI的错误判断

**修改文件**：[`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt)

**在第8行后添加**：
```
<%_ if (getvar('始终使用galgame界面')) { _%>
  **CRITICAL OVERRIDE**: "始终使用galgame界面"开关已开启，本次必须输出galgame格式，忽略变量当前值和更新规则的任何提示
<%_ } _%>
```

**修改第9行的条件判断逻辑**：
```
你必须输出判断{{format_message_variable::stat_data.世界.下一回合界面选择}}对应的界面，因此必须最优先地遵守以下内容:
  <%_
  // 强制检查：如果开启了"始终使用galgame界面"，强制进入galgame分支
  const forceGalgame = getvar('始终使用galgame界面');
  const interfaceChoice = forceGalgame ? 'galgame' : getvar('stat_data.世界.下一回合界面选择');

  if (interfaceChoice === 'sprite') {
  _%>
  sprite:
    rule: the following must be inserted to the end of each reply and cannot be omitted
    ...
  <%_ } else { _%>
  galgame:
    场景风格: <%= getvar('stat_data.世界.是否NSFW') === true ? 'galgame游戏中的R18场景' : 'galgame游戏中的关键情感爆发场景' %>
    ...
  <%_ } _%>
```

**优点**：
- 在最终决策点强制纠正
- 即使AI误判，也能输出正确格式

**缺点**：
- 增加了逻辑复杂度
- 可能导致AI更加困惑（规则说一套，实际做另一套）

### 方案3：在"下一回合界面选择强调.txt"中添加澄清说明（辅助方案）

**核心思路**：在强调文件中明确说明变量守护机制

**修改文件**：[`下一回合界面选择强调.txt`](../src/佩伊洛/世界书/下一回合界面选择强调.txt)

**在开头添加**：
```yaml
<%_ if (getvar('始终使用galgame界面')) { _%>
始终galgame模式说明:
  status: ENABLED
  mechanism: "变量守护脚本会自动强制覆盖'下一回合界面选择'为'galgame'，因此无论你在<UpdateVariable>中如何设置，最终都会是'galgame'"
  your_task: "本次响应必须使用galgame格式，在<UpdateVariable>中保持'世界.下一回合界面选择'为'galgame'即可"
  critical_rule: "不要被变量更新规则中的'reset to sprite'提示混淆，那是针对正常模式的规则，在始终galgame模式下不适用"
<%_ } _%>
```

**优点**：
- 明确告知AI变量守护机制的存在
- 减少AI的认知混淆

**缺点**：
- 可能让AI过度依赖脚本，不再主动维护变量

### 方案4：组合方案（最推荐 ⭐⭐⭐⭐⭐）

**核心思路**：结合方案1和方案3，既修改规则又添加说明

**实施步骤**：

1. **修改变量更新规则**（方案1）- 让AI看到正确的规则
2. **添加强调说明**（方案3）- 明确告知变量守护机制
3. **可选：添加强制检查**（方案2）- 作为最后一道防线

**优点**：
- 多层防护，最大程度避免混淆
- 规则与实际逻辑一致
- AI能理解系统的完整工作机制

**缺点**：
- 需要修改多个文件

## 推荐实施方案

**推荐使用方案4（组合方案）**，具体步骤如下：

### 步骤1：修改变量更新规则

**文件**：[`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml)

**定位**：第40-49行

**修改内容**：
```yaml
下一回合界面选择:
  type: |-
    <%= getvar('始终使用galgame界面') ? "'galgame'" : "'sprite' | 'galgame'" %>
  check: <%_ if (getvar('始终使用galgame界面')) { _%>
    - **CRITICAL**: 必须始终保持为 'galgame'，严禁设为其他任何值
    - 即使当前值已经是 'galgame'，也不要改动，保持原值
    - 注意：变量守护脚本会自动强制覆盖为 'galgame'，因此你无需手动重置
    - 在<UpdateVariable>中保持此字段为 'galgame' 即可
    <%_ } else { _%>
    - default to 'sprite' if no special situation
    - reset to 'sprite' when the current value is not 'sprite'
    - set to 'galgame' when the storyline reaches an emotional peak, climax CG scene, confession, farewell, reconciliation, or NSFW scene
    <%_ } _%>
```

### 步骤2：添加强调说明

**文件**：[`下一回合界面选择强调.txt`](../src/佩伊洛/世界书/下一回合界面选择强调.txt)

**在第1行后添加**：
```yaml
<%_ if (getvar('始终使用galgame界面')) { _%>
始终galgame模式说明:
  status: ENABLED
  mechanism: "变量守护脚本会自动强制覆盖'下一回合界面选择'为'galgame'，因此无论你在<UpdateVariable>中如何设置，最终都会是'galgame'"
  your_task: "本次响应必须使用galgame格式，在<UpdateVariable>中保持'世界.下一回合界面选择'为'galgame'即可"
  critical_rule: "不要被变量更新规则中的'reset to sprite'提示混淆，那是针对正常模式的规则，在始终galgame模式下不适用"

<%_ } _%>
```

### 步骤3（可选）：添加强制检查

**文件**：[`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt)

**在第8行后添加**：
```
<%_ if (getvar('始终使用galgame界面')) { _%>
  **CRITICAL OVERRIDE**: "始终使用galgame界面"开关已开启，本次必须输出galgame格式
<%_ } _%>
```

**修改第9行的条件判断**：
```
你必须输出判断{{format_message_variable::stat_data.世界.下一回合界面选择}}对应的界面，因此必须最优先地遵守以下内容:
  <%_
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

## 测试验证

### 测试1：正常galgame输出
- **前置条件**：开启"始终使用galgame界面"
- **操作**：进行一次对话
- **预期结果**：
  - AI输出galgame格式
  - AI在UpdateVariable中保持变量为'galgame'
  - 变量最终值为'galgame'

### 测试2：连续多轮对话
- **前置条件**：开启"始终使用galgame界面"
- **操作**：连续进行5轮对话
- **预期结果**：
  - 每次都输出galgame格式
  - 变量始终为'galgame'
  - AI不再产生认知混淆

### 测试3：关闭开关后恢复正常
- **前置条件**：关闭"始终使用galgame界面"
- **操作**：进行对话，触发情感高潮场景
- **预期结果**：
  - AI能正常在sprite和galgame之间切换
  - 变量更新规则正常工作

### 测试4：检查AI的理解
- **前置条件**：开启"始终使用galgame界面"
- **操作**：查看AI在UpdateVariable中的变量更新
- **预期结果**：
  - AI将'下一回合界面选择'保持为'galgame'
  - AI不再尝试重置为'sprite'

## 问题根源总结

问题的本质是**规则与实际执行逻辑的不一致**：

1. **变量更新规则**告诉AI要重置为'sprite'
2. **变量守护脚本**实际上会强制覆盖为'galgame'
3. AI看到规则和实际结果不匹配，产生认知混淆
4. AI在下一回合时误判应该输出sprite格式

解决方案就是**让规则与实际逻辑保持一致**，明确告知AI变量守护机制的存在，避免认知混淆。

## 相关文件清单

- [`变量守护/index.ts`](../src/佩伊洛/脚本/变量守护/index.ts) - 变量守护脚本（已存在，无需修改）
- [`始终galgame界面控制器.txt`](../src/佩伊洛/世界书/始终galgame界面控制器.txt) - @@generate_before控制器（无需修改）
- [`变量更新规则.yaml`](../src/佩伊洛/世界书/变量/变量更新规则.yaml) - 需要修改
- [`下一回合界面选择.txt`](../src/佩伊洛/世界书/下一回合界面选择.txt) - 可选修改
- [`下一回合界面选择强调.txt`](../src/佩伊洛/世界书/下一回合界面选择强调.txt) - 需要修改

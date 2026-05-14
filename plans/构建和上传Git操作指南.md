# 构建和上传到 Git 操作指南

## 📋 任务概述

本指南将帮助你完成以下操作：
1. 运行 `pnpm build` 打包项目
2. 将打包后的文件提交到 Git
3. 创建版本标签 v1.0.1
4. 推送到 GitHub 远程仓库

---

## 🔍 项目信息

- **项目类型**：酒馆助手模板项目（tavern_helper_template）
- **构建工具**：webpack + pnpm
- **目标版本号**：v1.0.1
- **构建输出目录**：`dist/`
- **源代码目录**：`src/`

---

## 📝 操作步骤

### 步骤 1：检查当前 Git 状态

在开始之前，先检查项目的 Git 状态，了解有哪些文件被修改了。

**命令**：
```bash
git status
```

**作用**：
- 查看当前分支
- 查看未提交的更改
- 确认是否有未跟踪的文件

---

### 步骤 2：运行构建命令

使用 pnpm 运行生产环境构建。

**命令**：
```bash
pnpm build
```

**等价于**：
```bash
webpack --mode production
```

**这个命令会做什么**：
- 读取 `src/` 目录中的源代码
- 使用 webpack 进行打包、压缩、优化
- 将打包后的文件输出到 `dist/` 目录
- 可能会生成以下内容：
  - 打包后的 JavaScript 文件
  - 打包后的 CSS 文件
  - 处理后的 HTML 文件
  - 其他资源文件

**预期输出**：
- 构建成功后会显示打包统计信息
- `dist/` 目录会被更新或创建

---

### 步骤 3：检查构建输出

构建完成后，检查 `dist/` 目录确保文件正确生成。

**命令**：
```bash
dir dist /s
```
或者在 VSCode 中直接查看 `dist/` 文件夹。

**检查要点**：
- ✅ `dist/` 目录存在
- ✅ 包含你的项目文件（如 `佩伊洛/` 等）
- ✅ 文件大小合理（不是空文件）

---

### 步骤 4：查看更改的文件

再次检查 Git 状态，看看构建后有哪些文件被修改。

**命令**：
```bash
git status
```

**你可能会看到**：
- `dist/` 目录下的新文件或修改的文件
- 可能还有其他源代码的修改

---

### 步骤 5：添加文件到暂存区

将所有更改添加到 Git 暂存区。

**命令**：
```bash
git add .
```

**作用**：
- `.` 表示添加当前目录下所有更改
- 包括新增、修改、删除的文件
- `.gitignore` 中列出的文件会被自动忽略（如 `node_modules/`）

**注意**：
- 根据 `.gitattributes` 配置，`dist/` 目录的冲突会自动使用本地版本
- 这是正常的，因为 CI 会重新打包

---

### 步骤 6：提交更改

创建一个提交，记录这次更改。

**命令**：
```bash
git commit -m "更新佩伊洛角色卡并打包 v1.0.1"
```

**说明**：
- `-m` 后面的引号内是提交说明
- 提交说明应该简洁明了地描述这次更改
- 你可以根据实际情况修改说明内容

**其他提交说明示例**：
```bash
git commit -m "修复选择框强调功能"
git commit -m "添加CG系统支持"
git commit -m "更新世界书配置"
```

---

### 步骤 7：创建版本标签

为这次提交打上版本号标签。

**命令**：
```bash
git tag v1.0.1
```

**作用**：
- 标记这个提交为 v1.0.1 版本
- 方便以后回溯到这个版本
- jsdelivr CDN 可以通过标签访问特定版本

**版本号规则**：
```
v1.0.1
  │ │ │
  │ │ └── 补丁版本（bug修复、小调整）
  │ └──── 次版本（新增功能）
  └────── 主版本（重大更新）
```

**下次更新时**：
- 小修复：v1.0.1 → v1.0.2
- 新功能：v1.0.1 → v1.1.0
- 大改动：v1.0.1 → v2.0.0

---

### 步骤 8：推送代码到远程仓库

将提交推送到 GitHub。

**命令**：
```bash
git push
```

**作用**：
- 将本地的提交上传到 GitHub 远程仓库
- 更新远程仓库的代码

**可能遇到的情况**：
1. **成功推送**：显示上传进度和成功信息
2. **需要登录**：弹出登录窗口，使用 GitHub 账号登录
3. **需要 Token**：输入 Personal Access Token（参考教程生成）
4. **推送被拒绝**：可能需要先拉取远程更改
   ```bash
   git pull
   git push
   ```

---

### 步骤 9：推送标签到远程仓库

将版本标签也推送到 GitHub。

**命令**：
```bash
git push origin v1.0.1
```

**作用**：
- 将 v1.0.1 标签上传到 GitHub
- 让 jsdelivr CDN 能够访问这个版本

**注意**：
- 标签需要单独推送，`git push` 不会自动推送标签
- `origin` 是远程仓库的默认名称

---

### 步骤 10：验证上传成功

检查 GitHub 仓库确认上传成功。

**操作**：
1. 打开浏览器，访问你的 GitHub 仓库
2. 检查以下内容：
   - ✅ 最新提交显示在首页
   - ✅ `dist/` 目录已更新
   - ✅ 点击仓库页面的 "releases" 或 "tags"，能看到 v1.0.1 标签

**jsdelivr CDN 链接格式**：
```
https://testingcf.jsdelivr.net/gh/你的用户名/仓库名@v1.0.1/dist/佩伊洛/脚本/xxx.js
```

**测试 CDN 链接**：
- 将链接复制到浏览器地址栏
- 如果能看到文件内容，说明发布成功
- 如果显示 404，等待 5-10 分钟让 CDN 同步

---

## 🚀 完整命令速查

如果你熟悉流程，可以直接复制以下命令依次执行：

```bash
# 1. 检查状态
git status

# 2. 构建项目
pnpm build

# 3. 添加所有更改
git add .

# 4. 提交更改
git commit -m "更新佩伊洛角色卡并打包 v1.0.1"

# 5. 创建标签
git tag v1.0.1

# 6. 推送代码
git push

# 7. 推送标签
git push origin v1.0.1

# 8. 验证状态
git status
```

---

## ⚠️ 注意事项

### 关于 dist 目录

根据项目的 `.gitattributes` 配置：
```
dist/** merge=ours
```

这意味着：
- `dist/` 目录的内容会被提交到 Git
- 如果有冲突，会自动使用本地版本
- GitHub Actions 会在推送后自动重新打包，所以本地打包的内容是否完美不重要

### 关于 .gitignore

以下文件/目录不会被提交：
- `node_modules/` - 依赖包
- `*.log` - 日志文件
- `auto-imports.d.ts` - 自动生成的类型文件
- `components.d.ts` - 自动生成的组件类型文件

### 关于 GitHub Actions

推送后，GitHub Actions 会自动运行：
- **bundle.yaml**：自动打包并递增版本号
- **bump_deps.yaml**：定期更新依赖
- **sync_template.yaml**：同步模板更新

你可以在 GitHub 仓库的 "Actions" 标签页查看工作流运行状态。

---

## 🔧 常见问题

### Q1: pnpm 命令找不到

**错误信息**：`'pnpm' 不是内部或外部命令`

**解决方法**：
```bash
npm install -g pnpm
```

### Q2: 构建失败

**可能原因**：
- 依赖未安装：运行 `pnpm install`
- 代码有语法错误：检查错误信息并修复
- 内存不足：关闭其他程序后重试

### Q3: 推送被拒绝

**错误信息**：`rejected` 或 `failed to push`

**解决方法**：
```bash
git pull --rebase
git push
```

### Q4: 标签已存在

**错误信息**：`tag 'v1.0.1' already exists`

**解决方法**：
- 使用新的版本号：`git tag v1.0.2`
- 或删除旧标签：
  ```bash
  git tag -d v1.0.1
  git push origin --delete v1.0.1
  git tag v1.0.1
  git push origin v1.0.1
  ```

### Q5: 需要输入密码

如果 Git 要求输入密码，不能使用 GitHub 登录密码，需要使用 **Personal Access Token**。

**生成方法**：
1. GitHub 右上角头像 → Settings
2. Developer settings → Personal access tokens → Tokens (classic)
3. Generate new token (classic)
4. 勾选 `repo` 权限
5. 生成后复制 token（以 `ghp_` 开头）
6. 将 token 作为密码输入

---

## 📚 相关文档

- [从零开始发布脚本到GitHub教程.md](../从零开始发布脚本到GitHub教程.md) - 完整的 Git 和 GitHub 使用教程
- [README.md](../README.md) - 项目说明文档
- [package.json](../package.json) - 查看所有可用的构建命令

---

## ✅ 检查清单

完成后请确认：

- [ ] 运行 `pnpm build` 成功
- [ ] `dist/` 目录已更新
- [ ] 所有更改已提交到 Git
- [ ] 创建了版本标签 v1.0.1
- [ ] 代码已推送到 GitHub
- [ ] 标签已推送到 GitHub
- [ ] GitHub 仓库页面能看到最新提交
- [ ] jsdelivr CDN 链接可以访问（可能需要等待几分钟）

---

**祝你发布顺利！** 🎉

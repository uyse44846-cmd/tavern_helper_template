# 🌟 从零开始：注册 GitHub 并发布酒馆助手脚本教程

> 本教程面向完全没有 GitHub 和 Git 使用经验的用户，会手把手教你从注册账号开始，一步步完成脚本发布。所有英文界面都会告诉你该点哪个按钮。

---

## 📋 目录

1. [准备工作](#1-准备工作)
2. [注册 GitHub 账号](#2-注册-github-账号)
3. [安装 Git](#3-安装-git)
4. [配置 Git 身份信息](#4-配置-git-身份信息)
5. [在 GitHub 上创建仓库](#5-在-github-上创建仓库)
6. [克隆仓库到本地](#6-克隆仓库到本地)
7. [理解发布原理](#7-理解发布原理)
8. [第一次发布脚本](#8-第一次发布脚本)
9. [更新脚本（日常操作）](#9-更新脚本日常操作)
10. [常见问题与解决](#10-常见问题与解决)

---

## 1. 准备工作

你需要：

- 一台能上网的电脑（本教程以 Windows 为例）
- 一个邮箱（QQ邮箱、网易邮箱等都可以）
- 能访问 GitHub 网站（如果访问慢，后面会说怎么办）
- 你已经有打包好的脚本文件（比如 `index.js`）

---

## 2. 注册 GitHub 账号

### 第一步：打开 GitHub 官网

用浏览器打开 https://github.com

> ⚠️ 如果打不开或很慢，你可能需要科学上网工具，或者尝试用手机热点访问。

### 第二步：点击注册按钮

在页面右上角，你会看到一个绿色按钮 **"Sign up"**（注册），点击它。

![注册按钮位置](https://img.shields.io/badge/点击-Sign%20up-brightgreen?style=for-the-badge)

### 第三步：填写注册信息

GitHub 会一步一步问你信息：

1. **Enter your email**（输入你的邮箱）
   - 输入你的邮箱地址，比如 `xxxxx@qq.com`
   - 点击绿色的 **"Continue"**（继续）按钮

2. **Create a password**（创建密码）
   - 输入一个密码（至少8位，要包含数字和小写字母）
   - 点击 **"Continue"**

3. **Enter a username**（输入用户名）
   - 这个用户名很重要！它会出现在你的脚本链接里
   - 比如你取名 `sanmingyue`，以后脚本链接就是 `github.com/sanmingyue/xxx`
   - 只能用英文字母、数字和短横线 `-`
   - 如果提示 "Username is already taken"（用户名已被占用），换一个试试
   - 点击 **"Continue"**

4. **Email preferences**（邮件偏好）
   - 问你要不要接收 GitHub 的邮件通知
   - 输入 `n`（不要）或 `y`（要）都行，无所谓
   - 点击 **"Continue"**

### 第四步：验证你不是机器人

- 页面会出现一个验证码（可能是拼图或选图片）
- 按提示完成验证
- 点击 **"Create account"**（创建账号）

### 第五步：邮箱验证

- GitHub 会发一封验证邮件到你的邮箱
- 打开邮箱，找到 GitHub 发来的邮件
- 邮件里有一个 **8位数字验证码**，把它输入到 GitHub 页面上
- 或者直接点击邮件里的验证链接

### 第六步：跳过个性化设置

验证完成后，GitHub 可能会问你一些个性化问题（你是学生还是工作、团队多大等）：

- 你可以直接滚动到页面最下面，点击 **"Skip this step"**（跳过这一步）
- 或者随便选几个再点 **"Continue"**

✅ **恭喜！你的 GitHub 账号注册完成了！**

---

## 3. 安装 Git

Git 是一个版本管理工具，你需要把它安装到电脑上才能把文件上传到 GitHub。

### 第一步：下载 Git

打开 https://git-scm.com/download/win

页面会自动开始下载，如果没有自动下载，点击页面上的 **"Click here to download manually"**（点击这里手动下载）。

> 💡 如果下载很慢，可以用国内镜像：https://registry.npmmirror.com/binary.html?path=git-for-windows/

### 第二步：安装 Git

1. 双击下载好的安装包（文件名类似 `Git-2.xx.x-64-bit.exe`）
2. 安装过程中会弹出很多选项页面，**全部保持默认，一路点 "Next"（下一步）就好**
3. 最后点 **"Install"**（安装）
4. 安装完成后点 **"Finish"**（完成）

### 第三步：验证安装成功

1. 按键盘上的 `Win + R`，输入 `cmd`，按回车，打开命令提示符
2. 输入以下命令并按回车：

```bash
git --version
```

3. 如果看到类似 `git version 2.44.0.windows.1` 的输出，说明安装成功！

> ❌ 如果提示 `'git' 不是内部或外部命令`，请重启电脑后再试。

---

## 4. 配置 Git 身份信息

安装完 Git 后，你需要告诉 Git 你是谁。打开命令提示符（`Win + R` → 输入 `cmd` → 回车），输入以下两条命令：

```bash
git config --global user.name "你的GitHub用户名"
git config --global user.email "你注册GitHub用的邮箱"
```

**举个例子**，如果你的用户名是 `sanmingyue`，邮箱是 `sanmingyue@qq.com`：

```bash
git config --global user.name "sanmingyue"
git config --global user.email "sanmingyue@qq.com"
```

> 💡 这两条命令只需要执行一次，以后不用再设置。

---

## 5. 在 GitHub 上创建仓库

仓库（Repository）就是你在 GitHub 上存放文件的地方，相当于一个网盘文件夹。

### 第一步：进入创建页面

1. 登录 GitHub（https://github.com）
2. 点击页面右上角的 **"+"** 号
3. 在下拉菜单中点击 **"New repository"**（新建仓库）

### 第二步：填写仓库信息

| 项目 | 怎么填 | 说明 |
|------|--------|------|
| **Repository name**（仓库名） | 输入 `tavern_dist`（或你喜欢的名字） | 这个名字会出现在链接里 |
| **Description**（描述） | 可以写 `酒馆助手脚本发布仓库` | 选填，写不写都行 |
| **Public / Private** | 选择 **Public**（公开） | ⚠️ 必须选公开！jsdelivr 只能访问公开仓库 |
| **Add a README file** | ✅ **勾选上** | 勾选 "Add a README file" 这个选项 |

其他选项（`.gitignore`、`License`）都不用管，保持默认。

### 第三步：点击创建

点击页面底部的绿色按钮 **"Create repository"**（创建仓库）。

✅ **仓库创建完成！** 你会看到仓库页面，上面有一个 `README.md` 文件。

> 📝 记住你的仓库地址，格式是：`https://github.com/你的用户名/tavern_dist`
>
> 比如：`https://github.com/sanmingyue/tavern_dist`

---

## 6. 克隆仓库到本地

"克隆"就是把 GitHub 上的仓库下载到你的电脑上。

### 第一步：复制仓库地址

1. 在你刚创建的仓库页面，点击绿色的 **"<> Code"** 按钮
2. 在弹出的框里，确保选中的是 **"HTTPS"** 标签页
3. 复制框里的地址，格式是：`https://github.com/你的用户名/tavern_dist.git`

### 第二步：在电脑上克隆

1. 打开命令提示符（`Win + R` → 输入 `cmd` → 回车）
2. 先进入你想放仓库的位置（比如桌面）：

```bash
cd C:\Users\你的电脑用户名\Desktop
```

3. 执行克隆命令：

```bash
git clone https://github.com/你的用户名/tavern_dist.git
```

**举个例子**：

```bash
cd C:\Users\三明月\Desktop
git clone https://github.com/sanmingyue/tavern_dist.git
```

4. 等待下载完成，桌面上会出现一个 `tavern_dist` 文件夹

### 第三步：首次推送可能需要登录

第一次推送时，Git 可能会弹出一个登录窗口，让你登录 GitHub：

- 如果弹出浏览器窗口：直接用你的 GitHub 账号登录并授权
- 如果弹出一个小窗口要求输入用户名和密码：
  - 用户名输入你的 GitHub 用户名
  - 密码**不能用 GitHub 密码**，需要用 **Personal Access Token**（个人访问令牌），下面教你怎么生成

### 生成 Personal Access Token（如果需要）

1. 登录 GitHub，点击右上角你的头像
2. 点击 **"Settings"**（设置）
3. 在左边侧栏，滚动到最下面，点击 **"Developer settings"**（开发者设置）
4. 点击左边的 **"Personal access tokens"** → **"Tokens (classic)"**
5. 点击右上角 **"Generate new token"** → **"Generate new token (classic)"**
6. 可能需要输入 GitHub 密码确认
7. 填写信息：
   - **Note**（备注）：随便写，比如 `我的电脑`
   - **Expiration**（过期时间）：选 **"No expiration"**（永不过期）
   - **Select scopes**（权限范围）：勾选 **"repo"**（整个 repo 大类都勾上）
8. 滚动到最下面，点击绿色的 **"Generate token"**（生成令牌）
9. ⚠️ **立即复制生成的令牌！** 它只会显示一次！
   - 令牌是一串以 `ghp_` 开头的字符，比如 `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 把它保存到一个安全的地方（比如记事本里）

> 以后 Git 要求输入密码时，粘贴这个令牌就行了。

---

## 7. 理解发布原理

在开始操作之前，先理解一下整个发布是怎么回事：

```
你的电脑                           GitHub                          jsdelivr CDN
┌──────────────┐     git push    ┌──────────────┐    自动同步    ┌──────────────┐
│ tavern_dist  │ ──────────────→ │ GitHub仓库   │ ────────────→ │ CDN 加速链接  │
│ (本地文件夹)  │                 │ (云端存储)    │               │ (玩家访问)    │
└──────────────┘                 └──────────────┘               └──────────────┘
```

**简单来说就是三步**：
1. 把打包好的脚本文件放进本地的 `tavern_dist` 文件夹
2. 用 Git 命令把文件上传到 GitHub
3. 通过 jsdelivr 的免费 CDN 链接分享给玩家

**CDN 链接格式**：
```
https://testingcf.jsdelivr.net/gh/你的用户名/tavern_dist@版本号/文件路径
```

例如：
```
https://testingcf.jsdelivr.net/gh/sanmingyue/tavern_dist@xw-v1.0.0/dist/我的脚本/index.js
```

**版本号（Git Tag）** 的作用：
- 每次更新脚本，你给它打一个"标签"（tag），比如 `v1.0.0`、`v1.1.0`
- 玩家用的链接里包含版本号，所以你更新脚本不会影响使用旧版本的玩家
- 你也可以用 `@latest` 让链接始终指向最新版本

---

## 8. 第一次发布脚本

假设你已经有一个打包好的脚本文件 `index.js`，我们来把它发布到 GitHub。

### 第一步：整理文件

在你克隆下来的 `tavern_dist` 文件夹里，创建目录结构来存放文件：

```
tavern_dist/
├── dist/
│   └── 你的脚本名/
│       └── index.js        ← 你打包好的脚本文件放这里
└── README.md
```

**操作方法**：
1. 打开 `tavern_dist` 文件夹
2. 新建一个文件夹叫 `dist`
3. 在 `dist` 里新建一个文件夹，用你的脚本名命名（比如 `我的脚本`）
4. 把打包好的 `index.js` 复制进去

### 第二步：用 Git 上传

打开命令提示符，执行以下命令：

```bash
cd C:\Users\你的电脑用户名\Desktop\tavern_dist
```

然后依次执行：

```bash
git add .
git commit -m "首次发布我的脚本"
git tag v1.0.0
git push
git push origin v1.0.0
```

**逐行解释**：

| 命令 | 作用 |
|------|------|
| `git add .` | 把所有新增/修改的文件标记为"准备上传" |
| `git commit -m "首次发布我的脚本"` | 把标记的文件打包成一次提交，引号里是备注说明 |
| `git tag v1.0.0` | 给这次提交打一个版本号标签 |
| `git push` | 把提交上传到 GitHub |
| `git push origin v1.0.0` | 把版本号标签也上传到 GitHub |

### 第三步：验证上传成功

1. 打开浏览器，进入你的 GitHub 仓库页面（`https://github.com/你的用户名/tavern_dist`）
2. 你应该能看到 `dist` 文件夹
3. 点进去能看到你的脚本文件

### 第四步：获取 CDN 链接

你的脚本的 CDN 链接是：

```
https://testingcf.jsdelivr.net/gh/你的用户名/tavern_dist@v1.0.0/dist/你的脚本名/index.js
```

**举个例子**：

```
https://testingcf.jsdelivr.net/gh/sanmingyue/tavern_dist@v1.0.0/dist/我的脚本/index.js
```

玩家在酒馆助手中使用这个链接：

```javascript
import 'https://testingcf.jsdelivr.net/gh/sanmingyue/tavern_dist@v1.0.0/dist/我的脚本/index.js'
```

### 第五步：测试链接是否可用

把 CDN 链接复制到浏览器地址栏，按回车：
- 如果能看到脚本代码，说明发布成功！🎉
- 如果显示 404，等几分钟再试（jsdelivr 需要一点时间同步）

---

## 9. 更新脚本（日常操作）

以后每次更新脚本，只需要重复以下步骤：

### 第一步：替换文件

把新打包好的 `index.js` 覆盖到 `tavern_dist/dist/你的脚本名/index.js`

### 第二步：上传并打新版本号

```bash
cd C:\Users\你的电脑用户名\Desktop\tavern_dist
git add .
git commit -m "更新说明，比如：修复了xx问题"
git tag v1.0.1
git push
git push origin v1.0.1
```

> 💡 版本号要比上次大！比如上次是 `v1.0.0`，这次就用 `v1.0.1` 或 `v1.1.0`。

### 第三步：更新 CDN 链接

把分享给玩家的链接里的版本号改成新的：

```
旧：...@v1.0.0/dist/...
新：...@v1.0.1/dist/...
```

### 版本号递增规则（建议）

```
v1.0.0
  │ │ │
  │ │ └── 补丁版本：修bug、小调整（v1.0.0 → v1.0.1）
  │ └──── 次版本：新增功能（v1.0.0 → v1.1.0）
  └────── 主版本：大改动（v1.0.0 → v2.0.0）
```

---

## 10. 常见问题与解决

### ❓ Q: 推送时提示 "Permission denied" 或 "Authentication failed"

**原因**：没有登录或令牌过期。

**解决**：
1. 重新生成 Personal Access Token（参考[第6节](#生成-personal-access-token如果需要)）
2. 在 Windows 的"凭据管理器"中删除旧的 GitHub 凭据：
   - 按 `Win` 键搜索 **"凭据管理器"**（或 **"Credential Manager"**），打开它
   - 点击 **"Windows 凭据"**
   - 找到 `git:https://github.com`，点击它
   - 点击 **"删除"**（或 **"Remove"**）
3. 下次推送时会重新要求登录，输入新的令牌即可

### ❓ Q: `git push` 提示 "rejected" 或 "failed to push"

**原因**：可能是你在 GitHub 网页上直接修改过文件，导致本地和远程不一致。

**解决**：先拉取远程的改动，再推送：

```bash
git pull
git push
```

### ❓ Q: 打了一个错误的 tag 怎么删除？

```bash
# 删除本地 tag
git tag -d 错误的tag名

# 删除远程 tag
git push origin --delete 错误的tag名
```

例如：

```bash
git tag -d v1.0.0
git push origin --delete v1.0.0
```

### ❓ Q: jsdelivr CDN 链接打不开 / 显示 404

可能的原因和解决方法：

1. **刚刚推送的**：等 5-10 分钟再试，CDN 需要时间同步
2. **链接拼写错误**：仔细检查用户名、仓库名、版本号、文件路径是否正确
3. **仓库不是公开的**：去 GitHub 仓库的 **"Settings"**（设置）→ 下拉到 **"Danger Zone"** → 点击 **"Change visibility"**（更改可见性），改为 **"Public"**（公开）
4. **CDN 缓存问题**：如果更新了文件但 CDN 还是旧的，换一个新的版本号 tag 即可

### ❓ Q: 中文文件名乱码怎么办？

执行以下命令让 Git 正确显示中文：

```bash
git config --global core.quotepath false
```

### ❓ Q: GitHub 打不开怎么办？

- 尝试使用 [GitHub 镜像站](https://hub.nuaa.cf/) 或 [GitHub 加速](https://ghproxy.com/)
- 使用科学上网工具
- Git 推送通常不受影响，只是网页访问可能较慢

### ❓ Q: 我有多个脚本项目，版本号会冲突吗？

不会！你可以给不同项目使用不同的版本号前缀，比如：

| 项目 | 版本号示例 | 说明 |
|------|-----------|------|
| 我的脚本A | `a-v1.0.0`、`a-v1.0.1` | 前缀 `a-v` |
| 我的脚本B | `b-v1.0.0`、`b-v1.1.0` | 前缀 `b-v` |
| 我的脚本C | `c-v1.0.0` | 前缀 `c-v` |

每个项目的版本号独立递增，互不影响。

发布命令示例：

```bash
git add .
git commit -m "更新脚本A"
git tag a-v1.0.1
git push && git push origin a-v1.0.1
```

---

## 📌 命令速查表

以下是你最常用的 Git 命令，打印出来贴在旁边方便随时查看：

```bash
# 📦 首次发布
cd 你的tavern_dist路径
git add .                        # 标记所有改动
git commit -m "发布说明"          # 提交改动
git tag v1.0.0                   # 打版本号
git push                         # 上传到 GitHub
git push origin v1.0.0           # 上传版本号

# 🔄 日常更新
git add .                        # 标记改动
git commit -m "更新说明"          # 提交
git tag v1.0.X                   # 新版本号（X换成新数字）
git push                         # 上传
git push origin v1.0.X           # 上传版本号

# 🔍 查看信息
git status                       # 查看哪些文件有改动
git log --oneline                # 查看提交历史
git tag                          # 查看所有版本号

# 🗑️ 修正错误
git tag -d 错误tag               # 删除本地版本号
git push origin --delete 错误tag  # 删除远程版本号
```

---

## 🎯 完整流程总结

```
第一次使用：
  注册 GitHub → 安装 Git → 配置身份 → 创建仓库 → 克隆到本地
                                                    ↓
每次发布：                                          ↓
  打包脚本 → 复制到 tavern_dist → git add . → git commit → git tag → git push
                                                    ↓
  分享给玩家：
  import 'https://testingcf.jsdelivr.net/gh/用户名/仓库名@版本号/dist/脚本名/index.js'
```

---

> 🎉 恭喜你学会了！以后更新脚本只需要 **复制文件 + 5条命令**，非常简单。

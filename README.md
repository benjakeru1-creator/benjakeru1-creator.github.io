# 王成 · 视觉传达设计作品集 / Portfolio 2026

一个纯前端（HTML + CSS + 原生 JS，无构建步骤、无框架）的个人设计作品网站。
把 `D:\作品集` 里的 87 件图版与影像重新整理成 **19 个项目 / 6 个方向**，并做了动效、交互与循环播放。

---

## 1. 怎么打开

**方式一（最简单）**：双击 `site/index.html`，用 Chrome / Edge 打开即可。全部功能可用，不需要联网。

**方式二（本地服务器，推荐给分享 / 局域网演示）**：

```bash
cd D:\作品集\site
python -m http.server 8080
# 浏览器打开 http://127.0.0.1:8080
```

> 字体优先使用系统已装的 **Noto Serif SC / Noto Sans SC**；若联网还会加载 Google Fonts，离线时自动回退，版式不变。

---

## 2. 网站结构与功能

| 区块 | 内容 | 交互 |
|---|---|---|
| **Hero 首屏** | 姓名、身份、主张、循环展示窗 | 展示窗每 5 秒自动切换（带进度条）；鼠标视差；点击进入案例 |
| **01 简介** | 个人陈述、数据统计 | 滚动时文字由浅到深填充（text-scrub）；数字滚动计数 |
| **02 精选作品** | 19 个项目索引 | 悬停：整行反色 + 标题缩进 + 跟随光标的预览图；点击进入案例 |
| **03 循环影像** | 两条无限横向循环的影像带 | 自动循环流动、可拖拽、悬停暂停、点击进案例 |
| **04 资料库** | 87 件图版 / 影像瀑布流 | 方向筛选、模糊占位渐显、点击大图（← → 切换、ESC 关闭） |
| **05 能力** | 6 个设计方向 + 工具条 | 悬停展开说明；工具名无限滚动 |
| **06 联系** | 邮箱 / 电话 | 点击一键复制并弹出提示 |
| **案例层** | 每个项目的完整图版 | 全屏上滑展开、视频自动循环播放、图版自适应排版、下一个项目、URL 深链 `#/work/tea` |

**循环播放**（三处）：
1. 首屏展示窗 5 秒自动轮播 + 进度条；
2. 影像区两条无限循环滚动带（可拖拽 / 悬停暂停）；
3. 所有视频 `<video muted loop playsinline>` 自动静音循环。

**其他细节**：昼夜双主题（右上角「夜航 / 日光」，带圆形擦除转场，本地记住选择）、自定义光标、滚动进度线、胶片颗粒、滚动渐显、`prefers-reduced-motion` 适配、键盘可操作、移动端断点适配。

---

## 3. 目录

```
D:\作品集\
├─ site\                       ← 网站（可整个文件夹上传到任意静态托管）
│  ├─ index.html
│  └─ assets\
│     ├─ css\style.css         设计系统、动效、响应式
│     ├─ js\app.js             全部交互逻辑（原生 JS）
│     ├─ data.js               网站内容数据（自动生成）
│     ├─ favicon.svg
│     ├─ img\   80 张 webp     由原图压缩，长边 ≤1600px
│     └─ media\ 7 段 mp4       循环用短片（无音轨，h264 faststart）
├─ build\
│  ├─ build_media.py           素材流水线：压缩图片 / 转码视频 / 生成 data.js
│  └─ shot.mjs                 无头 Chrome 截图自检脚本
└─ （原始设计文件保持不动）
```

---

## 4. 怎么改内容

### 改姓名 / 邮箱 / 电话 / 个人陈述

- 姓名、标语等文字：`site/index.html` 里搜索「王成」直接改。
- 邮箱、电话：改动两处（保持一致）
  1. `site/index.html` → `<footer class="band band--ink contact">` 里的 `data-copy="..."` 与显示文本；
  2. `site/assets/data.js` → 开头 `"meta":{ "email":"...", "phone":"..." }`。
- 当前：邮箱 `2923694851@qq.com`，电话 `18384335129`（要换的话两处一起改）。
- 微信一行已按要求删除；如需加回，在 `index.html` 的联系区复制一行 `.crow` 按钮即可。

### 改项目文案 / 增删项目

所有项目文案都在 `build/build_media.py` 顶部的 `PROJECTS` 列表里（标题、英文名、类别、年份、角色、工具、描述、以及每张图的说明）。
改完运行：

```bash
python build/build_media.py
```

它会重新压缩图片、转码视频并重新生成 `site/assets/data.js`（约 3 分钟）。
若只是改文字、不换图片，可以直接编辑 `site/assets/data.js`（JSON 结构，注意逗号）。

### 换首页循环展示的项目

`site/assets/js/app.js` 顶部：

```js
const HERO = ['tea','guhuo','xiaoyexing','skyforge','mapping','bayou'];  // 首屏 6 个
const COVERS = { tea: 1, ... };   // 每个项目用第几张图做封面
```

---

## 5. 部署（已上线）

**线上地址：https://benjakeru1-creator.github.io/**
仓库：https://github.com/benjakeru1-creator/benjakeru1-creator.github.io （public，GitHub Pages 自动构建）

### 以后改完怎么更新

改完 `site` 里的文件后，运行根目录的 [更新网站.ps1](更新网站.ps1)（右键 →「使用 PowerShell 运行」），
脚本会把整个 `site` 重新上传成一个新提交，1～2 分钟后线上自动刷新：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File "D:\作品集\更新网站.ps1"
```

> 脚本读取的是本机 GitHub CLI 保存的登录凭据；如果以后失效，运行 `gh auth login` 重新登录即可。
> 也可以装个 Git，用常规流程：`git clone` → 改 → `git commit && git push`。

### 换到别的平台

`site` 是纯静态资源，同样可以直接拖到 Vercel / Netlify / 腾讯云 COS / 阿里云 OSS。
体积参考：图片 9.2 MB + 视频 14 MB ≈ 23 MB，首次加载按需懒加载。

> GitHub Pages 免费版要求仓库 public（你的作品本身就是要被看到的，没问题）。
> 国内访问 github.io 有时会慢，微信里打开也可能受限；需要更快的话，同样这套文件放到 Vercel 或国内 OSS + CDN 即可。

---

## 6. 技术说明

- 零依赖、零构建：`index.html` + 1 个 CSS + 2 个 JS（其中 data.js 是生成的数据）。
- 动效全部基于 `transform / opacity / clip-path` + `IntersectionObserver` + `requestAnimationFrame`，滚动不触发布局抖动。
- 图片：WebP（质量 82），每张附带 26px 的 base64 模糊占位图（LQIP），加载时淡入；`loading="lazy"`。
- 视频：H.264 / CRF 26-27，去掉音轨，`+faststart`，按需 `preload`，进入视口才播放，离开即暂停。
- 主题：CSS 变量 + View Transitions API（不支持的浏览器自动降级）。
- 深链：`index.html#/work/tea` 可直接打开某个案例，浏览器返回键可关闭。

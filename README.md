# 📚 学习资料库 (Learning Resources)

一个基于 **Vue 3 + TypeScript + Vite** 构建的现代化、轻量级学习资料导航库。

项目采用自动化脚本扫描本地 HTML 文件，自动生成树状目录结构，并支持**毫秒级实时搜索**，完美适配个人知识沉淀与在线分享。

## ✨ 特性

- 🚀 **极速加载**：基于 Vite 构建，纯静态页面，秒开体验。
- 🌳 **无限层级树**：支持任意深度的文件夹嵌套，直观的 `|` 对齐线排版。
- 🔍 **实时搜索**：输入关键字即时过滤文件树，并自动展开匹配路径，实时统计结果数量。
- 🤖 **自动化目录生成**：只需把 `.html` 资料丢进对应文件夹，运行脚本即可自动更新目录树，告别手动维护 JSON。
- 🛡️ **类型安全**：基于 TypeScript 构建，核心数据结构拥有严格的类型约束。
- 🎨 **现代 UI**：居中卡片式布局、平滑的过渡动画与焦点光晕，仿 VSCode / Notion 的阅读体验。

## 🛠️ 技术栈

- 前端框架：Vue 3 (Composition API / `<script setup>`)
- 状态管理：Pinia
- 构建工具：Vite
- 开发语言：TypeScript
- 样式：原生 CSS (Scoped)

## 📂 项目结构

```text
Learning-Resources/
├── public/
│   └── docs/                # 存放你的 html/md 资料的地方（建议按学科分文件夹）
├── scripts/
│   └── scan-docs.js         # 自动化扫描脚本（生成 docs-paths.json）
├── src/
│   ├── components/
│   │   ├── TreeNode.vue     # 递归渲染的树节点组件
│   │   └── TreeView.vue     # 树形视图容器（包含搜索框）
│   ├── data/
│   │   └── docs-paths.json  # 自动生成的路径数据（已在 .gitignore 中忽略）
│   ├── stores/
│   │   └── tree.ts          # Pinia Store（状态与搜索过滤逻辑）
│   ├── types/
│   │   └── tree.ts          # 核心数据类型定义
│   ├── utils/
│   │   └── tree.ts          # 纯函数（建树、过滤、统计）
│   ├── App.vue              # 根组件（页面布局）
│   ├── main.ts              # 应用入口
│   └── style.css            # 全局样式（可选）
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 🚀 本地运行

1. **克隆仓库**
   ```bash
   git clone git@github.com:你的用户名/仓库名.git
   cd 仓库名
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或者 pnpm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   打开浏览器访问 `http://localhost:5173` 即可。

## 📖 如何添加新的学习资料？

本项目的核心工作流如下：

1. **编写与导出**：在你的笔记软件（如 Typora, Obsidian, markdown-preview-enhanced）中写好 `.md` 源文件，并将其**导出为独立的 `.html` 文件**。
2. **放置文件**：将导出的 `.html`（与其关联的图片文件夹）放入 `public/docs/` 下的对应分类目录中。例如：
   ```text
   public/docs/
   └── 大学/
       └── 高等数学/
           └── 微分方程/
               └── 化归.html
   ```
   *(注：扫描脚本会自动忽略 `.md` 源文件以及 `图`、`images` 等图片目录)*
3. **重新构建**：
   ```bash
   npm run build
   ```
   或者本地直接 `npm run dev`。项目会自动运行 `scripts/scan-docs.js`，更新树状目录。

## ☁️ 部署

本项目已配置好适配 **Cloudflare Pages** 或 **Vercel** 的自动构建。

- **构建命令**：`npm run build` (或 `pnpm run build`)
- **输出目录**：`dist`
- **环境变量**：建议在部署平台设置 `NODE_VERSION = 20`，以保证扫描脚本正常运行。

## 📄 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。资料内容仅供个人学习交流使用。

# ReleaseSmith 路线图

## v0.1.0 · 发布体检基础

- [x] Tauri + React + TypeScript 桌面工程
- [x] 中文开发者工具界面与基础导航
- [x] 本地目录选择和受限只读扫描
- [x] Tauri / Electron / Node.js / Rust / 通用项目识别
- [x] 名称、描述、多来源版本与 Git 信息
- [x] 可扩展检查规则、评分和首批基础规则
- [x] 体检报告与可勾选清单
- [x] 最近项目摘要本地保存
- [x] Windows / macOS 发布配置专项规则
- [x] 配置解析错误的结构化展示

## v0.2.0 · 桌面软件发布工作台

- [x] 独立 Release Session、自动保存与发布历史；
- [x] 从项目加载到发布交付的九步一条龙向导；
- [x] 分步骤发布工作区与发布信息编辑；
- [x] 跨平台发布产物识别、检查与 SHA-256；
- [x] 从 Git 提交生成可编辑更新日志；
- [x] 通过 GitHub CLI 发布 Release 安装包或公开/私有源码仓库；
- [x] 本地生成朋友圈和小红书文案；
- [x] 本地生成二维码和宣传海报；
- [x] 安全导出完整发布资料包。

## v0.3.0 · 发布自动化与平台指导

- [x] GitHub Actions 在 Windows、macOS Intel 和 macOS Apple Silicon 上自动构建并发布；
- [x] Tauri updater 签名产物、`latest.json` 和跨平台校验文件；
- [x] 私有源码仓与公开发布仓分离的发布模板；
- 更完整的 Windows 安装包配置体检；
- macOS Bundle Identifier、签名、公证配置与引导；
- 更细致的跨平台发布建议。

## 未来方向

- 经用户明确确认后执行本地构建、签名与公证；
- 可选 GitHub API Provider；
- 可选 OpenAI 兼容内容 Provider；
- 团队检查模板与更多项目生态。

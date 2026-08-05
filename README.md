# ReleaseSmith（发版匠）

ReleaseSmith 是一款面向独立开发者的本地优先软件发布助手。它把本地软件项目的名称、版本、Git 状态、发布资源和必要文档整理成一份可执行的发布体检报告。

当前版本为 `v0.2.0`。项目正在从发布体检工具扩展为完整的桌面软件发布工作台。

## 仓库与下载

- 源码仓（私有）：[Liangxd/releasesmith-src](https://github.com/Liangxd/releasesmith-src)；
- 安装包与更新资产（公开）：[Liangxd/releasesmith-releases](https://github.com/Liangxd/releasesmith-releases)；
- 最新版本下载：[GitHub Releases](https://github.com/Liangxd/releasesmith-releases/releases/latest)。

源码仓的 README 和发布文档是项目介绍的唯一来源，会自动同步到公开发布仓，确保两个仓库展示一致。

## 当前能力

- 通过可恢复的九步发布向导串联项目加载、体检、发布、宣传与最终交付；
- 根据真实会话内容显示完成度、当前步骤、未解锁步骤和缺失条件；
- 选择本地项目目录并执行只读扫描；
- 识别 Tauri、Electron、Node.js、Rust 和通用项目；
- 从 `package.json`、`Cargo.toml`、`tauri.conf.json/json5` 读取名称与版本；
- 显示 Git 分支、工作区状态、远程仓库和当前版本标签状态；
- 检查基础信息、多来源版本一致性、Git 状态、图标、常见文档和发布产物；
- 用透明权重计算发布准备度；
- 从警告和阻塞项生成可勾选清单并复制 Markdown；
- 创建独立发布会话，自动保存并从发布历史恢复或复制；
- 编辑版本、标签、发布标题、目标用户、亮点、平台、下载说明与已知问题；
- 识别 Windows、macOS、Linux 和跨平台发布产物；
- 从文件名辅助判断产物平台、架构、版本和类型，并允许手动修正；
- 流式计算所选产物的 SHA-256，显示进度并支持取消；
- 安全读取最近标签或指定标签到 HEAD 的 Git 提交；
- 解析 Conventional Commits，生成可编辑、可排序的更新日志；
- 识别多个 GitHub Remote，并优先选择 `origin`；
- 提供 GitHub 账号输入，并可在确认页选择发布 Release 安装包、仅推送源码，或一键触发跨平台自动发布；
- Release 模式通过确认页创建强制 Draft Release 并上传选中的安装包；自动模式可创建/更新私有源码仓和公开发布仓，推送已提交内容与发布标签；
- 提供 Tauri updater 签名配置、公开发布仓 endpoint 和 GitHub Actions 跨平台自动发布模板；
- 在本机生成朋友圈和小红书文案，并提示绝对化、占位和缺失信息；
- 在本机生成下载二维码和三套宣传海报，支持方形、竖版、横版及 1–3 张产品截图；
- 原分辨率导出 PNG，并安全导出完整发布资料包；
- 在本机应用数据目录保存最近项目与发布会话。
- 提供真实可用的最近项目、启动恢复和默认导出目录设置；
- 配置解析失败会显示具体文件和安全、友好的修复提示，不会静默当作未识别；

当前版本不会替用户项目构建安装包、修改用户项目或执行签名、公证，也不会自动发布社交平台内容。GitHub 写操作只会在用户明确确认后执行：Release 模式创建 Draft Release，源码模式创建/更新源码仓库并推送已提交内容和发布标签。跨平台构建由源码仓库中的 GitHub Actions 负责。

## 一条龙发布流程

桌面端默认进入“发布向导”。主界面会根据真实发布会话自动定位下一步，并在具体页面顶部持续展示进度、缺失条件和唯一的继续操作：

1. 加载软件项目；
2. 查看发布体检和修复建议；
3. 填写发布版本、标题、亮点、平台、下载方式和当前限制；
4. 从 Git 提交整理可编辑更新日志；
5. 扫描各平台安装包并生成 SHA-256；
6. 可选发布 GitHub Release 安装包或源码仓库与发布标签；
7. 可选生成并复核朋友圈、小红书文案；
8. 可选生成二维码、合成产品截图并确认海报；
9. 导出完整发布资料包。

流程状态随发布会话自动保存。退出应用或从“发布历史”恢复会话后，会回到尚未完成的步骤。GitHub、宣传文案和海报步骤都可以安全跳过；ReleaseSmith 不会绕过确认创建正式 Release。

发布会话版本只存在于 ReleaseSmith 本地记录中。修改它不会改写 `package.json`、`Cargo.toml` 或 Tauri 配置。

完整资料包默认写入所选目录下的 `release-output/v版本号`，包含发布摘要、发布清单、GitHub 草稿正文、更新日志、SHA-256、产物清单、社交文案和三种 PNG 海报。安装包默认不复制；勾选后才会复制到 `artifacts/`。发生重名时会创建带时间后缀的新目录，不覆盖旧资料。

## macOS 桌面版

DMG 可直接拖入“应用程序”安装。当前试用包使用本机运行所需的完整 ad-hoc bundle 签名，但尚未使用 Apple Developer ID 身份签名和公证，因此 macOS 仍可能阻止首次打开。可在 Finder 中右键应用并选择“打开”，再次确认即可。正式分发前应替换为 Developer ID 签名并完成公证。

详细步骤和当前 DMG 校验值见 [INSTALL.md](./INSTALL.md)。

## 发布产物识别

扫描范围包括 `dist`、`build`、`release`、`releases`、`out`、`bundle`、`target/release` 和 `src-tauri/target/release`。最多扫描 5 层、2000 个候选产物，不跟随符号链接，并跳过 Git、依赖、调试、缓存和临时目录。达到上限或遇到不可读条目时会保留已发现结果并明确提示，不再静默丢失。

支持的主要类型：

- Windows：EXE、MSI、MSIX、ZIP、7z；
- macOS：DMG、PKG、APP、ZIP；
- Linux：AppImage、DEB、RPM、tar.gz、tar.xz、ZIP；
- 通用：JAR、WHL、校验文件和签名文件。

文件名识别只是辅助判断。无法可靠判断时会标记为未知，并允许用户手动指定。

## GitHub CLI

GitHub 发布功能依赖用户本机的 [GitHub CLI](https://cli.github.com/)：

```bash
gh auth login
gh auth status
```

ReleaseSmith 不会自动安装 `gh`，不会读取其认证文件，也不会保存或输出 GitHub Token。

GitHub 步骤会要求输入目标 GitHub 账号。账号输入只用于确定目标仓库命名空间；实际认证仍使用本机已经登录的 `gh`。源码模式还可以选择公开或私有仓库：新仓库按选择创建，已有仓库在确认后调整可见性并推送当前项目的已提交内容。未提交的本地修改不会被自动提交。

### GitHub Actions 自动发布

推荐将 `Liangxd/releasesmith-src` 作为私有源码仓，将 `Liangxd/releasesmith-releases` 作为公开发布仓。在 GitHub 步骤选择“自动跨平台发布”后，ReleaseSmith 会准备两个仓库并推送标签；源码仓中的 [`release.yml`](./.github/workflows/release.yml) 会在 `v*.*.*` 标签推送后调用 Tauri Action，在 Windows、macOS Intel 和 macOS Apple Silicon Runner 上构建，生成 `.sig`、`latest.json` 和 `SHA256SUMS.txt`，然后把资产发布到公开仓。完整的 Secrets 和版本发布步骤见 [RELEASE_AUTOMATION.md](./RELEASE_AUTOMATION.md)。

安全机制：

- 创建前检查仓库访问权限、标签、已有 Release、目标分支和上传文件；
- 没有仓库写权限、附件重名、缺少 SHA-256、产物版本冲突或单文件达到 GitHub 的 2 GiB 上限时会阻止 Release 创建；源码模式会检查项目是有效 Git 仓库并检查目标仓库写权限；
- 完整展示仓库、账号、可见性、标签、正文、Draft 状态和待上传文件；
- 未勾选确认时，前端和 Rust 后端都会拒绝创建；
- Release 模式的 Rust 后端始终加入 `--draft`，忽略任何要求创建正式 Release 的客户端值；源码模式不会创建 Release；
- 创建和上传使用参数数组，不通过 shell 拼接命令；
- Release 创建后逐个上传附件，能区分成功和失败的文件；
- v0.2.0 不删除或覆盖已有标签和 Release。

## Tauri 插件与诊断日志

桌面端只接入当前功能实际需要的官方插件：

- Dialog：选择项目、产物、截图和导出位置，以及保存海报；
- Opener：在 Finder 中显示项目/导出文件，并仅打开 GitHub 与小红书创作服务的 HTTPS 链接；
- Clipboard Manager：只允许写入文本，不读取用户剪贴板；
- Log：默认记录 Info 及以上级别的脱敏诊断事件。

macOS 日志文件位于 `~/Library/Logs/com.releasesmith.desktop/ReleaseSmith.log`。日志只记录类似
`[diagnostic] project.scan_failed` 的事件代号，不记录用户文案、项目源代码、剪贴板内容、完整环境变量或 GitHub 凭据。

## 技术栈

- Tauri 2 + Rust
- React 19 + TypeScript
- Vite 8
- Vitest

## 本地开发

前置环境：

- Node.js 20 或更高版本
- npm
- Rust stable
- 对应平台的 [Tauri 系统依赖](https://v2.tauri.app/start/prerequisites/)

安装依赖并启动桌面开发模式：

```bash
npm install
npm run tauri dev
```

仅启动浏览器中的前端壳：

```bash
npm run dev
```

目录选择和项目扫描依赖 Tauri 运行时，在普通浏览器中不可用。

## 验证

```bash
npm run test
npm run build
cargo test --manifest-path src-tauri/Cargo.toml
cargo check --manifest-path src-tauri/Cargo.toml
```

## 工程边界

```text
src/
├── app/          # 应用壳、主题与全局状态
├── components/   # 通用界面组件
├── domain/       # 项目、检查、发布内容领域模型
├── i18n/         # 本地化词条入口
├── pages/        # 页面组合
├── features/     # 产物、更新日志、GitHub、海报和导出步骤
└── services/     # 扫描调用、规则、会话及内容转换

src-tauri/src/
├── artifacts/    # 发布产物识别与检查
├── checksum/     # 流式 SHA-256
├── commands/     # Tauri 命令边界
├── filesystem/   # 受限目录遍历
├── git/          # 固定参数、超时的只读 Git 查询
├── github/       # GitHub CLI 预检查、Draft 创建与源码推送
├── models/       # 跨进程统一数据模型
├── release_export/ # 原子化发布资料包导出
├── scanner/      # 项目识别与配置解析
└── session_store/ # 应用数据目录中的发布会话
```

项目扫描器最多遍历项目下 5 层、5000 个文件；配置、README、许可证、隐私说明和常见图标路径会在普通文件限额之前优先检查，因此大型源码目录不会再挤掉关键发布信息。达到上限或遇到不可读条目时，会在项目页和体检报告中明确提示。产物扫描使用独立的常见输出目录扫描器，最多返回 2000 个候选产物。两者都不跟随符号链接。

## 本地数据与隐私

- 发布会话保存在系统应用数据目录的 `com.releasesmith.desktop/release-sessions` 下；
- macOS 通常位于 `~/Library/Application Support/com.releasesmith.desktop/`；
- 最近项目摘要和设置保存在同一系统应用数据目录的 `app-state.json`，不再依赖 WebView localStorage；旧记录会自动迁移；
- 应用设置和发布会话均采用临时文件、备份与恢复机制保存；
- 发布会话带有独立 schema 版本；旧版本会在读取时迁移并重写，损坏或不兼容的单个文件会被跳过并在界面提示，不影响其他历史记录；
- 扫描期间不会写入用户项目；
- 默认不上传源代码；仅在用户明确选择“源码仓库”并确认发布后推送源代码，不读取证书私钥内容，不记录令牌或密码；
- Git 查询通过参数数组调用，不使用 shell，不接受用户命令字符串，并设有 3 秒超时；
- GitHub 写操作使用用户已经登录的 GitHub CLI；源码推送前会运行 `gh auth setup-git` 以让 Git 使用同一份认证；
- 源码模式的确认会推送已提交分支和指定标签；标签已存在时会阻止操作，不覆盖远程标签；
- 应用更新检查只请求公开发布仓的 `latest.json`，只有用户在“设置”中确认安装时才下载、安装并重启；
- 只有明确确认的 GitHub Draft 创建、源码仓库创建/可见性调整/推送，或用户确认安装更新，才产生对应外部写入。

完整说明见 [PRIVACY.md](./PRIVACY.md)。

## 版本与授权

- 版本变化见 [CHANGELOG.md](./CHANGELOG.md)；
- 当前源码未授予复制、修改或再分发许可，具体条款见 [LICENSE](./LICENSE)。

## 已知限制

- 应用图标只做常见文件路径存在性检查；
- 配置文件解析错误会结构化展示，但不会自动修改用户配置；
- Windows/macOS 准备度只根据明确的打包目标或平台配置判断；macOS 签名身份与公证凭据只检查是否存在，不读取或记录凭据内容；
- 项目与产物扫描仍有严格的深度和数量上限；关键文件优先扫描，SHA-256、GitHub 上传和资料包导出支持主动取消；
- GitHub 功能已通过单元测试和参数边界测试；真实跨仓发布需先配置 Actions Secrets，再从“自动跨平台发布”推送标签；
- 完整 Xcode、签名和公证放在发布工作流完善后处理。

ReleaseSmith 不会自动发布朋友圈或小红书，只生成可供用户自行确认和发布的文案与图片。

后续计划见 [ROADMAP.md](./ROADMAP.md)。

# ReleaseSmith（发版匠）

ReleaseSmith 是一款面向独立开发者的本地优先桌面发布工作台，帮助你把一次软件版本发布整理得更清楚、更可靠。

当前版本：`v0.4.0`

## 核心功能

- **项目识别**：识别 Tauri、Electron、Node.js、Rust 等项目，读取名称、版本和 Git 信息；
- **发布体检**：检查版本、文档、图标、Git 状态和发布配置，快速发现发布前问题；
- **发布信息管理**：集中填写版本、标题、亮点、平台、下载说明和已知问题；
- **更新日志**：从 Git 提交整理更新内容，也可以手动编辑；
- **安装包管理**：识别 Windows、macOS、Linux 产物，计算 SHA-256 校验值；
- **GitHub 发布**：在确认后创建 GitHub Release 或发布项目内容，检测到代码更新时提醒自动跨平台发布；
- **Gitee 镜像与回退更新**：可选同步公开安装包和 `latest.json`，GitHub 不可用时自动切换到 Gitee；
- **宣传素材**：生成朋友圈、小红书文案和产品海报；
- **资料包导出**：可选导出发布摘要、更新日志、校验文件、文案和海报；
- **发布历史**：保存最近项目和发布会话，随时恢复并继续编辑；
- **更新检查**：从公开发布页面检查新版本，并在设置中安装更新。

## 下载与安装

前往 [GitHub Releases](https://github.com/Liangxd/releasesmith-releases/releases/latest) 下载最新版：

- Windows：`.exe` 或 `.msi`；
- macOS：`.dmg`，支持 Intel 和 Apple Silicon。

详细安装说明见 [INSTALL.md](./INSTALL.md)。

## 使用方式

1. 选择需要发布的软件项目；
2. 查看发布体检并补充发布信息；
3. 整理更新日志、确认产物和发布方式；
4. 按需发布到 GitHub、生成宣传素材或导出资料包。

宣传素材和资料包导出都是可选的，不会阻塞完成一次发布。之后仍可以返回相应步骤继续生成或修改。

## 隐私

ReleaseSmith 默认只在本机读取项目并保存发布会话，不会自动上传项目文件或发布社交平台内容。只有在你明确确认 GitHub/Gitee 发布操作时，才会执行对应的远程写入；Gitee 令牌保存在系统钥匙串。

更多说明见 [PRIVACY.md](./PRIVACY.md)，版本变化见 [CHANGELOG.md](./CHANGELOG.md)。

## 反馈

欢迎通过 [GitHub Issues](https://github.com/Liangxd/releasesmith-releases/issues) 反馈问题或提出建议。

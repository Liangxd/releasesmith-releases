# ReleaseSmith 自动发布与更新

ReleaseSmith 现在支持将源码仓和公开发布仓分开：

- 私有源码仓：`Liangxd/releasesmith-src`；
- 公开发布仓：默认 `Liangxd/releasesmith-releases`；
- `.github/workflows/release.yml` 位于源码仓，负责在标签推送后构建并发布安装包。

## 一次性准备

公开发布仓可以由 ReleaseSmith 的“自动跨平台发布”模式自动创建并初始化 `main` 分支。也可以手动创建：

```bash
gh repo create Liangxd/releasesmith-releases --public --add-readme
```

为源码仓配置以下 GitHub Actions Secrets：

- `TAURI_SIGNING_PRIVATE_KEY`：与 `src-tauri/tauri.conf.json` 中 `plugins.updater.pubkey` 配对的私钥全文；
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`：如果私钥设置了密码则填写，否则留空；
- `RELEASE_REPO_TOKEN`：有权向 `Liangxd/releasesmith-releases` 写入 Contents 的 fine-grained PAT。它只用于跨仓库创建 Release 和上传资产，不写入源码仓。

私钥绝不能提交到源码仓、写入 `tauri.conf.json` 或放进日志。丢失私钥或密码后，已经安装的应用无法验证后续更新。

源码仓还包含 `sync-public-docs.yml`。当 README、安装说明、更新日志、许可证或其他发布文档变更并推送到 `main` 后，该工作流会使用 `RELEASE_REPO_TOKEN` 将同一套文档同步到公开发布仓，避免公开仓只有安装包而没有项目介绍。

## 版本发布

标签必须与 `src-tauri/tauri.conf.json` 的版本一致。当前工作区配置仍是 `0.2.0`；要发布 `v1.0.0`，先把项目版本统一改为 `1.0.0` 并提交：

```bash
git push origin main
git tag v1.0.0
git push origin v1.0.0
```

在 ReleaseSmith 的 GitHub“自动跨平台发布”模式中填写源码仓、公开发布仓和 `v1.0.0`。确认后应用会准备两个仓库，推送当前已提交源码到目标分支，并从同一个提交推送该标签。标签推送会触发 Actions；已有同名标签会被预检查阻止，不会覆盖。宣传文案和海报步骤可以直接跳过，发布安装包不依赖它们。

工作流会在 Windows、macOS Intel 和 macOS Apple Silicon Runner 上构建，并在公开发布仓创建已发布的 GitHub Release，上传：

- Windows NSIS / MSI 安装包及 `.sig`；
- macOS `.dmg`、`.app.tar.gz` 及 `.sig`；
- Tauri updater 使用的 `latest.json`；
- 汇总所有发布资产的 `SHA256SUMS.txt`。

工作流不需要手动打开 GitHub 的 New release 页面。

## 应用更新

`src-tauri/tauri.conf.json` 已将 updater endpoint 配置为：

```text
https://github.com/Liangxd/releasesmith-releases/releases/latest/download/latest.json
```

应用启动时会检查这个公开 JSON；在“设置”中可以再次检查并安装签名更新。更新下载完成后应用会自动重启。没有可用发布仓或尚未发布 `latest.json` 时，检查失败只会被记录为诊断事件，不影响本地使用。

如果更换公开发布仓名称，需要同时修改：

1. `.github/workflows/release.yml` 的 `RELEASE_OWNER` / `RELEASE_REPOSITORY`；
2. `src-tauri/tauri.conf.json` 的 updater endpoint；
3. 本文件中的命令和地址。

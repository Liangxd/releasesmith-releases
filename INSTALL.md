# ReleaseSmith 安装说明

## macOS

当前提供 Apple Silicon（`arm64`）DMG：

```text
ReleaseSmith_0.2.0_aarch64.dmg
```

安装步骤：

1. 双击打开 DMG；
2. 将 `ReleaseSmith` 拖入“应用程序”；
3. 从“应用程序”目录启动 ReleaseSmith。

当前试用包使用 ad-hoc 签名，尚未进行 Apple Developer ID 签名和公证。首次打开如果被 macOS 阻止：

1. 在 Finder 中找到 ReleaseSmith；
2. 右键选择“打开”；
3. 在系统确认页再次选择“打开”。

安装前可以验证下载文件：

```bash
shasum -a 256 ReleaseSmith_0.2.0_aarch64.dmg
```

v0.2.0 ARM64 DMG 的校验值：

```text
a605e28737ab8883f5fb5963cea0c644ef16e1749286ea1b5f06167a500c0a43
```

## Windows 与 Linux

源码保留跨平台能力，并可识别 Windows、macOS 和 Linux 发布产物，但 v0.2.0 尚未提供经过验证的 Windows 或 Linux 安装包。

## 本地数据

卸载应用不会自动删除发布会话。macOS 数据通常位于：

```text
~/Library/Application Support/com.releasesmith.desktop/
```

删除该目录前请确认不再需要其中的发布历史和设置。

## 运行要求

- macOS 10.13 或更高版本；
- 当前 DMG 需要 Apple Silicon Mac；
- Git 功能需要本机可执行 `git`；
- GitHub Draft Release 功能需要安装并登录 GitHub CLI。

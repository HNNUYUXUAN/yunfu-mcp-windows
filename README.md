---
type: "Runbook"
title: "在 Windows 上接入云蝠智能 MCP"
description: "启动 Codex 项目并使用本地 .env 的 SaaS API Key 完成 MCP 认证。"
tags: ["Windows", "Codex", "MCP", "云蝠智能"]
sources:
  - {"id": "codex", "title": "Codex MCP 配置文档", "resource": "https://developers.openai.com/codex/mcp"}
  - {"id": "helper", "title": "Codex 配置参考", "resource": "https://learn.chatgpt.com/docs/config-file/config-reference"}
  - {"id": "cloudbat", "title": "云蝠智能 AI 客户联络中心", "resource": "https://agent.ccgpt.net/#/"}
---

# 在 Windows 上接入云蝠智能 MCP

本仓库为 Codex 工作区配置云蝠 MCP。Codex 启动项目里的认证脚本，从同一工作区的 `.env` 读出 SaaS API Key，并向云蝠端点发送 Bearer 认证头。[^codex][^helper]

## 准备

1. 安装 [Windows 版 Codex](<https://openai.com/codex/>) 并登录，确认终端能执行 `codex --version`。
2. 安装 [Node.js 24](<https://nodejs.org/en/download>) 和 [Git for Windows](<https://git-scm.com/install/windows>)，确认 `node --version` 与 `git --version` 可运行。已测版本见[实测记录](verification.md)。
3. 在云蝠控制台打开「连接 Agent → 凭据管理」，创建或取得 SaaS API Key。[^cloudbat]

## 初始化

在 Codex 中打开本仓库根目录。阅读 [认证脚本](.codex/cloudbat-headers.mjs) 后，允许 Codex 信任这个项目，以加载项目级设置。[^codex][^helper]

在仓库根目录运行：

```powershell
node scripts/setup.mjs
```

打开生成的 `.env`，把 SaaS API Key 填在 `YUNFU_MCP_TOKEN=` 后面。初始化依据当前目录位置生成 `.codex/config.toml`，两份本地文件均由 Git 忽略。若已有不同的配置，运行 `node scripts/setup.mjs --print-config`，将输出的 `[mcp_servers.saas]` 段合并到现有 TOML，确保同名段只出现一次。

| 项目 | 值 |
| --- | --- |
| MCP 名称 | `saas` |
| 传输 | 流式 HTTP |
| 端点 | `https://ai.telrobot.top/cli/mcp` |
| 项目凭据变量 | `YUNFU_MCP_TOKEN` |

## 验证

新开一个 Codex 项目对话。也可在仓库根目录运行下方命令，让 Codex 在临时项目会话里初始化指定的 MCP 并发现工具。

```powershell
node scripts/verify.mjs
```

预期显示 `saas: initialized, ... tools discovered.`。工具数量随账号权限和平台版本变化。若正在验证刚克隆、尚未在应用内设置信任的本仓库，审核脚本和配置后可添加 `--trust-workspace`，仅为这次验证进程提供项目级信任设置。遇到错误时查阅[排障说明](troubleshooting.md)。

[^codex]: [Codex MCP 配置文档](<https://developers.openai.com/codex/mcp>)。
[^helper]: [Codex 配置参考](<https://learn.chatgpt.com/docs/config-file/config-reference>)中的本地 HTTP 请求头助手与项目设置。
[^cloudbat]: [云蝠控制台](<https://agent.ccgpt.net/#/>)的「连接 Agent」。

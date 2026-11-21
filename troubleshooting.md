---
type: "Troubleshooting"
title: "Windows 云蝠 MCP 接入排障"
description: "检查项目配置、认证变量和云蝠 MCP 地址，复现并定位常见连接问题。"
tags: ["Windows", "Codex", "MCP", "排障"]
sources:
  - {"id": "config", "title": "Codex 配置参考", "resource": "https://learn.chatgpt.com/docs/config-file/config-reference"}
  - {"id": "evidence", "title": "Windows 本机实测记录", "resource": "verification.md"}
---

# Windows 云蝠 MCP 接入排障

| 现象 | 检查办法 |
| --- | --- |
| Codex 找不到 `saas` | 在 Codex 中打开仓库根目录，确认项目已获信任，检查已生成 `.codex/config.toml`，新开项目对话。[^config] |
| 提示填写 `YUNFU_MCP_TOKEN` | 检查项目根目录的 `.env`，该变量应对应 SaaS API Key。 |
| 此前使用 `agent.ccgpt.net/cli/mcp` 收到 403 | 检查项目端点是否为本机已验证的 `https://ai.telrobot.top/cli/mcp`。此前返回「MCP host 不允许」的请求来自旧地址。[^evidence] |
| 新地址返回 401 | 核对云蝠控制台颁发的 SaaS API Key 是否仍有效并属于当前账号。 |

如需把截图中的「Bearer 令牌环境变量」填进自定义 MCP 表单，该字段填变量名，Codex 从启动进程的环境取值。项目方案使用 `http_headers_helper` 读取 `.env`。合并配置时让同一个 `saas` 段只配置这一种认证方式，避免其他认证字段优先。[^config]

移动仓库后，运行 `node scripts/setup.mjs --print-config` 查看新位置对应的配置，并更新 `saas` 段的脚本路径。

[^config]: [Codex 配置参考](<https://learn.chatgpt.com/docs/config-file/config-reference>)。
[^evidence]: [本机实测记录](verification.md)。

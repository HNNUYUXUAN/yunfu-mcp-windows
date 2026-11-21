---
type: "Verification"
title: "云蝠 MCP Windows 本机验收"
description: "记录项目初始化、路径兼容性和 Codex MCP 握手的执行结果。"
tags: ["Windows", "验收", "MCP"]
generated: {"by": "agent:codex", "at": "2026-11-21T19:26:18+08:00"}
verified: [{"by": "agent:codex", "at": "2026-11-21T19:26:18+08:00"}]
sources:
  - {"id": "app", "title": "Codex app-server MCP 发现接口", "resource": "https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md#mcp-server-capabilities"}
  - {"id": "verifier", "title": "项目自带的验收程序", "resource": "scripts/verify.mjs"}
  - {"id": "old", "title": "旧端点的本机对照请求", "resource": "https://agent.ccgpt.net/cli/mcp"}
---

# 云蝠 MCP Windows 本机验收

2026-11-21 在 Windows x64 环境复测，Codex CLI 为 `0.171.0-alpha.13`，Node.js 为 `v24.16.0`，Git for Windows 为 `2.54.0.windows.1`。这些版本是本次基线。

| 场景 | 结果 |
| --- | --- |
| 空目录初始化与重复执行 | 生成项目配置和空白凭据项，重复运行保持同一配置。 |
| 已有配置和 `.env` | 检测到不同的 TOML 后提示手动合并，原配置和 `.env` 保留。 |
| 缺少凭据 | 提示填写 `YUNFU_MCP_TOKEN`，退出码为 1。 |
| E 盘仓库根目录 | Codex 完成 MCP 握手，发现 83 个工具。[^app][^verifier] |
| E 盘中文及空格路径下的临时项目 | Codex 完成 MCP 握手，发现 83 个工具。[^app][^verifier] |

验收程序从项目上下文启动临时 Codex 会话，检查 `serverCapabilities` 和工具数量。验收范围为认证、连接和工具发现。测试结束后，两次验收使用的临时凭据已清理。[^app][^verifier]

早期对 `agent.ccgpt.net/cli/mcp` 发起的带凭据和无凭据初始化均返回 `HTTP 403` 和「MCP host 不允许」。使用新端点 `ai.telrobot.top/cli/mcp` 后，同一 SaaS API Key 在项目级配置中通过验收。[^old][^verifier]

[^app]: [Codex app-server MCP 发现接口](<https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md#mcp-server-capabilities>)。
[^verifier]: [项目验收程序](scripts/verify.mjs)及 2026-11-21 的实测输出。
[^old]: [旧端点](<https://agent.ccgpt.net/cli/mcp>)在 2026-11-21 的两次 MCP 初始化对照测试。

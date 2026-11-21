---
type: "Reference"
title: "云蝠官方 Codex 插件 v1.0.1"
description: "记录云蝠控制台发布的原始插件文件及其完整性校验。"
tags: ["云蝠智能", "官方插件", "第三方资料"]
sources:
  - {"id": "console", "title": "云蝠智能控制台 · 连接 Agent", "resource": "https://agent.ccgpt.net/#/"}
---

# 云蝠官方 Codex 插件 v1.0.1

登录[云蝠控制台](<https://agent.ccgpt.net/#/>)，打开「连接 Agent → 接入指南 → Codex → 下载 Plugin ZIP」。版本号也可从归档内的 `plugins/saas/.codex-plugin/plugin.json` 核对。[^console]

| 项目 | 已核对值 |
| --- | --- |
| 原件 | `saas-codex-plugin.zip` |
| 版本 | `1.0.1` |
| 大小 | 5870 字节 |
| SHA-256 | `e23680293b0cbb1c0a8791ab75ef9cb7f713cd787e721c3b3df5d5e5cd51ae65` |

本地归档保存在 Git 忽略的 `vendor/local/`。归档内含官方 README、插件清单、市场索引和 MCP 配置。官方 `mcp.json` 指向 `agent.ccgpt.net/cli/mcp`，使用 `SAAS_API_KEY`。本仓库的[接入步骤](../README.md)使用已实测通过的配置。

原件由云蝠提供。包内未载明公开再分发许可，公开仓库通过本页提供获取入口和校验信息。

[^console]: [云蝠控制台](<https://agent.ccgpt.net/#/>)的 Codex 下载入口及通过该入口取得的原始 ZIP。

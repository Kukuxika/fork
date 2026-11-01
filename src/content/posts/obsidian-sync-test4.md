---
title: 更新1
published: 2026-11-01T19:48:59+08:00
updated: 2026-11-01T19:51:53+08:00
description: ""
tags:
  - 更新修复
category: 修bug
draft: false
---

# 2026-11-01｜博客系统优化与 Obsidian 自动化工作流完善

## 一、博客文章排序功能优化

今天继续完善博客首页的文章排序逻辑。

### 需求与实现

- 置顶文章始终优先显示。
    
- 非置顶文章按照 `updated ?? published` 降序排列。
    
- 新文章与已有文章使用相同的排序规则。
    
- 有 `updated` 字段时显示「最近更新于 YYYY-MM-DD」，否则显示发布时间。
    
- 归档页面保留原有的发布年份分组，组内按照新规则排序。
    
- 分页以及上一篇 / 下一篇导航保持一致。
    

### 问题排查

测试过程中发现，修改文章「好多bug」后，文章仍然排在首页末尾。

经过多轮检查和测试，最终解决排序没有正确反映更新时间的问题。

验证结果：修改文章后，文章能够正确移动到首页前列，并显示最近更新时间。

## 二、Obsidian 文章发布工作流优化

完成博客系统 V1.1 的代码和模板优化。

### 1. 新文章模板

- 优化 Templater 文章模板。
    
- 使用 `pnpm new-post` 创建文章。
    
- `published` 自动生成精确到秒的时间，并包含上海时区。
    
- 增加 `updated` 字段，用于记录文章更新时间。
    
- 规范化空 `tags` 等可选属性。
    
- 保留真实格式错误的校验机制。
    

### 2. 自动更新时间

配置 Obsidian 插件：

- Templater：负责创建文章。
    
- Update modified date：负责更新文章修改时间。
    
- 采用已接受的保护间隔，避免不必要的更新时间变动。
    

同时处理了模板插入后需要手动执行 `Templater: Replace templates in the active file` 的繁琐问题。

### 3. 草稿目录

明确目录用途：

- `templates/`：存放文章模板。
    
- `drafts/`：存放尚未完成的文章。
    
- 正式文章目录：存放需要发布的文章。
    

修复 Astro 文章集合误收录草稿的问题。

最终在 `src/content.config.ts` 增加：

`!drafts/**`

保留原有的 `!templates/**` 排除规则。

草稿和模板及其子目录均不会进入正式文章集合。

## 三、GitHub 与 Cloudflare 部署问题

今天遇到了两类部署问题：

1. Obsidian Git 连接 GitHub 时出现连接超时和 Connection reset。
    
2. Cloudflare Pages 构建时，因为草稿目录中的 Markdown 文件被错误纳入文章集合而失败。
    

### 网络排查

使用 PowerShell 执行：

`Test-NetConnection github.com -Port 443`

确认 TCP 443 端口连接成功。

随后使用 `git ls-remote` 检查远程仓库连接，确认可以读取 GitHub 远程分支信息。

### 最终修复

通过 Codex 精确修改配置，并完成独立 Git 提交：

- Commit：`98c9175`
    
- 提交说明：`fix: exclude drafts from posts collection`
    
- 修改文件：`src/content.config.ts`
    
- 仅修改一行排除规则。
    
- 推送至 GitHub `master` 成功。
    
- Cloudflare Pages 自动部署成功。
    

期间 Obsidian Git 自动生成了 vault backup 提交，最终保留了已有提交历史，没有使用强制推送，也没有覆盖其他未提交修改。

## 四、开发环境与插件处理

今天还处理了 VS Code 和 Obsidian 的一些使用问题：

- 排查 VS Code 更新安装失败。
    
- 处理 Codex 扩展无法启动用户界面的问题。
    
- 调整 Codex 扩展版本及工作区启用状态。
    
- 恢复 Codex 在 VS Code 中的使用。
    
- 配置 Obsidian Templater 和修改时间插件。
    
- 了解 Obsidian Git 自动提交、推送和拉取的配置。
    

## 五、最终测试结果

<badge color="success">全部通过</badge>

|测试项目|结果|
|---|---|
|`pnpm check`|通过|
|`pnpm type-check`|通过|
|`pnpm build`|通过|
|页面生成数量|32 个|
|正式文章|6 篇|
|网站首页|HTTP 200|
|归档页面|HTTP 200|
|正式文章页面|HTTP 200|
|草稿及模板地址|HTTP 404|
|GitHub 推送|成功|
|Cloudflare 部署|成功|

本地测试与线上部署均已验证通过。

## 六、后续待办

1. **文章浏览量提示**：此前提出的浏览量展示功能尚未实现，需要检查现有浏览量统计方案，再决定如何接入首页文章卡片。
    
2. **文章更新时间**：继续观察 Obsidian 插件是否能够稳定维护 `updated` 字段。
    
3. **自动发布流程**：持续观察 Obsidian Git、GitHub 和 Cloudflare 三者之间的同步稳定性。
    

---

## 今日总结

今天主要完成了博客文章排序逻辑、更新时间维护、Obsidian 写作模板以及草稿目录隔离。

过程中经历了排序不生效、Cloudflare 构建失败、GitHub 连接异常以及 VS Code Codex 扩展无法启动等问题，逐一排查并解决。

最终形成了较为完整的文章发布流程：

**Obsidian 编写 → Templater 创建文章 → Update modified date 更新修改时间 → Obsidian Git 同步 → GitHub → Cloudflare Pages 自动部署。**


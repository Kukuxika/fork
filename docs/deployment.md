# Marcus 博客部署与写作

源码仓库：https://github.com/Kukuxika/fork  
生产分支：`master`  
正式域名：`https://marcus12138.com`

备用访问地址：https://fork-cjf.pages.dev

## Cloudflare Pages 首次部署

在 Cloudflare 控制台进入 **Workers 和 Pages → 创建 → Pages → 连接到 Git**，授权 GitHub 并导入 `Kukuxika/fork`。

| 设置 | 值 |
| --- | --- |
| 项目名称 | `fork`（若不可用，选择其他名称并同步修改 `wrangler.jsonc` 的 `name`） |
| 生产分支 | `master` |
| 框架预设 | `Astro` |
| 根目录 | 留空，使用仓库根目录 |
| 构建命令 | `pnpm build` |
| 构建输出目录 | `dist` |
| 环境变量 `NODE_VERSION` | `22.23.0` 或更高的受支持版本 |
| 环境变量 `PNPM_VERSION` | `11.22.0` |

这是静态站点，**不要设置 `CF_WORKERS`**，也不需要填写 Workers 的 `wrangler deploy` 命令。`wrangler.jsonc` 中的 `pages_build_output_dir` 已设为 `./dist`。Node 和 pnpm 的版本属于构建环境设置，不放在 Wrangler 的运行时 `vars` 中。

保留完整的 `pnpm build` 命令，才能生成 Pagefind 搜索索引。部署成功后，以控制台返回的实际 `*.pages.dev` 地址为准。Git 集成配置完成后，每次向 `master` 推送都会自动更新网站。仓库里的 GitHub Pages 工作流仅保留手动触发。

## 绑定 marcus12138.com

1. 确认 `marcus12138.com` 已作为站点添加到同一个 Cloudflare 账号，并且域名注册商的名称服务器已按 Cloudflare 提示设置。
2. 在 Pages 项目中进入 **自定义域 → 设置自定义域**，添加 `marcus12138.com`。
3. 根据控制台提示检查 DNS 记录；如果根域已有其他网站记录，先确认原站是否需要保留。
4. 等待域名和 HTTPS 证书状态变为有效，再访问 `https://marcus12138.com` 验证首页、文章和搜索。

不要只手动添加 DNS 而跳过 Pages 的自定义域绑定。`src/config/siteConfig.ts` 中的 `site_url` 已配置为 `https://marcus12138.com`，用于 canonical、RSS 和站点地图。

官方参考：[Pages 构建配置](https://developers.cloudflare.com/pages/configuration/build-configuration/)、[Wrangler 配置](https://developers.cloudflare.com/pages/functions/wrangler-configuration/)、[自定义域名](https://developers.cloudflare.com/pages/configuration/custom-domains/)。

## 本地写作和预览

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm new-post my-next-post
```

在 `src/content/posts/my-next-post.md` 中修改标题、日期、摘要和正文，准备发布时设为 `draft: false`。

主题示例文章已设为 `draft: true` 并保留原文件。开发模式会显示草稿，生产构建会隐藏草稿。要查看真实上线效果，执行：

```sh
pnpm check
pnpm type-check
pnpm build
pnpm preview
```

预览地址通常是 `http://localhost:4321`，以终端输出为准。Windows PowerShell 如果阻止执行 `pnpm.ps1`，可使用等效的 `pnpm.cmd` 命令，无需修改系统执行策略。

## 个性化设置

- 作者资料：`src/config/profileConfig.ts`，当前作者为 Marcus，GitHub 为 Kukuxika。
- 首页横幅：`src/config/backgroundWallpaper.ts`。
- 关于页面：`src/content/spec/about.md`。
- 第一篇文章：`src/content/posts/hello-world.md`。
- 评论、打赏及带示例数据的个人页面暂时关闭；填写自己的信息后再在 `src/config/siteConfig.ts` 中开启。
- 当前使用系统字体，避免构建时依赖外部字体 CDN。可在 `src/config/fontConfig.ts` 中重新选择字体。

写完文章后检查改动，提交并推送至 `master`；无需提交 `dist` 或 `node_modules`。

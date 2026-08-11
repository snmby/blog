---
title: VS Code中Codex 插件启动不了，显示：Codex could not start
published: 2026-08-11T14:51:00.000+08:00
draft: false
description: |-
  弹窗Codex could not start
  The extension couldn't load its resources.
tags:
  - Codex
pinned: false
comment: true
---
解决方法在最后，文章是解决的整个过程

**现象：**

今天在使用vscode的Codex插件发现启动时弹窗报错：

```
Codex could not start
The extension couldn't load its resources.
```

同时，命令行里的 `codex` 可以正常使用，所以一开始可以排除“Codex CLI 完全不可用”这一类问题，卸载重装codex插件无效

**过程：**

网上搜索解决方案为ctrl+shift + P，输入

```
Developer: Open Extension Logs Folder
```

查看插件日志，打开 Codex.log

```
2026-08-11 14:04:57.981 [error] Error fetching error="TypeError: fetch failed" url=https://ab.chatgpt.com/v1/initialize?k=client-sYWqzCYMRkUg4DqqiZcR5DGTNl2iD7zNJY0HoeDLzxR&st=javascript-client&sv=3.33.3&t=1786428252163&sid=a7f3801f-7849-471a-8935-36cb1a209184&se=1
2026-08-11 14:05:06.572 [error] Error fetching error="TypeError: fetch failed" url=https://ab.chatgpt.com/v1/initialize?k=client-sYWqzCYMRkUg4DqqiZcR5DGTNl2iD7zNJY0HoeDLzxR&st=javascript-client&sv=3.33.3&t=1786428262667&sid=a7f3801f-7849-471a-8935-36cb1a209184&se=1
2026-08-11 14:05:19.136 [error] Error fetching error="TypeError: fetch failed" url=https://ab.chatgpt.com/v1/initialize?k=client-sYWqzCYMRkUg4DqqiZcR5DGTNl2iD7zNJY0HoeDLzxR&st=javascript-client&sv=3.33.3&t=1786428274669&sid=a7f3801f-7849-471a-8935-36cb1a209184&se=1
```

博主认为是查看日志发现无法连接，没有走CC-Switch[ 代理](https://jishuzhan.net/article/2086608105072115713#)，最终调整VSCode的settings.json配置如下：

```
    "codex.apiKey": "cc-switch",
    "codex.baseUrl": "http://127.0.0.1:15721/v1",
    "http.proxyAuthorization": null,
    "http.proxy": "http://127.0.0.1:15721",
    "http.proxyStrictSSL": false
```

编程后两行是新增加的代理，无论是LLM还是其他交互，都走cc-switch代理。

重新启动后问题依旧存在，日志发生变化：

```
2026-08-11 14:15:42.074 [error] [CodexMcpConnection] cli: message="2026-08-11T06:15:39.876639Z  WARN codex_core_plugins::remote::remote_installed_plugin_sync: remote installed plugin bundle sync failed error=chatgpt authentication required for remote plugin catalog; api key auth is not supported\n2026-08-11T06:15:39.882614Z  WARN codex_core_plugins::manager: failed to warm featured plugin ids cache error=failed to send remote featured plugin request to https://chatgpt.com/backend-api/plugins/featured?platform=codex: error sending request for url (https://chatgpt.com/backend-api/plugins/featured?platform=codex)"
2026-08-11 14:15:42.074 [info] [CodexMcpConnection] Initialize received id=1
2026-08-11 14:15:42.074 [error] [CodexMcpConnection] cli: message="2026-08-11T06:15:40.331042Z  WARN codex_core_plugins::startup_sync: git sync failed for curated plugin sync; falling back to GitHub HTTP error=git ls-remote curated plugins repo failed with status exit code: 128: fatal: unable to access 'https://github.com/openai/plugins.git/': CONNECT tunnel failed, response 404\n2026-08-11T06:15:40.332735Z  WARN codex_core_plugins::startup_sync: GitHub HTTP sync failed for curated plugin sync; skipping export archive fallback because a local curated plugins snapshot already exists error=failed to get curated plugins repository from https://api.github.com/repos/openai/plugins: error sending request for url (https://api.github.com/repos/openai/plugins)\n2026-08-11T06:15:40.332785Z  WARN codex_core_plugins::manager: failed to sync curated plugins repo: git sync failed for curated plugin sync: git ls-remote curated plugins repo failed with status exit code: 128: fatal: unable to access 'https://github.com/openai/plugins.git/': CONNECT tunnel failed, response 404; GitHub HTTP sync failed for curated plugin sync: failed to get curated plugins repository from https://api.github.com/repos/openai/plugins: error sending request for url (https://api.github.com/repos/openai/plugins); export archive fallback skipped because a local curated plugins snapshot already exists"
2026-08-11 14:15:42.074 [warning] [IpcClient] Received broadcast but no handler is configured method=client-status-changed
2026-08-11 14:16:12.069 [error] [CodexWebviewProvider] Webview did not finish starting extensionVersion=26.803.61601 role=sidebar
```

为什么没用？

因为真正给 Codex CLI / app-server 用的配置在：

```
C:\Users\user.codex\config.toml
```

读取日志发现内容

```
fatal: unable to access 'https://github.com/openai/plugins.git/': CONNECT tunnel failed, response 404
```

说明： VS Code/Codex 的网络请求被送进了一个“HTTP 代理”路径。但 127.0.0.1:15721 实际是 cc-switch 的 OpenAI API 服务，不是通用代理，不支持 HTTPS CONNECT，所以返回 404。

同时：

```
[CodexWebviewProvider] Webview did not finish starting extensionVersion=26.803.61601 role=sidebar
```

  说明：  这说明 Codex 扩展后端已经启动了，但侧边栏 webview 没在超时时间内完成初始化。

**解决方法：**

直接crtl+Shift+p执行

```
Developer: Reload Window
```

**它会重启 VS Code 当前窗口的 renderer、extension host 和 Codex webview，让修正后的设置生效。**

若已经进行错误配置，需先删除：删除 VS Code settings.json 里的：

```
  "http.proxy": "http://127.0.0.1:15721",
  "http.proxyAuthorization": null,
  "http.proxyStrictSSL": false
```

原理： 插件后端已启动，但 VS Code 当前窗口里的 Codex webview 初始化状态坏了或卡住了。执行 Developer: Reload Window 后，它重新走完整启动流程，webview 成功发出 ready，插件就好了。

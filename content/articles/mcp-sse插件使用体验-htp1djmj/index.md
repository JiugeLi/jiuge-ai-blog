---
title: "MCP_SSE插件使用体验"
slug: "mcp-sse-plugin-review"
author: "九歌"
digest: "MCP_SSE插件使用体验 图片展示了安装MCP_SSE插件时遇到异常信息“plugin verification has been enabled, and the plugin you want "
publish_time: "2025-04-08"
article_id: "Htp1djmjZo3WM7xxdFKcKnn1nTf"
---

# MCP_SSE插件使用体验

![图片展示了安装MCP_SSE插件时遇到异常信息“plugin verification has been enabled, and the plugin you want to install has a bad signature”的处理办法。解决办法是在/docker/.env配置文件末尾添加“FORCE_VERIFYING_SIGNATURE=false”字段，然后运行“cd docker\\ndocker compose down\\ndocker compose up -d”命令重启Dify服务。该图片与文档中MCP_SSE插件使用体验的上下文相关，为遇到此异常时的处理提供了具体操作步骤。](./assets/img01.png)

FORCE_VERIFYING_SIGNATURE=false

![图片展示的是MCP_SSE插件在Docker环境下的配置界面。界面显示了编辑路径为“/home/jiugeai/dify/docker/.env”，主题为“Visual Studio Dark”，语言为“plaintext”，行尾符为“LF (Linux)”，自动换行已启用。关键信息包括PLUGINS_PYTHON_ENV_INIT_TIMEOUT、PLUGINS_MAX_EXECUTION_TIMEOUT等配置项，以及FORCE_VERIFYING_SIGNATURE=false设置。该图片与文档中MCP_SSE插件使用体验上下文相关，直观呈现了插件在Docker环境中的配置情况。](./assets/img02.png)

![图片展示的是在终端执行`sudo docker compose down`命令的输出结果。命令用于停止并删除Docker Compose服务。输出显示有6个容器，其中`docker-nginx-1`、`docker-plugin_daemon-1`、`docker-worker-1`、`docker-weaviate-1`、`docker-ssrf_proxy-1`、`docker-sandbox-1`分别处于Stopping、Stopping、Stopping、Removed、Stopping、Removed状态，表明这些容器正在停止或已停止。该图片与文档中MCP_SSE插件使用体验上下文相关，展示了插件运行环境的容器管理操作。](./assets/img03.png)
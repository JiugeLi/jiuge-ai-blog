---
title: "国内流畅使用GPT-5、Gemini2.5 Pro教程，手把手教你将Poe API集成到CherryStudio"
slug: "poe-api-cherry-studio"
author: "九歌"
digest: "国内流畅使用GPT5、Gemini2.5 Pro教程,手把手教你将Poe API集成到CherryStudio 当今世界，大模型哪家强？ 我认为现在是群雄逐鹿的时候，虽然编程等一些垂直领域，Claud"
publish_time: "2025-08-21"
article_id: "RoCBdCzEjoZl0tx5KOHc5YQcnnb"
---

# 国内流畅使用GPT-5、Gemini2.5 Pro教程,手把手教你将Poe API集成到CherryStudio

当今世界，大模型哪家强？

我认为现在是群雄逐鹿的时候，虽然编程等一些垂直领域，Claude-4稳坐第一把交椅，但是最后三分天下有其一的，未必就是它。

作为AI用户，当然要积极享受当前的AI红利，不要将自己局限在某个平台，尽量的多去了解一下每个大模型的脾气和秉性，为后面创建智能体或者自己的AI数字员工，选择合适的大脑。我目前创意和文案的主力模型是Gemini2.5 Pro和腾讯元宝的DeepSeek R1,编程主力是Trae国际版的Claude 4。

为了能够更好更方便的自如切换和使用各种大模型，同时方便的管理，最通用的解决方法就是直接使用像CherryStudio、ChatBase这样的AI客户端，一键接入各种大模型的API，但是直接调用API，Token一旦超量，国外这些模型花费还是非常高的，所以我更喜欢每月会员付费的方式。

先给大家看一下，我直接在国内使用Gemini2.5Pro的效果，没有使用科学上网。

![图片展示了在CherryStudio中使用Gemini 2.5 Pro | POE的界面。界面顶部显示“Gemini 2.5 Pro | POE”，下方有输入框，提示“你好，我是默认助手。你可以立刻开始跟我聊天”。左侧有多个图标，包括文件夹、文件、消息等。底部有输入区域，提示“在这里输入消息，按 Enter 发送...”，并有多种输入工具图标。该图片与文档中介绍Poe开放API，可将Poe服务像调用OpenAI接口一样用到CherryStudio等内容相关，展示了实际操作界面。](./assets/img01.png)

在之前的图文中，给大家介绍过Poe,一个套壳平台，可以使用国内外各种大模型，每月只需20每月就能拥有100万积分，完全够用了。7月底的时候，竟然开放了API，直接将Poe的服务像调用OpenAI接口一样，用到像Cursor、Cline、CherryStudio中。

![图片展示了Poe API架构。上方左侧是Poe app图标，右侧是Poe API，其下有Cursor、Cline、Roo、Continue等服务。下方是Poe平台，分为Bots和Models两部分，Bots有Raw models、Server bots、Prompt bots等，Models有GPT-4o、Claude-Opus-4、Grok-4、Veo-3、Flux Kontext等。该图与文档中介绍Poe开放API，可将Poe服务像调用OpenAI接口一样用到Cursor、Cline、CherryStudio等内容相关，直观呈现了Poe API的架构。](./assets/img02.png)

其实Poe之前就提供过API功能，但是限制太多，这次开放，允许你可以把Poe 上任何一个公开bot 当成大模型来调用。注意，是任何一个bot，这就是它openrouter这种服务商最大的区别。比如你可以直接调用Poe 的App Creator服务，制作零代码AI应用，你可以直接调用GPT4o生成吉卜力风格的图片，你也可以调用你在Poe上创建的提示词机器人。

常见的Claude、Gemini2.5等模型就更不用说了，每个机器人直接增加了一个api调用说明，简直不要太贴心。       

最重要的是调用API消耗的还是你的订阅积分，跟你用网页端Poe方式一样，这样你就不需要像使用GPT一样，既要买会员又要api充值了，20美元送100万积分，对个人来说绝对够用了。

说了这么多，我们来看一下，如何将Poe 集成到 CherryStudio中吧。

**1.Poe 付费购买会员，并开通API。**

访问https://poe.com/api_key，生成API key 

![图片展示的是Poe API密钥页面。上方标题为“Poe API密钥”，下方有“API密钥”区域，显示密钥内容，右侧有“显示”和“重新生成”按钮。下方“积分”区域显示可用积分744,876，有“查看积分历史”按钮和“购买附加积分”蓝色按钮。该图片与文档中“访问https://poe.com/api_key，生成API key”上下文对应，用于说明获取Poe API密钥的操作界面及相关信息。](./assets/img03.png)

**2.选择需要使用的机器人，查看API调用方式。**

![图片展示了Poe API构建GPT - 5 - Chat的相关内容。上方是GPT - 5 - Chat的介绍，说明其为ChatGPT中使用的非推理模型，支持原生视觉功能等。下方是使用Poe API构建GPT - 5 - Chat的步骤，首先创建API密钥，代码示例提供了Python、Node.js、Python (Poe SDK)三种语言的示例代码，还提示可查看完整文档获取全面的入门指导。该图片与上下文紧密相关，是上下文介绍Poe API构建GPT - 5 - Chat操作步骤的直观呈现。](./assets/img04.png)

**3.打开CherryStudio，找到设置按钮，添加供应商，填写API密钥和API地址。**

![图片展示的是CherryStudio中POE供应商的设置界面。左侧列出多个供应商，其中POE供应商被选中，其状态为ON。右侧显示POE的API密钥和API地址，API地址为http://poe.jiugene.site。下方模型列表中，chatgpt-5、Claude-Sonnet、Gemini-2.5、gpt-4o等模型被选中。该图片与文档中将Poe API集成到CherryStudio的步骤相关，用于说明添加供应商并填写API密钥和API地址的操作界面情况。](./assets/img05.png)

这个时候大家发现问题了，Poe国内无法直接访问，怎么办，你直接填上https://api.poe.com/v1 这个API地址，是无法访问的。

**怎么办？哈哈，我已经给大家解决了，我自己写了个代理服务，放在了一个腾讯云新加坡服务器上，你只需要将API地址改为 http://poe.jiugenote.site就可以了，免费的。如果觉得不安全，可以自己部署，代理脚本直接放在文章最后。**

**4.添加模型，将Poe的bot名字，填写到模型ID，或者从bot的API属性中，复制model变量的值**

![图片展示了Poe平台中可使用的模型列表。其中，GPT - 5、Gemini 2.5 Pro、Claude - Sonnet 4、Claude - Opus 4.1、Gemini 2.5 - Flash Image等模型被突出显示。这些模型对应不同功能，如GPT - 5是OpenAI的最新模型，Claude - Opus 4.1支持可自定义思考预算等。图片与上下文紧密相关，上下文提到添加模型时需将Poe的bot名字填写到模型ID，或从bot的API属性中复制model变量值，此图可帮助用户了解可选模型。](./assets/img06.png)

![图片展示的是CherryStudio中添加模型的界面。界面上方有“添加模型”标题，下方有三个输入框，分别标注“模型ID”“模型名称”“分组名称”，其中“模型ID”输入框内显示“Grok-4”，“模型名称”和“分组名称”输入框内也分别显示“Grok-4”和“grok-4”。右下角有一个绿色的“添加模型”按钮。该图片与上下文紧密相关，是添加模型操作步骤中的关键展示画面，用于指导用户在CherryStudio中正确填写模型相关信息。](./assets/img07.png)

添加模型完毕后，点击API密钥后面的检测按钮，就可以测试连接是否成功，如果没有问题，就可以正常使用了。

![图片展示了在CherryStudio中添加Poe API后的界面。上方显示“连接成功”，并有红色框和箭头突出显示。下方有API密钥、API地址等输入区域，API地址处显示为http://poe.jiugenote.site。模型列表中，chatgpt-5、claude-sonnet、gemini-2.5、gpt-4o、grok-4等模型均有对应图标。该图与上文添加模型、测试连接是否成功的内容相关，直观呈现了添加后的界面状态。](./assets/img08.png)

大功告成，就是这么简单，大家感兴趣的，赶紧动手吧！

<callout emoji="🍰">
**附Python代理脚本**
</callout>

```Python

import httpx
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
import uvicorn

# Poe API 的目标主机
POE_API_HOST = "api.poe.com"

app = FastAPI()

# 创建一个可复用的 httpx 异步客户端
client = httpx.AsyncClient(base_url=f"https://{POE_API_HOST}", timeout=30.0)

@app.api_route("/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
async def reverse_proxy(request: Request, path: str):
    """
    一个通用的反向代理，将请求转发到 POE_API_HOST。
    """
    # 构建目标 URL
    target_url = httpx.URL(path=f"/{path}", query=request.url.query.encode("utf-8"))

    # 准备请求头
    headers = {k: v for k, v in request.headers.items() if k.lower() != 'host'}
    headers['host'] = POE_API_HOST # 必须将 Host 头设置为目标主机

    # 准备请求体
    req_content = request.stream()

    # 发送请求到目标服务器
    proxied_request = client.build_request(
        method=request.method,
        url=target_url,
        headers=headers,
        content=req_content,
    )
    proxied_response = await client.send(proxied_request, stream=True)

    # 将响应流式传回
    return StreamingResponse(
        proxied_response.aiter_bytes(),
        status_code=proxied_response.status_code,
        headers=proxied_response.headers,
        media_type=proxied_response.headers.get("content-type"),
    )

if __name__ == "__main__":
    # 启动uvicorn服务器
    uvicorn.run(
        "poeapi:app",
        host="0.0.0.0",
        port=8090,
        reload=True,
        log_level="info"
    )
```
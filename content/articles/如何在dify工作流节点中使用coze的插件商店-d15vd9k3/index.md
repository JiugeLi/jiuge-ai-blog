---
title: "如何在Dify工作流节点中使用Coze的插件商店"
slug: "coze-plugins-in-dify"
author: "九歌"
digest: "如何在Dify工作流节点中使用Coze的插件商店 大家好，我是九歌。 在前几天的文章《论MCP Server与工作流在智能体开发场景中的作用和区别》，我提到了一个观点，MCP和工作流的关系将是你中有我"
publish_time: "2025-04-19"
article_id: "D15vd9K3xo8xm6x5a0sc0VIEn1a"
---

# 如何在Dify工作流节点中使用Coze的插件商店

大家好，我是九歌。

在前几天的文章《论MCP Server与工作流在智能体开发场景中的作用和区别》，我提到了一个观点，MCP和工作流的关系将是你中有我，我中有你。Dify工作流可以将MCP Server作为工作流中的某个关键节点；同样，Dify工作流可以发布为Mcp Sever，由大模型选择和使用。

同样，对于各大智能体开发平台来说，不管是生态庞大的Coze还是开源界的扛把子Dify,在将来也是这种互联互通的状态，只要他们各家的API足够开放就行。

比如，因为Coze的爸爸就是字节跳动，他家的插件中自然少不了头条内容的支持。

![图片展示了Coze插件商店的界面。商店中有多个插件，如“应搜索”“链接读取”“图片理解”等，还特别标注了“头条搜索”“ByteArtistic”“头条新闻”三个插件。其中“头条新闻”插件被红色框线突出显示，其描述为“持续更新，了解最新的头条新闻和新闻文章”，并有114K的下载量和13K的使用量。该图片与上下文紧密相关，直观呈现了Coze插件商店中可使用的插件，特别是强调了头条新闻插件的功能和使用情况。](./assets/img01.png)

比如头条新闻，我们顺手搭建一个Coze工作流，就能够使用该插件。开始节点用户可以输入搜索词，插件帮助返回相关的最新新闻资讯。

![图片展示了Dify工作流节点中使用Coze插件商店的示例。左侧工作流中，用户节点输入“toulaio_news”，getToulaioNews节点获取头条新闻，再通过print节点输出。右侧试运行输入处，试运行模式为JSON模式，可选测试集为“AI测试集”，并有“将本次运行保存为测试集或手动创建”选项。该图与上下文紧密相关，直观呈现了通过Dify工作流调用Coze插件获取头条新闻的操作流程。](./assets/img02.png)

但是，如果我们想在Dify中使用头条新闻这个插件，直接根据搜索词获取最新的新闻资讯，可就难了。

还好，Coze的API功能足够强大，足够开放，我们通过Coze API可以调用任何一个工作流或者智能体！如果我们想使用Coze的某个插件，直接将其包装在工作流中，然后通过在Dify使用接口调用节点的方式，不就可以愉快地在Dify中使用Coze的插件了嘛！！！

![图片展示的是Coze的API功能中Playground界面。界面上方有“空间”“会话”“消息”等分类，下方有“工作流”“知识库”“语音”等分类，每个分类下有对应的操作选项。图片中“执行工作流”选项被红色箭头指向突出显示。该图片与上下文关系紧密，上下文提到可通过Coze的API功能在线可视化测试调用Coze工作流API，此图直观呈现了在Playground中执行工作流的操作位置，帮助用户了解如何操作。](./assets/img03.png)

Coze的API功能提供了PlayGround功能，也就是可以在线可视化测试，通过下面的网页，我们可以很清楚知道，调用Coze工作流Api，需要设置好workflow_id、bot_id、parmeters、is_async等多个参数值。

![图片展示了Coze API PlayGround的界面，用于在线可视化测试调用Coze工作流API时所需设置的参数。左侧为参数设置区域，包括token、path、workflow_id、bot_id、parmeters、est、key_1、is_async等，其中parmeters参数下有“keywords”等输入框。右侧是Curl Request区域，显示了对应的Curl请求代码，以及返回的JSON结果，如code、msg、data等信息。该图与上下文紧密相关，直观呈现了上下文中提到的API调用参数设置及测试结果。](./assets/img04.png)

上面的几个参数，我们可以很容易在工作流的URL参数中获取到。

![图片展示了Coze工作流页面中URL参数部分，包含bot_id、space_id、workflow_id等参数值。其中bot_id为7488522300472836106，space_id为74863803101674209438，workflow_id为7486381686683598898。该图片与上下文紧密相关，上下文提到可通过Coze的API功能在线可视化测试调用Coze工作流API，这些参数值正是在工作流URL参数中获取到的，用于在Dify工作流节点中使用Coze插件。](./assets/img05.png)

不过这里面有个坑，Coze的 Python调用方式，不管是个官方给的示例还是PlayGroud给出的示例代码，都没有说明工作流中的开始节点参数如何传入！！！所有我直接阅读了源码，搞明白了Coze API中 Python调用工作流，传入参数值的方式。

比如我们要使用的头条新闻工作流，开始节点要接收keyword这个参数，也就是用户想检索哪方面的新闻。

![图片展示了Coze工作流API中WorkflowRunsClient类的create方法代码。方法接受workflow_id、parameters等参数，其中parameters参数为可选的字典类型，用于传入参数值。该图片与上下文紧密相关，上下文提到要将Coze工作流API代码封装成可外部HTTP请求的接口，此图片中的create方法正是用于运行已发布的流程，为封装接口提供代码基础。](./assets/img06.png)

下面是补充完整的Coze工作流API，Python调用代码。

```python
import os
# Our official coze sdk for Python [cozepy](https://github.com/coze-dev/coze-py)
from cozepy import COZE_CN_BASE_URL

# Get an access_token through personal access token or oauth.
coze_api_token = '你自己的Coze token'
# The default access is api.coze.com, but if you need to access api.coze.cn,
# please use base_url to configure the api endpoint to access
coze_api_base = COZE_CN_BASE_URL

from cozepy import Coze, TokenAuth, Message, ChatStatus, MessageContentType  # noqa

# Init the Coze client through the access_token.
coze = Coze(auth=TokenAuth(token=coze_api_token), base_url=coze_api_base)

# Create a workflow instance in Coze, copy the last number from the web link as the workflow's ID.
workflow_id = '7486381686683598898'

# Call the coze.workflows.runs.create method to create a workflow run. The create method
# is a non-streaming chat and will return a WorkflowRunResult class.
workflow = coze.workflows.runs.create(
    workflow_id=workflow_id,
    parameters ={"keywords": "智能体"},
)
#将worlflow.data直接return 
print("workflow.data", workflow.data)
```

我们把上面这段代码在自己服务器或者电脑上跑一下，发现运行正常，可以很快得到头条新闻的搜索结果。

![图片展示的是在终端中运行Coze工作流API的Python代码及结果。代码导入了requests库，定义了Coze API的token、base URL等参数，创建了Core对象，调用create方法创建工作流运行，最后执行run方法。运行结果显示了头条新闻搜索结果，包括标题、时间、封面图片等信息，如“AI Agent”等新闻标题及对应时间、封面等。该图片与上下文紧密相关，直观呈现了上文提到的Python调用Coze工作流API获取头条新闻搜索结果的操作及结果。](./assets/img07.png)

接下来，我们要把上面的代码封装成能够外部HTTP请求的接口。使用FastAPI就可以了。直接把代码扔给deepseek-V3，生成接口代码。

![图片展示了在Dify工作流节点中使用Coze插件商店的代码示例。左侧代码编辑器中，以Python语言编写了调用Fastapi接口的代码，包括导入os、cozepy等模块，设置Coze API相关参数，初始化Coze客户端，创建工作流实例等。右侧界面显示了代码运行结果，提示代码将调用Fastapi接口，接口参数为“keywords”。该图片与文档中介绍在Dify工作流节点使用Coze插件商店的内容相关，直观呈现了代码实现过程。](./assets/img08.png)

直接运动该代码，并测试这个接口，没有问题，一次成功！我们可以放在自己电脑上，或者直接部署到云服务器上都可以。

![图片展示的是在Dify中运行工作流的界面。界面中“Request body”区域显示了JSON格式的请求体内容，包含“keywords”为“智能体”的参数。下方有“Execute”按钮用于执行操作。该图片与上文提到的在Dify中使用Coze插件商店的教程相关，是将搭建好的头条搜索API链接填写完整并设置keywords到body请求信息后，点击运行工作流的步骤展示，直观呈现了操作界面及请求体内容。](./assets/img09.png)

头条新闻的接口准备完毕，在dify中新建工作流，在开始节点添加变量"**keywords**"


添加**HTTP请求**节点，将搭建好的头条搜索API链接填写完整，并将开始节点传入的keywords设置到body请求信息中，点击运行就大功告成了。

![图片展示了Dify工作流中头条搜索节点的设置界面。左侧为工作流节点，开始节点处有“开始”和“keywords”变量标识。右侧是节点详情，API为头条搜索API链接，HEADERS、PARAMS、BODY等参数栏均有设置项。其中，BODY部分选中JSON格式，内容为“{“keywords”:“开始”}”。该图片与上文介绍在Dify中使用Coze插件商店的教程相关，直观呈现了在Dify中添加HTTP请求节点并设置请求信息的操作界面。](./assets/img10.png)

以上就是一个非常简单的教程，抛砖引玉，教大家如何在Dify中使用Coze的插件生态。相关的代码和工作流我已经放在《人人都会做智能体》知识库，点击“阅读原文”或者后台回复“知识库”获取。
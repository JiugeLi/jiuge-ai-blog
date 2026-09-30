---
title: "Trae + Dify 10分钟构建 Data McpServer 与 Agent，和 Excel 说再见！"
slug: "trae-dify-data-mcp-server"
author: "九歌"
digest: "Trae + Dify 10分钟构建 Data McpServer 与 Agent ，和 Excel 说再见！ 大家好，我是九歌AI。 今天手把手教大家使用AI编程工具+Dify构建一个能根据大模型对"
publish_time: "2025-03-06"
article_id: "BzoGdFupNoqByOxvrHtc16JxnWe"
---

# Trae + Dify 10分钟构建 Data McpServer 与 Agent ，和 Excel 说再见！

大家好，我是九歌AI。

今天手把手教大家使用AI编程工具+Dify构建一个能**根据大模型对话处理Excel的智能体**。

当然，全程下来10分钟是不可能的，代码确实是Trae 几分钟就生成的，**但是我调Bug就花了2个小时啊！**

本来还想加上Pyecharts数据可视化部分，但是一口子吃成胖子也不好，先做个简单的吧。

话不多说，我们撸起袖子开干。

打开国内最新版的AI编程工具Trae，在新建Builder地方，输入下面的提示词,大模型选择DeepSeek R1。提示词为什么这么写，当然是避坑了！

![图片展示了国内最新版AI编程工具Trae中Builder Alpha界面。界面中显示“Trae - Builder模式”，提示轻松完成从零到一的项目构建。下方代码区域有提示“终端有报错？添加到对话，AI帮你解决”，并有代码示例，使用OpenAI库进行API调用，创建聊天完成任务，打印响应内容。该图片与文档中介绍在Trae中使用提示词生成代码的内容相关，直观呈现了操作界面及代码示例。](./assets/img01.png)

## DeepSeek R1 **提示词**

> 我要使用 MCP  server 搭建1个服务，接受 Excel 路径和大模型对话中的数据处理要求，这个server服务里的 llm(使用deepseek) 将数据处理要求转变成 真实的 pandas 代码，然后服务执行这个代码，将代码运行结果返回。  请根据我的要求，一步步给出完整的解决办法和创建完整代码。
> 代码结构可以参考下面这样：
> excel_mcp/  
> ├── config.py  
> ├── llm_integration.py  
> ├── main.py  
> ├── safe_exec.py  
> └── requirements.txt
> 数据处理库使用Pandas
> LLM使用DeepSeek，DeepSeek的请求使用参考下方代码
> from openai import OpenAI
> client = OpenAI(api_key="<DeepSeek API Key>", base_url="https://api.deepseek.com")
> response = client.chat.completions.create(
>     model="deepseek-chat",
>     messages=[
>         {"role": "system", "content": "You are a helpful assistant"},
>         {"role": "user", "content": "Hello"},
>     ],
>     stream=False
> )
> print(response.choices[0].message.content)

使用Trae的Builder模式，将上面的提示词输入

![图片展示的是一个代码生成流程的聊天界面。界面中列出多个文件，包括config.py、llm_integration.py、safe_exec.py、main.py和requirements.txt，每个文件旁有数字序号标识步骤。下方有“全部拒绝”和“全部接受”按钮。界面底部提示“Ctrl+Enter输入，Shift+Enter执行”。该图片与文档中介绍使用Trae的Builder模式将提示词输入并生成代码的内容相关，直观呈现了代码生成过程中涉及的文件及操作提示。](./assets/img02.png)

再代码生成的过程中，一直惦记全部接受，直到代码执行阶段。这时候终端会报错，你根据报错信息就会陷入修Bug的无底洞，所以要自己把代码都读一遍，不然哪里错的都不知道。

比如下面这个报错，原因很简单，包的大小写弄错了！

![图片展示的是代码终端界面，显示了代码运行时的错误信息。错误提示为“ModuleNotFoundError: No module named 'restrictedPython'”，表明在运行代码时，系统找不到名为'restrictedPython'的模块。该图片与文档中代码生成后的运行步骤相关，当在config.py中添加DeepSeek API密钥后，按步骤运行代码时，若出现此错误，需先安装'restrictedPython'模块，再执行后续步骤。](./assets/img03.png)

代码全部生成后，你需要在config.py中 添加DeepSeep API的密钥，然后按下面步骤运行代码。

> 1. 替换config.py中的API密钥
> 2. 通过`uvicorn main:app --host 0.0.0.0 --port 8000` 启动服务
> 3. 访问`http://localhost:8000/docs` 测试接口
> 4. 如果使用venv管理环境，请先激活环境，再执行第2步。
> 5. vevn环境激活命令：.\venv\Scripts\activate

这时候，访问FastAPI的docs路径（可能需要科学上网，因为fastapi的一个js库被挡了），就可以看到Data McpServer的接口了。

![图片展示的是Data McpServer的FastAPI接口文档页面。页面上方显示版本号0.1.0和QAS 3.1。下方有“default”部分，包含“/health Health Check”和“/process Process Excel”两个接口，其中“/process”接口为POST请求，无参数，Request body为必填，示例内容为JSON格式，包含“excel_path”和“instruction”两个字段。该图片与上文介绍的访问FastAPI的docs路径查看Data McpServer接口的内容相关，直观呈现了接口的具体信息。](./assets/img04.png)

紧接着，我们需要准备一个excel文件，我们可以直接在飞书文档的excel模板中找一个，下载下来。我找的是客户反馈跟踪表。

![图片展示的是飞书云文档模板库界面，左侧为导航栏，选中“推荐”选项。右侧是多个模板示例，其中“客户反馈跟踪”模板被红色框突出显示，其下方显示“3月6日 使用过”，并有“查看更多”按钮。该图片与文档中介绍飞书云文档模板库的内容相关，直观呈现了模板库中可选择的模板样式，为用户提供了参考。](./assets/img05.png)

将这个表格放在Trae项目根文件夹，直接点击Trae右下角的Go Live,**会将项目文档以端口5000**的web服务暴露出来。

![图片展示的是在DeepSeek Reasoner (R1)界面中，右下角“Go Live”按钮的提示信息。该提示框以白色背景呈现，内有黑色箭头指向“Go Live”按钮，旁边文字为“Click to run live server”，意为点击以运行实时服务器。此图与上文提到的将表格放在Trae项目根文件夹，点击右下角“Go Live”按钮将项目文档以端口5000的web服务暴露出来的内容相关，是操作步骤中的关键提示。](./assets/img06.png)

我们访问这个地址，复制表格的URL链接。

![图片展示了在浏览器中访问的地址为“127.0.0.1:5500”，页面显示了Trae项目根文件夹内的文件和文件夹，如“__Pycache__”“config.py”“requirements.txt”等。右侧突出显示了“客户反馈跟踪.xlsx”文件。该图片与上文提到的将表格放在Trae项目根文件夹，点击右下角Go Live将项目文档以端口5000的web服务暴露出来，以及访问地址复制表格URL链接的内容相关，展示了操作后的文件展示界面。](./assets/img07.png)

接下来再回到FastAPI Docs界面，找到接口，点击Try It!填写参数值，然后点击Execute按钮 执行！

![图片展示的是FastAPI Docs界面中“Process Excel”接口的请求参数设置页面。页面上方显示请求方法为POST，路径为/process。下方参数区域提示无参数，Request body部分要求以application/json格式提交数据，示例数据包含“excel_path”和“instruction”两个字段，其中“excel_path”为Excel文件URL链接，“instruction”为处理指令。页面底部有“Execute”和“Clear”按钮，其中“Execute”按钮被红色框突出显示。该图片与上文提到的在FastAPI Docs界面找到接口、点击Try It!填写参数值并点击Execute按钮执行的操作步骤相关。](./assets/img08.png)

查看结果，成功了！（中途修了半小时BUG!）

![图片展示了在FastAPI Docs界面执行接口请求后的结果。上方是执行的curl命令，请求地址为http://localhost:8000/process，参数包括host、accept、Content-Type、read_path等。下方是Server response，显示状态码200，响应体为JSON格式，包含“status”为“success”及“data”结果数组，数组中包含“返回值”“问题”“答案”“来源”“来源类型”“来源地址”“来源标题”“来源作者”“来源时间”等字段，如“返回值”为“这个周末有几场电影”，“问题”为“这个周末有几场电影”，“答案”为“这个周末有几场电影”，“来源”为“豆瓣电影”，“来源类型”为“网页”，“来源地址”为“https://movie.douban.com/subject/36000007/”等。](./assets/img09.png)

下面我们就要把McpServer 作为工具放到Dify上了。

**第一步**  先确定你Dify能访问到本地运行的Fastapi接口服务，所以我将地址换成了电脑的IP。

![图片展示的是在Windows系统下使用命令行执行“ipconfig”命令获取网络配置信息的结果。显示了以太网、无线局域网适配器等网络接口的连接状态、DNS后缀、IPv6地址、IPv4地址等信息。其中，IPv4地址部分以红色框突出显示，具体为192.168.10.37。该图片与上下文关系紧密，用于说明在将McpServer作为工具放到Dify上时，需确定Dify能访问到本地运行的Fastapi接口服务，此处IP地址即为电脑的IP地址。](./assets/img10.png)

**第二步**  获取Fastapi openAPI-Swagger数据，点下面这里。

![图片展示的是FastAPI的openAPI-Swagger界面。界面上方显示“localhost:8000/docs”，并有“FastAPI 0.1.0 OAS 3.1”标识。下方有“default”部分，列出“/health Health Check”和“/process Process Excel”两个接口，其中“/process”接口以绿色背景突出显示。图片中红色框和箭头突出指向“/openapi.json”，这与文档中“第二步获取Fastapi openAPI-Swagger数据，点下面这里”的操作说明对应，指引用户获取数据。](./assets/img11.png)

**第三步**  把json数据复制到dify 自定义工具界面。这里面需要手动添加servers信息，fastapi上没有带这个参数。

![图片展示了Dify平台中创建自定义工具的界面。在“名称”处输入“DataMCP”，“Schema”选择“OpenAPI - Swagger 规范”，并有“从URL中导入”和“例子”选项。关键信息是“servers”部分，显示“uri”为“http://192.168.10.37:8000/”，“description”为“Development server”。下方“可用工具”列表中，“health_check”和“process_excel”两个工具被红色框突出显示，其中“process_excel”对应“Process Excel”操作。该图片与文档中介绍在Dify平台创建自定义工具，对接Data McpServer与Agent的内容相关。](./assets/img12.png)

点击接口旁边的测试，测试一下工具是否可用。


回到Dify，创建一个工作流应用，取名为**Excel智能助手**。

![图片展示的是Dify平台创建空白应用的界面。左侧为应用类型选择区域，有聊天助手、Agent、文本生成应用、Chatflow、工作流等类型，其中工作流被选中。右侧是工作流编排示例，显示了开始按钮、Excel文件URL上传、用户提示词等节点，以及节点间的连接关系。该图片与上下文紧密相关，上下文提到回到Dify创建工作流应用，取名为Excel智能助手，此图直观呈现了创建工作流应用的操作界面及工作流编排示例，帮助理解操作步骤。](./assets/img13.png)

编排这个简单的工作流如下,开始按钮设置变量类型,一个是Excel文件URL上传，一个是用户提示词。

![图片展示了Dify平台中创建工作流应用“Excel智能助手”时，开始按钮设置变量的操作界面。界面中“开始”按钮下有“excel_file”和“usr_prompt”两个变量，其中“excel_file”变量类型为“单文件”，显示名称和文件名称均为“excel_file”，上传文件类型为“URL”。该图片与上文提到的在Dify编排工作流时，开始按钮设置变量类型，一个是Excel文件URL上传，一个是用户提示词的内容相呼应，直观呈现了变量设置情况。](./assets/img14.png)

![图片展示了Dify平台中创建工作流应用“Excel智能助手”时的开始节点设置界面。左侧为开始节点，有“excel_file”和“usr_prompt”两个必填输入字段。右侧是开始节点的输入字段详细信息，包括“excel_file”和“usr_prompt”字段，以及sys.files、sys.user_id等其他字段。该图片与上下文紧密相关，直观呈现了上下文中提到的开始按钮设置变量类型，一个是Excel文件URL上传，一个是用户提示词这一操作步骤。](./assets/img15.png)

在下一个节点，选择我们刚刚内置的工具，讲文件URL和用户提示词对接好。


**如何点击运行按钮，查看执行效果。**


运行这个智能体，查看效果！

![图片展示了Excel智能助手界面及AI Completion结果。左侧为Excel智能助手，有Run Once和Run Batch选项，下方有excel_file输入框及usr_prompt输入框，示例内容分别为文件链接和“这个表格有几个行业”，还有Execute按钮。右侧是AI Completion结果，显示Workflow Process流程，包含开始、PROCESS EXCEL PROCESS POST、结束三个步骤，RESULT部分呈现了数据结果，如“学校”“互联网”等行业的数量。该图与上下文介绍的将文件URL和用户提示词对接，点击运行查看执行效果相呼应。](./assets/img16.png)

好了，今天就先到这，我们还可以把这个工作流发布为工具，在新的智能体对话时作为Function Call调用，我们下期再详细讲。

所有的代码和Dify工作流文件，可以访问下方或原文链接获取。

```Markdown
https://mbd.pub/o/bread/aJWXm5dv
```
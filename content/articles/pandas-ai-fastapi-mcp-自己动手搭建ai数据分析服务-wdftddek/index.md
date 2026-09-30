---
title: "Pandas-ai+FastAPI-MCP，自己动手搭建AI数据分析服务"
slug: "pandas-ai-fastapi-mcp"
author: "九歌"
digest: "Pandasai+FastAPIMCP，自己动手搭建AI数据分析服务，效果不比大厂差 大家好，我是九歌。今天我们聊一聊使用大模型进行数据分析。 AI数据分析作为大模型应用的刚需，在各大平台上的表现却大"
publish_time: "2025-04-23"
article_id: "WDfTddEKnoSe19xTxA7cgwFdnVh"
---

# Pandas-ai+FastAPI-MCP，自己动手搭建AI数据分析服务，效果不比大厂差

大家好，我是九歌。今天我们聊一聊使用大模型进行数据分析。

AI数据分析作为大模型应用的刚需，在各大平台上的表现却大相径庭。阿里百炼的析言、ChatGPT、商汤的小浣熊、豆包，用了一圈，发现能打的只有豆包。但是豆包只提供大模型接口，AI数据分析却没有对应的接口。

![图片展示了Pandas-ai平台的技能选择界面。界面顶部有“发消息、输入 @ 选择技能或 / 选择文件”提示。下方有“深度思考”按钮。中间有多个技能图标，其中“数据分析”技能被红色框线突出显示。该图片与上下文关系紧密，上下文提到AI数据分析步骤，而图片直观呈现了Pandas-ai平台中可选择的技能之一，即数据分析技能，为读者了解平台技能选择提供直观参考。](./assets/img01.png)

首先定义一下“AI数据分析”，本文所说的AI数据分析，专指大模型对数据表格的处理能力，默认数据超过2000行！

2000行的表格直接喂给大模型让其分析，可想而知，这是多么不现实的一件事情，更不要说是让大模型对表格中的某行或某列进行精准的函数计算了。

目前各大平台使用的解决方案，基本一致，主要是下面几个步骤：

```Plain Text
命令大模型对上传的Excel文件，生成Python代码，读取表头和表格前几行数据
将读取后的数据与用户的需求再重新提交给大模型
大模型根据需求生成Pandas或者SQL代码，对数据进行操作
在沙箱中执行数据处理代码，判断是否处理成功
若处理成功，将处理后的表格路径返回
若处理失败，将错误信息一并交给大模型，重新生成
```

按理说上面的过程看起来好像一点不麻烦，于是我自信满满的想要智能体工作流实现一个，但是很快被打脸了。遇到稍微复杂点的数据分析需求，工作流陷入死循环，一直报错！

![图片展示了Pandas-ai智能体工作流的流程。从“表格基本信息获取”开始，经“表格处理规则优化”后进入循环，循环内依次进行“表格处理代码生成”“表格处理代码执行”“代码执行结果获取”“代码执行结果报错”“代码错误结果提醒”等步骤，最后保存代码执行结果。该图与上下文紧密相关，直观呈现了智能体工作流的执行步骤，帮助理解其工作原理。](./assets/img02.png)

本着不能重复造轮子的心态，我开始在Github上找AI数据分析相关的开源项目。功夫不负想偷懒的人，终于发现了一个将近2万star的项目——Pandas-ai！

![图片展示的是Pandas-ai项目的GitHub页面。页面显示该项目有1318个提交记录，1.9k个fork，19.9k个star，1.9k个watchers。页面左侧是项目代码分支、标签等导航栏，右侧有项目介绍，提到Pandas-ai使用LLM和RAG，可与数据库或数据湖（CSV、SQL、Parquet等）对话，进行数据分析、数据可视化等。页面底部还有关于、查看许可证、引用此仓库、活动、自定义属性等选项。](./assets/img03.png)

Pandas是Python中数据分析必用的库!然后给ai赋能了!还这么多人星标了!

激动的心怦怦跳,颤抖的小手搓起来,让我们一块体验一下吧!

<callout emoji="🥇">
安装篇
</callout>

Pandas-ai 已经做成了Python库,所以我们直接安装使用就行,简直不要太方便。 我们通过以下命令即可完成Python环境搭建和Pandas-ai库的安装。

```Plain Text
#创建虚拟环境 
python -m venv .venv 
#激活环境
.\.venv\Scripts\activate
#安装Pandas-ai
pip install pandasai -i https://pypi.tuna.tsinghua.edu.cn/simple
```

![图片展示的是在Windows系统的命令提示符界面中，执行“python -m venv .venv”命令的场景。命令执行后，界面显示“公众号#九里AI大模型”字样。该图片与文档中“安装篇”内容相关，用于说明在Python环境中安装Pandas-ai库时，通过此命令创建虚拟环境的操作步骤，直观呈现了命令执行后的界面情况。](./assets/img04.png)

<callout emoji="🥇">
配置篇
</callout>

将Pandas-ai的github库，下载到本地，在项目文件夹中找到pandas-ai\examples\use_openai_llm.ipynb 这个文件，并打开。

```Plain Text
https://github.com/sinaptik-ai/pandas-ai.git
```

![图片展示的是pandas-ai\\examples\\use_openai_llm.ipynb文件内容，标题为“Configuring OpenAI LLM with PandasAI”。文件说明了如何配置PandasAI与OpenAI大模型LLM，涵盖安装pandasai-openai扩展、配置OpenAI API token及与一个或多个数据框聊天等内容。关键部分有“Install openai llm extension”步骤，需使用“pip install pandasai-openai”命令；“Load OpenAI LLM”步骤，需导入pandasai-openai库并传入OpenAI API token。该图片与文档中介绍配置OpenAI大模型api_token使用PandasAI的df.chat方法的内容相关，是具体操作指引。](./assets/img05.png)

这个文件中，告诉我们，如何配置OpenAI大模型的api_token,从而用Pandas-ai的 df.chat方法。我们只需要学会这一种使用方法就可以了。我们需要使用以下命令，额外安装 pandasai-openai库。

```Plain Text
pip install pandasai-openai -i https://pypi.tuna.tsinghua.edu.cn/simple
```

然后再下方的命令中填入OpenAI的api_token。Pandas-ai目前支持的大模型有限，首选OpenAI

```Plain Text
import pandasai as pai
from pandasai_openai import OpenAI
#我修改成了opentourer的token
llm = OpenAI(api_token="your_api_token")
```

问题来了，我没有OpenAI的api_token,但是我有OpenRouter的token，可以调用GPT-4o等模型。于是我找到pandasai-openai库的源文件base.py和openai.py，修改OpenAI的URL为OpenRouter的URL，并将默认模型设置为GPT-4o

```Plain Text
# .venv\Lib\site-packages\pandasai_openai\base.py
api_base: str = "https://openrouter.ai/api/v1"

#.venv\Lib\site-packages\pandasai_openai\openai.py
model: str = "gpt-4o"
```

在use_openai_llm.ipynb中，将api_token设置为openrouter的token，然后执行每一个单元格，查看是否输出为下方的正确信息。此处我直接使用Trae编辑器，配置了Jupyter的内核环境，按照提示安装相应的包之后，就可以直接执行ipynb文件。

![图片展示的是在Trae编辑器中配置pandasai-openai库的代码界面。上方代码导入了pandasai和OpenAI类，通过OpenAI类实例化llm对象，传入api_token参数。下方代码用于打印LLM配置信息，以验证设置。该图片与文档中使用pandasai-openai库进行AI数据分析服务搭建的内容相关，展示了配置代码的具体实现，是配置成功后执行df.chat()函数前的代码准备步骤。](./assets/img06.png)

如果你最后能够顺利执行 df.chat（）函数，能够将response打印出值来，恭喜你配置成功了！

![图片展示的是在Jupyter Notebook中使用Pandas-ai进行数据分析的代码示例。代码中首先导入数据，然后使用df.chat()函数查询年龄与胆固醇之间的相关性，输出结果为-0.09528177118121824。该图片与上下文紧密相关，是对上文提到的“顺利执行df.chat()函数，能够将response打印出值来，恭喜你配置成功了！”这一成功配置结果的直观呈现，展示了实际操作效果。](./assets/img07.png)

<callout emoji="🥇">
进阶篇
</callout>

我们来看一下Pandas-ai的工作原理，非常简单！

第一步，引入Pandas-ai库，更换别名为pai，并初始化大模型！

```Plain Text
import pandasai as pai
from pandasai_openai import OpenAI

llm = OpenAI(api_token="your token")
```

第二步，指定需要处理的文件路径，然后输入数据分析需求就可以了！返回信息都存储在response变量中，你只需要将其直接打印或者保存成其他文件就可以了！

```Plain Text
#文件路径
df = pai.read_csv("./data/heart.csv")
#发送需求
response = df.chat("What is the correlation between age and cholesterol?")
```

你可以再Jupyter的变量面板查看当前所有变量属性！偷偷告诉你，如果response 的Type属性是DataFrameResponse，你直接可以使用pandas的函数操作，把response再保存成各种你想要的格式！

![图片展示了Jupyter Variables界面，其中response的Type属性被红色框突出显示为NumberResponse。这与文档中提到的“如果response的Type属性是DataFrameResponse，你直接可以使用pandas的函数操作，把response再保存成各种你想要的格式！”相呼应，表明在使用pandas - ai进行数据分析服务搭建时，若response的Type属性为NumberResponse，可直接使用pandas函数操作，体现了其在数据处理中的灵活性。](./assets/img08.png)

```Plain Text
import pandas as pd 
df2 = pd.DataFrame(response.value)
df2.to_csv("./data/result3.csv",index=False)
```

如果你再细心点，你会发现当前文件夹根路径下面多了个pandasai.log文件。恭喜你，发现了新大陆，pandas-ai在和大模型交流过程的请求和生成代码执行情况以及错误情况，你都可以在这个文件看见了！

![图片展示了pandas-ai与大模型交流过程中的日志信息。左侧为文件目录，右侧是代码编辑器，显示了pandas-ai的代码及与大模型的交互日志。日志中记录了2023年5月3日16:44:35的请求信息，包括Prompt ID、生成新代码等，还展示了大模型返回的SQL查询结果，即“table”数据表内容，包含年龄、性别等12列数据。该图片与上下文介绍的pandas-ai在和大模型交流过程中的请求和生成代码执行情况等内容相契合。](./assets/img09.png)

对了，为了降低bug次数，请将所有的数据文件，全部转成UTF-8格式的CSV文件后，再使用pandas-ai进行处理！

<callout emoji="🥇">
接口篇
</callout>

Pandas-ai 在我们自己的电脑上已经成功跑起来了！如果我们想把这个服务分享出去，就需要开发接口了。我们已经有了基础功能，直接使用FastAPI编写接口就可以了。因为文章篇幅有限，全部接口代码请在文末说明中获取。

接口我主要加了一个判断处理，如果response数据长度超过1000，直接保存为csv文件，并返回在线下载地址；如果未超过1000，则将response内容直接通过接口返回。

我们来测试一下接口是否能正常工作！这里依然使用Pandas-ai提供的测试表格 ./data/heart.csv。

![图片展示的是Pandas-ai+FastAPI-MCP搭建的AI数据分析服务中“Process Attendance”接口的请求界面。界面显示请求方法为POST，路径为“/process-attendance/”，参数部分无参数。Request body内容为JSON格式，包含“csv_path”和“data_col”两个字段，分别指向本地文件路径和数据列名称。下方有“Execute”按钮用于执行请求，以及200状态码的“Successful Response”响应信息。该图片与上下文介绍的使用Pandas-ai提供的测试表格进行数据分析，以及将接口用MCP协议封装后放在MCP客户端直接调用的内容相关。](./assets/img10.png)

pandas-ai很快给出了正确结果，Age列的平均年龄为53.5108。我们用WPS打开heart.csv看一下结果，发现完全正确！

![图片展示的是WPS Office中打开的heart.csv文件内容。文件包含Age等多列数据，其中Age列的平均值为53.510893246187，计数为919，求和为4万9123。图片与上文提到的使用Pandas-ai对heart.csv文件进行数据分析相呼应，通过WPS查看文件内容，验证了Pandas-ai给出的Age列平均年龄53.5108这一结果的准确性。](./assets/img11.png)

<callout emoji="🥇">
MCP篇
</callout>

现在接口有了，当然接口也不是很完善，读取的依然是本地文件路径或者在线URL路径。这段时间MCP非常火，我们再把上面的接口用MCP协议封装一层，看看能不能放在MCP客户端里面直接调用！

万幸Github上有个项目FastAPI-MCP，可以很容易就能将fastapi接口转成支持MCP协议的服务。我们安装项目文档，直接上手使用！只需要将fastapi对象，再用FastApiMCP封装一下就可以了！接口中，一定带上operation_id,不然客户端找不到工具名。

```Plain Text
#安装
pip install fastapi-mcp -i https://pypi.tuna.tsinghua.edu.cn/simple
#使用
from fastapi import FastAPI
from fastapi_mcp import FastApiMCP

##原有接口
@app.post("/process-attendance/",operation_id="data_analysis")
#省略代码
##

app = FastAPI()
mcp = FastApiMCP(app)

# Mount the MCP server directly to your FastAPI appmcp.mount()

#
```

我们重新启动接口文件，访问localhost:8989/mcp，发现如下信息，说明服务启动成功！

![图片展示的是在浏览器中访问localhost:8989/mcp后的界面。界面上方显示网址为“localhost:8989/mcp”。下方以列表形式呈现了多条“ping”事件，时间戳从2025 - 05 - 03 14:27:12.708096+00:00到2025 - 05 - 03 14:30:57.877296+00:00不等。这些事件表明服务已启动成功，且处于活跃状态，不断进行ping操作以保持连接。该图片与上文提到的重新启动接口文件后访问localhost:8989/mcp，发现服务启动成功的内容相呼应。](./assets/img12.png)

打开AI编辑器 Trae，手动添加MCP Server ,配置文件如下(使用时请换成自己的路径）：

![图片展示了在AI编辑器Trae中配置MCP Server的界面。左侧为配置文件代码，显示了“mcpServers”下的“pandas - ai”配置，包含“url”为“http://localhost:8989/mcp”和“env”中的“EXCEL_FILES_PATH”路径等信息。右侧是MCP界面，显示“pandas - ai”智能体已添加至MCP Servers列表，状态为“可使用”，并有“data_analysis”智能体的响应信息。该图片与文档中介绍在AI编辑器Trae手动添加MCP Server的内容相关，展示了配置与添加后的界面情况。](./assets/img13.png)

我们创建一个智能体：数据分析师，然后调用这个智能体，看一下数据分析MCP的效果吧。

```Plain Text
#智能体输入问题
D:\JiugeCode\Projects2025\pandasai\pandas-ai-2\pandas-ai\examples\data\heart.csv  
表格Age列的平均值是多少
```

![图片展示了与“数据分析师”协作的界面。上方显示“数”字及“与 @数据分析师 协作”字样。下方输入框中显示路径“D:\\ViugeCode\\Projects2025\\pandasai\\pandas-ai-2\\pandas-ai\\examples\\data\\heart.csv”，并提出问题“表格Age列的平均值是多少”。输入框右下角有“@智能体”和“#上下文”标签，以及“DeepSeek-V3-0324”标识，右侧还有“X”和“齿轮”图标。该图片与上下文介绍的使用AI编辑器Trae手动添加MCP Server，创建智能体“数据分析师”并调用其进行数据分析的内容相关。](./assets/img14.png)

大功告成了！
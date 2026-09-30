---
title: "字节跳动Dolphin多模态文档解析神器开源，16G显存就能流畅运行"
slug: "bytedance-dolphin-document-parsing"
author: "九歌"
digest: "字节跳动Dolphin多模态文档解析神器开源，16G显存就能流畅运行，效果不输GPT4.1 最近字节跳动开源了一款创新多模态文档图像解析模型——Dolphin，基于先解析结构后解析内容的两阶段方法，参"
publish_time: "2025-05-26"
article_id: "CLCVdQIGDowVEhxfHaRcz7i7nTh"
---

# 字节跳动Dolphin多模态文档解析神器开源，16G显存就能流畅运行，效果不输GPT4.1!

最近字节跳动开源了一款创新多模态文档图像解析模型——Dolphin，基于先解析结构后解析内容的两阶段方法，参数只有322M，16G显存就能流畅运行，而且效果比不输GPT-4.1！

![图片展示了Dolphin多模态文档图像解析模型的相关信息。上方有Dolphin的标志及名称，下方说明其为基于先解析结构后解析内容的两阶段方法的新型多模态文档图像解析模型。图片中间有四个标签，分别为论文、模型、代码、许可证。下方分别介绍了支持格式、轻量级模型、并行解析、公式和表格等功能特点，如支持多页PDF、单页图像等格式，Dolphin模型参数量322M，高效易部署，可并行解析多个文本块以提高速度，支持公式LaTex格式、表格HTML格式输出等。](./assets/img01.png)

目前支持Pdf和图片直接解析成Markdown和Json格式。官网直接给出了Demo在线地址，真的太良心了！直接上手体验！

```Plain Text
http://115.190.42.15:8888/dolphin/
```

**（1）15秒识别表格图片**

![图片展示了Dolphin多模态文档解析神器的界面。左侧是上传文件区域，可上传PDF或图片文件，下方有“Submit”和“Cancel”按钮。中间是文件预览区域，显示了文件的名称、类型、大小等信息，当前显示1/1页。右侧有Markdown（Header）、Markdown（Content）、Json（Content）三个选项卡，当前选中Markdown（Header）。该图片与文档中介绍Dolphin安装及使用教程的内容相关，直观呈现了文件上传与预览的操作界面。](./assets/img02.png)

**（2）30秒识别公式**


是不是很酷的感觉，我看了一下github项目文档，安装也非常简便，我们按照教程一步步来。

1.根据Dolphin项目requirements.txt要求，准备安装环境，安装torch2.1.0版本环境。我这里准备了一个干净的docker容器。

![图片展示的是更换镜像界面，提示更换镜像会重置系统盘，数据盘数据不受影响。有系统镜像、CodeWithGPU镜像、我的镜像选项。框架名称下有Miniconda、PyTorch、TensorFlow等，其中PyTorch被选中。框架版本有1.10.0 - 2.1.0多个版本，Python版本有3.10（ubuntu22.04）等。该图片与文档中准备安装环境，安装torch2.1.0版本环境的内容相关，展示了安装前选择镜像和框架版本的界面。](./assets/img03.png)

2.下载 Dolphin Github 项目仓库

```Plain Text
git clone https://github.com/ByteDance/Dolphin.git
#下载慢的，直接下载zip文件，上传到服务器
```

![图片展示的是在Dolphin项目仓库下载安装过程中的终端操作界面。用户在容器中执行git clone命令，克隆了https://github.com/ByteDance/Dolphin.git仓库，显示了远程对象枚举、计数、压缩等进度信息，最后完成接收对象和解决delta操作。之后，用户执行cd命令切换到Dolphin/libx32目录。该图片与文档中下载Dolphin Github项目仓库的操作步骤相关，直观呈现了下载过程中的终端操作情况。](./assets/img04.png)

2.下载安装所有依赖（Long time！！），这里浪费了我一个小时时间。

```Plain Text
pip install -r requirements.txt  -i https://pypi.tuna.tsinghua.edu.cn/simple
```

![图片展示的是在终端中安装Dolphin模型所需依赖包的命令执行结果。命令为“pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple”，并指定了国内镜像站。结果显示正在下载albummentations==1.4.0包，下载速度为513.9 kB/s，预计耗时0:00:00。该图片与文档中安装Git LFS及下载预训练模型文件的内容相关，是运行测试命令后的一部分操作步骤展示。](./assets/img05.png)

3.接下来我们需要安装Git LFS，方便下一步下载模型大文件。

```Plain Text
apt update
apt install git-lfs
```

4.下载预训练模型文件，这个模型文件托管在HuggingFace网站上，国内是无房直接访问的。还好我之前吃过亏，这里直接使用了HuggingFace的国内镜像站

```Plain Text
#切换到终端到项目文件夹，执行下方命令
git clone https://hf-mirror.com/ByteDance/Dolphin  ./hf_model
```

![图片展示的是在Dolphin多模态文档解析神器项目中，使用Git LFS下载预训练模型文件的命令执行结果。命令为“git clone https://hf - mirror . com/ByteDance/Dolphin ./hf_model”，显示了远程仓库对象计数、压缩、打包等信息，最后提示“Unpacking objects: 100% (26/26), 936.23 KiB | 1.16 MiB/s, done.”，表明模型文件下载完成。该图片与上下文紧密相关，是安装Git LFS后下载模型大文件操作的呈现，是后续运行测试命令前的准备步骤。](./assets/img06.png)

5.激动的时刻来了，运行测试命令

```Plain Text
python demo_page_hf.py --model_path ./hf_model --input_path ./demo/page_imgs/page_1.jpeg --save_dir ./results
```

![图片展示的是Dolphin多模态文档解析神器的运行测试命令界面。左侧是文件目录，包含local、autodiff tmp、huggingface等文件夹及多个配置文件。右侧是命令行界面，显示了运行测试命令的代码，包括模型路径、输入路径等参数设置，以及模型配置信息，如attention_probs_dropout_prob、hidden_size等参数值。该图片与上下文紧密相关，直观呈现了运行测试命令时的代码及界面情况。](./assets/img07.png)

整体比较顺利。下面我们把这个服务做成API，这样就可以用在我们的智能体工作流中了！

在Google Gemini中输入一下提示词，就可以使用FastAPI创建接口了。

```Plain Text
# Process a single document image 
 python demo_page_hf.py --model_path ./hf_model --input_path ./demo/page_imgs/page_1.jpeg --save_dir ./results   将这个代码 改写成fastapi 接口 ，接收在线的pdf或者图片路径，将其保存在服务器中，然后替换参数中的input_path 执行后，如果接口参数指定获取markdown接口，将结果result中的对应文件的md内容 直接返回，如果指定输出json 将result recognition中的同名json文件内容输出。
```

![图片展示了Google Gemini对将命令行脚本转换为FastAPI接口的回复。上方代码为处理单个文档图像的命令行脚本，包含模型路径、输入路径、保存目录等参数。下方代码示例展示了如何在Python中结构化生成FastAPI接口，包括导入os、subprocess、uuid等模块，以及使用Path和Literal类型。该图片与上下文紧密相关，上下文提到在Google Gemini中输入提示词后，可使用FastAPI创建接口，此图即为回复的代码示例。](./assets/img08.png)

  我们再安装fastapi、uvcorn、httpx 等Python库，然后运行生成的代码，就可以拥有Dolphin的接口了！

![图片展示的是Dolphin多模态文档解析神器的API接口设置界面。上方显示“POST /process-document/ Process Document Endpoint”，说明该接口用于处理文档。下方有“file_url”参数，需输入PDF或图像URL；“output_type”参数，可选择“markdown”或“json”输出格式，当前选中“markdown”。界面底部有“Execute”和“Clear”按钮，以及生成的Curl命令，用于在Google Gemini中输入提示词后生成接口。该图与上下文介绍的将Dolphin服务做成API，以便在智能体工作流中使用的内容相契合。](./assets/img09.png)
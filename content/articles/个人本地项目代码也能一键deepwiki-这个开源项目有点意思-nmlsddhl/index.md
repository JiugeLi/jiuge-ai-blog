---
title: "个人本地项目代码也能一键DeepWiki，这个开源项目有点意思！"
slug: "deepwiki-for-local-code"
author: "九歌"
digest: "个人本地项目代码也能一键DeepWiki，这个开源项目有点意思！ 大家好，我是九歌。 最近刷到最多的AI相关文章，就是一路好评的DeepWiki了！手痒难耐的我，也早早就上手体验了一下。整体体验下来，"
publish_time: "2025-05-06"
article_id: "NMlSddHL4oeFIdx7F3ecaGHjnJd"
---

# 个人本地项目代码也能一键DeepWiki，这个开源项目有点意思！

大家好，我是九歌。

最近刷到最多的AI相关文章，就是一路好评的DeepWiki了！手痒难耐的我，也早早就上手体验了一下。整体体验下来，确实不错，对于想了解一个Github项目的新人来说，确实非常有帮助。

但是有一说一，DeepWiki的缺点也是很明显的，一是只能局限于Github项目，对于个人私有代码仓库却爱莫能助！二是时间具有滞后性，项目代码不是最新的！如果公司有传承已久的代码库，新入职的同事看到那山一样高的代码，内心肯定是崩溃的！

![图片是一幅插画，画面中有一堆堆的代码文件，文件上标有“ERROR”字样，还有一台笔记本电脑，电脑屏幕上也显示“ERROR”。画面左侧有三个人物，其中一人双手抱头，另两人张大嘴巴，似乎在惊讶或困惑。画面右侧有一个人物正拿着一个工具，似乎在修理电脑。这幅图与上下文的关系是，通过形象化地表现代码混乱、错误频出的场景，来直观地反映公司有传承已久的代码库，新入职同事面对大量代码时的困惑与压力，与上下文提到的公司代码库问题相呼应。](./assets/img01.png)

其实利用Dify工作流，也能快速做个简易版的DeepWiki出来，但是本着不要重复造轮子的原则，又发现了一个宝藏项目——Agent as a Judge! 怎么样，这个项目名称够长够别扭吧！但是利用这个项目可以快速对个人私有代码仓库生成如下样式项目Wiki，是不是和DeepWiki一样！

![图片展示了metauto - ai/GPTSwarm项目的Wiki页面部分内容。上方是项目概述、架构等内容，下方是Utilities部分，介绍了logging、global_setting、calculate_setting等关键函数及其用途，如log_message用于以特定格式记录日志，get_global_setting获取全局设置等。页面还展示了使用logging utility的示例代码。该图片与文档中介绍Agent as a Judge项目的内容相关，展示了其生成的Wiki文档样式，体现了项目能对代码生成高质量Wiki文档的功能。](./assets/img02.png)

Agent as a Judge 项目的初衷就是让智能体评价智能体，把智能体当做裁判！主要提供了一种自动化评估智能体工作表现的方法，同时还能生成高质量的智能体数据集。它就像是一个严格的裁判，能够快速、准确地评判智能体在执行各种任务时的表现，并且为智能体的进一步训练提供有用的反馈。

![图片展示了Agent-as-a-Judge项目的文件结构及功能。左侧是项目文件夹，包含workspace、results、src等文件夹及多个.py文件。右侧是项目功能图标，包括Graph、Read、Retrieve、Locate、Ask等，下方文字“Judge or ask anything about a project”表明可对项目进行评判或询问。该图与文档中介绍Agent-as-a-Judge项目的内容相关，直观呈现了项目运行环境及功能。](./assets/img03.png)

简单说，Agent as a Judge 能够对项目代码进行**问答对话，生成Wiki文档，对智能体方向的项目进行测评**！

为了更快了解这个项目，我们先把这个项目在我们自己电脑上跑起来再说！因为这个项目是用poetry管理依赖，所以我们在自己电脑上装上它（以Windows为例）。poetry感觉不是很好用，我第一次用这个东西，浪费了很多时间。

```markdown
(Invoke-WebRequest -Uri https://install.python-poetry.org -UseBasicParsing).Content | py -
```

然后我们根据官方给的安装教程，完成项目的安装。步骤如下，我进行了优化。

```Plain Text
#1.拉取项目代码
git clone https://github.com/metauto-ai/agent-as-a-judge.git
cd agent-as-a-judge/
#创建虚拟环境
python -m venv .venv
#激活环境
.\.venv\Scripts\activate
#给poetry指定虚拟环境
poetry env use .\.venv\Scripts\python.exe
#安装依赖
poetry install 
```

遇到的坑，请大家避开，其实直接从pyproject.toml把依赖复制出来,用大模型整理成requirements.txt，直接用pip安装更方便：

```markdown
#1.删除poetry.lock文件
#2.poetry镜像拉取超时，修改pyproject.toml文件，在最后添加下面配置
[[tool.poetry.source]]
name = "tsinghua-pypi"
url = "https://pypi.tuna.tsinghua.edu.cn/simple"
priority = "primary"
#3 还需要额外安装的Python包
litellm
dotenv
tenacity
spacy
rank-bm25
sentence_transformers
pandas
python-docx
PyPDF2 
openpyxl
opencv-python
bs4
pylatexenc
python-pptx
```

最后一步，我们配置一下这个项目的大模型，将 .env.samplech重名为 .env ，添加openai_api_key。因为我没有openai官方的key,只有openrouter的，所以我顺便修改了一下源码。

```markdown
#将 .env.samplech重名为 .env 
DEFAULT_LLM="gpt-4o-2024-08-06"
#添加openrouter key
OPENAI_API_KEY="sk-***"
PROJECT_DIR="{PATH_TO_THIS_PROJECT}"

# 修改 agent_as_a_judge\llm\provider.py 代码 220行
 base_url = "https://openrouter.ai/api/v1"
```

**具体作用**

1.**Ask Anything**

可以针对任意工作区提出问题，了解工作区的内容和结构。例如，对一个药物反应预测的代码库进行问题查询，以及其包含的数据加载、模型实现和训练等相关文件。

```Plain Text
PYTHONPATH=. python scripts/run_ask.py \
  --workspace $(pwd)/benchmark/workspaces/OpenHands/39_Drug_Response_Prediction_SVM_GDSC_ML \
  --question "What does this workspace contain?"
```

2.**Agent-as-a-Judge**

对 DevAI 数据集中的任务进行评估，收集证据来判断项目的输出是否满足要求。这个功能有点复杂，我们现在先简单知道一下，等后面有时间再研究。

```Plain Text
PYTHONPATH=. python scripts/run_aaaj.py \
  --developer_agent "OpenHands" \
  --setting "gray_box" \
  --planning "comprehensive (no planning)" \
  --benchmark_dir $(pwd)/benchmark
```

![图片展示的是Hugging Face平台上的DEVAI-benchmark/DEVAI数据集页面。页面上方有搜索栏及导航栏。数据集信息显示为DEVAI-benchmark/DEVAI，有20个点赞。下方有Dataset card、Data Studio、Files and versions、Community四个标签，当前选中Dataset card标签。数据集预览部分显示了部分数据条目，如01_Image_Classification_ResNet18_Fashion_MNIST_DL等，每个条目包含name、query、tags等信息。该图片与文档中介绍OpenWiki功能时提到的对DevAI数据集任务评估的内容相关，展示了数据集的样例。](./assets/img04.png)

3.**OpenWiki**：这个就是本文的主角，可以制作给仓库生成Wiki文档，帮助新开发者快速了解代码库的结构、目的和最佳实践。我们来看一下使用方法，好像很简单，直接运行run_wiki.py，后面带上github项目库的URL就可以了！

```Plain Text
python scripts/run_wiki.py https://github.com/metauto-ai/GPTSwarm
```

等等，咱的文章标题不是个人私有代码仓库吗？读取github仓库的功能，DeepWiki就支持啊，而且也支持私有仓库，说好的本地仓库代码呢？

别急，这个项目不是开源吗，咱研究一下代码，改成让它直接读取本地文件夹，不就行了吗？

通过阅读run_wiki.py的源码，我们可以理清它的工作逻辑，主要通过 `download_github_repo` 函数从 GitHub 克隆仓库，在 `main` 函数中使用 `parse_arguments` 函数获取用户输入的 GitHub 仓库 URL 来进行后续操作。

```Plain Text
def main():
    # ... 其他代码 ...
    args = parse_arguments()
    repo_url = args.repo_url or get_repo_url_interactive()
    # ... 其他代码 ...
    repo_dir = download_github_repo(repo_url, output_dir)
    # ... 其他代码 ...
```

也就是说，它的工作原理就是把github的仓库代码下载到本地文件夹，再进行分析！那我们直接让run_wiki.py的参数接受个本地路径不就可以了，这样改也很简单。添加一个新的命令行参数来指定本地文件夹路径，并且在代码中根据这个参数来决定是下载 GitHub 仓库还是直接使用本地文件夹。

```python
import argparse
from pathlib import Path
import logging
import time
import json
import datetime
import subprocess
from urllib.parse import urlparse
from dotenv import load_dotenv

# 省略其他代码
# ...

def parse_arguments():
    parser = argparse.ArgumentParser(description="Generate documentation for GitHub repositories or local folders")
    parser.add_argument(
        "--repo-url",
        type=str,
        help="GitHub repository URL (e.g., https://github.com/metauto-ai/gptswarm)",
        default=None
    )
    parser.add_argument(
        "--local-dir",
        type=str,
        help="Path to the local project folder",
        default=None
    )
    parser.add_argument(
        "--output_dir", 
        type=str, 
        default="./repo_docs",
        help="Directory to save documentation"
    )
    # 其他保持不变
    # ...
    return parser.parse_args()

def main():
    load_dotenv()
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logger = logging.getLogger(__name__)

    args = parse_arguments()
    output_dir = Path(args.output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    judge_dir = output_dir / "judge"
    judge_dir.mkdir(parents=True, exist_ok=True)

    start_time = time.time()

    try:
        if args.repo_url:
            logger.info(f"Starting repository download and documentation: {args.repo_url}")
            repo_dir = download_github_repo(args.repo_url, output_dir)
        elif args.local_dir:
            logger.info(f"Using local project folder: {args.local_dir}")
            repo_dir = Path(args.local_dir)
            if not repo_dir.exists() or not repo_dir.is_dir():
                raise ValueError(f"Invalid local directory: {args.local_dir}")
        else:
            raise ValueError("Please provide either a GitHub repository URL or a local project folder path.")

        # 后续代码保持不变
        # ...

    except Exception as e:
        logger.error(f"Error generating documentation: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        sys.exit(1)

if __name__ == "__main__":
    main()
```

最后我们看一下结果，跑出来了，但是报错了！

![图片展示了在VS Code中运行run_wiki.py脚本后的结果界面。左侧是项目文件夹结构，右侧是代码编辑区域，显示了parse_arguments函数代码。下方有绿色进度条，显示“Documentation generated successfully in 0.76 seconds”。最后还弹出提示框，建议在浏览器中打开生成的HTML文件，文件路径为file:///D:/LiupeCode/Projects/2025/agent-es-a-judge/repo_docs/pandas_ai_documentation.html。该图片与上文提到的生成网页但无数据，因访问不了huggingface及科学上网后包报代理错误的情况相关，展示了脚本运行结果。](./assets/img05.png)

生成的网页没有数据！因为访问不了huggingface!我打开科学上网，但是有些包又报代理错误！

![图片展示的是pandas - ai项目的文档页面。页面左侧有Overview、Architecture、Core Components、Using pandas - ai、Installation & Setup等导航栏。右侧是文档内容，上方有“Overview”标题，下方显示生成网页时出现错误，无法连接huggingface加载文件且在缓存文件中找不到，提示检查网络连接或查看如何在离线模式下运行库。该图片与文档中提到的生成网页报错情况相关，直观呈现了报错内容。](./assets/img06.png)

最后我想说，尽力了，不想浪费时间在这个项目上了，前前后后用掉了我三个晚上！此天不让我跑通这个项目，非我不用心也！以后用时间再研究吧！
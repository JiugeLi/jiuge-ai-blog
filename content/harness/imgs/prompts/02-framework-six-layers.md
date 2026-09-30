---
illustration_id: 02
type: framework
style: blueprint
---

Harness Engineering 六层架构 - 概念框架图

STRUCTURE: 同心环 + 外围六个功能节点。中心是“模型”，外圈是“Harness”，最外层形成可靠交付边界。

NODES:
- 中心：“模型 Model” - 推理核心。
- 左上：“知识 Context” - AGENTS.md、架构、业务规则。
- 上方：“工具 Tools” - Git、终端、浏览器、数据库。
- 右上：“环境 Runtime” - 沙箱、worktree、依赖。
- 右下：“护栏 Guardrails” - 权限、类型、架构边界。
- 下方：“验证 Feedback” - 测试、日志、指标、Review。
- 左下：“编排 Orchestration” - 拆解、状态、重试、升级人工。

RELATIONSHIPS: 六个节点通过双向数据线连接中心 Harness；验证节点形成回流箭头；最外圈标签“可运行｜可验证｜可恢复”。
LABELS: 只使用上述中英文短标签，文字必须准确。
COLORS: 深蓝 #071827；青色 #2DD4BF 表示工具与环境；紫色 #8B5CF6 表示知识与编排；橙色 #FB923C 表示护栏；绿色 #22C55E 表示验证；白色 #F8FAFC 文字。
STYLE: 高级蓝图信息架构图，统一细线图标，轻微辉光，层次清晰，充足留白，无真实人物，无装饰性背景。Clean composition with generous white space.
ASPECT: 16:9


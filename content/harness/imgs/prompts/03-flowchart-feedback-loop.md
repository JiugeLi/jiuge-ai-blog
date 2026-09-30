---
illustration_id: 03
type: flowchart
style: blueprint
---

智能体软件工程反馈闭环 - 流程图

Layout: 顺时针圆角矩形闭环，中间放置“证据驱动交付”，右侧有一个人工判断分支。

STEPS:
1. “目标” - 明确任务。
2. “验收标准” - 定义完成。
3. “上下文” - 读取事实源。
4. “计划” - 拆解步骤。
5. “隔离执行” - 修改与运行。
6. “确定性检查” - 类型、Lint、测试。
7. “语义审查” - AI Review。
8. “修复复测” - 自我纠错。
9. “提交证据” - PR、截图、指标。

CONNECTIONS: 1→9 使用粗青色箭头；检查失败从 6、7 回到 5；右侧菱形“需要判断？”分为“否：继续”和“是：升级人工”。
LABELS: “证据驱动交付”，“需要判断？”，“升级人工”，九个步骤名称。中文必须准确清晰。
COLORS: 深海军蓝 #061827；青色 #22D3EE 主流程；绿色 #4ADE80 通过；橙色 #FB923C 判断；红色 #F87171 失败回路；白色 #F8FAFC 文字。
STYLE: 蓝图式流程图，统一线框图标，粗细分明的箭头，少量辉光，无立体人物，无复杂背景。Clean composition with generous white space. Text large and prominent.
ASPECT: 16:9


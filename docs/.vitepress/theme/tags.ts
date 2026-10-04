// 标签的英文地址与简介：标签聚合页 /tags/<slug>/、文章页标签链接、结构化数据共用。
// 文章 frontmatter 中的 tags 由 scripts/import-articles.mjs 的 tagsFor() 生成，新增标签时需同步在此登记。
export interface TagInfo {
  name: string
  slug: string
  description: string
}

export const tags: TagInfo[] = [
  { name: 'AI', slug: 'ai', description: 'AI 与大模型：模型能力评测、本地部署、多模态应用与行业观察。' },
  { name: '智能体', slug: 'agents', description: '智能体（Agent）原理与实践：Dify、Coze、MCP、工作流编排与 Harness 工程。' },
  { name: '编程', slug: 'coding', description: 'AI 编程与开发实践：Coding Agent、Vibe Coding、数据处理与自动化脚本。' },
  { name: '互联网', slug: 'internet', description: '互联网产品与平台观察：工具测评、开源项目与技术趋势。' },
  { name: '职场', slug: 'career', description: '职场与专业成长：工作方法、企业落地经验与职业思考。' },
  { name: '电商', slug: 'ecommerce', description: '电商运营与行业历史：平台规则、品类运营、拼多多与 8848 的故事。' },
  { name: '商业', slug: 'business', description: '商业观察与产品思考：商业模式、企业智能化与创业经验。' },
  { name: '成长', slug: 'growth', description: '个人成长与生活随想：学习方法、效率工具与人生感悟。' },
  { name: '随笔', slug: 'notes', description: '随笔与短篇记录：零散的想法、体验与笔记。' },
]

export function tagByName(name: string): TagInfo | undefined {
  return tags.find(tag => tag.name === name)
}

export function tagBySlug(slug: string): TagInfo | undefined {
  return tags.find(tag => tag.slug === slug)
}

export function tagUrl(name: string): string {
  const tag = tagByName(name)
  return tag ? `/tags/${tag.slug}/` : '/posts/'
}

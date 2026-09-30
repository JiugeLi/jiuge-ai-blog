// 根据 docs/posts（由 import-articles.mjs 生成）更新 README.md 中的精选文章与完整文章列表。
// 只替换 <!-- POSTS:START --> 与 <!-- POSTS:END --> 之间的内容。
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import matter from 'gray-matter'

const projectRoot = resolve(import.meta.dirname, '..')
const postsDir = resolve(projectRoot, 'docs', 'posts')
const readmePath = resolve(projectRoot, 'README.md')
const siteUrl = 'https://jiuge.ai'

// 精选文章（按 slug），展示为带封面的卡片
const featuredSlugs = [
  'harness-engineering',
  'what-is-an-ai-agent',
  'manus-deep-research-multi-agent',
  'react-strategy-tool-calling-agents',
  'mcp-server-vs-workflow',
  'ten-ai-buzzwords-explained',
]

async function collectPosts(dir) {
  const posts = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) posts.push(...await collectPosts(path))
    else if (entry.name === 'index.md' && dir !== postsDir) {
      const { data } = matter(await readFile(path, 'utf8'))
      const route = path.slice(postsDir.length).replaceAll('\\', '/').replace(/index\.md$/, '')
      posts.push({ ...data, url: `${siteUrl}/posts${route}`, slug: route.split('/').at(-2) })
    }
  }
  return posts
}

const escapeCell = text => String(text).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()

function featuredTable(posts) {
  const featured = featuredSlugs.map(slug => posts.find(post => post.slug === slug)).filter(Boolean)
  const cell = post => [
    `<a href="${post.url}"><img src="${siteUrl}${post.cover}" alt="${escapeCell(post.title)}" width="260"></a><br>`,
    `<a href="${post.url}"><b>${post.title}</b></a><br>`,
    `<sub>${post.date} · ${post.readingMinutes} 分钟阅读</sub>`,
  ].join('')
  const rows = []
  for (let i = 0; i < featured.length; i += 3) {
    rows.push(`<tr>\n${featured.slice(i, i + 3).map(post => `<td width="33%" valign="top">${cell(post)}</td>`).join('\n')}\n</tr>`)
  }
  return `<table>\n${rows.join('\n')}\n</table>`
}

function fullList(posts) {
  const byYear = new Map()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!byYear.has(year)) byYear.set(year, [])
    byYear.get(year).push(post)
  }
  return [...byYear].map(([year, list]) => [
    `### ${year} 年（${list.length} 篇）`,
    '',
    '| 日期 | 文章 | 标签 | 阅读 |',
    '| --- | --- | --- | --- |',
    ...list.map(post => `| ${post.date.slice(5)} | [${escapeCell(post.title)}](${post.url}) | ${post.tags.join(' · ')} | ${post.readingMinutes} 分钟 |`),
  ].join('\n')).join('\n\n')
}

const posts = (await collectPosts(postsDir)).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
const years = new Set(posts.map(post => post.date.slice(0, 4)))

const generated = [
  '<!-- POSTS:START -->',
  '<!-- 本段由 scripts/update-readme.mjs 自动生成，请勿手动编辑 -->',
  '',
  '## ⭐ 精选文章',
  '',
  featuredTable(posts),
  '',
  '## 📚 全部文章',
  '',
  `共 **${posts.length}** 篇，时间跨度 ${[...years].at(-1)}–${[...years][0]}，按发布时间倒序排列。`,
  '',
  fullList(posts),
  '',
  '<!-- POSTS:END -->',
].join('\n')

const readme = await readFile(readmePath, 'utf8')
if (!/<!-- POSTS:START -->[\s\S]*<!-- POSTS:END -->/.test(readme)) throw new Error('README.md 缺少 POSTS 标记')
const next = readme.replace(/<!-- POSTS:START -->[\s\S]*<!-- POSTS:END -->/, generated)
if (next !== readme) await writeFile(readmePath, next, 'utf8')
console.log(`README: ${posts.length} posts${next === readme ? ' (unchanged)' : ' updated'}.`)

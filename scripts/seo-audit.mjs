// 构建产物 SEO 自检：npm run seo:audit（需先 npm run build）
// 检查每个页面的 title / description / canonical / h1 / og:image / JSON-LD，以及文章图片懒加载与宽高、sitemap、robots、RSS。
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'

const dist = resolve(import.meta.dirname, '..', 'docs', '.vitepress', 'dist')
const walk = dir => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  if (entry.isDirectory()) return ['assets', 'media'].includes(entry.name) ? [] : walk(join(dir, entry.name))
  return entry.name.endsWith('.html') ? [join(dir, entry.name)] : []
})
const pick = (html, re) => [...html.matchAll(re)].map(match => match[1])

const issues = []
const types = {}
const titles = new Map()
const descriptions = new Map()
let pages = 0
let images = 0
let lazy = 0
let sized = 0

for (const file of walk(dist)) {
  const route = `/${relative(dist, file).split(sep).join('/')}`.replace(/index\.html$/, '').replace(/\.html$/, '')
  const html = readFileSync(file, 'utf8')
  pages++
  const title = pick(html, /<title>([^<]*)<\/title>/g)[0] || ''
  const description = pick(html, /<meta name="description" content="([^"]*)"/g)[0] || ''
  const robots = pick(html, /<meta name="robots" content="([^"]*)"/g)[0] || ''

  if (route === '/404') {
    if (!robots.includes('noindex')) issues.push(`${route}: 缺少 noindex`)
    continue
  }
  const h1 = (html.match(/<h1[\s>]/g) || []).length
  if (h1 !== 1) issues.push(`${route}: h1 数量为 ${h1}`)
  if (!title) issues.push(`${route}: 缺少 title`)
  if (description.length < 20 || description.length > 160) issues.push(`${route}: description 长度 ${description.length}`)
  if (!/<link rel="canonical" href="https:\/\/jiuge\.ai\//.test(html)) issues.push(`${route}: 缺少 canonical`)
  if (!/property="og:image" content="https:\/\//.test(html)) issues.push(`${route}: 缺少 og:image`)
  for (const json of pick(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      for (const node of JSON.parse(json)['@graph']) types[node['@type']] = (types[node['@type']] || 0) + 1
    }
    catch {
      issues.push(`${route}: JSON-LD 解析失败`)
    }
  }
  titles.set(title, [...(titles.get(title) || []), route])
  descriptions.set(description, [...(descriptions.get(description) || []), route])
  for (const attrs of pick(html, /<img ([^>]*)>/g)) {
    if (!attrs.includes('/media/')) continue
    images++
    if (attrs.includes('loading="lazy"')) lazy++
    if (/width="\d+"/.test(attrs) && /height="\d+"/.test(attrs)) sized++
  }
}

for (const [title, routes] of titles) if (routes.length > 1) issues.push(`重复 title「${title}」: ${routes.join(', ')}`)
for (const [description, routes] of descriptions) if (routes.length > 1) issues.push(`重复 description「${description.slice(0, 30)}」: ${routes.join(', ')}`)
if (images !== lazy || images !== sized) issues.push(`文章图片 ${images} 张：懒加载 ${lazy}，带宽高 ${sized}`)

const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
const urls = (sitemap.match(/<loc>/g) || []).length
const lastmods = (sitemap.match(/<lastmod>/g) || []).length
if (sitemap.includes('404')) issues.push('sitemap 包含 404 页面')
if (!existsSync(join(dist, 'robots.txt'))) issues.push('缺少 robots.txt')
const feedItems = (readFileSync(join(dist, 'feed.xml'), 'utf8').match(/<item>/g) || []).length

console.log(`页面 ${pages} | 文章图片 ${images}（懒加载 ${lazy}，带宽高 ${sized}）| sitemap ${urls} 条（lastmod ${lastmods}）| RSS ${feedItems} 条`)
console.log('JSON-LD:', Object.entries(types).map(([type, count]) => `${type}×${count}`).join(' '))
if (issues.length) {
  console.log(`\n发现 ${issues.length} 个问题：\n${issues.join('\n')}`)
  process.exit(1)
}
console.log('SEO 自检通过')

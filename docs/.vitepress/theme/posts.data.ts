import { createContentLoader } from 'vitepress'

export interface Post {
  url: string
  title: string
  date: string
  description: string
  tags: string[]
  readingMinutes: number
}

declare const data: Post[]
export { data }

export default createContentLoader('posts/**/index.md', {
  transform(raw): Post[] {
    return raw
      .filter(page => page.frontmatter.date)
      .map(page => ({
        url: page.url,
        title: page.frontmatter.title,
        date: page.frontmatter.date,
        description: page.frontmatter.description || '',
        tags: page.frontmatter.tags || [],
        readingMinutes: page.frontmatter.readingMinutes || 1,
      }))
      .sort((a, b) => b.date.localeCompare(a.date))
  },
})

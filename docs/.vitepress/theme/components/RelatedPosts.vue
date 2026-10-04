<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { data as posts } from '../posts.data'

const { frontmatter, page } = useData()

// 共同标签越多越相关；相同时取发布时间更接近的文章
const related = computed(() => {
  if (!frontmatter.value.date) return []
  const currentUrl = `/${page.value.relativePath.replace(/index\.md$/, '')}`
  const tags: string[] = frontmatter.value.tags || []
  const time = new Date(frontmatter.value.date).getTime()
  return posts
    .filter(post => post.url !== currentUrl)
    .map(post => ({
      post,
      shared: post.tags.filter(tag => tags.includes(tag)).length,
      distance: Math.abs(new Date(post.date).getTime() - time),
    }))
    .filter(item => item.shared > 0)
    .sort((a, b) => b.shared - a.shared || a.distance - b.distance)
    .slice(0, 4)
    .map(item => item.post)
})
</script>

<template>
  <!-- 标题不设 id，避免被收进右侧"本文目录" -->
  <section v-if="related.length" class="related-posts" aria-label="相关文章">
    <h2 class="related-title">相关文章</h2>
    <ul class="related-list">
      <li v-for="post in related" :key="post.url">
        <a :href="post.url" class="related-item">
          <span class="related-item-title">{{ post.title }}</span>
          <span class="related-item-meta">{{ post.date }} · {{ post.readingMinutes }} 分钟阅读</span>
        </a>
      </li>
    </ul>
  </section>
</template>

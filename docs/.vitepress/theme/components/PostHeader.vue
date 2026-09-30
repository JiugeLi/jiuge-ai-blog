<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <header v-if="frontmatter.date" class="post-header">
    <a href="/posts/" class="post-back-link">← 返回文章列表</a>
    <h1 class="post-title">{{ frontmatter.title }}</h1>
    <div class="post-meta">
      <span>{{ frontmatter.author || '九歌' }}</span>
      <span class="meta-dot">·</span>
      <time :datetime="frontmatter.date">{{ frontmatter.date }}</time>
      <span class="meta-dot">·</span>
      <span>{{ frontmatter.readingMinutes }} 分钟阅读</span>
    </div>
    <p v-if="frontmatter.description" class="post-description">{{ frontmatter.description }}</p>
    <div class="post-tags">
      <a v-for="tag in frontmatter.tags" :key="tag" :href="`/?tag=${encodeURIComponent(tag)}`" class="lab-tag">{{ tag }}</a>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { tagUrl } from '../tags'

const { frontmatter } = useData()
</script>

<template>
  <header v-if="frontmatter.date" class="post-header">
    <nav class="breadcrumb" aria-label="面包屑导航">
      <a href="/">首页</a>
      <span aria-hidden="true">›</span>
      <a href="/posts/">文章</a>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ frontmatter.title }}</span>
    </nav>
    <h1 id="top" class="post-title">{{ frontmatter.title }}</h1>
    <div class="post-meta">
      <a href="/about" rel="author">{{ frontmatter.author || '九歌' }}</a>
      <span class="meta-dot">·</span>
      <time :datetime="frontmatter.date">{{ frontmatter.date }}</time>
      <template v-if="frontmatter.updated">
        <span class="meta-dot">·</span>
        <span>更新于 <time :datetime="frontmatter.updated">{{ frontmatter.updated }}</time></span>
      </template>
      <span class="meta-dot">·</span>
      <span>{{ frontmatter.readingMinutes }} 分钟阅读</span>
    </div>
    <p v-if="frontmatter.description" class="post-description">{{ frontmatter.description }}</p>
    <div class="post-tags">
      <a v-for="tag in frontmatter.tags" :key="tag" :href="tagUrl(tag)" class="lab-tag" rel="tag">{{ tag }}</a>
    </div>
  </header>
</template>

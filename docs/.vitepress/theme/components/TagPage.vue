<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import PostCard from './PostCard.vue'
import { data as posts } from '../posts.data'
import { tags, tagByName } from '../tags'

const { frontmatter } = useData()

const current = computed(() => (frontmatter.value.tag ? tagByName(frontmatter.value.tag) : undefined))
const tagPosts = computed(() => (current.value ? posts.filter(post => post.tags.includes(current.value!.name)) : []))
const allTags = computed(() => tags
  .map(tag => ({ ...tag, count: posts.filter(post => post.tags.includes(tag.name)).length }))
  .filter(tag => tag.count > 0)
  .sort((a, b) => b.count - a.count))
</script>

<template>
  <div class="archive-page tag-page">
    <div class="jg-container">
      <header class="archive-header">
        <nav class="breadcrumb" aria-label="面包屑导航">
          <a href="/">首页</a>
          <span aria-hidden="true">›</span>
          <template v-if="current">
            <a href="/tags/">标签</a>
            <span aria-hidden="true">›</span>
            <span aria-current="page">{{ current.name }}</span>
          </template>
          <span v-else aria-current="page">标签</span>
        </nav>
        <div class="badge-eyebrow">
          <span class="badge-dot" />
          {{ current ? `TAG · ${current.slug.toUpperCase()}` : 'ALL TAGS' }}
        </div>
        <h1 class="archive-title">{{ frontmatter.title }}</h1>
        <p class="archive-desc">{{ current ? current.description : frontmatter.description }}</p>
        <div class="tag-cloud">
          <a
            v-for="tag in allTags"
            :key="tag.slug"
            :href="`/tags/${tag.slug}/`"
            class="tag-filter-btn"
            :class="{ active: current?.slug === tag.slug }"
          >{{ tag.name }} <span class="tag-count">{{ tag.count }}</span></a>
        </div>
      </header>

      <div v-if="current" class="posts-grid grid">
        <PostCard v-for="post in tagPosts" :key="post.url" :post="post" />
      </div>

      <ul v-else class="tag-overview">
        <li v-for="tag in allTags" :key="tag.slug">
          <a :href="`/tags/${tag.slug}/`" class="tag-overview-item">
            <span class="tag-overview-name">{{ tag.name }}<span class="tag-count">{{ tag.count }} 篇</span></span>
            <span class="tag-overview-desc">{{ tag.description }}</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

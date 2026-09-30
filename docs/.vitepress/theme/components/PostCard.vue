<script setup lang="ts">
import { computed } from 'vue'
import type { Post } from '../posts.data'

const props = defineProps<{
  post: Post
  viewMode?: 'grid' | 'list'
}>()

function getBadge(tags: string[]) {
  if (tags.some(t => /harness|工程|build|架构/i.test(t))) return { text: 'BUILD', type: 'build' }
  if (tags.some(t => /agent|智能体|实验|评测|lab/i.test(t))) return { text: 'LAB', type: 'lab' }
  return { text: 'NOTE', type: 'note' }
}

const badge = computed(() => getBadge(props.post.tags))
</script>

<template>
  <article class="lab-card" :class="[badge.type, { 'is-list-view': viewMode === 'list' }]">
    <div class="lab-card-header">
      <div class="badge-meta">
        <span class="type-pill" :class="badge.type">{{ badge.text }}</span>
        <time class="meta-date" :datetime="post.date">{{ post.date }}</time>
        <span class="meta-dot">·</span>
        <span class="meta-time">{{ post.readingMinutes }} 分钟阅读</span>
      </div>
    </div>

    <div class="lab-card-body">
      <h3 class="lab-card-title">
        <a :href="post.url">{{ post.title }}</a>
      </h3>
      <p class="lab-card-excerpt">{{ post.description }}</p>
    </div>

    <div class="lab-card-footer">
      <div class="tags-group">
        <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="lab-tag">
          {{ tag }}
        </span>
      </div>
      <a :href="post.url" class="card-arrow-link" :aria-label="`阅读 ${post.title}`">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 10h12m-5-5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </article>
</template>

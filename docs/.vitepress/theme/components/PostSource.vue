<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
</script>

<template>
  <p v-if="frontmatter.sourceUrl" class="post-source">
    本文首发于 <a :href="frontmatter.sourceUrl" target="_blank" rel="noopener noreferrer">原文链接</a>
  </p>
</template>

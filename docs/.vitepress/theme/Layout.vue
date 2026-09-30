<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import PostHeader from './components/PostHeader.vue'
import PostSource from './components/PostSource.vue'
import SiteFooter from './components/SiteFooter.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #doc-before>
      <PostHeader />
    </template>
    <template #doc-footer-before>
      <PostSource />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>

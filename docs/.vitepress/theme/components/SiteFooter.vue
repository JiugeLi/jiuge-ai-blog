<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer jg-container">
    <div class="footer-left">
      <p>© {{ year }} 九歌 AI 实验室</p>
      <p>记录技术，也记录技术背后的人。</p>
      <nav class="footer-links" aria-label="页脚导航">
        <a href="/posts/">文章归档</a>
        <a href="/tags/">全部标签</a>
        <a href="/about">关于九歌</a>
        <a href="/feed.xml">RSS 订阅</a>
      </nav>
    </div>
    <div class="footer-right">
      <SocialLinks />
    </div>
  </footer>
</template>

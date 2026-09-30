<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer jg-container">
    <div class="footer-left">
      <p>© {{ year }} 九歌 AI 大模型</p>
      <p>记录技术，也记录技术背后的人。</p>
    </div>
    <div class="footer-right">
      <SocialLinks />
    </div>
  </footer>
</template>

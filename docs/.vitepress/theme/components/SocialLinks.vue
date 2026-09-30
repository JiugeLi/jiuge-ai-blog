<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(defineProps<{
  variant?: 'full' | 'compact'
}>(), { variant: 'full' })

const allLinks = [
  { label: 'GitHub', href: 'https://github.com/JiugeLi', icon: 'github' },
  { label: 'Twitter', href: 'https://x.com/jiugeAgent', icon: 'twitter' },
  { label: '公众号', href: 'https://mp.weixin.qq.com', icon: 'wechat' },
]

// compact 模式仅显示 GitHub 图标（顶部导航）
const displayLinks = computed(() =>
  props.variant === 'compact'
    ? allLinks.filter(l => l.icon === 'github')
    : allLinks
)

// 邮箱防爬虫：账户与域名拆分存储，点击时才拼接，不出现在静态 HTML 中
const emailRevealed = ref(false)
const emailUser = 'fde'
const emailDomain = 'jiuge.ai'
const fullEmail = computed(() => `${emailUser}@${emailDomain}`)

function revealEmail() {
  emailRevealed.value = true
}

function copyEmail() {
  navigator.clipboard?.writeText(fullEmail.value)
}
</script>

<template>
  <div class="social-links" :class="{ 'social-compact': variant === 'compact' }" aria-label="社交链接">
    <a
      v-for="l in displayLinks"
      :key="l.label"
      :href="l.href"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link"
      :aria-label="l.label"
    >
      <svg v-if="l.icon === 'github'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.38.5 0 5.88 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.23-.12-.3-.54-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.85 1.24 1.92 1.24 3.23 0 4.61-2.81 5.63-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12.01 12.01 0 0 0 24 12.5C24 5.88 18.62.5 12 .5z" />
      </svg>
      <svg v-else-if="l.icon === 'twitter'" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      <svg v-else viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M8.69 2C4.3 2 .8 4.8.8 8.25c0 2.02 1.21 3.8 3.1 4.97L3.1 15l2.6-1.4c.93.17 1.86.26 2.83.26h.49a5.4 5.4 0 0 1-.29-1.72c0-3.55 3.5-6.43 7.81-6.43.28 0 .55.02.82.05C15.9 3.56 12.6 2 8.69 2zM5.8 6.9a1.02 1.02 0 1 1 0-2.04 1.02 1.02 0 0 1 0 2.04zm5.78 0a1.02 1.02 0 1 1 0-2.04 1.02 1.02 0 0 1 0 2.04zM23.2 14.13c0-2.93-2.92-5.3-6.52-5.3s-6.52 2.37-6.52 5.3 2.92 5.3 6.52 5.3c.76 0 1.49-.1 2.17-.27l2.1 1.13-.57-1.88c1.66-1.03 2.82-2.61 2.82-4.28zm-8.7-1.5a.84.84 0 1 1 0-1.69.84.84 0 0 1 0 1.69zm4.35 0a.84.84 0 1 1 0-1.69.84.84 0 0 1 0 1.69z" />
      </svg>
      <span v-if="variant === 'full'">{{ l.label }}</span>
    </a>

    <!-- 邮箱：防爬虫，点击后才拼接显示，不进入静态 HTML -->
    <div v-if="variant === 'full'" class="email-wrap">
      <button
        v-if="!emailRevealed"
        type="button"
        class="social-link email-btn"
        aria-label="显示邮箱地址"
        @click.prevent="revealEmail"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span>邮箱</span>
      </button>
      <a
        v-else
        :href="`mailto:${fullEmail}`"
        class="social-link email-revealed"
        aria-label="发送邮件"
        @click="copyEmail"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
        <span>{{ fullEmail }}</span>
      </a>
    </div>
  </div>
</template>

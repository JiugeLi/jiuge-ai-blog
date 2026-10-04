<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import PostCard from './PostCard.vue'
import SocialLinks from './SocialLinks.vue'
import { data as posts } from '../posts.data'

const selectedTag = ref('全部')
const searchQuery = ref('')
const sortOrder = ref<'newest' | 'oldest'>('newest')
const viewMode = ref<'grid' | 'list'>('grid')
const currentPage = ref(1)
const pageSize = 12

// 只展示有文章的标签，按文章数排序
const tagCounts = posts.reduce<Record<string, number>>((acc, post) => {
  post.tags.forEach(tag => { acc[tag] = (acc[tag] || 0) + 1 })
  return acc
}, {})
const fixedTags = ['全部', ...Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])]

const researchTracks = [
  {
    icon: 'model',
    title: '大模型',
    sub: '模型 · Benchmark · 推理',
    filterTag: 'AI',
    colorClass: 'blue'
  },
  {
    icon: 'agent',
    title: '智能体',
    sub: 'Agent · Harness · Skill',
    filterTag: '智能体',
    colorClass: 'green'
  },
  {
    icon: 'coding',
    title: 'AI 编程',
    sub: 'Coding Agent · IDE · CLI',
    filterTag: '编程',
    colorClass: 'purple'
  },
  {
    icon: 'product',
    title: '产品与应用',
    sub: '产品 · 工具 · 创业',
    filterTag: '商业',
    colorClass: 'orange'
  },
  {
    icon: 'thought',
    title: '技术思考',
    sub: '行业 · 互联网 · 成长',
    filterTag: '随笔',
    colorClass: 'yellow'
  },
]

const hubNodes = [
  { id: 'model', label: 'MODEL', x: 50, y: 12, icon: 'model' },
  { id: 'agent', label: 'AGENT', x: 22, y: 28, icon: 'agent' },
  { id: 'coding', label: 'CODING', x: 78, y: 28, icon: 'coding' },
  { id: 'rag', label: 'RAG', x: 12, y: 55, icon: 'rag' },
  { id: 'bench', label: 'BENCH', x: 88, y: 55, icon: 'bench' },
  { id: 'think', label: 'THINK', x: 24, y: 82, icon: 'think' },
  { id: 'tools', label: 'TOOLS', x: 76, y: 82, icon: 'tools' },
  { id: 'product', label: 'PRODUCT', x: 50, y: 92, icon: 'product' },
]

// Current featured experiment
const featuredPost = computed(() => {
  const harness = posts.find(p => p.url.includes('harness'))
  return harness || posts[0]
})

const stats = computed(() => ({
  postsCount: posts.length,
  topicsCount: fixedTags.length - 1,
  projectsCount: 26,
  readCount: '12K+',
}))

const filteredPosts = computed(() => {
  let list = [...posts]
  if (selectedTag.value !== '全部') {
    list = list.filter(p => p.tags.includes(selectedTag.value))
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
  }
  if (sortOrder.value === 'oldest') {
    list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  } else {
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredPosts.value.length / pageSize)))

const pagedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredPosts.value.slice(start, start + pageSize)
})

watch([selectedTag, searchQuery, sortOrder], () => {
  currentPage.value = 1
})

function setTrack(tag: string) {
  selectedTag.value = tag
  scrollToArchive()
}

function scrollToArchive() {
  document.getElementById('archive-section')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const tag = params.get('tag')
  if (tag && fixedTags.includes(tag)) {
    selectedTag.value = tag
    scrollToArchive()
  }
})
</script>

<template>
  <div class="lab-home">
    <!-- Top Hero Section -->
    <section class="hero-lab-section">
      <div class="jg-container hero-grid">
        <!-- Left: Studio Identity & Stats -->
        <div class="hero-intro">
          <div class="eyebrow-pill-live">
            <span class="pill-dot" />
            <span>JUIGE AI LAB</span>
          </div>
          <h1 class="hero-title">
            九歌 AI 实验室
          </h1>
          <p class="hero-subtitle">Build · Test · Deploy · Write</p>
          <p class="hero-desc">
            我在这里记录 AI 模型、Agent、Coding、工程化与产品实验，以及在真实业务场景中的应用与思考。
          </p>

          <div class="hero-metrics-bar">
            <div class="metric-cell">
              <strong>{{ stats.postsCount }}</strong>
              <span>篇文章</span>
            </div>
            <div class="metric-divider" />
            <div class="metric-cell">
              <strong>{{ stats.topicsCount }}</strong>
              <span>个主题</span>
            </div>
            <div class="metric-divider" />
            <div class="metric-cell">
              <strong>{{ stats.projectsCount }}</strong>
              <span>实验项目</span>
            </div>
            <div class="metric-divider" />
            <div class="metric-cell">
              <strong>{{ stats.readCount }}</strong>
              <span>阅读量</span>
            </div>
          </div>

          <div class="hero-cta-group">
            <button class="btn-primary-glow" type="button" @click="scrollToArchive">
              探索文章
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 10h12m-5-5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <a href="/about" class="btn-subtle">
              关于我
            </a>
          </div>
        </div>

        <!-- Center: Interactive AI System Topology Orbit with Generated 3D Asset -->
        <div class="hero-centerpiece" aria-label="AI系统架构拓扑图">
            <img 
              src="/hero-orbit-topology.webp"
              alt="九歌 AI 实验室架构拓扑图" 
              class="hero-ai-art"
              width="460"
              height="306"
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
        </div>

        <!-- Right: Current Experiment Card -->
        <div class="experiment-card">
          <div class="exp-badge-row">
            <span class="exp-label">CURRENT EXPERIMENT</span>
            <span class="exp-num">026</span>
          </div>

          <div class="exp-status-pill">
            <span class="status-dot-pulse" />
            <span>Exploring</span>
          </div>

          <h2 class="exp-title">
            {{ featuredPost?.title || 'Harness Engineering' }}
          </h2>
          <p class="exp-summary">Agent Reliability & Framework</p>

          <!-- System Architecture Blueprint Illustration -->
          <div class="agent-diagram-box">
            <div class="diag-node">
              <span class="diag-node-pill">DB</span>
              <span class="diag-label">RAG</span>
            </div>
            <span class="diag-arrow">→</span>
            <div class="diag-node">
              <div class="diag-center-avatar">
                <span style="font-size: 14px;">🤖</span>
              </div>
              <span class="diag-label" style="color: #38bdf8; font-weight: 600;">Agent</span>
              <span class="diag-tags-sub">Tools · API · Env · Mem</span>
            </div>
            <span class="diag-arrow">→</span>
            <div class="diag-node">
              <span class="diag-node-pill purple">LLM</span>
              <span class="diag-label">Model</span>
            </div>
          </div>

          <div class="exp-meta-bar">
            <span class="meta-label">MODEL</span>
            <span class="meta-val">GPT-5.6 / Claude / DeepSeek</span>
          </div>

          <a :href="featuredPost?.url" class="exp-link">
            查看实验记录
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 10h12m-5-5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- Research Tracks Section -->
    <section id="tracks-section" class="tracks-section jg-container">
      <div class="section-heading">
        <span class="heading-tag">RESEARCH TRACKS</span>
        <h2>研究方向</h2>
      </div>

      <div class="tracks-grid">
        <button
          v-for="track in researchTracks"
          :key="track.title"
          class="track-card"
          type="button"
          :class="{ active: selectedTag === track.filterTag }"
          @click="setTrack(track.filterTag)"
        >
          <div class="track-icon-badge" :class="track.colorClass">
            <svg v-if="track.icon === 'model'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <svg v-else-if="track.icon === 'agent'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 005 0" />
            </svg>
            <svg v-else-if="track.icon === 'coding'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <svg v-else-if="track.icon === 'product'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <div class="track-info">
            <div class="track-title">{{ track.title }}</div>
            <div class="track-desc">{{ track.sub }}</div>
          </div>
        </button>
      </div>
    </section>

    <!-- Article Archive Section -->
    <section id="archive-section" class="archive-section jg-container">
      <div class="archive-toolbar">
        <div class="section-heading">
          <span class="heading-tag">ARTICLE ARCHIVE</span>
          <h2>文章归档</h2>
        </div>

        <div class="archive-controls">
          <!-- Live Filter Search -->
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="M12.5 12.5L17 17" stroke-linecap="round" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索标题、摘要或标签..."
              aria-label="筛选文章"
            >
          </div>

          <!-- Sort Select -->
          <div class="sort-selector">
            <select v-model="sortOrder" aria-label="排序方式">
              <option value="newest">最新发布</option>
              <option value="oldest">最早发布</option>
            </select>
          </div>

          <!-- Grid / List View Toggle -->
          <div class="view-toggles" role="group" aria-label="视图切换">
            <button
              type="button"
              :class="{ active: viewMode === 'grid' }"
              aria-label="网格视图"
              @click="viewMode = 'grid'"
            >
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8">
                <rect x="2" y="2" width="6" height="6" rx="1" />
                <rect x="10" y="2" width="6" height="6" rx="1" />
                <rect x="2" y="10" width="6" height="6" rx="1" />
                <rect x="10" y="10" width="6" height="6" rx="1" />
              </svg>
            </button>
            <button
              type="button"
              :class="{ active: viewMode === 'list' }"
              aria-label="列表视图"
              @click="viewMode = 'list'"
            >
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M3 5h12M3 9h12M3 13h12" stroke-linecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Tag Filters Pill Row -->
      <div class="tags-filter-bar" role="tablist">
        <button
          v-for="tag in fixedTags"
          :key="tag"
          type="button"
          class="tag-chip"
          :class="{ active: selectedTag === tag }"
          @click="selectedTag = tag"
        >
          {{ tag }}
        </button>
      </div>

      <!-- Posts Listing -->
      <div v-if="filteredPosts.length" class="posts-grid" :class="viewMode">
        <PostCard
          v-for="post in pagedPosts"
          :key="post.url"
          :post="post"
          :view-mode="viewMode"
        />
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>没有找到相关文章</h3>
        <p>可以尝试更换关键词或选择「全部」分类</p>
        <button class="btn-primary-glow" type="button" @click="selectedTag = '全部'; searchQuery = ''">
          重置筛选条件
        </button>
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="pagination" aria-label="文章列表分页">
        <button
          class="page-btn"
          type="button"
          :disabled="currentPage === 1"
          aria-label="上一页"
          @click="currentPage--"
        >
          ‹
        </button>
        <button
          v-for="p in totalPages"
          :key="p"
          class="page-btn"
          type="button"
          :class="{ active: currentPage === p }"
          @click="currentPage = p; scrollToArchive()"
        >
          {{ p }}
        </button>
        <button
          class="page-btn"
          type="button"
          :disabled="currentPage === totalPages"
          aria-label="下一页"
          @click="currentPage++"
        >
          ›
        </button>
      </nav>
    </section>

    <!-- Bottom Footer Profile Card -->
    <section class="bottom-lab-profile jg-container">
      <div class="profile-card-grid">
        <div class="profile-col-main">
          <div class="profile-eyebrow">ABOUT / JIUGE</div>
          <h2>关于九歌</h2>
          <p class="profile-bio">
            大家好，我是九歌AI。关注 AI、大模型、智能体和真实的软件工程实践，也记录互联网商业与个人成长。
          </p>
          <div class="profile-socials">
            <SocialLinks />
          </div>
        </div>

        <div class="profile-col-info">
          <h4>我的研究方向</h4>
          <ul>
            <li>大模型与评测</li>
            <li>智能体工程</li>
            <li>AI 产品与工具</li>
          </ul>
        </div>

        <div class="profile-col-info">
          <h4>正在折腾</h4>
          <ul>
            <li>Solomux</li>
            <li>FDE</li>
            <li>Agent Harness</li>
            <li>更多实验中...</li>
          </ul>
        </div>

        <div class="profile-col-art">
          <div class="mountain-silhouette" />
        </div>
      </div>
    </section>
  </div>
</template>

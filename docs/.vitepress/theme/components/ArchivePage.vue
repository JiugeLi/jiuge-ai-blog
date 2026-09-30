<script setup lang="ts">
import { computed, ref } from 'vue'
import { data as posts, type Post } from '../posts.data'

const selectedYear = ref<string>('all')
const selectedTag = ref<string>('all')
const searchQuery = ref<string>('')

// 提取所有年份
const years = computed(() => {
  const set = new Set<string>()
  posts.forEach(p => {
    if (p.date && p.date.length >= 4) {
      set.add(p.date.slice(0, 4))
    }
  })
  return Array.from(set).sort((a, b) => b.localeCompare(a))
})

// 提取热门标签
const allTags = computed(() => {
  const map: Record<string, number> = {}
  posts.forEach(p => {
    p.tags?.forEach(t => {
      map[t] = (map[t] || 0) + 1
    })
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag)
})

// 过滤后的文章列表
const filteredPosts = computed(() => {
  return posts.filter(post => {
    const matchYear = selectedYear.value === 'all' || post.date.startsWith(selectedYear.value)
    const matchTag = selectedTag.value === 'all' || post.tags.includes(selectedTag.value)
    const q = searchQuery.value.trim().toLowerCase()
    const matchSearch = !q || post.title.toLowerCase().includes(q) || post.description.toLowerCase().includes(q)
    return matchYear && matchTag && matchSearch
  })
})

// 按 年份 -> 月份 组织树状归档
interface MonthGroup {
  month: string
  monthLabel: string
  posts: Post[]
}

interface YearGroup {
  year: string
  count: number
  months: MonthGroup[]
}

const archiveGroups = computed<YearGroup[]>(() => {
  const yearMap = new Map<string, Map<string, Post[]>>()

  filteredPosts.value.forEach(post => {
    const dateStr = post.date || '2026-01-01'
    const year = dateStr.slice(0, 4)
    const month = dateStr.slice(5, 7) || '01'

    if (!yearMap.has(year)) {
      yearMap.set(year, new Map())
    }
    const monthMap = yearMap.get(year)!
    if (!monthMap.has(month)) {
      monthMap.set(month, [])
    }
    monthMap.get(month)!.push(post)
  })

  // 排序输出
  const result: YearGroup[] = []
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => b.localeCompare(a))

  for (const year of sortedYears) {
    const monthMap = yearMap.get(year)!
    const sortedMonths = Array.from(monthMap.keys()).sort((a, b) => b.localeCompare(a))
    const months: MonthGroup[] = []
    let totalInYear = 0

    for (const month of sortedMonths) {
      const monthPosts = monthMap.get(month)!.sort((a, b) => b.date.localeCompare(a.date))
      totalInYear += monthPosts.length
      months.push({
        month,
        monthLabel: `${Number(month)}月`,
        posts: monthPosts,
      })
    }

    result.push({
      year,
      count: totalInYear,
      months,
    })
  }

  return result
})
</script>

<template>
  <div class="archive-page">
    <div class="jg-container">
      <!-- 页面头部 -->
      <header class="archive-header">
        <div class="badge-eyebrow">
          <span class="badge-dot"></span>
          ARTICLE TIMELINE ARCHIVE
        </div>
        <h1 class="archive-title">文章时间线归档</h1>
        <p class="archive-desc">
          探索九歌 AI 实验室自创建以来的全部技术记录、实战方案与观察笔记。共计 <strong>{{ posts.length }}</strong> 篇文章。
        </p>

        <!-- 检索与筛选栏 -->
        <div class="archive-filter-bar">
          <div class="search-input-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索归档文章标题或关键词..."
              class="archive-search-input"
            >
            <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">✕</button>
          </div>

          <div class="filter-pills">
            <!-- 年份切换 -->
            <button
              :class="['filter-pill', { active: selectedYear === 'all' }]"
              @click="selectedYear = 'all'"
            >
              全部年份
            </button>
            <button
              v-for="y in years"
              :key="y"
              :class="['filter-pill', { active: selectedYear === y }]"
              @click="selectedYear = y"
            >
              {{ y }}年
            </button>
          </div>
        </div>

        <!-- 热门标签 -->
        <div class="archive-tags-row">
          <span class="tags-label">按主题筛选:</span>
          <button
            :class="['tag-filter-btn', { active: selectedTag === 'all' }]"
            @click="selectedTag = 'all'"
          >
            全部
          </button>
          <button
            v-for="tag in allTags"
            :key="tag"
            :class="['tag-filter-btn', { active: selectedTag === tag }]"
            @click="selectedTag = tag"
          >
            {{ tag }}
          </button>
        </div>
      </header>

      <!-- 时间线主体 -->
      <section v-if="archiveGroups.length > 0" class="timeline-container">
        <div v-for="yearGroup in archiveGroups" :key="yearGroup.year" class="timeline-year-section">
          <!-- 年份标记 -->
          <div class="timeline-year-header">
            <div class="year-number">{{ yearGroup.year }}</div>
            <div class="year-badge">{{ yearGroup.count }} 篇文章</div>
          </div>

          <!-- 月份列表 -->
          <div class="timeline-months">
            <div
              v-for="monthGroup in yearGroup.months"
              :key="monthGroup.month"
              class="timeline-month-block"
            >
              <div class="timeline-month-badge">
                <span class="month-dot"></span>
                <span class="month-name">{{ monthGroup.monthLabel }}</span>
                <span class="month-count">({{ monthGroup.posts.length }})</span>
              </div>

              <!-- 月度文章流 -->
              <div class="timeline-articles">
                <a
                  v-for="article in monthGroup.posts"
                  :key="article.url"
                  :href="article.url"
                  class="timeline-article-row"
                >
                  <div class="row-date">
                    {{ article.date.slice(5) }}
                  </div>
                  <div class="row-main">
                    <h3 class="row-title">{{ article.title }}</h3>
                    <p class="row-excerpt">{{ article.description }}</p>
                    <div class="row-tags">
                      <span v-for="t in article.tags.slice(0, 3)" :key="t" class="row-tag">{{ t }}</span>
                    </div>
                  </div>
                  <div class="row-action">
                    <span class="read-min">{{ article.readingMinutes }} min</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 无搜索结果 -->
      <div v-else class="archive-empty">
        <div class="empty-icon">📂</div>
        <h3>未找到符合条件的归档文章</h3>
        <p>可以尝试更换搜索关键词，或者重置筛选条件。</p>
        <button class="reset-filter-btn" @click="selectedYear = 'all'; selectedTag = 'all'; searchQuery = ''">
          重置全部筛选
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SocialLinks from './SocialLinks.vue'
import { data as posts } from '../posts.data'

const focusAreas = [
  {
    title: '大模型与评测',
    desc: '跟踪国内外主流前沿模型推理、多模态与长上下文能力，探索工业落地基准。',
    tag: 'LLM & Eval',
    icon: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    title: '智能体工程 (Harness)',
    desc: '从单点提示词进化到多轮工具调用、Durable 执行与自主纠错系统的架构设计。',
    tag: 'Agentic Workflow',
    icon: 'M12 6V2M12 22v-4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83',
  },
  {
    title: 'AI 编码与生产力',
    desc: '深度实测 Claude Code、Codex、Cursor、Playwright 等工具链的最佳工程化实践。',
    tag: 'AI Coding & CLI',
    icon: 'M16 18l6-6-6-6M8 6l-6 6 6 6',
  },
  {
    title: '商业落地与个人成长',
    desc: '技术最终需要服务于真实业务闭环，记录个人技术探索与商业化变现思考。',
    tag: 'Business & Growth',
    icon: 'M22 12h-4l-3 9L9 3l-3 9H2',
  },
]

const ongoingProjects = [
  { name: 'Solomux', desc: 'AI 多通道网关与智能体路由' },
  { name: 'FDE 智能体工作台', desc: '自动化企业任务流与虚仿引擎' },
  { name: 'Agent Harness', desc: '高鲁棒性自主 Agent 运行环境' },
  { name: '九歌 AI 实验室', desc: 'VitePress + Cloudflare Pages 静态博客' },
]
</script>

<template>
  <div class="about-page">
    <div class="jg-container-narrow">
      <!-- 头部个人名片 -->
      <section class="about-profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <span>九</span>
          </div>
          <div class="profile-title">
            <div class="badge-eyebrow">
              <span class="badge-dot"></span>
              CREATOR & ENGINEER
            </div>
            <h1>九歌 (Jiuge)</h1>
            <p class="profile-sub">AI 架构实践者 / 独立开发者 / 终身学习者</p>
          </div>
        </div>

        <p class="profile-bio">
          大家好，我是九歌。这里是我的个人技术实验室。我长期关注 <strong>AI 大模型</strong>、<strong>智能体架构 (Agentic Systems)</strong>、<strong>AI 编码辅助</strong> 以及真实场景下的软件工程落地，同时记录互联网产品商业化与个人认知迭代。
        </p>

        <div class="profile-stats">
          <div class="pstat">
            <span class="pstat-val">{{ posts.length }}</span>
            <span class="pstat-lbl">原创技术文章</span>
          </div>
          <div class="pstat">
            <span class="pstat-val">26</span>
            <span class="pstat-lbl">实验项目</span>
          </div>
          <div class="pstat">
            <span class="pstat-val">100%</span>
            <span class="pstat-lbl">开源透明实践</span>
          </div>
        </div>
      </section>

      <!-- 核心栏目：这个博客写什么 -->
      <section class="about-section">
        <div class="section-title-wrap">
          <div class="badge-eyebrow">
            <span class="badge-dot"></span>
            MISSION
          </div>
          <h2>这个博客写什么？</h2>
          <p class="section-lead">把复杂概念讲清楚，把真实踩坑留下来，把一次性的经验变成可以重复使用的方法论。</p>
        </div>

        <div class="focus-grid">
          <div v-for="area in focusAreas" :key="area.title" class="focus-card">
            <div class="focus-icon-wrap">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                <path :d="area.icon" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div class="focus-tag">{{ area.tag }}</div>
            <h3>{{ area.title }}</h3>
            <p>{{ area.desc }}</p>
          </div>
        </div>
      </section>

      <!-- 正在折腾的项目 -->
      <section class="about-section">
        <div class="section-title-wrap">
          <div class="badge-eyebrow">
            <span class="badge-dot"></span>
            ACTIVE LABS
          </div>
          <h2>正在折腾的实验项目</h2>
        </div>

        <div class="projects-list">
          <div v-for="proj in ongoingProjects" :key="proj.name" class="project-item">
            <div class="proj-badge">● RUNNING</div>
            <div class="proj-info">
              <h4>{{ proj.name }}</h4>
              <p>{{ proj.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系与社交矩阵 -->
      <section class="about-section about-contact-section">
        <div class="contact-card">
          <div class="contact-text">
            <h2>连接九歌</h2>
            <p>如果你对博客中的技术文章有疑问，或者想共同探讨 AI 落地、智能体或项目合作，欢迎随时通过以下渠道联系我。</p>
          </div>
          <div class="contact-links">
            <SocialLinks />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<template>
  <main class="fde-series-page jg-container-narrow">
    <div class="fde-series-heading">
      <span class="fde-series-eyebrow">FIELD GUIDE / FDE</span>
      <h1>FDE前线部署工程师小白书</h1>
      <p>企业 AI 项目能演示，不等于用户能用。账号、权限、资料、模型服务和业务系统接在一起，问题才会真正出现。这个系列从最基本的工作对象讲起，顺着一次请求走完整条链路，再逐步写部署、排错和验收。</p>
      <p>文章按顺序读即可。每篇都尽量回答一个具体问题，图用来说明系统关系，不需要先背一套框架名词。</p>
    </div>

    <div class="fde-series-list">
      <a class="fde-series-item" href="/posts/2026/10/13/what-is-fde/">
        <span class="fde-series-number">01 / 岗位与边界</span>
        <h2>FDE 到底是什么</h2>
        <p>用企业 AI 助手的交付过程说明 FDE 接通哪些环节，以及“能演示”和“能交付”之间差在哪。</p>
        <span class="fde-series-item-link">阅读文章 →</span>
      </a>
      <a class="fde-series-item" href="/posts/2026/10/13/fde-request-path/">
        <span class="fde-series-number">02 / 请求链路</span>
        <h2>一个 AI 请求到底经过了哪些系统</h2>
        <p>从浏览器到应用、检索、网关与模型服务。先找到请求在哪一层失败，再决定查什么日志。</p>
        <span class="fde-series-item-link">阅读文章 →</span>
      </a>
    </div>

    <p class="fde-series-outro">后续篇目会继续沿着这条链路，写服务器检查、模型服务、知识库权限、故障定位和上线验证。</p>
  </main>
</template>

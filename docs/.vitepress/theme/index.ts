import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import HomePage from './components/HomePage.vue'
import ArchivePage from './components/ArchivePage.vue'
import AboutPage from './components/AboutPage.vue'
import TagPage from './components/TagPage.vue'
import './styles/lab.css'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.component('HomePage', HomePage)
    app.component('ArchivePage', ArchivePage)
    app.component('AboutPage', AboutPage)
    app.component('TagPage', TagPage)
  },
} satisfies Theme

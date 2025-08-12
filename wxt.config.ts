import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-vue'],
  // @ts-ignore
  vite: () => ({
    plugins: [
      tailwindcss(),
    ],
  }),
  outDirTemplate: '{{browser}}-mv{{manifestVersion}}',
  outDir: 'dist',
  manifest: {
    permissions: [
      'activeTab',
      'storage',
    ],
    host_permissions: [
      '*://*.bilibili.com/*', // * 允许访问 Bilibili 域名下的所有 HTTPS 页面
    ],
  },
})

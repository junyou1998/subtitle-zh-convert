import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'vite.svg'],
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'ZhConvert 字幕轉換器',
        short_name: 'ZhConvert',
        description: '基於繁化姬 API 的純前端字幕轉換工具，支援 ASS/SRT 批次繁簡轉換與本地化。',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})

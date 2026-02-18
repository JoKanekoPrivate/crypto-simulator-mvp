import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite開発サーバのプロキシ設定
  // 本番デプロイ時：/api/* → https://your-production-server.com/api/*
  // 開発時：/api/* → http://localhost:3000/api/*
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})

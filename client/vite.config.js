import path from 'path'
// import eslint from 'vite-plugin-eslint'
import vue from '@vitejs/plugin-vue2'

export default {
  esbuild: {
    drop: ['console', 'debugger'],
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  server: {
    port: 8080,
  },
}

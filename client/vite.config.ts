import react from '@vitejs/plugin-react'
import {defineConfig} from 'vite'

// https://vite.dev/config/

const c = {
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  plugins: [react()],
  resolve: {
    alias: {
      'components': '/src/components',
      'pages': '/src/pages',
      '~': '/src',
    },
  },

}
export default defineConfig(({command}:{command:string}) => {
  if (command === 'serve') {
    return c
  } else {
    // command === 'build'
    return c
  }
})

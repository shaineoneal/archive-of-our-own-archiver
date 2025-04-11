import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                additionalData: '@use "${path.join(process.cwd(), \'src/_mantine\').replace(/\\\\/g, \'/\')}" as mantine";'
            }
        }
    }
})
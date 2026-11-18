import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' funciona na Vercel e no GitHub Pages
export default defineConfig({ plugins: [react()], base: './' })

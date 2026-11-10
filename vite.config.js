
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/student-task-manager/',
  plugins: [react()],
})

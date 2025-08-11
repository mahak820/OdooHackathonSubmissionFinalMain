import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   proxy : {
      '/api' : {
        changeOrigin : true , 
        target : 'http://localhost:8000' , 
        secure : false
      }
    } ,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
 
})
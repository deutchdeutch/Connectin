import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        react(),          
        tailwindcss(),     

    ],
    
    base: "/connectin/",  
    build: {
        outDir: "dist",    
        sourcemap: true,
    },
    server: {
        host: true,        
        port: 5173
    }
});

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import fs from 'fs';

console.log(process.env.SW_DEV)

// https://vitejs.dev/config/
export default defineConfig({
    // server : {
    //     https : {
    //         key  : fs.readFileSync("./server.key"),
    //         cert : fs.readFileSync("./server.crt")
    //     }
    // },
    plugins: [vue(), VitePWA({
        registerType: "autoUpdate",
        // mode : "development",
        strategies: "injectManifest",
        base : "./",
        srcDir: 'src',
        filename: 'sw.ts',
        includeAssets: ["favicon.ico"],
        manifest: {
            name: "Lucy Marketing",
            short_name: "Lucy Marketing",
            theme_color: "#FF2353",
            start_url: "/home",
            display: "standalone",
            background_color: "#ffffff",
            icons: [
            {
                src: "icon-192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
            },
            {
                src: "icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "any maskable",
            },
            ],
        },
        devOptions : {
            enabled: false,
            type: 'module',
            navigateFallback: 'index.html'
        }, 
    })]
})
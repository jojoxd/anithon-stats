import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'vite-plugin-components';
import pages from 'vite-plugin-pages';
import icons, { ViteIconsResolver } from 'vite-plugin-icons';

// https://vitejs.dev/config/
export default defineConfig({
    base: 'http://localhost:3000/',

    server: {
        proxy: {
            '/api': "http://localhost:8083",
        },
    },

    alias: {
        '~include-media': 'include-media',
        '$$component-utils': './src/assets/css/component-utils.scss'
    },

    plugins: [
        vue(),

        components({
            dirs: [
                'src/components/**'
            ],

            customComponentResolvers: [
                ViteIconsResolver({
                    componentPrefix: 'icon'
                }),
            ],
        }),

        icons({

        }),

        pages({
            importMode: "async",
            nuxtStyle: true,

            pagesDir: 'src/pages',
        }),
    ],
});

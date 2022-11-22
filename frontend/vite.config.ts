import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite';
import pages from 'vite-plugin-pages';
import icons from 'unplugin-icons/vite';
import ViteIconsResolver from "unplugin-icons/resolver";
import {Vuetify3Resolver} from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
    base: 'http://localhost:3000/',

    server: {
        port: 3000,

        proxy: {
            '/api': "http://localhost:8083",
        },
    },

    resolve: {
        alias: {
            '~include-media': 'include-media',
            '$$component-utils': './src/assets/css/component-utils.scss'
        },
    },

    plugins: [
        vue(),

        components({
            dirs: [
                'src/components/**'
            ],

            resolvers: [
            	Vuetify3Resolver(),

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

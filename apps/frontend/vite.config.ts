/// <reference types="vitest" />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite';
import pages from 'vite-plugin-pages';
import icons from 'unplugin-icons/vite';
import ViteIconsResolver from "unplugin-icons/resolver";
import {Vuetify3Resolver} from "unplugin-vue-components/resolvers";

export default defineConfig({
    server: {
        port: 4200,
        host: 'localhost',

        proxy: {
            '/api': "http://localhost:8083"
        },
    },

    plugins: [
        vue(),

        components({
            dirs: [
                'src/components/**',
            ],

            resolvers: [
                Vuetify3Resolver(),

                // @NOTE: This should be unused under vuetify
                ViteIconsResolver({
                    componentPrefix: 'icon'
                }),
            ],
        }),

        // @NOTE: This should be unused under vuetify
        icons({}),

        pages({
            importMode: "async",
            nuxtStyle: true,

            pagesDir: 'src/pages',
        }),

        tsconfigPaths({
            root: '../../',
            projects: ['tsconfig.base.json'],
        }),
    ],

    test: {
        globals: true,
        environment: 'jsdom',
        include: [
            'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
        ],
    },
});

/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite';
import pages from 'vite-plugin-pages';
import icons from 'unplugin-icons/vite';
import ViteIconsResolver from "unplugin-icons/resolver";
import {Vuetify3Resolver} from "unplugin-vue-components/resolvers";
import {ComponentResolver} from "unplugin-vue-components";

function Vuetify3LabsResolver(): ComponentResolver
{
    return {
        type: 'component',
        resolve: (name: string) => {
            if (name.match(/^V[A-Z]/)) {
                console.log('resolve', name);

                try {
                    require.resolve(`vuetify/labs/${name}`);
                    console.log('resolve labs', name);

                    return { name, from: 'vuetify/labs/components', };
                } catch(ignored) {}
            }

            return void 0;
        },
    };
}

export default defineConfig({
    server: {
        port: 4200,
        host: 'localhost',

        proxy: {
            '/api': "http://localhost:8083"
        },

        fs: {
            // Allow vite to serve files from root node_modules
            allow: ['../../node_modules'],
        }
    },

    plugins: [
        vue(),

        components({
            dirs: [
                'src/components/**',
            ],

            resolvers: [
                Vuetify3LabsResolver(),
                Vuetify3Resolver(),

                // @NOTE: This should be unused under vuetify
                ViteIconsResolver({
                    componentPrefix: 'icon'
                }),

                (name: string) => {
                    if (name.startsWith('Slick')) {
                        console.log('RESOLVE', name.slice('Slick'.length));
                        return { name: name.slice('Slick'.length), from: 'vue-slicksort', };
                    }
                },
            ],
        }) as Plugin,

        // @NOTE: This should be unused under vuetify
        icons({}) as Plugin,

        pages({
            importMode: "async",
            nuxtStyle: true,

            pagesDir: 'src/pages',
        }),

        tsconfigPaths({
            root: '../../',
            projects: ['tsconfig.base.json'],
        }) as Plugin,
    ],

    test: {
        globals: true,
        environment: 'jsdom',
        include: [
            'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
        ],
    },
});

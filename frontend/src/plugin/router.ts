import {createRouter as _createRouter, createWebHistory} from 'vue-router';
import routes from 'virtual:generated-pages';

export default function createRouter()
{
    const router = _createRouter({
        history: createWebHistory(),
        routes,
    });

    return router;
}
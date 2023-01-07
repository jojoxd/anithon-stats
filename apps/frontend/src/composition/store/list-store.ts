import {defineStore} from "pinia";
import { ref } from "vue";
import {ListDataResponse} from "@anistats/shared";

export const useListStore = defineStore('list', () => {
    const entries = ref<null | ListDataResponse>();

    const hasUnsavedChanges = ref<boolean>(false);

    async function loadList(id: string) {
        console.log('Load List', id);
    }

    async function saveList() {
        console.log('Save List');
    }

    return {
        currentList,
        hasUnsavedChanges,

        loadList,
        saveList,
    };
});

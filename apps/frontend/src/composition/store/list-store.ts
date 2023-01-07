import {defineStore} from "pinia";
import { ref } from "vue";
import {ListId, ListResponse} from "@anistats/shared";
import {useAxios} from "../useAxios";

export const useListStore = defineStore('list', () => {
    const currentList = ref<null | ListResponse>();

    const hasUnsavedChanges = ref<boolean>(false);

    const axios = useAxios();

    async function loadList(id: ListId) {
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

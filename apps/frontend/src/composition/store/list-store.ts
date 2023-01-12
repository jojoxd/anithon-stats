import {defineStore} from "pinia";
import { ref, readonly } from "vue";
import {ListDto, ListId, ListResponse} from "@anistats/shared";
import {useAxios} from "../useAxios";

export const useListStore = defineStore('list', () => {
    const currentList = ref<ListDto | null>();

    const hasUnsavedChanges = ref<boolean>(false);

    const axios = useAxios();

    async function loadList(id: ListId) {
        console.log('Load List', id);

        const response = await axios.get<ListResponse>(`list/${id}`);

        currentList.value = response.data?.list ?? null;
        hasUnsavedChanges.value = false;
    }

    async function saveList() {
        console.log('Save List');
    }

    return {
        currentList,

        hasUnsavedChanges: readonly(hasUnsavedChanges),

        setHasUnsavedChanges(_hasUnsavedChanges: boolean) {
            hasUnsavedChanges.value = _hasUnsavedChanges;
        },

        loadList,
        saveList,
    };
});

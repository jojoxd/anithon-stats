<script lang="ts">
    import {useListStore} from "../../../lib/store/list.store";
    import {defineComponent, PropType} from "vue";
    import {storeToRefs} from "pinia";
    import {EntryId, ListId} from "@anistats/shared";

    export default defineComponent({
        props: {
            listId: {
                type: String as PropType<ListId>,
                required: true,
            },
        },

        setup(props) {
            const listStore = useListStore();

            listStore.loadList(props.listId);

            const {
                currentList,
                chunks,
            } = storeToRefs(listStore);

            return {
                currentList,
                chunks,

                getEntry(entryId: EntryId) {
                    return listStore.getEntry(entryId);
                },

                getSeries(entryId: EntryId) {
                    const entry = listStore.getEntry(entryId);

                    return entry ? listStore.getSeries(entry.series.ref) : null;
                },
            };
        },
    });
</script>

<template>
    <div class="chunks" v-if="currentList">
        <h1>Chunks (DEBUG)</h1>

		<chunk-timeline :chunk-list="currentList.chunks"></chunk-timeline>

        <div v-for="chunk of chunks">
            {{ getSeries(chunk.entry.ref).title.romaji }}

            <span>start = {{ chunk.start }};</span>
            <span>end = {{ chunk.end }};</span>
            <span>isJoined = {{ chunk.isJoined }};</span>
            <span>totalEp = {{ getSeries(chunk.entry.ref).episodes }};</span>
        </div>
    </div>
</template>
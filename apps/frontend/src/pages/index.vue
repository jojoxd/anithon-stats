<script lang="ts">
    import {defineComponent} from "vue";
    import {storeToRefs} from "pinia";
    import {useAuthStore} from "../lib/store/auth.store";

    export default defineComponent({
        setup()
        {
            const {
                currentUser,
            } = storeToRefs(useAuthStore());

            return {
                currentUser,
            };
        },
    });
</script>

<template>
    <div v-if="currentUser">
        <UserLists :user="currentUser" />
    </div>
    <div v-else>
        It's pretty empty here...
    </div>

    <search-series multiple />
</template>

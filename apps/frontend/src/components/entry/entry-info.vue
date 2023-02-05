<script lang="ts">
    import {EntryId} from "@anistats/shared";
    import {defineComponent, PropType, toRefs} from "vue";
    import {get} from "@vueuse/core";
    import {mdiApplicationCogOutline, mdiChevronDown, mdiChevronUp, mdiTrashCanOutline} from "@mdi/js";
    import {useListStore} from "../../lib/store/list-store";
    import {useEntry} from "../../lib/composition/entry/use-entry.fn";
    import {useSeries} from "../../lib/composition/series/use-series.fn";
    import {useBreakpoints} from "../../lib/composition/app/use-breakpoints.fn";

    export default defineComponent({
        props: {
            entryId: {
                type: String as PropType<EntryId>,
                required: true,
            },

            sequel: {
                type: Boolean,
                default: false,
            },
        },

        emits: [],

        setup(props, { emit, }) {
            const {
                entryId,
                sequel: isSequel,
            } = toRefs(props);

            const {
                setCurrentEntry,
            } = useListStore();

            const {
                entry,
                seriesId,
            } = useEntry(entryId);

            const {
                series,
                coverImage,
                seriesTitle,
            } = useSeries(seriesId);

            const {
                isMobile,
            } = useBreakpoints();

            function onClickSettings()
            {
                setCurrentEntry(get(entryId));
            }

            return {
                entry,
                entryId,

                index: 0,

                seriesTitle,

                isSequel,

                coverImage,

                isMobile,

                mdiChevronUp,
                onClickUp: () => emit('click:up'),

                mdiChevronDown,
                onClickDown: () => emit('click:down'),

                mdiApplicationCogOutline,
                onClickSettings,

                mdiTrashCanOutline,
                onClickRemove: () => emit('click:remove'),
            };
        },
    });
</script>

<template>
    <div :class="{ 'entry-info': true, sequel: isSequel, mobile: isMobile, }">
        <div class="entry-controls" v-if="!isSequel">
            <v-icon
                :icon="mdiChevronUp"
                @click.prevent="onClickUp"
            ></v-icon>
            <span>{{ index }}</span>
            <v-icon
                :icon="mdiChevronDown"
                @click.prevent="onClickDown"
            ></v-icon>
        </div>

        <v-img
            class="cover"
            :src="coverImage"
            :aspect-ratio="9 / 13"
        ></v-img>

        <span class="title text-h6 text-truncate">
            {{ seriesTitle }}
            <debug :items="{ entryId, sequel,  }"></debug>
        </span>

        <span class="stats">Stats</span>

        <span class="content">
            Content
        </span>

        <span class="actions">
            <v-btn
                :prepend-icon="mdiApplicationCogOutline"
                @click.prevent="onClickSettings"
            >
                Settings
            </v-btn>
            <v-btn
                :prepend-icon="mdiTrashCanOutline"
                @click.prevent="onClickRemove"
            >
                Remove
            </v-btn>
        </span>
    </div>
</template>

<style scoped lang="scss">
    .entry-info {
        display: grid;

        grid-template:
            [row1-start] "controls cover title title"     2rem   [row1-end]
            [row2-start] "controls cover stats   stats"   2.5rem [row2-end]
            [row3-start] "controls cover content content" 1fr    [row3-end]
            [row4-start] "controls cover action  action"  auto   [row4-end]
                       /  3ch      1fr   10fr     1ch;
        ;

        &.mobile {
            grid-template:
                [row1-start] "controls title"  2rem   [row1-end]
                [row2-start] "controls stats"  2.5rem [row2-end]
                [row3-start] "controls action" auto   [row3-end]
                           /  3ch      1fr;

            .cover,
            .content {
                display: none;
            }
        }

        grid-column-gap: 1rem;

        .entry-controls {
            grid-area: controls;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
        }

        .cover {
            grid-area: cover;
        }

        .title {
            grid-area: title;
        }

        .stats {
            grid-area: stats;
        }

        .settings {
            grid-area: settings;
        }

        .content {
            grid-area: content;
        }

        .actions {
            grid-area: action;

            display: inline-flex;
            flex-direction: row;
            flex-wrap: nowrap;
            gap: 1rem;
        }
    }
</style>

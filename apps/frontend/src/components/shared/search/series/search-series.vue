<script lang="ts">
import { mdiMagnify } from "@mdi/js";
import { useSearchSeries } from "../../../../composition/useSearchSeries";
import {computed, defineComponent, PropType, ref, toRefs, watch} from "vue";
import {ApiStatus} from "../../../../composition/useApi";
import {SeriesDto} from "@anistats/shared";

  export default defineComponent({
    props: {
      isDisabled: {
        type: Function as PropType<(series: SeriesDto) => boolean>,
        required: false,
        default: () => true,
      },
    },

    emits: [
        'selected'
    ],

    setup(props, { emit }) {
      const query = ref();
      const selectedId = ref();

      const isOpened = ref(false);

      const {
        isDisabled
      } = toRefs(props);

      const {
        searchData,
        searchStatus,
      } = useSearchSeries(query);

      watch(searchData, () => {
        console.log(searchData.value);
      })

      function onCompleted()
      {
        const selectedSeries = searchData.value?.series.find(series => series.id === selectedId.value) ?? undefined;

        emit('selected', selectedSeries);
        isOpened.value = false;
      }

      const isLoading = computed(() => {
        return searchStatus.value !== ApiStatus.Ok && searchStatus.value !== ApiStatus.Initial;
      });

      return {
        query,
        onCompleted,
        selectedId,

        isLoading,
        isOpened,

        isDisabled,

        searchData,

        mdiMagnify,
      };
    },
  });
</script>

<template>
  <v-dialog v-model="isOpened">
    <template #activator="{ on, props }">
      <v-btn v-on="on" v-bind="props">
        Add
      </v-btn>
    </template>

    <v-card>
      <v-card-title>Test</v-card-title>

      <v-card-text>
        <v-text-field
          ref="textField"
          v-model="query"
          :loading="isLoading"
          variant="solo"
          hide-details
          clearable
          label="Search"
          :prepend-inner-icon="mdiMagnify"
        ></v-text-field>

        <v-list v-if="searchData">
          <slot
              name="item"
              v-for="series in searchData.series"
              :key="series.id"
              :series="series">
            <search-series-entry
                :series="series"
                :disabled="isDisabled(series)"
                @click="selectedId = (selectedId === series.id) ? null : series.id"
                :selected="selectedId === series.id"
            ></search-series-entry>
          </slot>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-btn
            :disabled="!selectedId"
            @click="onCompleted"
        >Add</v-btn>

        <v-btn
          @click="isOpened = false"
        >Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

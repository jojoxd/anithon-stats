<script lang="ts">
  import {computed, defineComponent, PropType, ref, watch} from "vue";
  import {IAnilistUserMetadata, IEntry} from "@anistats/shared";
  import {useVModels} from "@vueuse/core";
  import {useBreakpoints} from "../../composition/useBreakpoints";
  import {useEntry} from "../../composition/useEntry";
	import {mdiDeleteOutline, mdiLinkVariant} from "@mdi/js";

  export default defineComponent({
    props: {
      entry: {
        type: Object as PropType<IEntry>,
        required: true,
      },

      index: {
        type: Number,
        required: false,
        default: -1
      },

      user: {
        type: Object as PropType<IAnilistUserMetadata>,
        required: true
      },

      upEnabled: {
        type: Boolean,
        required: false,
        default: true,
      },

      downEnabled: {
        type: Boolean,
        required: false,
        default: true,
      },
    },

    setup(props, { emit })
    {
      const { entry, index, user, upEnabled, downEnabled } = useVModels(props, emit);

      const {
        title,
        description,
        cover,
        duration: {
          totalDuration,
          episodeDuration,
          episodes
        },
      } = useEntry(entry);

      const anilistUrl = computed(() => {
        return `https://anilist.co/anime/${entry.value!.series.id}`;
      });

      const panels = ref([]);
      const descriptionShown = computed(() => {
      	return panels.value?.includes("description");
			})

      const upStyle = computed(() => {
        if(!upEnabled.value)
          return { color: "red" };

        return {};
      });

      const downStyle = computed(() => {
        if(!downEnabled.value)
          return { color: "red" };

        return {};
      });

      // @TODO: Cleanup these returns?
      return {
        entry,
        index,
        user,
        title,
        description,
        cover,
        totalDuration,
        episodeDuration,
        episodes,

        anilistUrl,

				panels,
        descriptionShown,

        upEnabled,
        upStyle,

        downEnabled,
        downStyle,

				mdiDeleteOutline,
				mdiLinkVariant,
      }
    }
  });
</script>

<template>
	<v-card class="entry-card" height="500" elevation="2">
		<v-row>
			<v-col cols="1" class="d-flex">
				<v-img :src="cover" aspect-ratio="9 / 16"/>
			</v-col>

			<v-col cols="11">
				<v-card-title class="d-flex flex-row align-center">
					<span class="mr-3">
						{{ title }}
					</span>

					<v-chip-group disabled>
						<v-chip>{{ episodes }}<span v-if="episodes !== entry.series.episodes">&nbsp;(of {{ entry.series.episodes }})</span>&nbsp; episodes</v-chip>
						<v-chip>{{ $moment.duration(episodeDuration, 'minutes').format() }} / episode</v-chip>
						<v-chip>{{ $moment.duration(totalDuration, 'minutes').format() }} total</v-chip>
						<v-chip v-if="entry.isDropped">Dropped</v-chip>
					</v-chip-group>
				</v-card-title>

				<v-card-text class="d-flex">
					<v-row>
						<v-col cols="12" md="6" class="description-container">
							<!-- TODO: Description can break card, overflow does not work correctly yet -->
							<v-sheet class="description-sheet">
								<v-expansion-panels v-model="panels">
									<v-expansion-panel
										:elevation="descriptionShown ? 4 : 0"
										title="Description"
										class="description-panel"
										value="description"
									>
										<v-expansion-panel-text>
											<p
												class="d-block"
												v-html="description"
											></p>
										</v-expansion-panel-text>
									</v-expansion-panel>
								</v-expansion-panels>
							</v-sheet>
						</v-col>

						<v-col cols="12" md="6" v-show="user?.isCurrentUser || true">
							<EntrySettings :entry="entry" />
						</v-col>
					</v-row>
				</v-card-text>

				<v-card-actions class="position-absolute" style="bottom: 0">
					<v-btn :prepend-icon="mdiDeleteOutline" color="error">
						Remove
					</v-btn>
					<v-btn
						:prepend-icon="mdiLinkVariant"
						:href="anilistUrl"
						target="_blank"
					>View on Anilist</v-btn>
				</v-card-actions>
			</v-col>
		</v-row>
	</v-card>

</template>

<style scoped lang="scss">
	.entry-card {
		overflow: visible;

		z-index: 10;
	}

	.description-panel ::v-deep .v-expansion-panel-title--active .v-expansion-panel-title__overlay {
		opacity: 0;
	}

	.description-panel ::v-deep .v-expansion-panel-title {
		min-height: 48px;
	}

	.description-container {
		position: relative;
	}

	.description-sheet {
		position: absolute;
		width: 100%;
		z-index: 50;
	}
</style>

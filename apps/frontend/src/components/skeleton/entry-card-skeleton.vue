<script lang="ts">
	import { defineComponent, toRefs } from "vue";
	import {useBreakpoints} from "../../lib/composition/app/use-breakpoints.fn";

	export default defineComponent({
		props: {
			loading: {
				type: Boolean,
				default: false,
			},
		},
		
		setup(props) {
			const {
				loading
			} = toRefs(props);
			
			const {
				isMobile,
			} = useBreakpoints();
			
			return {
				loading,
				isMobile,
			};
		},
	});
</script>

<template>
	<v-layout v-if="loading">
		<v-container fluid class="px-0">
			<v-card>
				<v-card-text>
					<v-system-bar class="ma-0"></v-system-bar>
					
					<v-main>
						<v-row>
							<v-col v-if="!isMobile" cols="2">
								<v-skeleton-loader :loading="loading" type="image" class="image"></v-skeleton-loader>
							</v-col>
				
							<v-col>
								<v-skeleton-loader :loading="loading" type="heading"></v-skeleton-loader>
								<v-skeleton-loader :loading="loading" type="chip@3"></v-skeleton-loader>
								<v-skeleton-loader :loading="loading" type="paragraph"></v-skeleton-loader>
								<v-skeleton-loader :loading="loading" type="button@2"></v-skeleton-loader>
							</v-col>
						</v-row>
					</v-main>
				</v-card-text>
			</v-card>
		</v-container>
	</v-layout>
</template>

<style scoped lang="scss">
	.image {
		height: 100%;
		padding: 1rem 1rem 1rem 30%;
	
		&:deep(.v-skeleton-loader__bone) {
			height: 100%;
		}
	}
</style>
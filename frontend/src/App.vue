<script lang="ts">
  import {defineComponent} from "vue";

  export default defineComponent({
  });
</script>

<template>
	<v-app>
		<Header />

		<v-main>
			<v-container fluid>
				<router-view />
			</v-container>
		</v-main>

		<v-overlay
			:model-value="$overlay.shown.value"
			class="align-center justify-center"
		>
			<div>
				{{ $overlay.title.value }}
			</div>

			<div v-if="$overlay.hasContent.value" v-html="$overlay.content.value"></div>

			<v-progress-circular
				v-if="$overlay.withSpinner.value"
				indeterminate
				size="64"
				color="primary"
			></v-progress-circular>
		</v-overlay>
	</v-app>
</template>

<style scoped lang="scss">
</style>

<script lang="ts">
  import {defineComponent, ref, watch} from "vue";
  import {useTitle} from "../composition/useTitle";
  import {debouncedRef} from "@vueuse/core";

  export default defineComponent({
    setup()
    {
			const user = ref(null);
      const debouncedUser = debouncedRef<string>(user, 750);

      const title = useTitle();

      watch(user, () => {
        if(user.value?.length === 0) {
          title.value = null;
          return;
        }

        title.value = `Search ${user.value}`;
      });

      return { user, debouncedUser };
    }
  });
</script>

<template>
	<v-container fluid>
		<v-row>
			<v-col class="d-flex justify-center">
				<v-card max-width="600" min-width="300" class="flex-fill">
					<v-card-title>
						Your Username
					</v-card-title>

					<v-text-field v-model="user" label="Username" />
				</v-card>
			</v-col>
		</v-row>

		<v-row>
			<v-col>
				<div v-if="debouncedUser">
					<UserLists :user="debouncedUser" />
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped lang="scss">
</style>

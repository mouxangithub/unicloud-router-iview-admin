<template>
	<Card>
		<Editor v-model="value" />
	</Card>
</template>

<script>
import Editor from '@/components/editor/editor.vue';
export default {
	components: {
		Editor
	},
	data() {
		return {
			value: '<h1>欢迎使用 unicloud-router-iview-admin</h1>'
		};
	},
}
</script>

<style>
</style>

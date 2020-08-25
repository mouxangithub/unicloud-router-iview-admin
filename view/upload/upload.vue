<template>
	<Card>
		<upload v-model="imglist" :isUpcloud="false" :more="true" />
		<div style="margin-top: 30px;">
			该组件使用方式: 使用v-model双向绑定传出imglist（url：图片链接，status：图片状态（finished完成，uploading正在上传），percent：上传进度百分比），isUpcloud是否上传至云存储（阿里云暂不支持前端进行删除云存储，可编写云函数进行删除），more是否多图上传，preview是否使用预览，delete是否显示删除按钮
		</div>
	</Card>
</template>

<script>
	import upload from '@/components/upload/upload.vue'
	export default {
		data() {
			return {
				imglist: [{
						url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-cheshi/7225f012-7a50-4071-b4c5-69e5aefa49b5.jpg',
						status: 'finished'
					},
					{
						url: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-cheshi/6bd8eeba-3540-4640-8e88-840f808da1ea.jpg',
						status: 'finished'
					}
				]
			}
		},
		components: {
			upload
		}
	}
</script>

<style>

</style>

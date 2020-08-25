<template>
	<div style="display: flex;">
		<div class="demo-upload-list" v-for="(item, index) in value" :key="index">
			<div :id="'img' + index" v-if="item.status === 'finished'" v-viewer>
				<image :src="item.url" />
				<div class="demo-upload-list-cover">
					<Icon v-if="preview" type="ios-eye-outline" @click.native="previewImg(index)"></Icon>
					<Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
				</div>
			</div>
			<div v-else>
				<i-circle
					v-if="item.percent || item.percent == 0"
					:size="size"
					:percent="item.percent"
					:stroke-color="item.percent == 100 ? '#5cb85c' : '#2db7f5'"
					style="margin-top: 10px;"
				>
					<Icon v-if="item.percent == 100" type="md-cloud-done" size="35" style="color:#5cb85c" />
					<span v-else style="font-size:18px">{{ item.percent }}%</span>
				</i-circle>
			</div>
		</div>
		<div class="upload" @tap="upload"><Icon type="ios-camera" size="25" /></div>
	</div>
</template>

<script>
export default {
	props: {
		// 图片集合，必传
		value: {
			type: Array,
			require: true
		},
		// 是否上传到云存储
		isUpcloud: {
			type: Boolean,
			default: false
		},
		// 是否使用多图上传
		more: {
			type: Boolean,
			default: true
		},
		// 是否显示预览按钮
		preview: {
			type: Boolean,
			default: true
		},
		// 是否显示删除按钮
		delete: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			size: 60
		};
	},
	methods: {
		// 删除图片
		async handleRemove(id) {
			var that = this;
			this.$Modal.confirm({
				title: '提示信息',
				content: '是否删除这张图片?',
				onOk: async () => {
					// 阿里云不支持前端操作删除云存储，请自行封装云函数
					// if(this.isUpcloud) {
					// 	var res = await uniCloud.deleteFile({fileList:[that.value[id].url]})
					// }
					that.value.splice(id, 1);
					that.$emit('input', that.value);
				}
			});
		},
		// 图片预览
		previewImg(id) {
			const vuer = this.$el.querySelector('#img' + id).$viewer;
			vuer.show();
		},
		// 上传图片
		upload() {
			var that = this;
			uni.chooseImage({
				count: this.more ? 2 : 1,
				async success(res) {
					if (res.tempFilePaths.length > 0) {
						var updind = that.value.length;
						for (var i = 0; i < res.tempFilePaths.length; i++) {
							var filePath = res.tempFilePaths[i];
							if (that.isUpcloud) {
								var index = updind + i;
								// 上传至云存储
								that.value.push({
									url: '',
									percent: 0,
									status: 'uploading'
								});
								that.$emit('input', that.value);
								that.upcloud(filePath, index);
							} else {
								// 暂不上传
								that.value.push({
									url: filePath,
									percent: 100,
									status: 'finished'
								});
								that.$emit('input', that.value);
							}
						}
					}
				}
			});
		},
		// 上传至云函数
		upcloud(filePath, index) {
			var that = this;
			uniCloud.uploadFile({
				filePath,
				cloudPath: 'test.jpg',
				onUploadProgress: function(progressEvent) {
					that.value[index].percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					that.$emit('input', that.value);
				},
				success(result) {
					that.value[index].status = 'finished';
					that.value[index].url = result.fileID;
					that.$emit('input', that.value);
				}
			});
		}
	}
};
</script>

<style>
.upload {
	background-color: #ffffff;
	width: 80px;
	height: 80px;
	line-height: 85px;
	text-align: center;
	border-radius: 10px;
	border: 1px dashed #d5d5d5;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.upload:hover {
	border: 1px dashed #0000ff;
}

.demo-upload-list {
	display: inline-block;
	width: 80px;
	height: 80px;
	text-align: center;
	line-height: 80px;
	border: 1px solid transparent;
	border-radius: 10px;
	overflow: hidden;
	background: #fff;
	position: relative;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
	margin-right: 10px;
}

.demo-upload-list image {
	width: 80px;
	height: 80px;
	line-height: 80px;
	border-radius: 10px;
}

.demo-upload-list-cover {
	display: none;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.6);
}

.demo-upload-list:hover .demo-upload-list-cover {
	display: block;
}

.demo-upload-list-cover i {
	color: #fff;
	font-size: 20px;
	cursor: pointer;
	margin: 0 2px;
}
</style>

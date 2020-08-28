<template>
	<div class="editor-wrapper"><div :id="editorId"></div></div>
</template>

<script>
import Editor from 'wangeditor';
import { oneOf } from '@/libs/tools';
import 'wangeditor/release/wangEditor.min.css';
export default {
	name: 'Editor',
	props: {
		name: {
			type: String
		},
		value: {
			type: String
		},
		/**
		 * 绑定的值的类型, enum: ['html', 'text']
		 */
		valueType: {
			type: String,
			default: 'html',
			validator: val => {
				return oneOf(val, ['html', 'text']);
			}
		},
		/**
		 * @description 设置change事件触发时间间隔
		 */
		changeInterval: {
			type: Number,
			default: 200
		},
		/**
		 * @description 是否开启本地存储
		 */
		cache: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		editorId() {
			return `${this.name}`;
		}
	},
	mounted() {
		this.editor = new Editor(`#${this.editorId}`);
		this.editor.customConfig.onchange = html => {
			let text = this.editor.txt.text();
			if (this.cache) localStorage.editorCache = html;
			console.log(html);
			this.$emit('input', this.valueType === 'html' ? html : text);
			this.$emit('on-change', html, text);
		};
		this.editor.customConfig.onchangeTimeout = this.changeInterval;
		// create这个方法一定要在所有配置项之后调用
		this.editor.create();
		// 如果本地有存储加载本地存储内容
		let html = this.cache ? localStorage.editorCache : '';
		if (html) this.editor.txt.html(html);
		// 如果有value加载内容
		if (this.value) {
			if (this.valueType === 'html') {
				this.editor.txt.html(this.value);
			} else {
				this.editor.txt.text(this.value);
			}
		}
	}
};
</script>

<style>
.editor-wrapper * {
	z-index: 100 !important;
}
</style>

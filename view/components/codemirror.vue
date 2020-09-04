<template>
	<Card>
		<codemirror v-model="code"  :options="cmOptions"/>
	</Card>
</template>

<script>
// language js
import 'codemirror/mode/javascript/javascript.js';
// theme css
import 'codemirror/theme/material-palenight.css';
// more codemirror resources
// import 'codemirror/some-resource...'
export default {
	data() {
		return {
			code: 'const a = 10',
			cmOptions: {
				// codemirror options
				tabSize: 4,
				mode: 'text/javascript',
				theme: 'material-palenight',
				lineNumbers: true,
				line: true
				// more codemirror options, 更多 codemirror 的高级配置...
			}
		};
	}
};
</script>

<style>
</style>

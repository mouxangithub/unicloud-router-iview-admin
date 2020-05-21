<template>
	<div class="page">
		<Form :model="loginForm" :rules="rules" ref="loginForm" class="login-form" @keydown.enter.native="login('loginForm')">
			<h2 class="title">用 户 登 录</h2>
			<FormItem prop="username"><Input type="text" v-model="loginForm.username" placeholder="用户名" autocomplete="off" prefix="ios-contact" /></FormItem>
			<FormItem prop="password">
				<Input :type="textType" v-model="loginForm.password" placeholder="密码" autocomplete="off" prefix="ios-lock" icon="ios-eye" @on-click="changeType" />
			</FormItem>
			<FormItem>
				<Button class="login-btn" :loading="loading" @click="login('loginForm')">
					<span>{{ loading ? 'Loading...' : '登 录' }}</span>
				</Button>
			</FormItem>
		</Form>
		<h4 @click="mouxan()" style="text-align: center;color: #0081ff;margin-top: 30px;">Powered By Mouxan</h4>
	</div>
</template>
<script>
import Checker from '@/libs/checker.js';
import { mapActions } from 'vuex';
import { validateUse, validatePass } from '@/libs/checker';
export default {
	data() {
		return {
			loginForm: {
				username: 'admin',
				password: 'a12345'
			},
			rules: {
				username: [{ required: true, validator: validateUse, trigger: 'blur' }],
				password: [{ required: true, validator: validatePass, trigger: 'blur' }]
			},
			textType: 'password',
			loading: false
		};
	},
	methods: {
		...mapActions(['handleLogin', 'getUserInfo']),
		login: function(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					this.loading = true;
					try {
						await this.handleLogin(this.loginForm);
						this.loading = false;
					} catch (error) {
						this.loading = false;
					}
				} else {
					this.$Message.error('请输入完整信息！');
				}
			});
		},
		changeType() {
			this.textType = this.textType === 'password' ? 'text' : 'password';
		},
		mouxan() {
			window.open('https://gitee.com/mouxangitee', '_blank');
		}
	}
};
</script>
<style>
.page {
	background: url('@/assets/images/bg.jpg');
	background-size: 100%;
	width: 100%;
	height: 100%;
	overflow: hidden;
	margin: 0;
	padding: 0;
}

.login-form {
	width: 400px;
	/* 容器自动水平居中 */
	margin: 0px auto;
	/* 实现垂直居中 距顶部高度  也可以写成 calc((100vh - 60vh)/2) */
	margin-top: calc((100vh - 50vh) / 2);
	border-radius: 20px;
	background-clip: padding-box;
	padding: 35px 35px 15px 35px;
	background: #23232e;
	border: 1px solid #23232e;
	box-shadow: 0 0 10px #000;
}

.title {
	margin: 0px auto 40px auto;
	text-align: center;
	font-size: 33px;
	color: #0081ff;
	text-shadow: 0 0 5px #0081ff;
	font-weight: bold;
}

.login-btn {
	margin: 20px 0 10px 0;
	width: 100%;
	line-height: 40px;
	height: 40px;
	font-weight: bold;
	font-size: 19px;
	border: 0;
	color: #fff;
	background: linear-gradient(45deg, #0081ff, #1cbbb4);
}
</style>

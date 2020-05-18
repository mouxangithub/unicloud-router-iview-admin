<template>
	<div class="user-avatar-dropdown">
		<Dropdown @on-click="handleClick">
			<Badge :dot="!!messageUnreadCount">
				<Avatar>{{ userAvatar }}</Avatar>
			</Badge>
			<Icon :size="18" type="md-arrow-dropdown"></Icon>
			<DropdownMenu slot="list">
				<DropdownItem name="user">个人中心</DropdownItem>
				<DropdownItem name="logout">退出登录</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	</div>
</template>

<script>
import './user.less';
import { mapActions } from 'vuex';
export default {
	name: 'User',
	props: {
		userAvatar: {
			type: String,
			default: ''
		},
		messageUnreadCount: {
			type: Number,
			default: 0
		}
	},
	methods: {
		...mapActions(['handleLogOut']),
		logout() {
			this.handleLogOut().then(() => {
				this.$Message.success({
					background: true,
					content: '退出成功'
				});
				this.$router.push({
					name: 'login'
				});
			});
		},
		user() {
			this.$router.push({
				name: 'user'
			});
		},
		handleClick(name) {
			switch (name) {
				case 'logout':
					this.logout();
					break;
				case 'user':
					this.user();
					break;
			}
		}
	}
};
</script>

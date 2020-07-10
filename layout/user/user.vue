<template>
	<div class="user-avatar-dropdown">
		<Dropdown @on-click="handleClick">
			<Badge :dot="!!messageUnreadCount">
				<Avatar v-if="avatar" :src="avatar" />
				<Avatar v-else>{{ username.substring(0, 1).toUpperCase() }}</Avatar>
			</Badge>
			<Icon :size="18" type="md-arrow-dropdown"></Icon>
			<DropdownMenu slot="list">
				<!-- <DropdownItem name="userInfo">个人中心</DropdownItem> -->
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
	data() {
		return {
			avatar: this.$store.state.user.UseInfo.avatar,
			username: this.$store.state.user.UseInfo.username,
			messageUnreadCount: 0
		};
	},
	methods: {
		...mapActions(['handleLogOut']),
		async handleClick(name) {
			switch (name) {
				case 'userInfo':
					this.$router.push({
						name: 'userInfo'
					});
					break;
				case 'logout':
					await this.handleLogOut();
					this.$Message.success({
						background: true,
						content: '退出成功'
					});
					break;
			}
		}
	}
};
</script>

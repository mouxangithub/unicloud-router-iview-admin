<template>
	<Card>
		<Layout>
			<Sider style="background-color: #f3f3f3;" hide-trigger>
				<view class="title">角色</view>
				<view class="Sider">
					<Button class="access" :type="limit.rolesid === '' ? 'primary' : 'default'" @click="changeroles()">全部</Button>
					<Button class="access" @click="changeroles(item._id)" :type="limit.rolesid === item._id ? 'primary' : 'default'" v-for="(item, index) in roles" :key="index">
						{{ item.name }}
					</Button>
				</view>
			</Sider>
			<Layout class="bodys">
				<view>
					<Button class="top" type="primary" @click="addedit('add')">新增用户</Button>
					<Button class="top" type="error" @click="batchDe">批量删除</Button>
					<Tooltip content="刷新" placement="right"><Button class="top" type="primary" shape="circle" icon="md-refresh" @click="getList" /></Tooltip>
					<Input class="top inpt" search suffix="ios-search" placeholder="用户名" v-model="limit.username" @on-search="getList" @on-change="getList" />
				</view>
				<Table :loading="loading" border :columns="columns" :data="list" @on-selection-change="selectionChange">
					<template slot-scope="{ row, index }" slot="action">
						<Tooltip content="编辑" placement="left">
							<Button style="margin-top: 4px;margin-right: 5px;" type="primary" shape="circle" icon="ios-create" @click="addedit(row._id)" />
						</Tooltip>
						<Button style="margin-top: 4px;" type="error" shape="circle" icon="ios-trash" @click="deleted(row._id)" />
					</template>
				</Table>
				<div class="page">
					<Page
						@on-change="pageChange"
						@on-page-size-change="pageSizeChange"
						show-total
						show-elevator
						show-sizer
						:total="limit.total"
						:page-size-opts="limit.pageSizeOpts"
						:current="limit.page"
						:page-size="limit.pageSize"
					/>
				</div>
			</Layout>
		</Layout>
		<Modal v-model="show" :title="showtitle" @on-cancel="cancel">
			<Form ref="adminuser" :model="adminuser" :rules="rules" :label-width="80">
				<FormItem prop="username" label="账号"><Input v-model="adminuser.username" placeholder="请输入账号" clearable /></FormItem>
				<FormItem prop="password" label="密码"><Input v-model="adminuser.password" type="password" placeholder="请输入密码" clearable /></FormItem>
				<FormItem v-if="method === 'add'" prop="passwdCheck" label="确认密码">
					<Input v-model="adminuser.passwdCheck" type="password" placeholder="请输入确认密码" clearable />
				</FormItem>
				<FormItem prop="roles_id" label="部门">
					<Select v-model="adminuser.roles_id" clearable filterable>
						<Option v-for="item in roles" v-model="item._id" :key="item._id">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="状态" prop="status">
					<i-switch v-model="adminuser.status" size="large">
						<span slot="open">启用</span>
						<span slot="close">禁用</span>
					</i-switch>
				</FormItem>
			</Form>
			<div slot="footer"><Button type="primary" size="large" long :loading="modal_loading" @click="confirm('adminuser')">确定</Button></div>
		</Modal>
	</Card>
</template>

<script>
import { getAdminUserList, deleteAdminUser, batchdelete, getAdminUser, addAdminUser, editAdminUser } from '@/api/user';
import { getRolesList } from '@/api/roles';
import { validateUse, validatePass } from '@/libs/checker';
export default {
	data() {
		const validatePassCheck = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请再次输入密码'));
			} else if (value != this.adminuser.password) {
				callback(new Error('两次密码不一致'));
			} else {
				callback();
			}
		};
		return {
			columns: [
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '用户名',
					key: 'username',
					sortable: true,
					align: 'center'
				},
				{
					title: '部门',
					align: 'center',
					sortable: true,
					render: (h, res) => {
						return h('span', res.row.roles[0].name);
					}
				},
				{
					title: '状态',
					key: 'status',
					sortable: true,
					align: 'center',
					render: (h, res) => {
						return h('span', res.row.status == 0 ? '正常' : '禁用');
					}
				},
				{
					title: '操作',
					slot: 'action',
					align: 'center'
				}
			],
			loading: false,
			ids: [],
			list: [],
			roles: [],
			limit: {
				username: '',
				rolesid: '',
				page: 1,
				total: 0,
				pageSize: 10,
				pageSizeOpts: [10, 50, 100, 500, 1000]
			},
			rules: {
				username: [{ required: true, validator: validateUse, trigger: 'blur' }],
				password: [{ required: true, validator: validatePass, trigger: 'blur' }],
				passwdCheck: [{ required: true, validator: validatePassCheck, trigger: 'blur' }],
				roles_id: [{ required: true, message: '请选择部门' }],
				status: [{ required: true, message: '请选择状态' }]
			},
			show: false,
			showtitle: '',
			modal_loading: false,
			method: '',
			adminuser: {
				username: '',
				password: '',
				passwdCheck: '',
				roles_id: '',
				status: true
			}
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		// 全选
		selectionChange(e) {
			this.ids = e.map(function(item) {
				return item['_id'];
			});
		},
		// 删除
		async deleted(id) {
			// 不能删除当前账号
			if (this.$store.state.user.uid != id) {
				var that = this;
				this.$Modal.confirm({
					title: '提示信息',
					content: '是否删除该账号?',
					onOk: async () => {
						try {
							await deleteAdminUser({ id });
							this.$Message.success('删除成功');
						} catch (error) {}
						this.getList();
					}
				});
			} else {
				this.$Message.error('请勿删除当前账号');
			}
		},
		// 批量删除
		async batchDe() {
			if (this.ids.findIndex(item => item === this.$store.state.user.uid) === -1) {
				if (this.ids.length > 0) {
					var that = this;
					this.$Modal.confirm({
						title: '提示信息',
						content: '是否删除这些?',
						onOk: async () => {
							var index = this.ids.indexOf('5f06d4b604c20400012c32f4');
							if (index >= 0) {
								this.$Message.error('禁止操作');
							} else {
								try {
									await batchdelete({ ids: this.ids });
									this.$Message.success('删除成功');
								} catch (error) {}
								this.getList();
							}
						}
					});
				} else {
					this.$Message.error('请选择要删除的数据');
				}
			} else {
				this.$Message.error('请勿删除当前账号');
			}
		},
		// 切换页码
		pageChange(e) {
			this.limit.page = e;
			this.getList();
		},
		// 切换条数
		pageSizeChange(e) {
			this.limit.pageSize = e;
			this.getList();
		},
		// 部门
		changeroles(id) {
			this.limit.rolesid = id ? id : '';
			this.getList();
		},
		// 获取列表
		async getList() {
			this.loading = true;
			try {
				const res = await getAdminUserList(this.limit);
				const roles = (await getRolesList({})).data;
				this.roles = roles;
				this.limit.total = res.total;
				this.list = res.data;
				this.loading = false;
			} catch (error) {}
		},
		// 取消编辑&新增
		cancel() {
			this.method = '';
			this.adminuser = {
				username: '',
				password: '',
				roles_id: '',
				status: true
			};
			this.show = false;
		},
		// 获取单个数据
		async getAdminUsers(id) {
			try {
				const res = await getAdminUser({ id });
				this.adminuser = res;
				this.adminuser.status = res.status ? false : true;
			} catch (error) {
				console.error(error);
			}
		},
		// 新增或编辑弹窗
		addedit(action) {
			this.show = true;
			if (action === 'add') {
				this.showtitle = '新增成员';
				this.method = 'add';
			} else {
				this.showtitle = '编辑成员';
				this.method = 'edit';
				this.getAdminUsers(action);
			}
		},
		// 提交
		confirm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					console.log(this.adminuser);
					if (this.adminuser._id != '5f06d4b604c20400012c32f4') {
						this.modal_loading = true;
						try {
							this.adminuser.status = this.adminuser.status ? 0 : 1;
							delete this.adminuser.passwdCheck;
							if (this.method == 'add') {
								await addAdminUser(this.adminuser);
							} else if (this.method == 'edit') {
								await editAdminUser(this.adminuser);
							}
							this.$Message.success({
								background: true,
								content: '保存成功'
							});
							this.modal_loading = false;
							this.getList();
							this.cancel();
						} catch (error) {
							console.error(error);
						}
					} else {
						this.$Message.error('禁止操作');
					}
				} else {
					this.$Message.error('请输入完整信息！');
				}
			});
		}
	}
};
</script>

<style>
.top {
	margin: 0 20px 20px 0;
}
.bodys {
	padding: 20px;
	background: #ffffff;
}
.title {
	background: #007aff;
	height: 50px;
	text-align: center;
	color: #ffffff;
	font-weight: bold;
	font-size: 21px;
	line-height: 50px;
}
.Sider {
	padding: 20px;
	text-align: center;
}
.access {
	margin: 10px;
}
.inpt {
	float: right;
	width: 300px;
}
.page {
	width: 100%;
	text-align: center;
	margin-top: 30px;
}
</style>

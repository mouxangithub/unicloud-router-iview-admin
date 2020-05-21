<template>
	<Card>
		<Button class="top" type="primary" @click="addedit('add')">添加部门</Button>
		<Button class="top" type="error" @click="batchDe">批量删除</Button>
		<Tooltip content="刷新" placement="right"><Button class="top" type="primary" shape="circle" icon="md-refresh" @click="getList" /></Tooltip>
		<Input class="top inpt" search suffix="ios-search" placeholder="部门名称" v-model="limit.search" @on-search="getList" @on-change="getList" />
		<Table :loading="loading" border :columns="columns" :data="list" @on-selection-change="selectionChange">
			<template slot="action" slot-scope="{ row, index }">
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
		<Modal v-model="show" :title="showtitle" @on-cancel="cancel">
			<Form ref="department" :model="department" :rules="rules" :label-width="80">
				<FormItem prop="name" label="部门名称"><Input v-model="department.name" placeholder="请输入部门名称" clearable /></FormItem>
				<FormItem prop="node" label="部门权限"><Tree :data="authTree" show-checkbox @on-check-change="checkChange" /></FormItem>
				<FormItem label="状态" prop="status">
					<i-switch v-model="department.status" size="large">
						<span slot="open">启用</span>
						<span slot="close">禁用</span>
					</i-switch>
				</FormItem>
			</Form>
			<div slot="footer"><Button type="primary" size="large" long :loading="modal_loading" @click="confirm('department')">确定</Button></div>
		</Modal>
	</Card>
</template>

<script>
import { getRoles, getRolesList, deleteRoles, batchdelete, addRoles, editRoles } from '@/api/roles';
import routers from '@/router/routers';
import { getSubRouter } from '@/libs/util';
export default {
	data() {
		return {
			indeterminate: false,
			loading: false,
			show: false,
			showtitle: '',
			modal_loading: false,
			ids: [],
			limit: {
				search: '',
				page: 1,
				total: 0,
				pageSize: 10,
				pageSizeOpts: [10, 50, 100, 500, 1000]
			},
			columns: [
				{
					type: 'selection',
					width: 60,
					align: 'center'
				},
				{
					title: '部门',
					key: 'name',
					align: 'center'
				},
				{
					title: '人数',
					key: 'popnum',
					align: 'center',
					sortable: true,
					render: (h, res) => {
						return h('span', res.row.user.length);
					}
				},
				{
					title: '状态',
					key: 'status',
					align: 'center',
					render: (h, res) => {
						return h('span', res.row.status == 1 ? '正常' : '禁用');
					}
				},
				{
					title: '操作',
					slot: 'action',
					align: 'center'
				}
			],
			list: [],
			rules: {
				name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
				node: [{ required: true, type: 'array', min: 1, message: '请选择部门权限', trigger: 'change' }],
				status: [{ required: true, message: '请选择状态' }]
			},
			nodes: [],
			authTree: [],
			department: {
				name: '',
				node: [],
				status: true
			}
		};
	},
	mounted() {
		this.getList();
	},
	methods: {
		// 权限选择
		checkChange(e) {
			var access = [];
			e.forEach(res => {
				if (res.access) {
					access.push(res.access[0]);
				}
			});
			this.department.node = access;
		},
		// 全选
		selectionChange(e) {
			this.ids = e.map(function(item) {
				return item['_id'];
			});
		},
		// 删除
		async deleted(id) {
			var that = this;
			this.$Modal.confirm({
				title: '提示信息',
				content: '是否删除?',
				onOk: async () => {
					try {
						await deleteRoles({ id });
						this.$Message.success('删除成功');
					} catch (error) {
						console.error(error);
					}
					this.getList();
				}
			});
		},
		// 批量删除
		async batchDe() {
			if (this.ids.length > 0) {
				var that = this;
				this.$Modal.confirm({
					title: '提示信息',
					content: '是否删除这些?',
					onOk: async () => {
						try {
							await batchdelete({ this.ids });
							this.$Message.success('删除成功');
						} catch (error) {}
						this.getList();
					}
				});
			} else {
				this.$Message.error('请选择要删除的数据');
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
		// 获取列表
		async getList() {
			this.loading = true;
			try {
				const res = await getRolesList(this.limit);
				this.limit.total = res.total;
				this.list = res.data;
				this.loading = false;
			} catch (error) {
				console.error(error);
			}
		},
		// 新增或编辑弹窗
		addedit(action) {
			this.show = true;
			if (action === 'add') {
				this.showtitle = '新增部门';
				this.method = 'add';
				this.authTree = getSubRouter(routers, [], this.$store.state.user.access);
			} else {
				this.showtitle = '编辑部门';
				this.method = 'edit';
				this.getDepartment(action);
			}
		},
		// 获取单个数据
		async getDepartment(id) {
			try {
				const res = await getRoles({ id });
				this.department = res;
				this.authTree = getSubRouter(routers, this.department.node, this.$store.state.user.access);
				this.department.status = res.status ? true : false;
			} catch (error) {}
		},
		// 取消编辑&新增
		cancel() {
			this.method = '';
			this.department = {
				name: '',
				node: [],
				status: true
			};
			this.show = false;
		},
		// 提交
		confirm(formName) {
			this.$refs[formName].validate(async valid => {
				if (valid) {
					if (this.department.name != '超级权限') {
						this.modal_loading = true;
						try {
							this.department.status = this.department.status ? 1 : 0;
							if (this.method == 'add') {
								await addRoles(this.department);
							} else if (this.method == 'edit') {
								await editRoles(this.department);
							}
							this.$Message.success({
								background: true,
								content: '保存成功'
							});
							this.modal_loading = false;
						} catch (error) {
							this.modal_loading = false;
						}
						this.getList();
						this.cancel();
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

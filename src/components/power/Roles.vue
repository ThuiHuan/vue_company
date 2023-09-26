<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <el-button @click="addDialogVisible = true" type="primary">添加角色</el-button>
            <el-table :data="rolesList" border stripe>

                <!-- 展开列 -->
                <el-table-column type="expand">
                    <!-- 插槽 -->
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
                            v-for="( item1, i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row, item1.id)"> {{ item1.authName }}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children"
                                    :key="item2.id">
                                    <!-- 二级权限 -->
                                    <el-col :span="6">
                                        <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">{{
                                            item2.authName
                                        }}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 三级权限 -->
                                    <el-col :span="18">
                                        <el-tag closable @close="removeRightById(scope.row, item3.id)" type="warning"
                                            v-for="(item3) in item2.children" :key="item3.id">
                                            {{ item3.authName }}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>

                <!-- 索引列 -->
                <el-table-column type="index" label='#'></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <!--  -->
                        <el-tooltip effect="dark" placement="top-start" :enterable="false" content="编辑">
                            <el-button @click="showEditDialog(scope.row.id)" type="primary" icon=" el-icon-edit"
                                size="mini">
                            </el-button>
                        </el-tooltip>

                        <!-- 删除按钮 -->
                        <!-- -->
                        <el-tooltip effect="dark" placement="top-start" :enterable="false" content="删除">
                            <el-button @click="removeUserById(scope.row.id)" type="danger" icon=" el-icon-delete"
                                size="mini">
                            </el-button>
                        </el-tooltip>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark" content="分配权限" placement="top-start" :enterable="false">
                            <el-button @click="showSetRightDialog(scope.row)" type="warning" icon="el-icon-setting"
                                size="mini">
                            </el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限的对话框 -->
        <el-dialog @close="setRightDialogClosed" title="分配权限" :visible.sync="SetRightDialogVisible" width="50%">
            <!-- 树形控件----------------------- -->
            <el-tree ref="treeRef" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys"
                :data="rightsList" :props="treeProps">
            </el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="SetRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加用户的对话框 -->
        <!--  -->
        <el-dialog title="添加用户" width="30%" @close="addDiologClosed" :visible.sync="addDialogVisible">
            <!-- 内容主体区 -->
            <!-- ref引用：获取DOM元素或组件的引用，里面存储着对应的 DOM 元素或组件的引用 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="90px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>

            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>

        </el-dialog>

        <!-- 修改用户的对话框 -->
        <!-- :visible.sync模态框显示隐藏 -->
        <el-dialog @close="editDiologClosed" title="修改用户" :visible.sync="editDialogVisible" width="50%">
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 角色列表数据
            rolesList: [],
            // 添加表单隐藏
            addDialogVisible: false,
            // 修改表单隐藏
            editDialogVisible: false,
            // 分配权限表单隐藏
            SetRightDialogVisible: false,
            // ==================================
            // 所有权限的数据
            rightsList: [],
            // 树形控件的属性绑定对象
            treeProps: {
                label: 'authName',
                // 父子节点嵌套
                children: 'children'
            },
            // 默认选中的节点id值数组
            defKeys: [],
            // 即将分配权限的id
            roleId: '',
            // 添加用户的表单数据对象
            addForm: {
                roleName: '',
                roleDesc: ''
            },
            // 修改用户的表单数据对象
            editForm: {
                roleName: '',
                roleDesc: ''
            },
            // 添加用户规则
            addFormRules: {
                roleName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
                ],
                roleDesc: [
                    { message: '请输入角色', trigger: 'blur' },
                    { min: 2, max: 10, message: '角色描述的长度在2-10个字符之间', trigger: 'blur' }
                ]
            }
        }
    },
    created() {
        this.getRolesList()
    },
    methods: {
        // 获取列表
        async getRolesList() {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('数据请求失败')
            this.rolesList = res.data
            console.log(this.rolesList);
        },
        //  监听添加用户对话框的关闭事件
        addDiologClosed() {
            this.$refs.addFormRef.resetFields()
        },
        //  监听修改用户对话框的关闭事件
        editDiologClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 添加用户
        addUser() {
            // 预验证
            this.$refs.addFormRef.validate(async (validate) => {
                if (!validate) return false
                const { data: ref } = await this.$http.post('roles', this.addForm)
                if (ref.meta.status !== 201) this.$message.error('请求参数失败')
                this.$message.success('请求数据成功')
                // 隐藏用户框
                this.addDialogVisible = false
                // 重新获取列表
                this.getRolesList()
            })
        },
        // 展示修改会话框并给值
        async showEditDialog(id) {
            const { data: res } = await this.$http.get('roles/' + id)
            if (res.meta.status !== 200) return this.$message.error('请求数据失败')
            this.editDialogVisible = true;
            this.editForm = res.data
            // console.log(res.data);
            // console.log(this.editForm);
        },
        // 更新用户数据
        editUserInfo() {
            // 预验证
            this.$refs.editFormRef.validate(async (validate) => {
                if (!validate) return false
                // 发起修改请求
                const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, {
                    roleName: this.editForm.roleName,
                    roleDesc: this.editForm.roleDesc
                })
                // console.log(res.meta);
                if (res.meta.status !== 200) return this.$message.error('请求失败')
                // 关闭对话框
                this.editDialogVisible = false
                // 刷新数据列表
                this.getRolesList()
                // 请求成功
                this.$message.success('更新成功')
            })
        },
        // 删除功能
        async removeUserById(id) {
            // 弹框确认删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                // eslint-disable-next-line no-dupe-keys
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            // 如果用户确认删除,则返回值为字符串confirm
            // 如果用户取消删除，则返回字符串cancel
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // 确认删除
            const { data: res } = await this.$http.delete('roles/' + id);
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getRolesList()
        },
        // =================================
        // 权限管理模块
        // 根据id删除对应的权限
        async removeRightById(role, rightId) {
            // 弹框确认删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                // eslint-disable-next-line no-dupe-keys
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            // 确认删除
            const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            // 重新赋值，避免重定向
            role.children = res.data
            console.log(role);
        },
        // 展示分配权限的对话框
        async showSetRightDialog(role) {
            console.log(role);
            // 将获取到的id存入roleId中
            this.roleId = role.id
            // 获取所有权限的数据
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) return this.$message.error('请求失败')
            // 把获取到的权限数据保存到data中
            this.rightsList = res.data
            console.log(this.rightsList);
            // 递归获取三级节点的id
            this.getLeafKeys(role, this.defKeys)
            this.SetRightDialogVisible = true
        },
        // 通过递归获取角色下所有三级权限的id，并保存到数组中
        // node是当前的角色
        getLeafKeys(node, arr) {
            //  不包含children说明是三级节点
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => {
                this.getLeafKeys(item, arr)
            })
        },
        // 监听分配权限对话框的关闭事件(重新赋值)
        setRightDialogClosed() {
            this.defKeys = []
        },
        // 点击为角色分配权限
        async allotRight() {
            // 拿到所有半选和全选状态下的id
            const keys = [
                // ...剩余参数,接收数组
                ...this.$refs.treeRef.getCheckedKeys(),
                ...this.$refs.treeRef.getHalfCheckedKeys()
            ]
            // 将数组拼接成','分割的字符串
            const idStr = keys.join(',')
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
            if (res.meta.status !== 200) return this.$message.error('分配权限失败')
            this.$message.success('分配权限成功')
            // 刷新列表
            this.getRolesList()
            // 隐藏对话框
            this.SetRightDialogVisible = false
        }
    }
}
</script>
<style lang="less" scoped>
.box-card {
    text-align: left;
}

.el-tag {
    margin-left: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>

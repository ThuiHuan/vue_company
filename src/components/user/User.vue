<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 搜索与添加区 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" clearable @clear="getUserList" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>
        </el-card>

        <!-- 用户列表数据 -->
        <el-table :data="userList" style="width: 100%" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="username" label="姓名" width="180"></el-table-column>
            <el-table-column prop="email" label="邮箱"></el-table-column>
            <el-table-column prop="mobile" label="电话"> </el-table-column>
            <el-table-column prop="role_name" label="角色"> </el-table-column>
            <el-table-column label="状态">
                <!-- 作用域插槽实际上是带有数据的插槽，可以获取到父组件传递的参数，将这些参数使用到子组件插槽里 -->
                <template slot-scope="scope">
                    <!-- active-text="开" inactive-text="关" -->
                    <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">

                <template slot-scope="scope">
                    <!-- 修改按钮 -->
                    <el-button @click="showEditDialog(scope.row.id)" type="primary" icon="el-icon-edit" size="mini">
                    </el-button>
                    <!-- 删除按钮 -->
                    <el-button @click="removeUserById(scope.row.id)" type="danger" icon="el-icon-delete" size="mini">
                    </el-button>
                    <!-- 分配角色按钮 -->
                    <el-tooltip effect="dark" content="分配角色" placement="top-start" :enterable="false">
                        <el-button @click="setRole(scope.row)" type="warning" icon="el-icon-setting" size="mini">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum" :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>

        <!-- 添加用户的对话框 -->
        <el-dialog @close="addDiologClosed" title="添加用户" :visible.sync="addDialogVisible" width="30%">
            <!-- 内容主体区 -->
            <!-- ref引用：获取DOM元素或组件的引用，里面存储着对应的 DOM 元素或组件的引用 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button @click="addUser" type="primary">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <!-- :visible.sync模态框显示隐藏 -->
        <el-dialog @close="editDiologClosed" title="修改用户" :visible.sync="editDialogVisible" width="50%">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
                <el-form-item label="用户名">
                    <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色的对话框 -->
        <!-- @close="setRoleDialogClosed"  -->
        <el-dialog title="分配角色" @close="setRoleDialogClose" :visible.sync="SetRoleDialogVisible" width="50%">
            <div>
                <p>当前的用户：{{ userInfo.username }}</p>
                <p>当前的角色：{{ userInfo.role_name }}</p>
                <p>分配新角色：
                    <el-select v-model="selectedRoleId" placeholder="请选择">
                        <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="SetRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的自定义规则
        // eslint-disable-next-line no-var
        var checkEmail = (rele, value, cb) => {
            const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (regEmail.test(value)) {
                // 校验通过
                return cb()
            }
            // 不通过
            cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机号的自定义规则
        // eslint-disable-next-line no-var
        var checkMobile = (rele, value, cb) => {
            const regMobile = /^(?:(?:\+|00)86)?1\d{10}$/
            if (regMobile.test(value)) {
                // 校验通过
                return cb()
            }
            // 不通过
            cb(new Error('请输入合法的手机号'))
        }
        return {
            // 获取用户列表的参数对象
            queryInfo: {
                // 查询参数
                query: '',
                // 当前页码
                pagenum: 1,
                // 每页显示条数
                pagesize: 3
            },
            userList: [],
            total: 0,
            // 控制对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据对象
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '用户名的长度在6-15个字符之间', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机', trigger: 'blur' },
                    // validator指定校验对象
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            // 控制修改用户的对话框
            editDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {
            },
            // 修改表单的验证规则
            editFormRules: {
                email: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
            SetRoleDialogVisible: false,
            // 需要被分配角色的用户信息
            userInfo: {},
            // 所有角色的数据列表
            rolesList: [],
            // 已选中的角色的id值
            selectedRoleId: ''
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            const { data: res } = await this.$http.get('users', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error('用户列表获取失败')
            this.userList = res.data.users;
            this.total = res.data.total
            // console.log(this.userList);
            // console.log(this.total);
            // console.log(res);
        },
        // 监听pagesize改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            // 重新渲染用户数据
            this.getUserList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            console.log(newPage);
            this.getUserList()
        },
        // 监听switch开关状态的改变
        async userStateChanged(userinfo) {
            console.log(userinfo);
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户状态失败!')
            }
            this.$message.success('更新用户状态成功!')
        },
        // 监听添加用户对话框的关闭事件
        addDiologClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮，添加新用户
        addUser() {
            // 预验证
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid); // true
                if (!valid) { return false; }
                const { data: res } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏用户框
                this.addDialogVisible = false
                // 重新获取用户列表
                this.getUserList()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            // console.log(id);
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) return this.$message.error('查询信息失败')
            this.editForm = res.data
            this.editDialogVisible = true
        },
        editDiologClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo() {
            // 预验证
            this.$refs.editFormRef.validate(async vaild => {
                // console.log(vaild);
                if (!vaild) return false;
                // 发起修改请求
                const { data: res } = await this.$http.put('users/' + this.editForm.id, {
                    email: this.editForm.email,
                    mobile: this.editForm.mobile
                })
                if (res.meta.status !== 200) return this.$message.error('更新用户失败')
                // 关闭对话框
                this.editDialogVisible = false
                // 刷新数据列表
                this.getUserList()
                // 修改成功
                this.$message.success('用户更新成功')
            })
        },
        // 根据id删除对应的用户信息
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
            // console.log('确认删除');
            const { data: res } = await this.$http.delete('users/' + id);
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getUserList()
        },
        // 展示分配角色的对话框
        async setRole(userInfo) {
            this.userInfo = userInfo

            // 在展示对话框之前获取所有角色的列表
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('请求失败')

            // 保存数据
            this.rolesList = res.data

            this.SetRoleDialogVisible = true
        },
        // 点击按钮分配角色
        async saveRoleInfo() {
            if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色!')
            // 发起请求保存用户操作
            const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, {
                rid: this.selectedRoleId

            })
            if (res.meta.status !== 200) return this.$message.error('更新角色失败')
            this.$message.success('更新角色成功')
            this.getUserList()
            this.SetRoleDialogVisible = false
        },
        // 监听分配角色对话框的关闭事件
        setRoleDialogClose() {
            this.selectedRoleId = ''
            this.userInfo = ''
        }
    }
}
</script>

<style lang="less" scoped></style>

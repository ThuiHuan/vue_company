<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <el-alert show-icon title="注意:只允许为第三级分类设置相关参数" type="warning" :closable="false">
            </el-alert>

            <!-- 选择商品分类区 -->
            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类:</span>
                    <!-- 选择商品分类的级联选择框 -->
                    <el-cascader v-model="selectedCateKeys" :options="CateList" :props="cateProps"
                        @change="handleChange"></el-cascader>
                </el-col>
            </el-row>

            <!-- tab区 -->
            <el-tabs class="cat_opt" v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" @click="addDialogVisible = true" size="mini" :disabled="isBtnDisabled">
                        添加参数
                    </el-button>

                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe>
                        <!-- 索引列 -->
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag closable @close="handleClose(i, scope.row)"
                                    v-for="(item, i) in scope.row.attr_vals" :key="i">
                                    {{ item }}
                                </el-tag>

                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>

                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"> </el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showEditDialogVisible(scope.row.attr_id
                                )" size="mini" icon="el-icon-edit">编辑
                                </el-button>
                                <el-button @click="removeParams(scope.row.attr_id
                                )" type="danger" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>
                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" @click="addDialogVisible = true" size="mini" :disabled="isBtnDisabled">
                        添加属性
                    </el-button>

                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe>
                        <!-- 索引列 -->
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环渲染tag标签 -->
                                <el-tag closable @close="handleClose(i, scope.row)"
                                    v-for="(item, i) in scope.row.attr_vals" :key="i">
                                    {{ item }}
                                </el-tag>

                                <!-- 输入文本框 -->
                                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                                    v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                                    @keyup.enter.native="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- 添加按钮 -->
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                                    +
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"> </el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"> </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showEditDialogVisible(scope.row.attr_id
                                )" size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" @click="removeParams(scope.row.attr_id
                                )" size="mini" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
        </el-card>

        <!-- 添加参数的对话框 -->
        <el-dialog @close="addDialogClose" :title="'添加' + titleText" :visible.sync="addDialogVisible" width="30%">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数的对话框 -->
        <el-dialog @close="editDialogClose" :title="'修改' + titleText" :visible.sync="editDialogVisible" width="30%">
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 商品分类列表
            CateList: [],
            // 级联选择框的配置对象
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },
            // 级联选择框双向绑定到的数组
            selectedCateKeys: [],
            // 被激活的页签的名称
            activeName: 'many',
            // 动态参数的数据
            manyTableData: [],
            // 静态属性的数据
            onlyTableData: [],
            // 控制添加对话框的显示与隐藏
            addDialogVisible: false,
            // 修改按钮的显示与隐藏
            editDialogVisible: false,
            // 添加参数的表单数据对象
            addForm: {
                attr_name: ''
            },
            // 修改参数的表单数据对象
            editForm: {
                attr_name: ''
            },
            // 添加表单的验证规则
            addFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数名称', trigger: 'blur' }
                ]
            }

        }
    },
    created() {
        // 获取所有的商品分类列表
        this.getCateList()
    },
    computed: {
        // 如果按钮需要被禁用,则返回true，否则返回false
        isBtnDisabled() {
            if (this.selectedCateKeys.length !== 3) {
                return true
            }
            return false
        },
        // 当前选中的三级分类Id
        cateId() {
            if (this.selectedCateKeys.length === 3) {
                return this.selectedCateKeys[2]
            }
            return null
        },
        // 动态计算标题的文本
        titleText() {
            if (this.activeName === 'many') return '动态参数'
            return '静态属性'
        }
    },
    methods: {
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('数据请求失败')
            this.CateList = res.data
            // console.log(this.CateList);
        },
        // 级联选择框中项变化，会触发这个函数
        async handleChange() {
            this.geParamsData()
        },
        // tab页签的点击事件
        handleTabClick() {
            this.geParamsData()
        },
        // 获取参数的列表数据
        async geParamsData() {
            // 选中的不是三级分类
            if (this.selectedCateKeys.length !== 3) {
                this.selectedCateKeys = []
                // 选中二级分类也清空
                this.manyTableData = []
                this.onlyTableData = []
                return false
            }
            // 选中的是三级分类
            // 根据所选分类的id喝当前所处的面板，获取对应的参数
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                params: { sel: this.activeName }
            })
            if (res.meta.status !== 200) return this.$message.error('数据请求失败')
            // 循环数组，以空格分隔
            res.data.forEach(item => {
                // 判断数组是否为空，为空就返回空白数组
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 添加一个布尔值控制文本框的显示与隐藏
                item.inputVisible = false
                // 文本框中输入的值
                item.inputValue = ''
            })
            if (this.activeName === 'many') {
                this.manyTableData = res.data
                // console.log(this.smanyTableDatas);
            } else {
                this.onlyTableData = res.data
            }
        },
        // 监听添加对话框的关闭事件
        addDialogClose() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮添加参数
        addParams() {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return false
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) return this.$message.error('添加参数失败')
                this.$message.success('添加参数成功')
                this.addDialogVisible = false
                this.geParamsData()
            })
        },
        // 展示修改对话框
        async showEditDialogVisible(id) {
            // 获取参数传入表单
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
                params: { attr_sel: this.activeName }
            })
            if (res.meta.status !== 200) return this.$message.error('获取参数信息失败')
            // console.log(res);
            this.editForm = res.data;
            this.editDialogVisible = true;
            console.log(this.editForm);
        },
        // 点击按钮修改参数
        editParams() {
            // 预校验
            this.$refs.editFormRef.validate(async valid => {
                if (!valid === 200) return false
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) return this.$message.error('获取参数信息失败')
                this.$message.success('修改数据成功')
                this.geParamsData()
                this.editDialogVisible = false
            })
        },
        // 监听修改对话框的关闭
        editDialogClose() {
            this.$refs.editFormRef.resetFields()
        },
        // 删除商品参数
        async removeParams(id) {
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
            const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`, {
                params: { attr_sel: this.activeName }
            });
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.geParamsData()
        },
        // 文本框失去焦点或按下enter会触发
        async handleInputConfirm(row) {
            row.inputVisible = false
            // 如果两端有空格
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return false
            }
            // 如果没有return，则输入了内容
            row.attr_vals.push(row.inputValue.trim())
            // 重置
            row.inputValue = ''
            row.inputVisible = false
            this.saveAttrVals(row)
        },
        // 将对attr_vals的操作保存到数据库
        async saveAttrVals(row) {
            // 然后再发起请求,保存这次操作，添加到数据库
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                attr_name: row.attr_name,
                attr_sel: row.attr_sel,
                attr_vals: row.attr_vals.join(' ')
            })
            if (res.meta.status !== 200) return this.$message.error('修改失败')
            this.$message.success('修改参数项成功')
        },
        // 点击按钮展示文本输入框
        showInput(row) {
            row.inputVisible = true
            // 让文本框自动获得焦点
            // $nextTick 当页面上元素被重新渲染后才会执行回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        // 删除对应的参数可选项
        handleClose(i, row) {
            row.attr_vals.splice(i, 1)
            this.saveAttrVals(row)
        }
    }
}
</script>
<style lang="less" scoped>
.cat_opt {
    text-align: left;
    margin: 20px 0;
}

.el-tag {
    margin-left: 20px;
}

.button-new-tag {
    margin-left: 20px;
}

.input-new-tag {
    width: 150px;
    margin-left: 20px;
}
</style>

<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <!-- 行 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 表格 -->
            <tree-table class="treeTable" :data="CateList" :columns="columns" :show-row-hover="false" border
                index-text="#" :show-index="true" :expand-type="false" :selection-type="false">
                <!-- 是否有效插槽 -->
                <template slot="isok" slot-scope="scope">
                    <i style="color:lightgreen" class="el-icon-success" v-if="scope.row.cat_deleted === false"></i>
                    <i style="color:red" class="el-icon-error" v-else></i>
                </template>
                <!-- 排序插槽 -->
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="success">二级</el-tag>
                    <el-tag size="mini" v-else type="warning">三级</el-tag>
                </template>
                <!-- 操作插槽 -->
                <template slot="opt" slot-scope="scope">
                    <el-button @click="showEditCateDialogVisible(scope.row.cat_id)" size="mini" type="primary"
                        icon="el-icon-edit">
                        编辑
                    </el-button>
                    <el-button @click="removeCateById(scope.row.cat_id)" size="mini" type="danger"
                        icon="el-icon-delete">删除
                    </el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination class="pagination" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog @close="addCateDialogClosed" title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
            <!-- 添加分类的表单 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                <!-- prop是表单验证对象下的属性 -->
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类">
                    <!--   options用来指定数据源,props用来指定配置对象-->
                    <el-cascader clearable v-model="selectedKeys" :options="parentCateList" :props="cascaderProp"
                        @change="parentCateChange">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改分类的对话框@close="addCateDialogClosed" -->
        <el-dialog title="修改分类分类" :visible.sync="editCateDialogVisible" width="50%">
            <!-- 添加分类的表单 -->
            <el-form :model="editCateForm" :rules="addCateFormRules" ref="editFormRef" label-width="100px">
                <!-- prop是表单验证对象下的属性 -->
                <el-form-item label="分类名称" prop="cat_name">
                    <el-input v-model="editCateForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editCateDialog">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {

    data() {
        return {
            queryInfo: {
                // 默认获取所有级别的分类
                type: 3,
                // 当前页码值
                pagenum: 1,
                // 每页显示多少条数据
                pagesize: 5
            },
            // 商品分类的数据列表,默认为空
            CateList: [],
            // 总数据条数
            total: 0,
            // 为table指定列的定义
            columns: [{
                label: '分类名称',
                prop: 'cat_name'
            },
            {
                label: '是否有效',
                // 当前列定义为模板列
                type: 'template',
                // 当前列使用的模板名称
                template: 'isok'
            },
            {
                label: '排序',
                // 当前列定义为模板列
                type: 'template',
                // 当前列使用的模板名称
                template: 'order'
            },
            {
                label: '操作',
                // 当前列定义为模板列
                type: 'template',
                // 当前列使用的模板名称
                template: 'opt'
            }],
            // 控制添加分类对话框的显示与隐藏
            addCateDialogVisible: false,
            //  控制修改分类对话框的显示与隐藏
            editCateDialogVisible: false,
            // 添加分类的表单数据对象
            addCateForm: {
                // 将要添加的分类名称
                cat_name: '',
                // 父级分类的id
                cat_pid: 0,
                // 分类层级,默认添加一级分类
                cat_level: 0
            },
            // 修改分类的表单数据对象
            editCateForm: {
                id: '',
                cat_name: ''
            },
            // 添加分类表单的验证规则对象
            addCateFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ]
            },
            // 指定级联选择器的配置对象
            cascaderProp: {
                checkStrictly: true,
                expandTrigger: 'hover',
                // 指定选项的值为选项对象的某个属性值
                value: 'cat_id',
                label: 'cat_name',
                // 指定选项的子选项为选项对象的某个属性值
                children: 'children'
            },
            // 父级分类的列表
            parentCateList: [],
            // 选中的父级分类的Id数组
            selectedKeys: []
        }
    },
    created() {
        this.getCateList()
    },
    methods: {
        // 获取商品分类数据
        async getCateList() {
            // get请求用params
            const { data: res } = await this.$http.get('categories', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('请求失败')
            // 把数据列表赋值给
            this.CateList = res.data.result
            // 总数据条数
            this.total = res.data.total
        },
        // 监听pagisize改变事件
        handleSizeChange(newSize) {
            // 给queryInfo赋值
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听page
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 点击展示添加分类的对话框
        showAddCateDialogVisible() {
            // 获取父级分类的数据列表
            this.getParentCateList()
            this.addCateDialogVisible = true
        },
        // 获取父级的分类列表数据
        async getParentCateList() {
            const { data: res } = await this.$http.get('categories', {
                params:
                    { type: 2 }
            })
            // console.log(res);
            if (res.meta.status !== 200) return this.$message.error('请求失败')
            this.parentCateList = res.data
            console.log(this.addCateForm);
        },
        // 选择项发生变化触发
        parentCateChange() {
            console.log(this.selectedKeys);
            // 如果selectedKeys数组中的length大于0,证明选中的父级分类
            // 反之说明没有选中任何父级分类
            if (this.selectedKeys.length > 0) {
                // 父级分类的id
                this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = this.selectedKeys.length
                return false
            } else {
                // 父级分类的id
                this.addCateForm.cat_pid = 0
                // 为当前分类的等级赋值
                this.addCateForm.cat_level = 0
            }
        },
        // 点击按钮添加新的分类
        addCate() {
            // console.log(this.addCateForm);
            this.$refs.addCateFormRef.validate(async valid => {
                if (!valid) return false
                const { data: res } = await this.$http.post('categories', this.addCateForm)
                if (res.meta.status !== 201) return this.$message.error('添加失败')
                this.$message.success('添加成功')
                // 刷新数据列表
                this.getCateList()
                this.addCateDialogVisible = false
            })
        },
        // 监听对话框的关闭事件,重置表单数据
        addCateDialogClosed() {
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = ''
            this.addCateForm.cat_level = 0
            this.addCateForm.cat_pid = 0
        },
        async showEditCateDialogVisible(id) {
            const { data: res } = await this.$http.get('categories/' + id)
            if (res.meta.status !== 200) return this.$message.error('请求失败')
            this.editCateForm = res.data
            // console.log(res);
            this.editCateDialogVisible = true
        },
        // 修改
        editCateDialog() {
            // 预验证
            this.$refs.editFormRef.validate(async (valit) => {
                if (!valit) return false
                const { data: res } = await this.$http.put('categories/' + this.editCateForm.cat_id, {
                    cat_name: this.editCateForm.cat_name
                }
                )
                if (res.meta.status !== 200) return this.$message.error('请求失败')
                // 关闭对话框
                this.editCateDialogVisible = false
                // 刷新数据列表
                this.getCateList()
                // 请求成功
                this.$message.success('更新成功')
            })
        },

        // 删除
        async removeCateById(id) {
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
            const { data: res } = await this.$http.delete('categories/' + id);
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getCateList()
        }
    }

}
</script>
<style lang="less" scoped>
.box-card {
    text-align: left;
}

.treeTable {
    margin-top: 15px;
}

.pagination {
    text-align: center;
}

.el-cascader {
    width: 100%
}
</style>

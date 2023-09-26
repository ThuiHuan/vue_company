<template>
    <div class="div">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 消息提示 -->
        <el-alert show-icon center :closable="false" class="alert_mes" title="添加商品信息" type="info">
        </el-alert>

        <!-- 步骤条 -->
        <el-steps align-center :space="200" :active="activIndex - 0" finish-status="success">
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

        <!-- tab栏 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
            <el-tabs @tab-click="tabClicked" :before-leave="beforeTabLeave" v-model="activIndex" :tab-position="'left'">
                <el-tab-pane label="基本信息" name="0">
                    <el-form-item prop="goods_name" label="商品名称">
                        <el-input v-model="addForm.goods_name">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="goods_price" label="商品价格">
                        <el-input v-model="addForm.goods_price" type="number">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="goods_weight" label="商品重量">
                        <el-input v-model="addForm.goods_weight" type="number">
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="goods_number" label="商品数量">
                        <el-input v-model="addForm.goods_number" type="number">
                        </el-input>
                    </el-form-item>

                    <el-form-item prop="goods_cat" label="商品分类">
                        <!-- 级联选择器 -->
                        <el-cascader v-model="addForm.goods_cat" :options="cateList"
                            :props="{ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', children: 'children' }"
                            @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>

                <!-- 渲染表单的item项 -->
                <el-tab-pane label="商品参数" name="1">
                    <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                        <!-- 复选框组 -->
                        <el-checkbox-group v-model="item.attr_vals">
                            <el-checkbox border :label="cb" :key="i" v-for="(cb, i) in item.attr_vals"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <!-- 渲染商品属性的表单项 -->
                    <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key=item.attr_id>
                        <el-input v-model="item.attr_vals"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload :on-success="handleSuccess" :headers="headleObj" class="upload-demo"
                        action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview"
                        :on-remove="handleRemove" list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <!-- 父文本编辑器组件 -->
                    <quill-editor v-model="addForm.goods_introduce"></quill-editor>
                    <!-- 添加商品的按钮 -->
                    <el-button class="btn_add" type="primary" @click="add">添加商品</el-button>
                </el-tab-pane>
            </el-tabs>
        </el-form>

        <!-- 图片预览 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
            <img :src="previewPath" alt="" class="previewImg">
        </el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
    data() {
        return {
            // 获取商品分类列表
            cateList: [],
            // tab标签的页面数
            activIndex: '0',
            // 动态参数列表数据
            manyTableData: [],
            // 静态属性列表数据
            onlyTableData: [],
            // 添加商品的表单数据对象
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所属的分类数组
                goods_cat: [],
                // 图片的数组
                pics: [],
                // 商品的详情描述
                goods_introduce: '',
                attrs: []
            },
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }

                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },
            // 配置图片上传组件的headers请求头对象
            headleObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 图片预览框
            previewPath: '',
            previewVisible: false
        }
    },
    created() {
        this.getCateList()
    },
    computed: {
        cateId() {
            if (this.addForm.goods_cat.length === 3) {
                return this.addForm.goods_cat[2]
            }
            return null;
        }
    },
    methods: {
        // 获取所有商品分类数据
        async getCateList() {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error('获取商品分类数据失败')
            this.cateList = res.data
            console.log(this.cateList);
        },
        // 级联选择器的选中项变化触发这个函数
        handleChange() {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
            console.log(this.addForm.goods_cat);
        },
        // 标签页切换的监听
        beforeTabLeave(activeName, oldActiveName) {
            // console.log('即将离开的标签页名字是:' + oldActiveName);
            // console.log('即将进入的的标签页名字是:' + activeName);
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },
        // 当点击tab标签时触发
        async tabClicked() {
            // 访问的动态参数面板
            if (this.activIndex === '1') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'many' }
                })
                if (res.meta.status !== 200) return this.$message('请求动态参数失败')
                res.data.forEach(item => {
                    // 将字符串转为数组
                    item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
                })
                this.manyTableData = res.data
            } else if (this.activIndex === '2') {
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: { sel: 'only' }
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('请求静态属性失败')
                }
                this.onlyTableData = res.data
                console.log(res);
            }
        },
        // 处理图片预览效果
        handlePreview(file) {
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 处理移出图片的操作
        handleRemove(file) {
            // 1.获取将要删除的图片的临时路径
            const filePath = file.response.data.tmp_path
            // console.log(filePath);
            // 2.从pics数组中找到这个图片对应的索引值
            const i = this.addForm.pics.findIndex(x =>
                x.pic === filePath
            )
            // 3.调用数组的splice方法,把图片信息对象,从pics数组中移出
            this.addForm.pics.splice(i, 1)
            console.log(this.addForm);
        },
        // 监听图片上传成功的事件
        handleSuccess(response) {
            // console.log(response);
            // 1.拼接得到一个图片信息对象
            const picInfo = { pic: response.data.tmp_path }
            // 2.将图片信息对象push到pics数组
            this.addForm.pics.push(picInfo)
            console.log(this.addForm);
        },
        // 添加商品
        add() {
            // 预验证
            this.$refs.addFormRef.validate(async valit => {
                if (!valit) {
                    return this.$message.error('请填写必要的表单项')
                }
                // 执行添加的逻辑
                // 深拷贝 lodash cloneDeep
                // 转为字符串
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                // 处理动态参数
                this.manyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals.join(' ')
                    }
                    this.addForm.attrs.push(newInfo)
                })
                // 处理静态属性
                this.onlyTableData.forEach(item => {
                    const newInfo = {
                        attr_id: item.attr_id,
                        attr_value: item.attr_vals
                    }
                    this.addForm.attrs.push(newInfo)
                })
                form.attrs = this.addForm.attrs
                console.log(form.attrs);

                // 发起请求,添加商品
                // 商品的名称必须是唯一的
                const { data: res } = await await this.$http.post('goods', form)
                if (res.meta.status !== 201) {
                    return this.$message.error('添加商品失败')
                }
                this.$message.success('添加商品成功')
                this.$router.push('/goods')
            }
            )
        }

    }
}
</script>
<style lang="less" scoped>
.el-steps {
    margin: 30px 0;
    justify-content: center;
}

.el-step__title {
    font-size: 13px
}

.el-tabs {
    text-align: left;
}

.el-checkbox {
    margin: 0 15px 0 0 !important;
}

.previewImg {
    width: 100%;
}

.btn_add {
    margin-top: 15px;
}
</style>

<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card class="box-card">
            <el-row>
                <el-col :span:="8">
                    <!-- @clear="getUserList" v-model="queryInfo.query" -->
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表数据 -->
            <el-table :data="orderlist" border stripe>
                <el-table-column type="index">
                </el-table-column>
                <el-table-column label="订单编号" prop="order_number">
                </el-table-column>
                <el-table-column label="订单价格" prop="order_price">
                </el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.pay === '0'">
                            已付款
                        </el-tag>
                        <el-tag type="danger" v-else>
                            未付款
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send">
                    <template slot-scope="scope">
                        {{ scope.row.is_send }}
                    </template>
                </el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                        {{ scope.row.create_time | dateFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button @click="showBox(scope)" type="primary" icon="el-icon-edit" size="mini">
                        </el-button>
                        <!-- 物流按钮 -->
                        <el-button @click="showProgressBox" type="success" icon="el-icon-location" size="mini">
                        </el-button>
                        <!-- 分配角色按钮 -->
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 修改地址的对话框 -->
        <el-dialog @close="addressDialogClosed" title="修改地址" :visible.sync="addRessVisible" width="50%">
            <el-form :model="addressForm" :rules="addressFormRule" ref="addressFormRef" label-width="100px">
                <el-form-item label="省市区/县" prop="address1">
                    <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRessVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRessVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 物流对话框 -->
        <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
            <span>一段信息</span>
            获取信息失败
        </el-dialog>
    </div>
</template>

<script>
import cityData from './citydata'

export default {
    data() {
        return {
            // 查询对象
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 10
            },
            total: 0,
            orderlist: [],
            addRessVisible: false,
            addressForm: {
                address1: '',
                address2: ''
            },
            progressInfo: [],
            addressFormRule: {
                address1: [
                    { required: true, message: '请选择省市区县', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请填写详细地址', trigger: 'blur' }
                ]
            },
            cityData,
            progressVisible: false
        }
    },
    created() {
        this.getOrderList()
    },
    methods: {
        async getOrderList() {
            const { data: res } = await this.$http.get('orders', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('获取订单列表失败')
            console.log(res);
            this.total = res.data.total
            this.orderlist = res.data.goods
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getOrderList()
        },
        // 展示修改地址的对话框
        showBox() {
            this.addRessVisible = true
        },
        addressDialogClosed() {
            this.$refs.addressFormRef.resetFields()
        },
        async showProgressBox() {
            // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
            // if (res.meta.status !== 200) return this.$message.error('获取物流信息失败')
            // this.progressInfo = res.data
            this.progressVisible = true
            // console.log(this.progressInfo);
        }
    }
}
</script>
<style lang="less" scoped>
.box-card {
    text-align: center;
}

.el-cascader {
    width: 100%;
}
</style>

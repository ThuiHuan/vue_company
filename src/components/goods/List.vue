<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区 -->
        <el-card>
            <el-row :gutter="20" class=" cat_opt">
                <!-- :span占位 -->
                <el-col :span="8">
                    <el-input clearable @clear="getGoodList" placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button @click="getGoodList" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- table表格区 -->
            <el-table :data="goodslist" border stripe>
                <!-- 索引列 -->
                <el-table-column type="index">
                </el-table-column>

                <!-- 商品名称 -->
                <el-table-column label="商品名称" prop="goods_name">
                </el-table-column>

                <!-- 商品价格 -->
                <el-table-column width="95px" label="商品价格(元)" prop="goods_price">
                </el-table-column>

                <!-- 商品重量 -->
                <el-table-column width="70px" label="商品重量" prop="goods_weight">
                </el-table-column>

                <!-- 商品创建时间-->
                <el-table-column width="140px" label="创建时间" prop="add_time">
                    <template slot-scope="scope">
                        {{ scope.row.add_time | dateFormat }}
                    </template>
                </el-table-column>

                <!-- 操作-->
                <el-table-column width="130px" label="操作">
                    <template slot-scope="scope">
                        <!-- 修改 -->
                        <el-button type="primary" size="mini" icon="el-icon-edit">
                        </el-button>
                        <!-- 删除 -->
                        <el-button @click="removeById(scope.row.goods_id)" type="danger" size="mini"
                            icon="el-icon-delete"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper" :total="total" background>
            </el-pagination>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            // 查询参数
            queryInfo: {
                // 查询参数
                query: '',
                // 当前页码值
                pagenum: 1,
                // 每页多少条数据
                pagesize: 10
            },
            // 商品列表
            goodslist: [],
            // 总数据条数
            total: 0
        }
    },
    created() {
        this.getGoodList()
    },
    methods: {
        // 根据分页获取对应的商品列表
        async getGoodList() {
            const { data: res } = await this.$http.get('goods', {
                params: this.queryInfo
            })
            if (res.meta.status !== 200) return this.$message.error('请求失败')
            this.goodslist = res.data.goods
            this.total = res.data.total
            // console.log(this.goodslist);
            // console.log(this.total);
        },
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodList()
        },
        // 页码值发生变化
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getGoodList()
        },
        // 删除功能
        async removeById(id) {
            const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
            const { data: res } = await this.$http.delete(`goods/${id}`)
            if (res.meta.status !== 200) return this.$message.error('删除失败')
            this.$message.success('删除成功')
            this.getGoodList()
        },
        // 添加功能
        goAddpage() {
            // 路由导航
            this.$router.push('/goods/add')
        }
    }
}
</script>
<style lang="less" scoped>
.cat_opt {
    text-align: left;
}
</style>

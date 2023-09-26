<!-- eslint-disable vue/no-parsing-error -->
<template>
    <el-container class="home-container">
        <!-- 头部区 -->
        <el-header>
            <div>
                <img id='img' src="../assets/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <el-menu default-active="activePath" router background-color="#1d6476" activ-text-color="#409EFF"
                    :unique-opened="true" :collapse="isCollapse" :collapse-transition="false">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" :key="item.id" v-for="item in menulist">
                        <!-- 一级菜单的模块区域 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconObj[item.id]"></i>
                            <!-- 文本 -->
                            <span class="message ">{{ item.authName }}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item @click="saveNavState('/' + sub.path)" ref="ilist" :index="'/' + sub.path"
                            :key="sub.id" v-for="sub in item.children">
                            <template slot="title">
                                <!-- 图标 -->
                                <i class="el-icon-menu"></i>
                                <!-- 文本 -->
                                {{ sub.authName }}
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容主体 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            menulist: [],
            iconObj: {
                125: 'iconfont icon-users',
                103: 'iconfont icon-tijikongjian ',
                101: 'iconfont icon-shangpin',
                102: 'iconfont icon-danju',
                145: 'iconfont icon-baobiao'
            },
            isCollapse: false,
            // 被激活的地址
            activePath: ''
        }
    },
    created() {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
        // console.log(this.activePath);
    },
    methods: {
        logout() {
            window.sessionStorage.clear();
            this.$router.push('/login')
        },
        // 获取所有的菜单
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
            // console.log(res);
            // console.log(this.menulist);
        },
        // 点击按钮切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
            // console.log(this.activePath);
        }
    }

}
</script>
<style lang="less" scoped>
.toggle-button {
    background-color: #2b5c68a9;
    line-height: 24px;
    font-size: 10px;
    color: #fff;
    text-align: center;
    // 文字间距
    letter-spacing: 0.2em;
    cursor: pointer;
}

.el-submenu__title {
    margin: 0;
}

.el-menu {
    border-right: none;
    // margin-left: -80px
}

.iconfont {
    margin-right: 7px;
}

.el-submenu [class^=el-icon-] {
    margin-right: -0px
}

.message {
    color: #fff;
}

.el-menu-item {
    // margin-left: 20px;
    color: #fff
}

.message {
    color: #fff;
}

.el-icon-message {
    color: #fff;
}

.el-header {
    color: #333;
    line-height: 60px;
    background-color: #185463;
    display: flex;
    // 左右贴边对齐
    justify-content: space-between;
    padding-left: 15px;
    align-items: center;

    div {
        display: flex;

        span {
            color: #fff;
            align-self: center;
            font-size: 18px;
            margin-left: 15px;
        }

        img {
            height: 60px;
        }
    }
}

.el-footer {
    background-color: #185463;
    color: #333;
    text-align: center;
    line-height: 60px;
}

.el-aside {
    color: #333;
    background-color: #1d6476;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #fff;
    color: #333;
    text-align: center;
    line-height: 20px;
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}

.home-container {
    height: 100%;
}
</style>

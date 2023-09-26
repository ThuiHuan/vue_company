<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区 -->
            <div class="avater_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 登录表单区 -->
            <!--ref是表单的引用对象  -->
            <el-form ref="loginFormRef" :model="loginForm" class="login_form" :rules="LoginFormRules">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password">
                    </el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="success" @click="CheckLogin">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 这是登录表单的数据对象
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 表单的验证规则对象
            LoginFormRules: {
                username: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在3-10个字符之间', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在6-15个字符之间', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        // 点击重置按钮
        resetLoginForm() {
            this.$refs.loginFormRef.resetFields();
        },
        // 预验证
        CheckLogin() {
            this.$refs.loginFormRef.validate(async (valid) => {
                if (!valid) return false;
                // 请求的地址与参数
                const { data: res } = await this.$http.post('login', this.loginForm);
                // console.log(res);
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
                this.$message.success(res.meta.msg);
                // 登录成功后的行为：1.将登录成功后的token,保存到客户端的sessionStorage中
                // 1.1项目中除了登录之外的其他API接口，必须在登录之后才能访问
                // 1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
                // console.log(res);
                window.sessionStorage.setItem('token', res.data.token) // 键值对
                // 2.通过编程式导航跳转到后台主页，路由是/home
                this.$router.push('/home')
            })
        }
    }
}

</script>

<!-- 支持less语法，scoped样式只在当前节点生效 -->
<style lang="less" scoped>
.login_container {
    background-image: linear-gradient(to top right, rgba(39, 47, 138, 0.597), rgba(161, 40, 19, 0.511));
    height: 100%;
    position: relative;
}

.login_box:hover {
    transition: all 1s linear;
    box-shadow: 0px 0px 20px rgb(0, 255, 26);
    opacity: 1;
}

.login_box {
    opacity: 0.7;
    width: 450px;
    height: 300px;
    background-color: rgba(31, 190, 169, 0.309);
    border-radius: 10px;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    left: 50%;
    transition: all 1.5s linear;

    .avater_box {
        z-index: 9;
        position: absolute;
        height: 130px;
        width: 130px;
        border-radius: 50%;
        border: 1px solid #eee;
        padding: 10px;
        box-shadow: 0 0 15px rgb(0, 255, 26);
        background-color: rgb(85, 148, 121);

        img {
            border-radius: 50%;
            width: 100%;
            height: 100%;
            background-color: #eee;
        }

        left: 50%;
        transform: translate(-50%, -50%);
    }
}

.login_form {
    // 相当于把padding和border的值都算在content里
    box-sizing: border-box;
    padding: 0 25px;
    width: 100%;
    position: absolute;
    bottom: 0;
    opacity: 1;
}

.btns {
    display: flex;
    // 尾部对齐
    justify-content: flex-end;
}
</style>

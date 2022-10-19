<template>
    <van-form @submit="submitHandle">
        <img class="logo" :src="state.logoUrl" alt="">
        <van-cell-group inset>
            <van-field v-model="state.username" clearable name="用户名" label="用户名" placeholder="用户名" />
            <van-field v-if="state.isPassword" v-model="state.password" type="password" clearable name="密码" label="密码"
                placeholder="密码" />
            <van-field v-else v-model="state.captcha" center clearable name="验证码" label="短信验证码" placeholder="短信验证码">
                <template #button>
                    <van-button class="verify-button" size="small" type="primary" @click="sendCaptcha"
                        :disabled="state.isSend">
                        {{ state.currentText }}
                    </van-button>
                </template>
            </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit">
                登录
            </van-button>
            <span class="change-button" v-text="state.changeText" @click="changeMode"></span>
        </div>
    </van-form>
</template>
  
<script setup>
import { getLogo } from '@/api/index'
import { getVerifyCode, getVerify, loginByPassword, loginByCaptcha } from '@/api/user'
import { computed, reactive } from "@vue/reactivity"
import { Toast } from 'vant';
import { useCountDown } from '@vant/use'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

// route 路由规则信息, router 负责操作路由
const route = useRoute()
const router = useRouter()
const store = useStore()
// 1. 提交按钮事件
const submitHandle = async () => {
    // 17. 用户名检测
    const username = state.username.trim()
    if (username === '') {
        return Toast('请检测用户名')
    }
    // 18. 统一变量的保存，响应结果，需要发送的数据：密码或者验证码
    let data = ''
    if (state.isPassword) {
        const password = state.password.trim()
        if (password === '') { return Toast('请检查密码') }
        ({ data } = await loginByPassword({
            account: username,
            password
        }))
    } else {
        const captcha = state.captcha.trim()
        if (captcha === '') { return Toast('请检查验证码') }
        ({ data } = await loginByCaptcha({
            phone: username,
            captcha
        }))
    }
    if (data.status !== 200) { return Toast('用户名和密码错误') }
    // 19. 成功之后，mutation保存提交新的token
    store.commit('user/setUser', data.data.token)
    // 20. 跳转页面, ??空值合并的操作符
    router.push(route.query.redirect ?? '/user')
}

// 2. 响应式数据
const state = reactive({
    // 3.登录模式
    loginMode: 'password',
    // 4.是否密码登录模式
    isPassword: computed(() => state.loginMode === 'password'),
    // 6. 按钮文本
    changeText: computed(() => state.isPassword ? '快速登录' : '密码登录'),
    username: '',
    password: '',
    captcha: '',
    // 13. 存储发送状态
    isSend: false,
    countDown: null,
    // 14. 状态对应的内容
    currentText: computed(() => state.isSend ? state.countDown.seconds : "发送验证码"),
    logoUrl: ''
})

// 5. 登录模式切换事件
const changeMode = () => {
    state.loginMode = state.isPassword ? 'captcha' : 'password'
    state.password = ''
    state.captcha = ''
}
// 7. 发送验证码请求
const sendCaptcha = async () => {
    // 8. 手机号规则校验
    if (!/^1\d{10}$/.test(state.username)) {
        return Toast('错误')
    }
    //   9. 发送校验请求
    const { data: v1 } = await getVerifyCode()
    if (v1.status !== 200) { return }
    // 10. 发送验证码请求
    const { data: v2 } = await getVerify({
        type: 'login',
        phone: state.username,
        key: v2.data.key
    })
    if (v2.status !== 200) { return Toast('网络出错') }
    // 11.验证码倒计时
    const countDown = useCountDown({
        time: 60 * 1000,
        // 16. 结束后禁用按钮
        onFinish() {
            state.isSend = false
        }
    })
    // 12.开启倒计时
    countDown.start()
    // 13.存储实例
    state.countDown = countDown.current
    // 15. 更改发送状态
    state.isSend = true

}

const loadLogo = async () => {
    const { data } = await getLogo()
    if (data.status !== 200) { return }
    state.logoUrl = data.data.logo_url
}
loadLogo()

</script>
<style lang="scss" scoped>
.van-form {
    display: flex;
    flex-direction: column;
}

.logo {
    width: 100%;
    align-self: center;
    margin: 70px 0 10px;
}

.change-button {
    display: block;
    text-align: center;
    font-size: 14px;
    color: #999;
    margin-top: 10px;
}
</style>
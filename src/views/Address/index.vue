<template>
    <!-- 导航 -->
    <van-nav-bar title="新增收货地址" left-text="返回" left-arrow />
    <!-- 表单 -->
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <!-- 1 姓名 -->
            <van-field v-model="real_name" name="姓名" label="姓名" placeholder="收货人姓名" />
            <!-- 2 手机号 -->
            <van-field v-model="phone" name="电话" label="电话" placeholder="收货人手机号" />
            <!-- 3 地区 -->
            <van-field v-model="fieldValue" is-link readonly label="地区" placeholder="请选择所在地区" @click="show = true" />
            <van-popup v-model:show="show" round position="bottom">
                <van-cascader v-model="area" title="请选择所在地区" :field-names="fieldNames" :options="options"
                    @close="show = false" @finish="onFinish" />
            </van-popup>
            <!-- 4 详细地址 -->
            <van-field v-model="detail" name="详细地址" label="详细地址" placeholder="详细地址信息" />
        </van-cell-group>
        <van-cell-group inset>
            <van-field name="switch" label="设置默认地址" input-align="right">
                <template #input>
                    <van-switch v-model="is_default" size="20" />
                </template>
            </van-field>
        </van-cell-group>
        <div style="margin: 16px;">
            <van-button round block type="primary" native-type="submit" @click="handleAdd">
                提交
            </van-button>
        </div>
    </van-form>
</template>

<script setup>
import { ref } from 'vue'
import { getCityList, addAddress } from '@/api/address'
import { useRouter } from 'vue-router'
const router = useRouter()
// ---- 1 数据处理 ----
const real_name = ref('')
const phone = ref('')
const area = ref('')
const detail = ref('')
const is_default = ref(false)
let address = {}
const { cartId } = defineProps({
    cartId: String
})
// 地区菜单显示状态
const show = ref(false)
// 地区选择后，输入框显示的内容
const fieldValue = ref('')

// 选项列表，children 代表子选项，支持多级嵌套
const options = ref([])
// 全部选项选择完毕后，会触发 finish 事件
const onFinish = ({ selectedOptions }) => {
    show.value = false
    fieldValue.value = selectedOptions.map((option) => option.n).join('/')
    // 为提交接口准备数据
    address = {
        province: selectedOptions[0].n,
        city: selectedOptions[1].n,
        city_id: selectedOptions[1].v,
        district: selectedOptions[2].n
    }
}

// 2. 请求数据
const initCityList = async () => {
    const { data } = await getCityList()
    if (data.status !== 200 ) { return }
    options.value = processData(data.data)
}
initCityList()
// 组件自定义名字
const fieldNames = {
  text: 'n',
  value: 'v', 
  children: 'c'
}
// 组件的空值的数据遍历
const processData = data => {
  data.forEach(item => {
    if (item.c.length === 0) {
        delete item.c
    } else {
        processData(item.c)
    }
  })
}

// 3. 提交数据
const handleAdd = async () => {
    const { data } = await addAddress({
        // 新增的id设置
        id: 0,
        real_name: real_name.value,
        phone: phone.value, 
        is_default: is_default.value,
        detail: detail.value,
        address
    })
    if (data.status !== 200) return 
    if (cartId) {
        router.push({
            name: 'order-confirm',
            params: {
                cartId
            }
        })
    } else {
        router.push('/user')
    }
}

</script>

<style lang="scss" scoped>
.van-form {
    background-color: #F7F7F7;

    .van-cell-group {
        margin-bottom: 10px;
    }
}
</style>
<template>
    <!-- 顶部导航 -->
    <van-nav-bar title="购物车" left-arrow></van-nav-bar>
    <!-- 购物车列表 -->
    <div class="cart-list" v-if="hasItem">
        <cart-item v-for="item in cartList" :key="item.id" :itemData="item" />
    </div>
    <!-- 当购物车为空时展示 -->
    <van-empty v-else description="购物车还没有商品哦~" />

    <!-- 总计价格提交 -->
    <!-- 模块的修改 -->
    <van-submit-bar :price="store.getters['cart/totalPrice'] * 100" button-text="去结算" @submit="handleClick">
        <van-checkbox v-model="checkedAll" checked-color="#ee0a24">全选</van-checkbox>
    </van-submit-bar>
    <!--底部  -->
    <layout-footer></layout-footer>
</template>

<script setup>
import LayoutFooter from '@/components/LayoutFooter.vue'
import { computed, ref } from '@vue/reactivity'
import { getCartList } from '@/api/cart'
import { useStore } from 'vuex'
import { nextTick } from '@vue/runtime-core';
import { useRouter } from 'vue-router'
const store = useStore()


// 2. 购物车列表数据处理
const cartList = computed(() => store.state.cart.cartList)
// 3. 购物车是否为空
const hasItem = computed(() => cartList.value.length !== 0)
// 1. 初始化购物车数据存储
const initCartList = async () => {
    const { data } = await getCartList()
    if (data.status !== 200) { return }
    // 1.2 请求数据之后，清空原始数据，注意渲染速度和数据速度不一致，需要nexttick
    store.commit('cart/clear')
    await nextTick()
    // 1.1 得到的数据信息，需要的数据进行状态管理
    data.data.valid.forEach(item => {
        store.commit('cart/addToCart', {
            id: item.id,
            checked: true,
            title: item.productInfo.store_name,
            image: item.productInfo.image,
            count: item.cart_num,
            price: item.truePrice,
            stock: item.trueStock,
            productId: item.product_id
        })
    })

}
initCartList()

//4. 全选的处理
const checkedAll = computed(() =>{
    get: () => store['cart/getters'].checkedAll;
    set: (newStatus) => store.commit('cart/changeAll', { checked: newStatus })
})
// 5. 跳转提交
const router = useRouter()
const handleClick = () => {
    router.push({
        name: 'order-confirm',
        params: {
            cartId: store.getters['car/checkedItems'].map(item => item.id).toString()
        }
    })
}
</script>

<style lang="scss" scoped>
// 导航区
.van-nav-bar {
    position: fixed !important;
    width: 100%;
    top: 0;
}

// 列表区域
.cart-list {
    margin: 50px 0 100px;
    background-color: #f2f2f2;
}

// 总计提交
.van-submit {
    bottom: 50px;
}
</style>

  
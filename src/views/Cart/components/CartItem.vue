<template>
    <div class="cart-item">
      <!-- 状态选框 -->
      <van-checkbox v-model="itemChecked" checked-color="#ee0a24"></van-checkbox>
      <!-- 右侧点击跳转 -->
      <div class="link" @click="handleRouter">
        <img :src="itemData.image" alt="">
        <div class="info">
          <p class="title" v-text="itemData.title"></p>
          <p class="detail">
            <span class="price">￥{{ itemData.price }}</span>
            <van-stepper
              v-model="itemCount"
              :max="itemData.stock"
              button-size="26px"
              @click.stop
            />
          </p>
          <p class="del">
            <span>删除</span>
          </p>
        </div>
      </div>
    </div>
  </template>
  <script setup>
import { computed } from '@vue/reactivity'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// 接收父组件的数据
const { itemData } = defineProps({
    itemData: {
        type: Object, 
        required: true
    }
})
// v-model分开获取值和设置值的操作
const store = useStore()
const itemChecked = computed({
    get: () => itemData.Checked,
    set: newChecked => {
        // vuex进行状态同步更新
        store.commit('cart/checkedChange', { checked: newChecked, id: itemData.id })
    }
})
// 商品的个数处理
const itemCount = computed(() => {
    get: () => itemData.count
    set: newCount => {
        // action进行处理的新数据
        store.dispatch('cart/countChange', { count: newCount, id: itemData.id })
    }
})

// 商品的点击跳转
const router = useRouter()
const handleRouter = () => {
    router.push({
        name: 'product',
        params: {
            productId: itemData.productId
        }
    })
}


</script>
<style lang="scss" scoped>

.cart-item {
    height: 90px;
    padding: 10px 20px;
    display: flex;
    background-color: #fff;
    margin-bottom: 1px;
    .link {
        width: 88px;
        display: flex;

        img {
            width: 88px;
            height: 88px;
            align-self: center;
        }
        .info {
            font-size: 14px;
            .title {
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                overflow: hidden;
                margin: 5px 0 15px;
            }
            .detail {
                margin-bottom: 10px;
                .price {
                    font-size: 16px;
                    color: #F2270C;
                }
                .van-stepper {
                    float: right;
                }
            }
            .del {
                direction: rtl;
            }
        }
    }
}
</style>
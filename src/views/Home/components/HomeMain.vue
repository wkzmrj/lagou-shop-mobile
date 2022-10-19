<template>
  <van-pull-refresh class="home-main" v-model="refreshing" @refresh="onRefresh">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="(item,index) in swipeData" :key="index">
        <img :src="item.img">
      </van-swipe-item>
    </van-swipe>
    <!-- 菜单 -->
    <van-grid icon-size="40">
      <van-grid-item v-for="(item,index) in menusData" :key="index" :icon="item.img" :text="item.info[0].value" />
    </van-grid>
    <!-- 公告 -->
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <span>热点资讯公告：</span>
      <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="(item,index) in newsData" :key="index" v-text="item.chiild[0].val" />
      </van-swipe>
    </van-notice-bar>
    <!-- 商品列表刷新 -->
    <van-list v-model:loading="state.loading" :finished="state.finished" finished-text="没有更多了" @load="initProductsData">
      <product-list :products-data="productsData"></product-list>
    </van-list>
  </van-pull-refresh>
</template>
<script setup>
import ProductList from '@/components/ProductList.vue'
import { ref, computed, reactive } from 'vue'
import { getDefaultData } from '@/api/index'
import { getProductsData } from '@/api/product'

// 响应式声明
const indexData = ref({})

// 首页数据初始化
const initIndexData = async () => {
  const { data } = await getDefaultData()
  if (data.status !== 200) {
    return
  }
  // 存所有首页数据
  indexData.value = data.data
  //   加载完成，完成下拉刷新
  refreshing.value = false
}
initIndexData()

// 计算属性保存需要使用的数据
// 1. 获取轮播图数据(可选链操作符，避免访问报错)
const swipeData = computed(() => indexData.value.swiperBg?.default.imgList.list)
const menusData = computed(() => indexData.value.menus?.default.imgList.list)
const newsData = computed(() => indexData.value.news?.default.newList.list)
// 第二次数据的响应式
const productsData = ref([])
const state = reactive({
  loading: false,
  finished: false
})

let page = 1
let limit = 4
// 请求每次新一段的数据，添加到productsData中
const initProductsData = async () => {
  const { data } = await getProductsData({
    limit,
    page
  })
  if (data.status !== 200) { return }
  productsData.value.push(...data.data)
  // 触底刷新,刷新的页面是否小于设置的数据数目，然后停止刷新
  state.loading = false
  if (data.data.length < limit) {
    state.finished = true
    return
  }
  //  下次数据请求
  page++
}
// initProductsData(),list组件自动加载后续数据；

// 下拉刷新状态的设置，与上state区分
const refreshing = ref(false)
const onRefresh = () => {
  indexData.value = {}
  productsData.value = []

  page = 1

  state.loading = false
  state.finished = false

  initIndexData()
  initProductsData()
}

</script>

<style lang="scss" scoped>
.home-main {
  .my-swipe img {
    width: 100%;
    height: 170px;
  }

  :deep(.van-notice-bar__content) {
    display: flex;
    align-items: center;
  }

  .notice-swipe {
    height: 40px;
    line-height: 40px;
  }
}
</style>
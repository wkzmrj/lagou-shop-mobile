<template>
    <van-nav-bar left-arrow fixed />
    <!-- 1.轮播图-商品上半部分 -->
    <van-tabs scrollspy color="#FBC546">
        <van-tab title="商品">
            <van-swipe :autoplay="3000" indicator-color="white" width="375" height="375">
                <van-swipe-item v-for="(item, index) in sliderImage" :key="index">
                    <img :src="item" alt="">
                </van-swipe-item>
            </van-swipe>
            <!-- 1.2 文字区域 -->
            <van-cell class="productHeader" :border="false">
                <template #title>
                    <!-- 商品价格 -->
                    <div class="price">
                        <span>¥{{ storeInfo?.price }}</span>
                    </div>
                    <!-- 分享按钮 -->
                    <van-icon name="share-o" size="20" class="share"></van-icon>
                    <div class="title" v-text="storeInfo?.store_name"></div>
                    <!-- 商品标题 -->
                </template>
                <template #label>
                    <span>原价: ¥{{ storeInfo?.ot_price }}</span>
                    <span>库存: {{ storeInfo?.stock + storeInfo?.unit_name }}</span>
                    <span>销量: {{ storeInfo?.fsales }}</span>
                </template>
            </van-cell>
            <!-- 1.3 规格SKU -->
            <van-cell class="sku_window" is-link @click="handlePopup">
                <template #title>
                    <span>已选择：{{ sku }}</span>
                </template>
                <van-popup v-model:show="specState.show" position="bottom" class="popup" round>
                    <van-cell-group>
                        <!-- 1 头部商品信息 -->
                        <van-cell class="popup-header">
                            <img :src="specDetail?.image" alt="">
                            <div class="info">
                                <p class="title" v-text="storeInfo?.store_name"></p>
                                <p class="price">￥{{ specDetail?.price }}</p>
                                <p class="stock">库存：{{ specDetail?.stock }}</p>
                            </div>
                        </van-cell>
                        <!-- 2 规格区域 -->
                        <van-cell class="spec" v-for="(attr,specIndex) in productAttr" :key="attr.id">
                            <p v-text="attr.attr_name"></p>
                            <!-- 规则选择标签 -->
                            <span class="tag" :class="{ active: specState.spec[specIndex] === tag }"
                                v-for="tag in attr.attr_values" :key="tag" v-text="tag"
                                @click="handleTagChange(tag, specIndex)"></span>
                        </van-cell>
                        <!-- 3 数量 -->
                        <van-cell title="数量">
                            <van-stepper v-model="specState.buyCount" :max="specDetail?.stock" />
                        </van-cell>
                    </van-cell-group>
                </van-popup>
            </van-cell>
        </van-tab>
        <van-tab title="评价" class="comment">
            <van-cell-group>
                <!-- 总体 -->
                <van-cell is-link :title="replyInfo" :value="replyRate" to="{
                    name: 'comment',
                    params: {
                        productId: storeInfo?.id
                    }
                }"></van-cell>
                <!-- 评价 -->
                <comment-item v-if="replyCount !== 0" :reply="reply" />
            </van-cell-group>
        </van-tab>
        <van-tab title="推荐">
            <van-cell class="recommend">
                <p class="title">推荐商品</p>
                <van-grid :border="false" :column-num="3">
                    <van-grid-item v-for="item in goodsList" :key="item.id" :to="{
                      name: 'product',
                      params: {
                          productId: item.id
                      }
                    }">
                        <van-image :src="item.image"></van-image>
                        <p v-text="item.store_name"></p>
                        <span>¥{{ item.price }}</span>
                    </van-grid-item>
                </van-grid>
            </van-cell>
        </van-tab>
        <van-tab title="详情">
            <div class="description" v-html="storeInfo?.description">
            </div>
        </van-tab>
        <!-- 加入购物车 -->
        <van-action-bar>
            <van-action-bar-icon icon="chat-o" text="客服" color="#ee0a24" />
            <van-action-bar-icon icon="cart-o" text="购物车" to="/cart" />
            <van-action-bar-icon icon="star" text="已收藏" color="#ff5000" />
            <van-action-bar-button type="warning" text="加入购物车" @click="handleCartAdd" />
            <van-action-bar-button type="danger" text="立即购买" />
        </van-action-bar>
    </van-tabs>
</template>
<script setup>
import CommentItem from '@/components/CommentItem.vue'
import { useRouter, onBeforeRouteUpdate } from 'vue-router'
// 请求商品数据
import { getProductDetails } from '@/api/product'
import { ref, computed, reactive } from '@vue/reactivity'
// 加入购物车数据
import { useStore } from 'vuex'
import { addToCart } from '@/api/cart'
import { Toast } from 'vant'

const store = useStore()
const router = useRouter()
const { productId } = defineProps({
    productId: {
        type: String,
        required: true
    }
})
// 存所有的商品详情的数据
const productDetails = ref({})
const initProductDetails = async (productId) => {
    const { data } = await getProductDetails(productId)
    if (data.status !== 200) {
        // 找不到商品内部跳转
        return router.push({
            name: 'home'
        })
    }
    productDetails.value = data.data
    // 初始化默认规格数据的存储
    initSpec(data.data.productAttr)
}
initProductDetails(productId)


//商品详情详细数据
const storeInfo = computed(() => productDetails.value?.storeInfo)
const sliderImage = computed(() => storeInfo.value?.slider_image)
// 评价信息
const replyCount = computed(() => productDetails.value.replyCount || 0)
const replyInfo = computed(() => `用户评价（${replyCount.value})`)
// 好评率
const replyChance = computed(() => productDetails.value.replyChance || 0)
const replyRate = computed(() => replyChance.value + '%好评率')
// 好评内容
const reply = computed(() => productDetails.value.reply)
// 推荐商品
const goodsList = computed(() => productDetails.value.good_list)
// 获取新的路由的商品详细详情页数据
onBeforeRouteUpdate((to) => {
    // 清空数据，回到顶部
    productDetails.value = {}
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
    // 跳转新的数据页面
    initProductDetails(to.params.productId)
})

// 商品弹出规格设置
const productAttr = computed(() => productDetails.value.productAttr)
const productValue = computed(() => productDetails.value.productValue)
// sku数据处理
const sku = computed(() => specState.spec.toString())
// 对应信息
const specDetail = computed(() => productValue.value?.[sku.value])

const specState = reactive({
    show: false,
    spec: [],
    buyCount: 0
})

const handlePopup = () => {
    specState.show = !specState.show
}
// 初始化规格的默认数据
const initSpec = (spec) => {
    specState.spec = spec.map(item => item.attr_values[0])
}

const handleTagChange = (tag, specIndex) => {
    specState.spec[specIndex] = tag
}

// 购物车添加处理
const handleCartAdd = async () => {
    const { data } = await addToCart({
        new: 0,
        productId, 
        uniqueId: specDetail.value.unique,
        carNum: specState.buyCount
    })
    if (data.status !== 200) { return }
    specState.show = false
    Toast('加入购物车成功')
}
</script>

<style lang="scss" scoped>
.van-tabs {
    background-color: #f2f2f2;

    :deep(.van-tabs__wrap) {
        position: fixed;
        top: 0;
        z-index: 999;
        left: 50%;
        transform: translateX(-50%);
    }

    :deep(.van-tabs__content) {
        padding: 46px;
    }

    .van-swipe-item img {
        width: 375px;
    }

    :deep(.productHeader) {
        margin-bottom: 10px;

        .van-cell__title {
            .price {
                span {
                    font-size: 24px;
                    font-weight: 700;
                }
            }

            .share {
                float: right;
            }

            .title {
                font-size: 16px;
                font-weight: 700;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
                margin: 5px 0 10px;
            }
        }

        .van-cell__label {
            display: flex;
            justify-content: space-between;
        }

        .sku_window {
            margin-bottom: 10px;
        }
    }

    :deep(.recommend) {
        margin-bottom: 10px;

        .title {
            font-size: 16px;
            font-weight: 700;
            padding: 5px 0;
        }

        .van-grid-item__content {
            padding: 0;
        }

        .van-grid-item {
            img {
                width: 90px;
                height: 90px;
            }

            p {
                padding: 1px 3px;
                font-size: 12px;
                font-weight: 700;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 2;
            }

            span {
                color: #F2270C;
                font-size: 12px;
                font-weight: 700;
                align-self: flex-start;
            }
        }
    }

    .description {
        width: 100%;

        :deep(img) {
            width: 100%;
        }
    }

    :deep(.van-popup) {
        border-radius: 10px 10px 0 0;
        max-height: 70%;
        margin-bottom: 50px;

        .popup-header {
            height: 30%;

            .van-cell__value {
                display: flex;

                img {
                    width: 75px;
                    height: 75px;
                    align-self: center;
                }

                .info {
                    padding: 10px;

                    .title {
                        font-size: 16px;
                        font-weight: 700;
                        display: -webkit-box;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        -webkit-line-clamp: 1;
                        margin-bottom: 10px;
                    }

                    .price {
                        font-size: 16px;
                        color: #F2270C;
                    }

                    .stock {
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }

        .spec {
            p {
                margin-bottom: 5px;
            }

            .tag {
                display: inline-block;
                min-width: 25px;
                padding: 0 12px;
                border: 1px solid #ccc;
                border-radius: 10px;
                text-align: center;
                background-color: #f2f2f2;
                margin-right: 7px;
            }

            .tag .active {
                border-color: #F2270C;
                color: #F2270C;
                background-color: #FCEDEB;
            }
        }
    }
}

.van-nav-bar {
    position: fixed ! important;
}
</style>


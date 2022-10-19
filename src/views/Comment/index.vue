<template>
    <van-cell-group class="comment">
        <!-- nav总体bar -->
        <van-cell title="商品评价" :value="`好评率:${ state?.replyChance }%`"></van-cell>
        <!-- 标签切换 -->
        <van-cell class="tags">
            <van-button size="small" :class="{ active: state.isSum }" @click="tagHandle('0')">
                全部{{ state.sumCount }}
            </van-button>
            <van-button size="small" :class="{ active: state.isGood }" @click="tagHandle('1')">
                好评{{ state.goodCount }}
            </van-button>
            <van-button size="small" :class="{ active: state.isIn }" @click="tagHandle('2')">
                中评{{ state.inCount }}
            </van-button>
            <van-button size="small" :class="{ active: state.isPoor }" @click="tagHandle('3')">
                差评{{ state.poorCount }}
            </van-button>
        </van-cell>
        <!-- 评价列表 -->
        <div v-if="state.hasComment">
            <comment-item v-for="reply in state.commentList" :key="reply.id" :reply="reply"></comment-item>
        </div>
        <!-- 12.没有数据，展示空的结构 -->
        <van-empty v-else
        description="暂时无评价哦～"></van-empty>
    </van-cell-group>
</template>
<script setup>
// 接口引入
import { getCommentCount, getCommentByTag } from '@/api/product'
import { computed, reactive } from '@vue/reactivity'
import CommentItem from '@/components/CommentItem.vue'

const { productId } = defineProps({
    productId: {
        type: String,
        required: true
    }
})
// 2. 声明存储评论数据
const state = reactive({
    commentCounts: {},
    goodCount: computed(() => state.commentCounts?.good_count || 0),
    poorCount: computed(() => state.commentCounts?.poor_count || 0),
    inCount: computed(() => state.commentCounts?.in_count || 0),
    sumCount: computed(() => state.commentCounts?.sum_count || 0),
    replyChance: computed(() => state.commentCounts?.reply_chance || 100),
    // 5.存所有评价信息
    commentList: [],
    // 7. 控制显示评论的状态
    active: '0',
    // 8. 计算状态不同的判断
    isSum: computed(() => state.active === '0'),
    isGood: computed(() => state.active === '1'),
    isIn: computed(() => state.active === '1'),
    isPoor: computed(() => state.active === '3'),
    // 11. 判断是否有评论数据
    hasComment: computed(() => state.commentList.length || 0)
})
// 1. 请求商品的个数信息
async function initReplyData() {
    const { data } = await getCommentCount(productId)
    if (data.status !== 200) {
        return
    }
    // 3. 存储信息到vue
    state.commentCounts = data.data
}
initReplyData()

// 4. 请求指定类型的评论内容
async function initCommentByTag(type) {
    const { data } = await getCommentByTag(productId, { type })
    if (data.status !== 200) {
        return
    }
    state.commentList = data.data
}
initCommentByTag('0')

// 9.点击事件函数
function tagHandle(tagKey) {
    state.active = tagKey
    // 10.发送新的状态数据
    initCommentByTag(tagKey)
}
</script>
<style lang="scss" scoped>
// 6. 评价标签布局
.tags {
    .van-button {
        border-radius: 15px;
        margin-right: 10px;
    }

    .active {
        background-color: #FDC546;
    }
}
</style>
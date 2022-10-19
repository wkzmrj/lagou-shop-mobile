import { changeCartItemNum } from '@/api/cart'

const state = {
    cartList: []
}
const getters = {
    // 类似computed功能，筛选选中的选项
    checkedItems: state => {
        return state.cartList.filter(item => item.checked === true)
    },
    // 选中的价格计算
    totalPrice(state, getters) {
        // 所有选中价格的累加统计
        return getters.checkedItems.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2)
    },
    // 全选的状态
    checkedAll(state, getters) {
        return state.cartList.length === getters.checkedItems.length
    }
}
const mutations = {
    // 购物车功能：
    // 添加商品
    addToCart(state, payload) {
        // payload数据信息应该都包含
        state.cartList.push(payload)
    },
    // 清除数据
    clear(state) {
        state.cartList = []
    },
    // 商品状态更改
    checkedChange(state, { id, checked }) {
        // 找到指定的数据修改
        const currentItem = state.cartList.find(item => item.id === id)
        currentItem.checked = checked
    },
    countChange(state, { id, count }) {
        state.cartList.find(item => item.id === id).count = count
    },
    // 全选的状态,主动操作
    changeAll(state, { checked }) {
        state.cartList.forEach(item => item.checked = checked)
    }
}
const actions = {
    async countChange({ commit }, payload) {
        // 提交更改数据的异步操作
        commit('countChange', payload)
        //发送请求
        const { data } = await changeCartItemNum({
            id: payload.id,
            number: payload.count
        })
        if (data.status !== 200) { return }
    }
}


export default {
    state,
    getters,
    mutations,
    actions

}
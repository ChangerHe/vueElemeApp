<template>
  <div id="app">
    <header-com :seller="seller"></header-com>
    <div class="tab border-1px">
      <div class="tab-item">
        <a href="" v-link="{path: '/goods'}">商品</a>
      </div>
      <div class="tab-item">
        <a href="" v-link="{path: '/ratings'}">评论</a>
      </div>
      <div class="tab-item">
        <a href="" v-link="{path: '/seller'}">商家</a>
      </div>
    </div>
    <router-view  :seller="seller"></router-view>
  </div>
</template>

<script>
import HeaderCom from './components/header/header.vue'

// 错误编号, 为0 代表无错误
const ERR_OK = 0

export default {
  data() {
    return {
      seller: {}
    }
  },
  created() {
    this.$http.get('/api/seller').then((res, err) => {
      // vue自动为json对象添加了get和set方法, 用于为对应的json对象监听其变化, 将变化实时转发到页面上
      res = res.body
      if (res.errno === ERR_OK) {
        this.seller = res.data
      }
    })
  },
  components: {
    HeaderCom
  }
}
</script>


<style lang="stylus" rel="stylesheet/stylus">
/* 可通过@import引入外部的样式表文件
  但是为什么会是当前目录的common目录? 不用加src这个目录先吗? 不得而知
 */
@import './common/stylus/mixin'
/* 注: & 表示父元素, 父元素 > 子元素相当于子代选择器, 可以避免后代再继承此属性 */
#app
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>

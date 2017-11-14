<template>
  <div class="cartcontrol">
    <div class="cart-decrease " v-show="food.count > 0" @click="decreaseCart" transition="move">
      <span class="inner iconfont icon-decreaseCircle"></span>
    </div>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add iconfont icon-addCircle" @click="addCart"></div>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    food: {
      type: Object
    }
  },
  created() {
    // console.log(this.food)
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return
      }
      if (!this.food.count) {
        // this.food.count = 1
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      // 派发cart.add事件, 将事件的对象作为参数传入
      this.$dispatch('cart.add', event.target)
      event.stopPropagation()
    },
    decreaseCart(event) {
      if (!event._constructed) {
        return
      }
      if (this.food.count) {
        this.food.count--
      }
      // 因为点击会出现弹出详情页的情况,所以这里要阻止事件冒泡
      event.stopPropagation()
    }
  }
}
</script>

<style lang="stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px
      transition: all 0.4s linear
      &.move-transition
        opacity 1
        transform translate3d(0, 0, 0)
        .inner
          display inline-block
          line-height 24px
          font-size 24px
          color rgb(0, 160, 220)
          transform rotate(0)
          transition: all 0.4s linear
      &.move-enter, &.move-leave
        opacity 0
        transform translate3d(24px, 0, 0)
        .inner
          transform rotate(180deg)

    .cart-count
      display inline-block
      vertical-align top
      width 12px
      padding-top 6px
      line-height 24px
      text-align center
      color rgb(147, 153, 159)
      font-size 10px

    .cart-add
      display inline-block
      padding 6px
      line-height 24px
      font-size 24px
      color rgb(0, 160, 220)
</style>

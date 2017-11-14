<template>
  <div class="shopCart">
    <div class="content">
      <div class="content-left"  @click="toggleList">
        <div class="logo-wrapper">
          <div class="logo" :class="{'highlight': totalCount > 0}">
            <span class="iconfont icon-shopCart"  :class="{'highlight': totalCount > 0}"></span>
          </div>
          <div class="num" v-show=" totalCount">
            {{totalCount}}
          </div>
        </div>
        <div class="price" :class="{'highlight': totalCount > 0}">&yen; {{totalPrice}}</div>
        <div class="desc">另需配送费 &yen; {{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <div class="ball-container">
      <div transition="drop" class="ball" v-for="(index,ball) in balls" v-show="ball.show" :key="index">
        <div class="inner inner-hook"></div>
      </div>
    </div>
    <div class="shopcart-list" transition="fold" v-show="listShow">
      <div class="list-header">
        <h1 class="title">购物车</h1>
        <span class="empty" @click="emptyItem">清空</span>
      </div>
      <div class="list-content" v-el:list-content>
        <ul>
          <li class="food" v-for="(index, food) in selectFoods" :key="index">
            <span class="name">{{food.name}}</span>
            <div class="price">
              <span>&yen; {{food.price * food.count}}</span>
            </div>
            <div class="cartcontrol-wrapper">
              <cart-control :food="food"></cart-control>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import BScroll from 'better-scroll'
import cartControl from 'components/cartcontrol/cartcontrol'

export default {
  props: {
    // 使用selectFoods实现父向子传参
    selectFoods: {
      type: Array,
      default() {
        return [{
          price: 10,
          count: 2
        }]
      }
    },
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 每个小球的当前状态, 一般来说, 每个页面最多会显示五个位置的五个小球
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBall: [],
      fold: true
    }
  },
  computed: {
    // 计算商品的总价格
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food, index) => {
        total += food.price * food.count
      })
      return total
    },
    // 计算商品的总数量
    totalCount() {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    // 不同状态下的支付状态文字
    payDesc() {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差¥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    // 支付状态class计算效果
    // 当总价小于最小配送价, 则返回class为not-enough
    // 当总价大于最小配送价, 则返回class为enough
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    },
    // 当总价为零的时候.令fold为true,否则零show为false
    listShow() {
      if (!this.totalCount) {
        this.fold = true
        return false
      }
      let show = !this.fold
      if (show) {
        this.$nextTick(() => {
          //
          if (!this.scroll) {
            this.scroll = new BScroll(this.$els.listContent, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      }
      return show
    }
  },
  methods: {
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]

        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBall.push(ball)
          console.log(this.dropBall)
          return
        }
      }
    },
    // 切换下方的购物车列表的显示隐藏
    toggleList() {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    // 清空列表
    emptyItem() {
      this.selectFoods = []
      this.$dispatch('empty.item')
    }
  },
  transitions: {
    // 加入购物车时小球的动画效果
    drop: {
      beforeEnter(el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            // 获取元素的相对视窗的位置集合
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
            el.style.transform = `translate3d(0, ${y}px, 0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px, 0, 0)`
          }
        }
      },
      enter(el) {
        /* 此处主动触发一次浏览器重绘 */
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0, 0, 0)'
          el.style.transform = 'translate3d(0, 0, 0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0, 0, 0)'
          inner.style.transform = 'translate3d(0, 0, 0)'
        })
      },
      afterEnter(el) {
        let ball = this.dropBall.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      }
    }
  },
  components: {
    cartControl
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin'

  .shopCart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          position relative
          top -14px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          vertical-align top
          border-radius 50%
          background #141d27
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 400
            color #fff
            background red
            box-shadow 0 4px 8px 0 rgba(0,0,0,.4)
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.highlight
              background rgb(0, 160, 220)
            .icon-shopCart
              font-size 24px
              line-height 44px
              text-align center
              color #80858a
              &.highlight
                color #fff
        .price
          display inline-block
          vertical-align top
          line-height 24px
          margin-top 12px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,.1)
          font-size 16px
          font-weight 700
          color rgba(255,255,255,.4)
          &.highlight
            color #fff

        .desc
          display inline-block
          vertical-align top
          margin 12px 0 0 12px
          line-height 24px
          color rgba(255,255,255,.4)
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          height 48px
          font-size 14px
          line-height 48px
          text-align center
          color rgba(255,255,255,.4)
          font-weight 700
          background #2b333b
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
    .ball-container
      .ball
        position fixed
        left 32px
        bottom 22px
        z-index 200
        &.drop-transition
          transition all .4s cubic-bezier(.29,-0.15,.86,.74)
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0, 160, 220)
            transition all .4s linear
    .shopcart-list
      position absolute
      left 0
      top 0
      z-index -1
      width 100%
      &.fold-transition
        transition all .5s
        transform translateY(-100%)
      &.fold-enter, &.fold-leave
        transform: translateY(0)
      .list-header
        height 40px
        line-height 40px
        padding 0 18px
        background #f3f5f7
        border-bottom 1px solid rgba(7, 17, 27, 0.1)
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right
          font-size 12px
          color rgb(0, 160, 221)

      .list-content
        padding 0 18px
        max-height 117px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px(rgba(7,17,27,.1))
        .price
          position absolute
          right 90px
          bottom 12px
          line-height 24px
          font-size 14px
          font-weight 700
          color rgb(240, 20, 20)
        .cartcontrol-wrapper
          position absolute
          right 0
          bottom 6px
</style>

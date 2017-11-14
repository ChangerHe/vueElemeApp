<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper>
      <ul>
        <li v-for="(index,item) in goods" class="menu-item"  :key="index"  :class="{'current': currentIndex === $index}" @click="selectMenu($index, $event)">
          <span class="text border-1px">
            <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="(index,item) in goods" :key="index"   class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(index,food) in item.foods" :key="index" @click="selectFood(food, $event)"  class="food-item border-1px">
              <div class="icon">
                <img :src="food.icon" width="57" height="57" alt="">
              </div >
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">&yen;{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shop-cart :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods" v-ref:shopcart></shop-cart>
  </div>
  <food-com :food="selectedFood" v-ref:food></food-com>
</template>

<script>
import BScroll from 'better-scroll'
import shopCart from 'components/shopCart/shopCart'
import cartControl from 'components/cartcontrol/cartcontrol'
import foodCom from 'components/food/food'

const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: {},
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    this.$http.get('/api/goods').then((res) => {
      res = res.body
      if (res.errno === ERR_OK) {
        this.goods = res.data
        this.$nextTick(() => {
          this._initScroll()
          this._calculateHeight()
        })
      }
    })
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i
        }
      }
      return 0
    },
    selectFoods() {
      let foods = []
      if (JSON.stringify(this.goods) === '{}') {
        return foods
      }
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    selectMenu(index, event) {
      // 预先进行判断, 用户产生的事件时为true, 默认事件为false
      if (!event._constructed) {
        return
      }

      let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook')
      let el = foodList[index]

      // 待处理BUG, 必须等待左侧界面停稳才可点击
      this.foodsScroll.scrollToElement(el, 300)
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$els.menuWrapper, {
        click: true
      })

      this.foodsScroll = new BScroll(this.$els.foodsWrapper, {
        click: true,
        probeType: 3
      })

      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y))
      })
    },
    _calculateHeight() {
      let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    // 子组件通过$.dispatch来进行事件的派发, 父组件通过挂载v-ref, 然后通过父组件上挂载的方法函数使用 this.$refs.shopcart.xxx来调用子组件上对应的xxx方法了
    _drop (target) {
      // 当两个动画执行时会出现轻微的卡顿, 所以为了体验优化, 将异步执行转为同步执行
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target)
      })
    },
    selectFood(food, event) {
      if (!event._constructed) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    }
  },
  components: {
    shopCart,
    cartControl,
    foodCom
  },
  events: {
    'cart.add'(target) {
      this._drop(target)
    },
    // 从子组件dispatch过来的事件处理尚有问题, 稍后处理
    'empty.item'() {
      console.log(1)
      this.goods.foods = {}
    }
  }
}
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin'


  .goods
    display flex
    position absolute
    top 174px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      // width为安卓设备下的兼容
      width 80px
      background #f3f5f7

      .menu-item
        display table
        height 54px
        width 56px
        padding 0 12px
        line-height 14px
        border-1px(rgba(7, 17, 27, .1))
        &.current
          margin-top -1px
          background #ffffff
          font-weight 700
          .text
            border-none()

        .icon
          display inline-block
          vertical-align middle
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image("decrease_3")
          &.discount
            bg-image("discount_3")
          &.invoice
            bg-image("invoice_3")
          &.special
            bg-image("special_3")
          &.guarantee
            bg-image("guarantee_3")
        .text
          display table-cell
          width 56px
          vertical-align middle
          font-size 12px

    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, .1))
        &.last-child
          border-none()
          margin-bottom 0
        .icon
          flex 0 0 57px
          margin-right 10px
        .content
          flex 1
          .name
            margin 2px 0 8px 0
            height 14px
            line-height 14px
            font-size 14px
            color rgb(7, 17, 17)
          .desc, .extra
            font-size 10px
            line-height 10px
            color rgb(147, 153, 159)
          .extra
            line-height 10px
            .count
              margin-right 12px
          .desc
            line-height 12px
            margin-bottom 8px
          .price
            font-weight 700
            line-height 24px
            .now
              margin-right 8px
              font-size 14px
              color rgb(240, 20, 20)
            .old
              text-decoration line-through
              font-size 10px
              color rgb(147, 153, 159)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 12px

</style>


<template>
  <div v-el:food-wrapper class="food" v-show="showFlag" transition="move">
    <div class="food-content"  >
      <div class="image-header">
        <img :src="food.image" alt="">
        <div class="back" @click="hide">
          <i class="iconfont icon-leftArrow"></i>
        </div>
      </div>
      <div class="content">
        <h1 class="title">{{food.name}}</h1>
        <div class="detail">
          <span class="sell-count">月售{{food.sellCount}}份</span>
          <span class="rating">好评率{{food.rating}}%</span>
        </div>
        <div class="price">
          <span class="now">&yen;{{food.price}}</span>
          <span class="old" v-show="food.oldPrice">&yen;{{food.oldPrice}}</span>
        </div>
        <div class="cartcontrol-wrapper">
          <cart-control :food="food"></cart-control>
        </div>
        <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0" transition="fade">加入购物车</div>
      </div>

      <split-com v-show="food.info"></split-com>
      <div class="info" v-show="food.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{food.info}}</p>
      </div>
      <split-com></split-com>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <rating-select  v-show="food.ratings && food.ratings.length" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></rating-select>
        <div class="rating-wrapper">
          <ul v-show="food.ratings && food.ratings.length">
            <li class="rating-item" v-show="needShow(rating.rateType, rating.text)" v-for="(index,rating) in food.ratings" :key="index">
              <div class="user">
                <span class="name">{{rating.username}}</span>
                <img :src="rating.avatar" width="12" height="12" alt="" class="avatar">
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <p class="text">
                <span :class="{'iconfont icon-thumbUp': rating.rateType === 0, 'iconfont icon-thumbDown': rating.rateType === 1}"></span>{{rating.text}}
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import BScroll from 'better-scroll'
import cartControl from 'components/cartcontrol/cartcontrol'
import Vue from 'vue'
import splitCom from 'components/split/split'
import ratingSelect from 'components/ratingSelect/ratingSelect'
// 带花括号,代表export这个对应的function
import {formatDate} from 'common/js/date'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    show() {
      this.selectType = ALL
      this.onlyContent = true
      this.showFlag = true
      // 只有完全渲染的时候, 整个高度才能被完全计算
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$els.foodWrapper, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    hide() {
      this.showFlag = false
    },
    addFirst(event) {
      if (!event._constructed) {
        return
      }
      this.$dispatch('cart.add', event.target)
      Vue.set(this.food, 'count', 1)
      // this.food.count = 1
    },
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) {
        return true
      } else {
        return type === this.selectType
      }
    }
  },
  events: {
    'ratingtype.select'(type) {
      this.selectType = type
      // 避免更新之后下方多的评论不显示的问题, 需要将better-scroll的scroll高度异步更新
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    },
    'content.toggle'(onlyContent) {
      this.onlyContent = onlyContent
      this.$nextTick(() => {
        this.scroll.refresh()
      })
    }
  },
  filters: {
    // 将传入的时间过滤为对应的格式
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    cartControl,
    splitCom,
    ratingSelect
  }
}
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin'

  .food
    position fixed
    bottom 48px
    left 0
    top 0
    z-index 30
    width 100%
    background #fff
    &.move-transition
      transition all .2s linear
      transform translate3d(0, 0, 0)
    &.move-enter, &.move-leave
      transform translate3d(100%, 0, 0)
    .food-content
      .image-header
        background #000
        position relative
        width 100%
        height 0
        padding-top 100%
        img
          position absolute
          top 0
          left 0
          width 100%
          height 100%
        .back
          position absolute
          top 10px
          left 0
          .icon-leftArrow
            display block
            padding 10px
            font-size 20px
            color #fff

      .content
        position relative
        padding 18px
        .title
          line-height 14px
          margin-bottom 8px
          font-size 14px
          font-weight 700
          color rgb(7, 17, 27)
        .detail
          margin-bottom 18px
          line-height 10px
          font-size 0
          height 10px
          .sell-count, .rating
            font-size 10px
            color rgb(147, 153, 159)
          .sell-count
            margin-right 12px
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
          right 12px
          bottom 12px
        .buy
          position absolute
          right 18px
          bottom 18px
          z-index 10px
          height 24px
          line-height 24px
          padding 0 12px
          box-sizing border-box
          font-size 10px
          border-radius 12px
          color #fff
          background rgb(0, 160, 220)
          &.fade-transition
            transition all .2s
            opacity 1
          &.fade-enter, &.fade-leave
            opacity 0
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77, 85, 93)
        margin-top 14px
    .rating
      padding-top 18px
      .title
        padding-left 18px
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7, 17, 27)
      .rating-wrapper
        position relative
        padding 0 18px
        border-1px(rgba(7, 17, 27, .1))
        .rating-item
          .user
            position absolute
            right 18px
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147, 153, 159)
            .avatar
              border-radius 50%
          .time
            margin 16px 0 6px 0
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7, 17, 27)
            .icon-thumbDown, .icon-thumbUp
              margin-right 4px
              line-height 24px
              font-size 12px
            .icon-thumbUp
              color rgb(0, 160, 220)
            .icon-thumbDown
              color rgb(147, 153, 159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147, 153, 159)


</style>

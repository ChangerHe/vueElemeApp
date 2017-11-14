<template>
  <div class="seller" v-el="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc">
          <star-com :size="36" :score="seller.score"></star-com>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>

        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="countent">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="countent">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="countent">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
      </div>
      <split-com></split-com>
      <div class="active">
        <h1>公告与活动</h1>
        <p>{{seller.bulletin}}</p>
        <ul>
          <li v-for="(index,support) in seller.supports" :key="index" class="support">
            <span class="pic" :class="classMap[support.type]"></span>
            <span class="text">{{support.description}}</span>
          </li>
        </ul>
      </div>

      <split-com></split-com>
      <div class="true-pic">
        <h1>商家实景</h1>
        <ul class="sellerpic-wrapper">
          <li v-for="(index,pic) in seller.pics" :key="index">
            <img :src="pic" alt="" class="seller-img">
          </li>
        </ul>
      </div>
      <split-com></split-com>
      <div class="seller-msg">
        <h1>商家信息</h1>
        <ul>
          <li v-for="(index, info) in seller.infos" :key="index" class="info">
            {{info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import starCom from 'components/star/star'
import splitCom from 'components/split/split'
import BScroll from 'better-scroll'

export default {
  props: {
    seller: {
      type: Object,
      default: {}
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  watch: {
    'seller'() {
      this._initScroll()
    }
  },
  ready() {
    // this._initScroll()
  },
  methods: {
    _initScroll() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$els.seller, {
          click: true
        })
      } else {
        this.scroll.refresh()
      }
    }
  },
  components: {
    starCom,
    splitCom
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/mixin'

  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7, 17, 27)
        font-size 14px
      .desc
        padding-bottom 10px
        line-height 18px
        font-size 0
        border-1px(rgba(7, 17, 27, .1))
        .star
          display inline-block
          margin-right 8px
          vertical-align top
          .star-item
            margin-right 4px
        .text
          margin-right 12px
          display inline-block
          vertical-align top
          font-size 10px
      .remark
        display flex
        margin-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7, 17, 27, .1)
          &:last-child {
            border-right 0
          }
          h2
            font-size 10px
            line-height 10px
            color rgb(147, 153, 159)
          .countent
            font-size 16px
            line-height 24px
            font-weight 200
            color rgb(7, 17, 27)
    .active
      padding 18px 18px 0
      h1
        margin-bottom 8px
        line-height 14px
        color rgb(7, 17, 27)
        font-size 14px
      p
        padding 0 12px
        font-size 12px
        font-weight 200
        line-height 24px
        color rgb(240, 20, 20)
        text-align justify
      ul
        margin-top 16px
        .support
          border-1px-top(rgba(7, 17, 27, .1))
          padding 0 12px
          .pic
            display inline-block
            width 16px
            height 16px
            margin 16px 6px 16px 12px
            font-size 0px
            vertical-align top
            &.decrease
              bg-image("decrease_3")
              background-size cover
            &.discount
              bg-image("discount_3")
              background-size cover
            &.invoice
              bg-image("invoice_3")
              background-size cover
            &.special
              bg-image("special_3")
              background-size cover
            &.guarantee
              bg-image("guarantee_3")
              background-size cover
          .text
            display inline-block
            font-size 12px
            font-weight 200
            line-height 48px
    .true-pic
      padding 18px 18px 0
      h1
        margin-bottom 8px
        line-height 14px
        color rgb(7, 17, 27)
        font-size 14px
      .sellerpic-wrapper
        display flex
        flex-direction row
        li
          .seller-img
            width 120px
            height 90px
            vertical-align middle
            margin 6px 6px 18px 0
    .seller-msg
      padding 18px 18px 0
      h1
        margin-bottom 8px
        line-height 14px
        color rgb(7, 17, 27)
        font-size 14px
      ul
        margin-top 8px
        .info
          border-1px-top(rgba(7, 17, 27, .1))
          padding 16px 12px
          font-size 12px
          font-weight 200
          color rgb(7, 17, 27)
          line-height 16px

</style>

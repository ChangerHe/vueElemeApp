<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height: "64" alt="">
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <!-- 此时需要加上条件判断,不加的话会因为异步请求而报错 -->
        <div v-if="seller.supports" class="support">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" @click="showDetail" v-if="seller.supports">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="iconfont icon-rightArrow"></i>
      </div>
    </div>
    <div class="bulletin-wrapper" @click="showDetail">
        <span class="bulletin-title"></span>
        <span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="iconfont icon-rightArrow"></i>
    </div>
    <div class="background">
      <img :src="seller.avatar" alt="" width="100%" height="100%">
    </div>
    <div class="detail" v-show="detailShow" transition="fade">
      <div class="detail-wrapper clearfix">
        <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
        </div>
        <div class="star-wrapper">
          <star-com :size="48" :score="4.2"></star-com>
        </div>
        <div class="title">
          <div class="line"></div>
          <div class="text">用户信息</div>
          <div class="line"></div>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="(index,item) in seller.supports" :key="index" >
            <span class="icon" :class="classMap[seller.supports[$index].type]"></span>
            <span class="text">{{seller.supports[$index].description}}</span>
          </li>
        </ul>

        <div class="title">
          <div class="line"></div>
          <div class="text">商家公告</div>
          <div class="line"></div>
        </div>
        <div class="bulletin">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
      <div class="detail-close" @click="hideDetail">
        <i class="iconfont icon-close"></i>
      </div>
    </div>
  </div>
</template>

<script>
import starCom from 'components/star/star'

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      detailShow: false
    }
  },
  methods: {
    showDetail() {
      this.detailShow = true
    },
    hideDetail() {
      this.detailShow = false
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  components: {
    starCom
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

  @import "../../common/stylus/mixin"

  .header
    position relative
    overflow hidden
    color: #fff
    background: rgba(7,17,27,.5)
    .content-wrapper
      position relative
      padding: 24px 12px 18px 24px
      .avatar
        display: inline-block
        vertical-align top
        img
          border-radius 2px
      .content
        display inline-block
        font-size 14px
        margin-left 16px
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            display inline-block
            margin-left 6px
            vertical-align top
            font-size 18px
            line-height 18px
            font-weight bold
        .description
          margin-bottom 10px
          line-height 12px
        .support
          .icon
            display inline-block
            vertical-align middle
            width 12px
            height 12px
            margin-right 4px
            background-size 12px 12px
            background-repeat no-repeat
            &.decrease
              bg-image("decrease_1")
            &.discount
              bg-image("discount_1")
            &.invoice
              bg-image("invoice_1")
            &.special
              bg-image("special_1")
            &.guarantee
              bg-image("guarantee_1")
          .text
            line-height 12px
            font-size 12px


      .support-count
        position absolute
        right 12px
        top 70px
        padding-right 4px
        height 24px
        line-height 24px
        border-radius 14px
        background rgba(0,0,0,.2)
        text-align center
        .count
          vertical-align middle
          margin-left 10px
          font-size 10px
        .icon-rightArrow
          font-size 14px

    .bulletin-wrapper
      position relative
      height 28px
      line-height 28px
      padding 0 22px 0 12px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background-color rgba(7, 17, 27, .2)
      .bulletin-title
        display inline-block
        width 22px
        height 12px
        margin-top 8px
        vertical-align top
        bg-image('bulletin')
        background-size 22px 12px
        background-repeat no-repeat
      .bulletin-text
        vertical-align top
        font-size 12px
      .icon-rightArrow
        position absolute
        font-size 10px
        right 12px
        top 0
    .background
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      z-index -1
      filter blur(10px)
    .detail
      position fixed
      top 0
      left 0
      z-index 100
      width 100%
      height 100%
      overflow auto
      background rgba(7, 17, 27, .9)
      backdrop-filter blur(10px)
      transition all .5s
      &.fade-&.fade-transition
        opacity 1
        background rgba(7, 17, 27, .8)
      &.fade-enter, &.fade-leave
        opacity 0
        background rgba(7, 17, 27, 0)
      .detail-wrapper
        min-height 100%
        width 100%
        .detail-main
          padding-top 32px
          padding-bottom 16px
          .name
            line-height 16px
            font-size 16px
            font-weight 700
            text-align center
      .detail-close
        position relative
        width 32px
        height 32px
        margin -64px auto 0
        // clear both
        font-size 32px
        text-align center
      .star-wrapper
        margin-top 18px
        padding 2px 0
        text-align center
      .title
        display flex
        width 80%
        margin 30px auto 24px
        .line
          flex 1
          position relative
          top -6px
          border-bottom 1px solid rgba(255,255,255,.2)
        .text
          padding 0 12px
          font-weight 700
          font-size 14px
      .supports
        width 80%
        margin 0 auto
        .support-item
          padding 0 12px
          margin-bottom 12px
          font-size 0
          &.last-child
            margin-bottom 0
          .icon
            display inline-block
            width 16px
            height 16px
            vertical-align top
            margin-right 6px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
              bg-image("decrease_2")
            &.discount
              bg-image("discount_2")
            &.invoice
              bg-image("invoice_2")
            &.special
              bg-image("special_2")
            &.guarantee
              bg-image("guarantee_2")
          .text
            display inline-block
            line-height 16px
            font-size 12px
      .bulletin
        width 80%
        margin 0 auto
        .content
          padding 0 12px
          line-height 24px
          font-size 12px
</style>

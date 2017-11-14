<template>
  <div class="ratings" v-el:ratings>
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star-com :size="36" :score="seller.serviceScore"></star-com>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star-com :size="36" :score="seller.foodScore"></star-com>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split-com></split-com>
      <rating-select  v-show="ratings && ratings.length" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings"></rating-select>
      <div class="rating-wrapper">
        <ul>
          <li v-for="(index,rating) in ratings" v-show="needShow(rating.rateType, rating.text)" class="item rating-item" :key="index">
            <div class="avatar">
              <img :src="rating.avatar" alt="" width="28" height="28" >
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star-com :size="24" :score="rating.score"></star-com>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div v-show="rating.recommend && rating.recommend.length" class="recommend">
                <i class="iconfont icon-thumbUp"></i>
                <span v-for="(index,item) in rating.recommend" :key="index" class="item" v-text="item"></span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import starCom from 'components/star/star'
import splitCom from 'components/split/split'
import ratingSelect from 'components/ratingSelect/ratingSelect'
import {formatDate} from '../../common/js/date'
import BScroll from 'better-scroll'
import shopCart from 'components/shopCart/shopCart'

// const POSITIVE = 0
// const NEGATIVE = 1
const ALL = 2
const ERR_OK = 0

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      // showFlag,
      ratings: [],
      selectType: ALL,
      onlyContent: true
    }
  },
  methods: {
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
  created() {
    // 发起ajax请求到ratings的数据,并赋值给data中的ratings
    this.$http.get('/api/ratings').then((res) => {
      let response = res.body
      if (response.errno === ERR_OK) {
        this.ratings = response.data
      }
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$els.ratings, {
          click: true
        })
      })
    })
  },
  filters: {
    formatDate(time) {
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    starCom,
    splitCom,
    ratingSelect,
    shopCart
  }
}
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin.styl'

  .ratings
    position absolute
    top 174px
    left 0
    bottom 0
    width 100%
    overflow hidden
    .overview
      display flex
      padding 18px 20px
      flex-wrap nowrap
      .overview-left
        flex 0 0 137px
        width 137px
        padding 6px 0
        border-right 1px solid rgba(7, 17, 27, .1)
        text-align center
        @media only screen and (max-width: 320px)
          flex 0 0 120px
          width 120px
        .score
          margin-bottom 6px
          font-size 24px
          line-height 28px
          color rgb(255, 153, 0)
        .title
          margin-bottom 8px
          line-height 12px
          font-size 12px
          color rgb(7, 17, 27)
        .rank
          line-height 10px;
          font-size 10px
          color rgba(7, 17, 27, .6)
      .overview-right
        margin-left 12px
        flex 1
        @media only screen and (max-width: 320px)
          padding-left 6px
        .score-wrapper
          line-height 18px
          margin-bottom 8px
          font-size 0px
          .title
            display inline-block
            vartical-align top
            font-size 12px
            color rgb(7, 17, 27)
          .star
            display inline-block
            vartical-align top
            margin 0 12px
            .star-item
              margin 0px
              margin-bottom -3px
              line-height 26px
          .score
            display inline-block
            vartical-align top
            line-height 18px
            font-size 12px
            color rgb(255, 153, 0)
          .time
            font-size 12px
            color rgb(147, 153, 159)
            line-height 18px
            margin 0 12px
    .rating-wrapper
      padding 0 18px
      .rating-item
        display flex
        padding 18px 0
        border-1px(rgba(7, 17, 27, .1))
        .avatar
          flex 0 0 28px
          width 28px
          margin-right 12px
          img
            border-radius 50%
        .content
          position relative
          flex 1
          .name
            margin-bottom 4px
            line-height 12px
            font-size 10px
            color rgb(7, 17, 27)
          .star-wrapper
            margin-bottom 6px
            font-size 0
            .star
              display inline-block
              margin-right 6px
              vertical-align top
            .delivery
              display inline-block
              vertical-align top
              font-size 10px
              font-weight 200
              color rgb(147, 153, 159)
              line-height 12px
          .text
            line-height 18px
            font-size 12px
            color rgb(7, 17, 27)
          .recommend
            line-height 16px
            margin-top 8px
            font-size 0
            .icon-thumbUp, .item
              display inline-block
              margin 0 8px 4px 0
              line-height 16px
              font-size 12px
              color rgb(0, 160, 220)
            .item
              padding 0 6px
              border 1px solid rgba(7, 17, 27, .1)
              border-radius 2px
              color rgb(147, 153, 159)
          .time
            position absolute
            top 0
            right 0
            line-height 12px
            font-size 10px
            color rgb(147, 153, 159)

</style>

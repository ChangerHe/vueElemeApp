<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2, $event)" class="block positive" :class="{'active': selectType === 2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0, $event)" class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1, $event)" class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent" :class="{'on': onlyContent}">
      <span class="iconfont icon-right-cilcle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script>
const POSITIVE = 0
const NEGATIVE = 1
const ALL = 2

export default {
  props: {
    ratings: {
      type: Array,
      default() {
        return []
      }
    },
    selectType: {
      type: Number,
      default: ALL
    },
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      }
    }
  },
  methods: {
    // 点击之后传值,并将传递的值赋予给selectType
    select(type, event) {
      if (!event._constructed) {
        return
      }
      this.selectType = type
      // 子组件告知父组件其变化
      this.$dispatch('ratingtype.select', type)
    },
    toggleContent(event) {
      if (!event._constructed) {
        return
      }
      this.onlyContent = !this.onlyContent
      this.$dispatch('content.toggle', this.onlyContent)
    }
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === POSITIVE
      })
    },
    negatives() {
      return this.ratings.filter((rating) => {
        return rating.rateType === NEGATIVE
      })
    }
  }
}
</script>

<style lang="stylus">
  @import '../../common/stylus/mixin'

  .ratingselect
    .rating-type
      padding 18px 0
      margin 0 18px
      border-1px(rgba(7, 17, 27, .1))
      font-size 0
      .block
        display inline-block
        padding 8px 12px
        margin-right 8px
        border-radius 3px
        font-size 12px
        color rgb(77, 85, 93)
        &.active
          color #fff
        .count
          margin-left 2px
          font-size 8px
        &.positive
          background rgba(0, 160, 220, .2)
          &.active
            background rgb(0, 160, 220)
        &.negative
          background rgba(77, 85, 93, .2)
          &.active
            background rgb(77, 85, 93)
    .switch
      padding 12px 18px
      line-height 24px
      color rgb(147, 153, 159)
      border-bottom 1px solid rgba(7, 17, 27, .1)
      font-size 0
      &.on
        .icon-right-cilcle
          color #00c850
      .icon-right-cilcle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
      .text
        font-size 12px
</style>



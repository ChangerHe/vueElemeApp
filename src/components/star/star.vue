<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses"  :class="itemClass" class="star-item" track-by="$index"></span>
  </div>
</template>

<script>
// 定义一些常量, 方便进行更改
const LENGTH = 5
const CLS_ON = 'on'
const CLS_HALF = 'half'
const CLS_OFF = 'off'

export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  computed: {
    starType() {
      // 返回star- 加数值, 匹配对应的size数值
      return 'star-' + this.size
    },
    itemClasses() {
      // 定义一个数组存储score值
      let result = []
      // 将分数转为.5的倍数
      let score = Math.floor(this.score * 2) / 2
      // 确定是否有.5, 找到小数部分
      let hasDecial = score % 1 !== 0
      // 找到整数部分
      let integer = Math.floor(score)
      // 循环, 放入全星个数
      for (let i = 0; i < integer; i++) {
        result.push(CLS_ON)
      }
      // 如果有半星, 则加入一个半星
      if (hasDecial) {
        result.push(CLS_HALF)
      }
      // 剩下的就是空星了
      for (let i = 0; i < LENGTH - integer; i++) {
        result.push(CLS_OFF)
      }
      // 返回这个结果的数组
      return result
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

.star
  font-size 0
  .star-item
    display inline-block
    background-repeat no-repeat
  &.star-48
    .star-item
      width 20px
      height 20px
      margin-right 22px
      background-size 20px 20px
      &.on
        bg-image('star48_on')
      &.half
        bg-image('star48_half')
      &.off
        bg-image('star48_off')
  &.star-36
    .star-item
      width 16px
      height 16px
      margin-right 16px
      background-size 15px 15px
      &.on
        bg-image('star36_on')
      &.half
        bg-image('star36_half')
      &.off
        bg-image('star36_off')
  &.star-24
    .star-item
      width 10px
      height 10px
      margin-right 3px
      background-size 10px 10px
      &.on
        bg-image('star24_on')
      &.half
        bg-image('star24_half')
      &.off
        bg-image('star24_off')
</style>



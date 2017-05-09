<template>
  <div class="ratings" ref="ratings">
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
            <star :score="seller.serviceScore" :size="36"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :score="seller.foodScore" :size="36"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect :select-type="selectType" :only-content="onlyContent"
                    :ratings="ratings" @selecttype="selectRating" @content="setOnlycontent"></ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item border-1px"
              v-show="needShow(rating.rateType, rating.text)">
            <div class="user">
              <span class="name">{{rating.username}}</span>
              <img :src="rating.avatar" class="avatar" width="12" height="12" alt="avatar">
            </div>
            <div class="time">{{rating.rateTime | formatDate}}</div>
            <p class="text">
                  <span
                    :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
            </p>
          </li>
        </ul>
        <div class="no-rating" v-show="!ratings || !ratings.length">
          暂无评价
        </div>
      </div>
    </div>
  </div>

</template>
<script type="text/ecmascript-6">
  import star from '../star/star'
  import split from '../split/split'
  import BScroll from 'better-scroll'
  import ratingselect from '../ratingselect/ratingselect'
  import {formatDate} from '@/common/js/date'

  const ALL = 2
  const ERROR_OK = 0

  export default {
    props: {
      seller: Object
    },
    components: {
      star,
      split,
      ratingselect
    },
    data () {
      return {
        ratings: [],
        selectType: ALL,
        onlyContent: true
      }
    },
    created () {
      this.$http.get('/api/ratings').then((response) => {
        response = response.body
        if (response.errno === ERROR_OK) {
          this.ratings = response.data
          this.$nextTick(() => {
            this.scroll = new BScroll(this.$refs.ratings, {
              click: true
            })
          })
        }
      })
    },
    methods: {
      needShow (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return type === this.selectType
        }
      },
      selectRating (type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      setOnlycontent () {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin"

  .ratings
    position: absolute
    top: 174px
    bottom: 0
    width: 100%
    left: 0
    overflow: hidden
    .overview
      display: flex
      padding 18px 0
      .overview-left
        flex: 0 0 137px
        width 137px
        padding: 6px 0
        text-align center
        border-right 1px solid rgba(7, 17, 27, 0.1)
        .score
          font-size 24px
          color: rgb(255, 153, 0)
          line-height: 28px
        .title
          font-size 12px
          color: rgb(7, 17, 27)
          margin 6px auto 8px auto
        .rank
          font-size 10px
          color #AEB2B7
          line-height 10px
      .overview-right
        flex: 1
        padding 6px 0 6px 24px
        @media only screen and (max-width: 320px)
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(7, 17, 27)
          .star
            display: inline-block
            margin: 0 12px
            vertical-align: top
          .score
            display: inline-block
            line-height: 18px
            vertical-align: top
            font-size: 12px
            color: rgb(255, 153, 0)
        .delivery-wrapper
          font-size: 0
          .title
            line-height: 18px
            font-size: 12px
            color: rgb(7, 17, 27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147, 153, 159)


    .rating-wrapper
      padding: 0 18px
      .rating-item
        position: relative
        padding: 16px 0
        border-1px(rgba(7, 17, 27.0 .1))
        .user
          position: absolute
          right: 0
          top: 16px
          line-height: 12px
          font-size 0
          .name
            display: inline-block
            margin-right 6px
            font-size 10px
            vertical-align: top
            color: rgb(147, 153, 159)
          .avatar
            border-radius: 50%
        .time
          margin-bottom 6px
          line-height: 12px
          font-size 10px
          color: rgb(147, 153, 159)
        .text
          font-size 12px
          color: rgb(7, 17, 27)
          line-height 16px
          .icon-thumb_up, .icon-thumb_down
            font-size 12px
            margin-right: 4px
            line-height 16px
          .icon-thumb_up
            color: rgb(0, 160, 220)
          .icon-thumb_down
            color: rgb(147, 153, 159)
    .no-rating
      padding: 16px 0
      font-size: 12px
      color: rgb(147, 153, 159)
</style>

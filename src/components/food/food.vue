<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide">
            <span class="icon-arrow_lift"></span>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst">加入购物车</div>
          </transition>
        </div>
        <split></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect :select-type="selectType" :only-content="onlyContent" :desc="desc"
                        :ratings="food.ratings" @selecttype="setType" @content="setOnlycontent"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="rating in food.ratings" class="rating-item border-1px"
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
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">
              暂无评价
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import Vue from 'vue'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import split from '../split/split'
  import ratingselect from '../ratingselect/ratingselect'
  import {formatDate} from '@/common/js/date'

  //  const POSITIVE = 0
  //  const NEGATIVE = 1
  const ALL = 2

  export default {
    props: {
      food: Object
    },
    components: {
      cartcontrol,
      split,
      ratingselect
    },
    data () {
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
      show () {
        this.showFlag = true
        this.selectType = ALL
        this.onlyContent = true
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.food, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      addFirst (event) {
        if (!event._constructed) {
          return
        }
        this.$emit('add', event.target)
        Vue.set(this.food, 'count', 1)
      },
      setType (type) {
        this.selectType = type
        //  手动刷新better-scroll重新计算页面高度
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      setOnlycontent () {
        this.onlyContent = !this.onlyContent
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      needShow (type, text) {
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

  .food
    position: fixed
    left: 0
    top: 0
    bottom 48px
    z-index 30
    width: 100%
    background: #fff
    &.move-enter-active, &.move-leave-active
      transition all .2s linear
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    .image-header
      position: relative
      width: 100%
      height: 0
      padding-top: 100%
      img
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
      .back
        position: absolute
        top: 10px
        left: 0
        .icon-arrow_lift
          display: block
          padding: 10px
          font-size 20px
          color: #fff

    .content
      position: relative
      padding: 18px
      .title
        font-size 14px
        font-weight 700
        color: rgb(7, 17, 27)
        line-height: 14px
      .detail
        margin: 8px 0 18px 0
        font-size 0
        .sell-count, .rating
          font-size 10px
          color: rgb(147, 153, 159)
          line-height 10px
        .sell-count
          margin-right: 12px
      .price
        font-size 0
        font-weight 700
        line-height: 24px
        .now
          font-size 14px
          color: rgb(240, 20, 20)
          vertical-align: top
          margin-right: 8px
        .old
          font-size 10px
          color: rgb(147, 153, 159)
          text-decoration line-through
      .cartcontrol-wrapper
        position: absolute
        right: 12px
        bottom: 12px
      .buy
        position: absolute
        right: 18px
        bottom: 18px
        z-index: 20
        font-size 10px
        color: #fff
        box-sizing border-box
        height: 24px
        line-height: 24px
        padding: 0 12px
        background: rgb(0, 160, 220)
        text-align center
        border-radius 12px
        &.fade-enter-active, &.fade-leave-active
          transition all .2s
        &.fade-enter, &.fade-leave-active
          opacity: 0
    .info
      padding: 18px
      .text
        font-size 12px
        font-weight 200
        color: rgb(77, 85, 93)
        line-height: 24px
        padding: 6px 8px
    .rating
      padding-top: 18px
      .title
        font-size 14px
        line-height: 14px
        margin-left 18px
        color: rgb(7, 17, 27)
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

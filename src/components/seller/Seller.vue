<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="score">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :score="seller.score" :size="36" class="star"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item border-1px" v-for="(item,index) in seller.supports">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" alt="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import split from '../split/split'
  import star from '../star/star'
  import {saveToLocal, loadFromLocal} from '@/common/js/store'

//  const ERROR_OK = 0

  export default {
    props: {
      seller: Object
    },
    data () {
      return {
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false)
        })()
      }
    },
    components: {
      split,
      star
    },
    created () {
      this.classMap = ['decreace', 'discount', 'special', 'invoice', 'guarantee']
    },
    watch: {
      'seller' () {
        this.$nextTick(() => {
          this._initScroll()
        })
      }
    },
    mounted () {
      this.$nextTick(() => {
        this._initScroll()
        this._initPics()
      })
    },
    computed: {
      favoriteText () {
        return this.favorite ? ' 已收藏' : '收藏'
      }
    },
    methods: {
      toggleFavorite (event) {
        if (!event._constructed) {
          return
        }
        this.favorite = !this.favorite
        saveToLocal(this.seller.id, 'favorite', this.favorite)
      },
      _initScroll () {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.scroll.refresh()
        }
      },
      _initPics () {
        if (this.seller.pics) {
          let picWidth = 120
          let margin = 6
          let width = (picWidth + margin) * this.seller.pics.length - margin
          this.$refs.picList.style.width = width + 'px'
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,  // 横向滚动
                eventPassthrough: 'vertical'   // 竖直方向滚动时忽略垂直方向滚动
              })
            } else {
              this.picScroll.refresh()
            }
          })
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .seller
    position: absolute
    top: 174px
    bottom: 0
    left: 0
    width 100%
    overflow: hidden
    .overview
      position: relative
      padding: 18px
      .score
        font-size 14px
        color: rgb(7, 17, 27)
        line-height: 14px
        margin-bottom: 8px
      .desc
        font-size 0
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          display: inline-block
          margin-right 8px
          vertical-align: top
        .text
          display: inline-block
          margin-right 12px
          font-size 10px
          line-height: 18px
          color: rgb(77, 85, 93)
          vertical-align: top
      .remark
        display: flex
        padding-top 18px
        .block
          flex: 1
          text-align center
          font-size 10px
          line-height 10px
          color: rgb(147, 153, 159)
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          .content
            margin-top: 4px
            color: rgb(7, 17, 27)
            .stress
              font-size 24px
              font-weight 200
              line-height 24px
      .favorite
        position: absolute
        right 18px
        top: 18px
        width 50px
        text-align center
        .icon-favorite
          display: block
          text-align center
          font-size 24px
          color: #d4d6d9
          line-height: 24px
          margin-bottom: 4px
          &.active
            color: rgb(240, 20, 20)
        .text
          font-size 10px
          line-height: 10px
          color: rgb(77, 85, 93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        .content
          font-size 12px
          line-height: 24px
          color: rgb(240, 20, 20)
      .supports
        .support-item
          padding: 16px 12px
          font-size 0
          border-1px(rgba(7, 17, 27, 0.1))
          .icon
            display: inline-block
            width: 16px
            height: 16px
            margin-right 6px
            background-size 16px 16px
            background-repeat no-repeat
            vertical-align top
            &.decreace
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.guarantee
              bg-image('guarantee_4')
            &.invoice
              bg-image('invoice_4')
            &.special
              bg-image('special_4')
          .text
            font-size 12px
            line-height: 16px
            color: rgb(7, 17, 27)
    .pics
      padding:18px
      .title
        margin-bottom:12px
        line-height: 14px
        color: rgb(7, 17, 27)
        font-size: 14px
      .pic-wrapper
        white-space:nowrap
        .pic-list
          font-size 0
          .pic-item
            display: inline-block
            margin-right 6px
            width: 120px
            height: 90px
            &:last-child
              margin 0
    .info
      padding: 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom:12px
        line-height: 14px
        font-size: 14px
        border-1px(rgba(7,17,27,0.1))
      .info-item
        padding 16px 12px
        border-1px(rgba(7,17,27,0.1))
        font-size 12px
        line-height 16px
        &:last-child
          border-none()
</style>

<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li v-for="item,index in goods" class="menu-item" :class="{'current':currentIndex === index}"
              @click="selectMenu(index,$event)">
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>
            {{item.name}}
          </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li v-for="item in goods" class="food-list food-list-hook">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
                <div class="icon">
                  <img :src="food.icon" width="57" height="57">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="description">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">¥{{food.price}}</span>
                    <span v-show="food.oldPrice" class="old">¥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food" @event="getEvent"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :select-foods="selectFoods" :delivery-price="seller.deliveryProce"
                :min-price="seller.minPrice">

      </shopcart>
    </div>
    <food :food="selectedFood" ref="food"></food>
  </div>

</template>
<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import shopcart from '../shopcart/shopcart'
  import cartcontrol from '../cartcontrol/cartcontrol'
  import food from '../food/food'
  const ERROR_OK = 0

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      }
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i]
          let height2 = this.listHeight[i + 1]// listHeight[length]返回undefined,所以可以用!height2做判断不是最后一个
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i
          }
        }
        return 0
      },
      selectFoods () {
        let foods = []
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
    created () {
      this.classMap = ['decreace', 'discount', 'special', 'invoice', 'guarantee']
      this.$http.get('/api/goods').then((response) => {
        response = response.body
        if (response.errno === ERROR_OK) {
          this.goods = response.data
          this.$nextTick(() => {
            this._initScroll()
            this._calculateHeight()
          })
        }
      })
    },
    methods: {
      // 左右连动映射
      selectMenu (index, event) {
        // 自己开发的event._constructed是为true,pc浏览器没有此事件
        if (!event._constructed) {
          return
        }
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let el = foodList[index]
        this.foodsScroll.scrollToElement(el, 300)
      },
      _initScroll () {
        // this.$refs：取得DOM对象
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true  // 取消默认阻止事件
        })
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          click: true, // 取消默认阻止事件
          probeType: 3 // 监听事件的触发时间，1为即时触发，3为延迟到事件完毕后触发
        })
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y))
        })
      },
      _calculateHeight () {
        let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < foodList.length; i++) {
          // 获取每个li的高度，放入一个数组中
          let item = foodList[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      getEvent (el) {
        // 体验优化,异步执行下落动画
        this.$nextTick(() => {
          this.$refs.shopcart.drop(el)
        })
      },
      selectFood (food, event) {
        // 自己开发的event._constructed是为true,pc浏览器没有此事件
        if (!event._constructed) {
          return
        }
        this.selectedFood = food
        this.$refs.food.show()
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .goods
    display: flex
    position: absolute
    top: 174px
    width 100%
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        line-height 14px
        padding 0 12px
        &.current
          position: relative
          z-index 10px
          margin-top -1px
          background: #fff
          font-weight 700
          .text
            border-none()
        .icon
          display: inline-block
          width: 12px
          height: 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          vertical-align top
          &.decreace
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.guarantee
            bg-image('guarantee_3')
          &.invoice
            bg-image('invoice_3')
          &.special
            bg-image('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size 12px
          border-1px(rgba(7, 17, 27, 0.1))

    .foods-wrapper
      flex 1
      .title
        padding-left = 14px
        height: 26px
        line-height 26px
        border-left: 2px solid #d9dde1
        font-size 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom 18px
        border-1px(rgba(7, 17, 27, 0.1))
        &.last-child
          border-none()
          margin-bottom 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size 14px
            color: rgb(7, 17, 27)
          .description, .extra
            line-height: 10px
            font-size 10px
            color: rgb(147, 153, 159)
          .description
            line-height 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight 700
            line-height 24px
            font-size 0
            .now
              margin-right 8px
              font-size 14px
              color: rgb(240, 20, 20)
              font-weight 700
            .old
              text-decoration: line-through
              font-size 10px
              color: rgb(147, 153, 159)
              font-weight 700
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px

</style>

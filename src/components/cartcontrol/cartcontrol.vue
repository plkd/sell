<template>
  <div class="cartcontrol">
    <transition>
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
        <span class="inner inner1 icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import Vue from 'vue'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        if (!event._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
        } else {
          this.food.count++
        }
//        this.$dispatch('cart.add', event.target)
        this.$bus.emit('add', event.target)
        this.$emit('event', event.target)
      },
      decreaseCart (event) {
        if (!event._constructed) {
          return
        }
        if (this.food.count > 0) {
          this.food.count--
        }
      }
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display: inline-block
      padding: 6px
      .inner
        display: inline-block
        font-size 24px
        line-height: 24px
        color: rgb(0, 160, 220)
        transition: all 0.2s linear
      &.v-enter-active, &.v-leave-active
        transition: all .2s linear
      &.v-enter, &.v-leave-active
        opacity: 0
        transform: translateX(24px)
        .inner1
          transform: rotate(180deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width 12px
      padding-top 6px
      line-height: 24px
      text-align center
      font-size 10px
      color: rgb(147, 153, 159)
    .cart-add
      display: inline-block
      padding: 6px
      font-size 24px
      line-height: 24px
      color: rgb(0, 160, 220)
</style>

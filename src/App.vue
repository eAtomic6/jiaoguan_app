<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    name: 'App'
}
</script>

<style lang="less">
@import "~@/assets/common.less";
#app{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
  p{
    margin: 0;
  }
.van-dialog{
  &.database-confirm{
    .van-dialog__footer{
      .van-dialog__confirm, .van-dialog__confirm:active{
        color: #3EBA70;
      }
    }
  }
}
.van-list__finished-text{
    background-color: @bg-grey;
}
.van-button--primary{
    background-color: @text-green!important;
    border: 1px solid @text-green!important;
}
.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
  border: 0!important;
}
.van-tabs .van-tab {
    font-size: 16px;
    &--active {
      font-weight: bold;
    }
}
.van-field__control{
    color: @text-grey-333;
    &::-webkit-input-placeholder {
        color: @text-grey-BBB;
    }
}
.van-field__control:disabled{
    color: @text-grey-666;
}
.iconUtubiao-11, .van-icon-arrow {
    color: @text-grey-BBB!important;
}
</style>

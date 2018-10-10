<template>
  <main id="CommonHeader">
    <div class="CommonHeader">
      <span class="topTitle" @click="$router.go(-1)" >{{text}}</span>
      <span class="locationArea" v-if="isCityShow">广州</span>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CommonHeader',
  // props: ['text'],
  props: {
    text: {
      type: String,
      default: ''
    },
    isCityShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },

  mounted () {

  },

  methods: {

  },
}
</script>

<style scoped lang="scss">
#CommonHeader {
  .CommonHeader{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90px;
    line-height: 90px;
    text-align: center;
    color: #fff;
    font-size: 36px;
    background: #fea331;
    z-index: 1;
    .topTitle{
      &:before{
        position: absolute;
        content: '';
        width: 21px;
        height: 36px;
        left: 30px;
        top: 28px;
        background: url(~Img/back.png)no-repeat 0 0/100% 100%;
      }
    }
    .locationArea{
      position: absolute;
      right: 30px;
      font-size: 28px;
    }
  }
}
</style>

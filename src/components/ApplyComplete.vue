<template>
  <main id="ApplyComplete">
    <common-header :text="'信用卡申请完成'"></common-header>
    <div class="applyComplete-img"></div>
    <div class="applyComplete-con">
      <p class="applyComplete-conOne">申请成功</p>
      <p class="applyComplete-conTwo">您已申请成功，银行会尽快审核您所填写的资料，并可能会尽快联系您进行审核，请注意来电。</p>
      <p class="applyComplete-conThree">您可以在<span>个人中心-信用卡进度查询</span>，输入您的身份证号码进行查询。</p>
    </div>

    <div class="applyComplete-btn">
      <button class="">完成</button>
    </div>
  </main>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader';

export default {
  name:'ApplyComplete',
  components: {
    'common-header': CommonHeader
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
#ApplyComplete {
  .applyComplete-img{
    width: 450px;
    height: 300px;
    margin: 190px auto 60px;
    background: #ccc;
    border-radius: 6px;
  }
  .applyComplete-con{
    margin: 0 100px;
    .applyComplete-conOne{
      position: relative;
      display: inline-block;
      height: 60px;
      line-height: 60px;
      left: 53%;
      transform: translateX(-50%);
      color: #FEA331;
      font-size: 44px;
      text-align: center;
      &:before{
        position: absolute;
        left: -50px;
        top: 7px;
        width: 45px;
        height: 45px;
        display: inline-block;
        content: '';
        background: url(~Img/tick_icon.png)no-repeat 0 0/100% 100%;
      }
    }
    .applyComplete-conTwo{
      margin-top: 24px;
      color: #333;
      font-size: 28px;

    }
    .applyComplete-conThree{
      margin-top: 22px;
      color: #333;
      font-size: 28px;
      >span{
        color: #2376f3;
        text-decoration: underline;
      }

    }
  }

  .applyComplete-btn{
    margin: 56px auto 0;
    width: 300px;
    >button{
      width: 300px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      background-color: #FEA331;
      color: #fff;
      font-size: 36px;
      border: none;
      border-radius: 6px;
    }
  }
}
</style>

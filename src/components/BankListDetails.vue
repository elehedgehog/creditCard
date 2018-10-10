<template>
  <main id="BankListDetails">
    <!-- <common-header :text="bankDetail.name" v-if="osNameAndroid"></common-header> -->
    <i class="backIcon" @click="back()"></i>
    <scroller :on-refresh="refresh" :on-infinite="infinite">
      <!-- <div :class="['main-creditCard',{'top-distance': osNameAndroid}]"> -->
      <div class="main-creditCard">
        <span class="main-creditCard-img">
            <img :src="bankDetail.logo" alt="">
          </span>
          <span class="main-creditCard-con">
            <p class="main-creditCard-name">{{ bankDetail.name }}</p>
            <p class="main-creditCard-description">{{ bankDetail.advert }}</p>
          </span>
      </div>
      <ul class="creditCard-list">
        <li v-for="(item,index) in creditCardList" :key="index" @click="toApplyUrl(item.applyUrl)">
          <span class="creditCard-list-img">
            <img :src="item.creditCardLogo" alt="item.id">
          </span>
          <span class="creditCard-list-con">
            <p class="creditCard-name">{{ item.creditCardName }}</p>
            <p class="creditCard-description">{{ item.creditCardAdvert }}</p>
            <p class="creditCard-applications">
                <span v-if="item.applyNum < 10000">{{ item.applyNum }}</span>
                <span v-else>
                  {{ parseFloat((item.applyNum /10000)*100) /100 }}
                  <span>万</span>
                </span>人申请
            </p>
          </span>
        </li>
      </ul>
    </scroller>
  </main>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader';
import { mobileManager } from '../util/WebInfo.js'
export default {
  name:'BankListDetails',
  components: {
    'common-header': CommonHeader
  },
  data () {
    return {
      bankDetail: {},
      creditCardBankId: this.$route.params.id,
      creditCardList: [],
      page: 0,
      pageSize: 7,
      isLastPage: false,
      osNameAndroid: false
    }
  },
  created(){
    mobileManager.hideBottomBar()   //隐藏原生底部栏
    if(sessionStorage.osName){
        this.osNameAndroid = true
    }

  },
  mounted () {
    let bankDetail = localStorage.getItem('bankDetail');
    if (bankDetail) {
      this.bankDetail = JSON.parse(bankDetail);
      document.title = JSON.parse(bankDetail).name
    }
  },

  methods: {
     back(){
      window.history.go(-1);
    },
    async getCreditList () {
      let url = this.lbdUtil.host + `/credit/listCreditCardByBankId` + `?creditCardBankId=${this.creditCardBankId}` + `&pageNumber=${this.page}` + `&pageSize=${this.pageSize}`;
      let res = await this.$http.get(url);
      if (res.status === 200 && res.data.status === '0000') {
        let data = res.data.data;
        if (data.length) {
          if (this.page === 1) {
            this.creditCardList = [];
            this.isLastPage = false;
          }
          this.creditCardList = this.creditCardList.concat(data);
          if (data.length < this.pageSize) {
            this.isLastPage = true;
          }
        }
        else {
          this.isLastPage = true;
        }
      }
    },


    toApplyUrl(key) {
      window.location.href = key;
    },
    // 上拉刷新
    async refresh (next) {
      await this.initData();
      next();
    },
    async infinite (next) {
      if (this.creditCardList.length === this.totalData.length) {
        setTimeout(() => {
          next(true);
        }, 1000);
      }
      else {
        setTimeout(() => {
          this.getDataList();
          next();
        }, 1000);
      }
    },

    // 下拉刷新
    refresh (next) {
      setTimeout(async () => {
        this.page = 1;
        await this.getCreditList();
        next();
      }, 1000);
    },
    //上拉翻页
    infinite (next) {
      if (this.isLastPage) {
        setTimeout(() => {
          next(true);
        }, 1000);
      }
      else {
        setTimeout(async () => {
          this.page ++;
          await this.getCreditList();
          next();
        }, 1000);
      }
    }
  },
}
</script>

<style scoped lang="scss">
#BankListDetails {
  width: 100%;
  height: 100%;
  .backIcon{
    position: fixed;
    right: 30px;
    top: 30px;
    width: 60px;
    height: 60px;
    background: url(../assets/img/back_page.png)no-repeat 0 0/100% 100%;
    z-index: 99;
  }
  .main-creditCard{
    height: 200px;
    // margin-top: 90px;
    padding-left: 30px;
    background-color: #fff;
    >span{
      float: left;
      display: inline-block;
      &.main-creditCard-img{
        margin-top:30px;
        width: 140px;
        height: 140px;
        border-radius: 100px;
        background-color: #ccc;
        font-size: 36px;
        >img{
          width: 140px;
          height: 140px;
          border-radius: 100px;

        }
      }
      &.main-creditCard-con{
        width: 70%;
        margin-left: 30px;
          .main-creditCard-name{
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            margin-top: 54px;
            font-size: 36px;
            color: #333;
          }
          .main-creditCard-description{
            padding-top: 14px;
            font-size: 28px;
            color: #666; width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
      }
    }
  }
  .creditCard-list{
    margin-top: 20px;
  }
  .top-distance{
    padding-top: 80px;
  }
}
</style>

<template>
  <main id="AllBank">
    <!-- <common-header :text="'全部银行'" v-if="type === 'bank' && osNameAndroid"></common-header>
    <common-header :text="'全部信用卡'" v-if="type === 'card' && osNameAndroid"></common-header>
    <div :class="{'top-distance': osNameAndroid}"> -->

    <!-- <div :class="{'top-distance': osNameAndroid}"> -->
      <i class="backIcon" @click="back()"></i>
      <scroller :on-refresh="refresh" :on-infinite="infinite">
      <ul class="creditCard-list">
        <li v-for="(item,index) in creditCardList" :key="index" @click="toApplyUrl(item)">
          <span :class="['creditCard-list-img',{'bank-list-img':bankImgWidth}]">
            <img :src="type === 'bank' ? item.bankLogo : item.creditCardLogo">
          </span>
          <span class="creditCard-list-con">
            <p class="creditCard-name">{{ type === 'bank' ? item.bankName : item.creditCardName }}</p>
            <p class="creditCard-description">{{ type === 'bank' ? item.bankAdvert : item.creditCardAdvert }}</p>
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
    <!-- </div> -->

  </main>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader';
import { mobileManager } from '../util/WebInfo.js'
export default {
  name:'AllBank',
  components: {
    'common-header': CommonHeader
  },
  data () {
    return {
      type: this.$route.params.type,
      creditCardList: [],
      page: 0,
      pageSize: 7,
      isLastPage: false,
      bankImgWidth: false,
      osNameAndroid: false
    }
  },
  created() {

        mobileManager.hideBottomBar()   //隐藏原生底部栏
  },
  mounted () {
    if(this.type === 'bank'){
       document.title = '全部银行'
       this.bankImgWidth = true
      } else {
        document.title = '全部信用卡'
         this.bankImgWidth = false
      }
      if(sessionStorage.osName){
        this.osNameAndroid = true
      }
  },

  methods: {
    back(){
      window.history.go(-1);
    },
    async getDataList () {
      let url = this.lbdUtil.host + (this.type === 'bank' ? '/credit/bank/list' : '/credit/list') + `?pageNumber=${this.page}&pageSize=${this.pageSize}`;
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

    toApplyUrl(item) {
      if(this.type === 'bank'){
        localStorage.setItem('bankDetail', JSON.stringify({ name: item.bankName, advert: item.bankAdvert, logo: item.bankLogo }));
        this.$router.push({ name: 'BankListDetails', params: { id: item.id } });
      } else {
        if(item.applyUrl){
          window.location.href = item.applyUrl;
        }

      }
    },

    // 上拉刷新
    refresh (next) {
      setTimeout(async () => {
        this.page = 1;
        await this.getDataList();
        next();
      }, 1000);
    },

    infinite (next) {
      if (this.isLastPage) {
        setTimeout(() => {
          next(true);
        }, 1000);
      }
      else {
        setTimeout(async () => {
          this.page ++;
          await this.getDataList();
          next();
        }, 1000);
      }
    }
  },
}
</script>

<style scoped lang="scss">
#AllBank {
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
  .creditCard-list{
    // margin-top: 90px;
  }
  .top-distance{
    ._v-contentv {
      padding-top: 30px;
    }

  }
}
</style>

<style lang="scss">
#AllBank {
  .top-distance{
    ._v-container{
      top: 80px;
    }

  }
}
</style>

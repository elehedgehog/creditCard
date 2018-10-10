<template>
  <main id="CreditCardCenter">
    <!-- <common-header :text="'信用卡中心'" v-if="osNameAndroid"></common-header> -->
    <scroller :on-refresh="refresh">
      <div class="recommand-headder">
        <span class="recommand-headder-title">今日推荐</span>
      </div>
      <!-- <div :class="['swiper-container','daily-recommand', {'top-distance': osNameAndroid}]" ref="mySwiper"> -->
      <div class="swiper-container daily-recommand" ref="mySwiper">
        <div class="swiper-wrapper" @click="toCommandUrl">
          <div class="swiper-slide" v-for="(el, i) in newRecommandList" :key="i">
            <ul class="recommand-list">
              <li v-for="(item, index) of el" :key="index">
                <img :src="item.creditCardLogo" class="target" :url="item.applyUrl">
                <p class="target" :url="item.applyUrl">{{ item.creditCardName }}</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>

      <div class="recommand-headder hot-bank">
        <span class="recommand-headder-title">
          热门银行
          <!-- <router-link :to="{ name: 'AllBank', params: { type: 'bank'}, }"> -->
            <span class="more-bank" @click="toAllBank">全部银行 ></span>
          <!-- </router-link> -->
        </span>
      </div>
      <ul class="bank-list cf">
        <li v-for="(item,index) in backCardList" :key="index" @click="toBankList(item)">
          <p class="bank-img">
            <img :src="item.bankLogo">
            <span v-if="item.bankLable">{{ item.bankLable }}</span>
          </p>
          <p class="bank-name">{{ item.bankName}}</p>
          <p class="bank-description">{{ item.bankAdvert}}</p>
        </li>
      </ul>

      <div class="recommand-headder hot-bank">
        <span class="recommand-headder-title">
          热门信用卡
          <!-- <router-link :to="{ name: 'AllBank', params: { type: 'card'}, }"> -->
            <span class="more-bank" @click="toCreditCard">全部信用卡 ></span>
          <!-- </router-link> -->
        </span>
      </div>
      <ul class="creditCard-list">
        <li v-for="(item,index) in creditCardList" :key="index" @click="toApplyUrl(item.applyUrl)">
          <span class="creditCard-list-img">
            <img :src="item.creditCardLogo" alt="">
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
import Swiper from 'Swiper';
import 'Swiper/dist/css/swiper.min.css'
// import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { Swipe, SwipeItem } from 'mint-ui';
import "mint-ui/lib/style.css"
import { mobileManager } from '../util/WebInfo.js'

export default {
  name:'CreditCardCenter',
  components: {
    'common-header': CommonHeader,
    // swiper,
    // swiperSlide
    'mt-swipe': Swipe,
    'mt-swipe-item': SwipeItem

  },
  data () {
    return {
      recommandList: [],    //今日推荐
      newRecommandList: [],
      backCardList: [],     //热门银行
      creditCardList: [],   //热门信用卡
      creditApplication: '', //信用卡申请人数,
      webInfo: {
        reqApplicationType : "webHtml",
        reqApplicationVersion : "1.0",
        osName : navigator.platform,
        osVersion : navigator.appName,
        appDownChannel : "web",
        mobileModel : navigator.userAgent,
        packageName: "",
        versionName: "",
      },
      osNameAndroid: false


    }
  },
  created(){
   mobileManager.showBottomBar()  //显示原生底部栏
    document.title = '信用卡中心'
    let paramUrl = document.location.href
      let arr = paramUrl.split('?')
      if (arr[1]) {
        let newArr = arr[1].split('&')
        for(var i=0; i < newArr.length; i++) {
          var item = newArr[i]
          if (/osName=/.test(item)) {
              this.osName = item.split('=')[1];
              if(this.osName){
                this.osNameAndroid = true
              }
              sessionStorage.osName = this.osName

          }
        }
      }
      if(sessionStorage.osName){
        this.osNameAndroid = true
      }

  },
  mounted () {
    this.HomeWebEvenPoint()
    this.initData()
  },

  methods: {
    // 初始化所有数据
    async initData () {
      await this.getRecommand();
      await this.getHotBank();
      await this.getHotCreditCard();
    },
    toAllBank(){  //全部银行
    this.hotBankWebEvenPoint()
      this.$router.push({ name: 'AllBank',params: { type: 'bank'}, });

    },
    toCreditCard(){ //全部信用卡
    this.creditCardWebEvenPoint()
      this.$router.push({ name: 'AllBank',params: { type: 'card'}, });

    },
    toBankList(item) {   //银行卡详情页
    this.bankDetailWebEvenPoint()
      localStorage.setItem('bankDetail', JSON.stringify({ name: item.bankName, advert: item.bankAdvert, logo: item.bankLogo }));
      this.$router.push({ name: 'BankListDetails', params: { id: item.id } });

    },
    //信用卡刷新首页埋点
    HomeWebEvenPoint(){
      let params = {
          mobile : "",
          webAgent : this.webInfo.mobileModel,
          eventId : "0006",
          eventName : "信用卡首页",
          pageUrl : window.location.href,
          pageRemark : "刷新信用卡首页",
          productCode : "lbd",
          channelCode : "lbdAPP"
        }
       this.$http.post(
        this.lbdUtil.host + `/app/appWebEventLog/addLog?`+ `webAgent=${params.webAgent}&eventId=${params.eventId}&eventName=${params.eventName}&pageUrl=${params.pageUrl}&pageUrl=${params.pageRemark}&productCode=${params.productCode}&channelCode=${params.channelCode}`,
				).then((res) => {
          console.log(res)
				},(err)=>{
					console.log(err,'请求失败');
        });
    },
    //信用卡刷新全部信用卡埋点
    creditCardWebEvenPoint(){
      let params = {
          mobile : "",
          webAgent : this.webInfo.mobileModel,
          eventId : "0007",
          eventName : "全部信用卡",
          pageUrl : window.location.href,
          pageRemark : "刷新全部信用卡页面",
          productCode : "lbd",
          channelCode : "lbdAPP"
        }
        this.$http.post(
           this.lbdUtil.host + `/app/appWebEventLog/addLog?`+ `webAgent=${params.webAgent}&eventId=${params.eventId}&eventName=${params.eventName}&pageUrl=${params.pageUrl}&pageUrl=${params.pageRemark}&productCode=${params.productCode}&channelCode=${params.channelCode}`,
				).then((res) => {
          console.log(res)
				},(err)=>{
					console.log(err,'请求失败');
        });
    },

    //信用卡刷新热门银行页埋点
    hotBankWebEvenPoint(){
      let params = {
          mobile : "",
          webAgent : this.webInfo.mobileModel,
          eventId : "0008",
          eventName : "热门银行页",
          pageUrl : window.location.href,
          pageRemark : "刷新热门银行页",
          productCode : "lbd",
          channelCode : "lbdAPP"
        }
        this.$http.post(
          this.lbdUtil.host + `/app/appWebEventLog/addLog?`+ `webAgent=${params.webAgent}&eventId=${params.eventId}&eventName=${params.eventName}&pageUrl=${params.pageUrl}&pageUrl=${params.pageRemark}&productCode=${params.productCode}&channelCode=${params.channelCode}`,
				).then((res) => {
          console.log(res)
				},(err)=>{
					console.log(err,'请求失败');
        });
    },

    // 银行详情页
    bankDetailWebEvenPoint(){
      let params = {
        mobile : "",
        webAgent : this.webInfo.mobileModel,
        eventId : "0009",
        eventName : "银行详情页",
        pageUrl : window.location.href,
        pageRemark : "刷新 银行详情页",
        productCode : "lbd",
        channelCode : "lbdAPP"
      }
      this.$http.post(
         this.lbdUtil.host + `/app/appWebEventLog/addLog?`+ `webAgent=${params.webAgent}&eventId=${params.eventId}&eventName=${params.eventName}&pageUrl=${params.pageUrl}&pageUrl=${params.pageRemark}&productCode=${params.productCode}&channelCode=${params.channelCode}`,
      ).then((res) => {
        console.log(res)
      },(err)=>{
        console.log(err,'请求失败');
      });
    },

    // 今日推荐
    async getRecommand () {
      await this.$http.get(
						this.lbdUtil.host + `/credit/recommend`,
				).then((res) => {
        // let data = {"status":"0000","code":"0000","msg":null,"debugMsg":"no debug message","data":[{"creditCardName":"广发银行信用卡4","id":63,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKX6SAYlFBAAAcSjyhTtQ974.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡3","id":62,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKX2KALBQNAAAcSjyhTtQ684.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡2","id":61,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKXxeAJWI4AAAcSjyhTtQ109.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡1","id":60,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKXkeAVFgOAAAcSjyhTtQ440.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡","id":59,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKXemARs-5AAAcSjyhTtQ520.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"YOUNG卡","id":10,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"爱驾卡","id":4,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"牡丹卡","id":5,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"中信银行银联标准IC信用卡（金卡）","id":82,"creditCardLogo":"https://app.lbdfun.com/group1/M05/CC/43/cEoQPVspuNWAOqF9AADejzqLQMU385.jpg","applyUrl":"https://creditcard.ecitic.com/citiccard/cardshop-h5/wap/initCardInfo.do?pid=CS0002&cls=SJWAPBZK01&sid=SJAYKTT11"},{"creditCardName":"啥信用卡","id":80,"creditCardLogo":"https://app.lbdfun.com/group1/M05/CB/28/cEoQPVsott-ATaRBAAA84DiqF6Q772.jpg","applyUrl":"https://www.baidu.com/"}]}
        // let res = {data}
           if (res.data.status === '0000'){
             this.recommandList = res.data.data;
              this.newRecommandList = [];
              for(let i of this.recommandList) {
                if(!this.newRecommandList.length || this.newRecommandList[this.newRecommandList.length - 1].length === 3) {
                  this.newRecommandList.push([i])
                } else {
                  this.newRecommandList[this.newRecommandList.length - 1].push(i)
                }
              }
              if(this.recommandList.length > 1){      //数据大于3个时初始化swiper
                this.$nextTick(() => {
                  let swiper = new Swiper(this.$refs.mySwiper, {
                    notNextTick: true,
                    autoplay: 3000,
                    speed: 800,
                    grabCursor : true,
                    pagination :'.swiper-pagination',
                    loop: true,
                    autoplayDisableOnInteraction: false,
                    // pagination: '.swiper-pagination',
                    // mode: 'horizontal',
                    // freeMode:false,
                    // touchRatio:0.5,
                    // longSwipesRatio:0.1,
                    // threshold:50,
                    // followFinger:false,
                    // observer: true,
                    // observeParents: true
                  });
                });
              }
           }

				},(err)=>{
					console.log(err,'请求失败');
        });
    },
    toCommandUrl (event) {    //点击 事件委托
      let e = event || window.event;
      let target = e.target || e.srcElement;
      if (/target/.test(target.className)) {
        let url = target.getAttribute('url');
        if (url) {
          window.location.href = url;
        }
      }
    },

    toApplyUrl(key) {
      window.location.href = key;
    },
    goToApplyUrl(key){
      if(key){
        window.location.href = key
      }
    },
    // 热门银行
    async getHotBank () {
      await this.$http.get(
						this.lbdUtil.host + `/credit/bank/hot`,
				).then((res) => {
        // let res = { data:{"status":"0000","code":"0000","msg":null,"debugMsg":"no debug message","data":[{"id":41,"applyNum":999999999,"bankName":"啥银行1","bankLable":"啥标签1","bankAdvert":"啥广告1","bankLogo":"https://app.lbdfun.com/group1/M05/CB/23/cEoQPVsorLKARBl8AAAxG_U1vWE725.jpg"},{"id":33,"applyNum":10100000,"bankName":"中国进出口银行","bankLable":"热门122","bankAdvert":"热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门热门","bankLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKbNOANln5AABVBjyKoOQ230.jpg"},{"id":34,"applyNum":999999999,"bankName":"农业发展银行","bankLable":"不发布","bankAdvert":"不发布","bankLogo":"https://app.lbdfun.com/group1/M05/BD/C8/cEoQPVsKcEmAaikqAAAftHw4gT4168.jpg"},{"id":35,"applyNum":999999999,"bankName":"兴业银行1","bankLable":"正常1","bankAdvert":"正常，中文~！@#￥%……&*（）——+｛｝：“｜《》？·-=【】；‘、，。、\r\n英文~!@#$%^&*()_+{}:\"|<>?`-=[];'\\,./","bankLogo":"https://app.lbdfun.com/group1/M05/BD/C8/cEoQPVsKeRuADOO4AAAw_iYNfvM890.jpg"},{"id":36,"applyNum":3,"bankName":"兴业银行2","bankLable":"热门","bankAdvert":"热门","bankLogo":"https://app.lbdfun.com/group1/M05/BD/C8/cEoQPVsKgZGAHAA0AAAw_iYNfvM129.jpg"},{"id":13,"applyNum":199,"bankName":"中信银行","bankLable":"热门","bankAdvert":"办卡送“壕”礼","bankLogo":"https://app.lbdfun.com/group1/M05/CC/2C/cEoQPVsptjiABVuvAAA1SdKjTGo293.png"},{"id":37,"applyNum":999999999,"bankName":"nedbank","bankLable":"nedbank","bankAdvert":"nedbank","bankLogo":"https://app.lbdfun.com/group1/M05/BD/CA/cEoQPVsLtzKAUT1AAABhlplciME706.jpg"},{"id":40,"applyNum":100,"bankName":"银行名称","bankLable":"大哥","bankAdvert":"广告","bankLogo":"https://app.lbdfun.com/group1/M05/CA/EA/cEoQPVsom9GAchG6AAKqoZPcBxw227.png"},{"id":39,"applyNum":999,"bankName":"乐宝宝银行","bankLable":"银行银行银行","bankAdvert":"乐宝宝银行乐宝宝银行乐宝宝银行","bankLogo":"https://app.lbdfun.com/group1/M05/C2/7D/cEoQPVsg0JyAdtH6AABiiegOflU737.png"},{"id":38,"applyNum":100,"bankName":"广州农商银行","bankLable":"热门","bankAdvert":"每周五享受5折优惠","bankLogo":"https://app.lbdfun.com/group1/M05/BE/35/cEoQPVsUqcKAYnsaAAAG7u3CD6M112.png"}]} }

          if (res.data.status === '0000'){
            this.backCardList = res.data.data;
          }
				},(err)=>{
					console.log(err,'请求失败');
				});
    },
     // 热门信用卡
    async getHotCreditCard () {
      await this.$http.get(
						this.lbdUtil.host + `/credit/hot`,
				).then((res) => {
        // let res = { data:{"status":"0000","code":"0000","msg":null,"debugMsg":"no debug message","data":[{"creditCardName":"广发银行信用卡10","id":69,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/CA/cEoQPVsLtdqAHfFIAAAlB6ANXig822.jpg","applyNum":120,"creditCardAdvert":"正常发布","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡9","id":68,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKYP6AJTMRAAAcSjyhTtQ899.jpg","applyNum":119,"creditCardAdvert":"今日推荐","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡8","id":67,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKYKaAZi7cAAAcSjyhTtQ168.jpg","applyNum":118,"creditCardAdvert":"重点推荐","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡7","id":66,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKYHOAQM7ZAAAcSjyhTtQ751.jpg","applyNum":117,"creditCardAdvert":"不发布","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡6","id":65,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKYDCAY9T-AAAcSjyhTtQ394.jpg","applyNum":116,"creditCardAdvert":"正常发布 ","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"广发银行信用卡5","id":64,"creditCardLogo":"https://app.lbdfun.com/group1/M05/BD/C7/cEoQPVsKX-KADNBbAAAcSjyhTtQ044.jpg","applyNum":115,"creditCardAdvert":"今日推荐","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"金穗卡","id":1,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyNum":2,"creditCardAdvert":"1111","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"龙卡","id":2,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyNum":11,"creditCardAdvert":"11","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"长城卡","id":3,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyNum":11,"creditCardAdvert":"11","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"爱驾卡","id":4,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyNum":11,"creditCardAdvert":"11","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"},{"creditCardName":"牡丹卡","id":5,"creditCardLogo":"https://app.lbdfun.com/group1/M04/09/23/cEoQPVoqBu-AE8I6AABo7BgkcGg928.jpg","applyNum":11,"creditCardAdvert":"11","applyUrl":"https://www.baidu.com/?tn=02003390_3_hao_pg"}]} }
          if (res.data.status === '0000'){
            this. creditCardList = res.data.data;
          }
				},(err)=>{
					console.log(err,'请求失败');
				});
    },

    // 上拉刷新
    async refresh (next) {
      await this.initData();
      next();
    },
  }
}
</script>

<style scoped lang="scss">
#CreditCardCenter {
  background-color: #F1F3F7;
  .recommand-headder{
    width: 100%;
    height: 70px;
    line-height: 70px;
    font-size: 32px;
    color: #333333;
    background-color: #fff;
    >span{
      display: inline-block;
      width: calc(100% - 30px);
      width: -webkit-calc(100% - 30px);
      width: -moz-calc(100% - 30px);
      margin-left: 30px;
      border-bottom: 1px solid #E6E6E6;

    }
  }
  .daily-recommand{
    height: 280px;
    background-color: #fff;
  }
  .recommand-list{
    display: flex;
    justify-content: space-between;
    padding: 20px 30px 0;
    background-color: #fff;
    >li{
      width: 32%;
      color: #333333;
      text-align: center;
      font-size:26px;
      margin: 0 1%;
      >img{
      margin: 0 auto;
      width: 200px;
      height: 130px;
      display: block;
      background-color: #ccc;
      border-radius: 6px;
    }
    >p{
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-top: 12px;
    }


    }
  }

  .top-distance{
    padding-top: 30px;
  }
  .recommand-list-p{
    width: 200px;
    text-align: center;
  }
  .hot-bank{
    margin-top: 20px;
    span.more-bank{
      float:right;
      line-height: 70px;
      margin-right: 30px;
      font-size: 26px;
      color: #999;
    }
  }
  .bank-list{
    background-color: #fff;
    padding: 0 30px;
    >li{
      // float: left;
      display: inline-block;
      width: 32%;
      margin-right: 1%;
      text-align: center;
      margin-top: 26px;
      margin-bottom: 20px;
      .bank-img{
        position: relative;
        width: 102px;
        height: 102px;
        border-radius: 60px;
        background-color: #ccc;
        margin:auto;
        >img{
          display: inline-block;
          width: 102px;
          height: 102px;
          border-radius: 60px;
        }
        >span{
          position: absolute;
          right: -40px;
          top: 0;
          display: inline-block;
          width: 60px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          font-size: 24px;
          border-top-left-radius: 6px;
          border-bottom-right-radius: 6px;
          background-color: #FF505E;
          color: #fff;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
      .bank-name{
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        color: #333;
        font-size: 26px;
        margin-top: 10px;
      }
      .bank-description{
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #999;
        font-size: 24px;
      }
    }
  }
}
._v-container{
  background-color: #F1F3F7;
}

</style>
<style  lang="scss">
  .swiper-pagination-bullet-active{
    background: #333333!important;
  }
  .swiper-pagination-bullet{
    background: #999999!important;
  }
</style>


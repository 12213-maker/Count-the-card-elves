<template>
	<div class="recommand-list" :style="{height:showTitle?'auto':'100%'}">
		<p class="title" v-if='showTitle'>相关推荐</p>
		<div class="card-wrap" v-if='!detailView  && lists.length!=0'>
      <index-card 
      v-for='(item,index) in lists' 
      :key='index' 
      :data='item'
      :search='searchForm'
      :areaId="searchForm.areaCode"
      :marginBottom="lists.length>2?'10px':0"
      :index='index'
      :detailPage="detailPage"
      @onCardClick="onCardClick"/>
    </div>

    <van-button
    class="tips" 
    :loading="loading"
    @click="getMoreData" 
    v-if="!detailView && !isLastPage">查看更多</van-button>

    <div v-show="detailView  && lists.length" class='custom-swipe-wrap' >
      <swiper :options="swiperOption" ref="mySwiper"  @slide-change="onSlideChange">
        <swiper-slide
        v-for='(item,idx) in lists' 
        :key='idx'>
          <detail-card 
          :data='item'
          :tabIndex='0'
          :index='idx'
          :detailView="detailView"
          :search='searchForm'
          :initKpiData='initKpiData'
          @updateKpiData='updateKpiData'
          ref="detailcard"/>
          <van-loading type="spinner" v-show="detailView && loading && idx==lists.length-1" style="width:100%;margin-top: 14px;">加载中...</van-loading>
        </swiper-slide>
      </swiper>
    </div>
    
 	</div>
</template>

<script>
import { getRecommendKpiData, browseBigCard,getKpiDataDetailList } from '@/api/home/index.js';
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  name: 'RecommandList',
  props:["searchForm","detailPage"],
  components:{swiper, swiperSlide},
  data () {
    return {
    	lists:[],
      pageNum:1,
      isLastPage: false,
      loading: false,
      showTitle: false,
      swiperOption:{
        direction:'vertical',
        height:720
      },
      currentIdx:0,
      detailView:false,

      changedKpiIds: new Set(),
      changedKpiIndex: new Set(),
      detailDate:''
    };
  },

  watch: {
    searchForm:{
      deep:true,
      handler(){
        this.getDatas(1,true)
      }
    }
  },

  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },

  methods: {
    formatterDate(val,type) {
      val = new Date(val);
      const year = val.getFullYear();
      const month = (val.getMonth() + 1) < 10 ? `0${val.getMonth() + 1}` : val.getMonth() + 1;
      const date = val.getDate() < 10 ? `0${val.getDate()}` : val.getDate();

      if(type === 'y-m-d') {
        return `${year}-${month}-${date} 23:59:59`;
      } else {
        return `${year}${month}${date}`;  
      }
    },

    getDatas(pageNum,isClear) {
      console.log('recommand-list,dateTime',this.searchForm)
      if(isClear) this.lists = [];
      const data = {
        areaId: this.searchForm.areaCode,
        dateTime: this.formatterDate(this.searchForm.dateTime,'y-m-d'),
        kpiModel: this.searchForm.kpiModel,

        kpiType:'',
        labelName:'',
        kpiName: '',
        userId: '1',
        pageSize: 2,
        pageNum,
        order:'0'
      };

      getRecommendKpiData(data).then((res) => {
        if(res.success) {
          if(res.data.total==0 || this.detailView) {
            this.showTitle = false;
          } else {
            this.showTitle = true;
          }
          this.lists = this.lists.concat(res.data.list);
          this.isLastPage = res.data.isLastPage;
        }
        this.loading = false;
      }).catch((err) => {
      });
    },

    getMoreData() {
      this.loading = true;
      this.pageNum++;
      this.getDatas(this.pageNum,false);
    },

    onSlideChange() {
      let activeIndex = this.$refs.mySwiper.swiper.activeIndex;
      this.currentIdx = activeIndex;
      this.getDetailList(this.detailDate?this.detailDate:this.searchForm.dateTime);
      if(activeIndex >= this.lists.length-3 && !this.isLastPage) {
        this.getMoreData();
      }
    },

    // 查询单个大卡数据
    getDetailList(date) {
      if(date!='') {
        let cardCom =  this.$refs['detailcard'][this.currentIdx];
        // 收集改变了日期的指标ID，用于切换至小卡时重新请求数据更改替换
        console.warn(cardCom.data.kpiId);
        this.changedKpiIds.add(cardCom.data.kpiId);
        this.changedKpiIndex.add(cardCom.index);
        cardCom.getKpiDataDetail(cardCom.data,false,date,true);
      }
    },

    onCardClick(index) {
      console.log(index)
      this.changeView(false);
      this.currentIdx = index;
      // this.cardScrollTop = this.$refs.cardListContent.scrollTop;  
      setTimeout( () => {
        this.swiper.slideTo(index);
      },50) 
    },

    changeView(flag) {
      this.$emit('hideLists',!flag);
      this.showTitle = flag;
      this.detailView = !flag;

      if(!this.detailView) {
        // 批量更新
        this.getDetailLists();
      }
    },

    // 批量更新数据
    getDetailLists() {
      let changedKpiIds = Array.from(this.changedKpiIds);
      let changedKpiIndex = Array.from(this.changedKpiIndex);
      getKpiDataDetailList({
        kpiIds: changedKpiIds,
        dateTime: this.formatterDate(this.searchForm.dateTime,'y-m-d'),
        areaId: this.searchForm.areaCode,
        userId: '1'
      }).then(res => {
        // console.log('覆盖数据',res);
        res.data.forEach( data => {
          let idx = changedKpiIds.indexOf(data.kpiId);
          if(data.kpiName) {
            for(var item in this.lists[idx]) {
              this.lists[changedKpiIndex[idx]][item] = data[item];
            }
          } else {
            const emptyData = this.initKpiData(this.lists[changedKpiIndex[idx]]);
            for(var item in this.lists[idx]) {
              this.lists[changedKpiIndex[idx]][item] = emptyData[item];
            }
          }
          
        })
        this.changedKpiIds = new Set();
        this.changedKpiIndex = new Set();
      })
    },


    initKpiData(data) {
      return {
        "kpiId": data.kpiId,
        "kpiName": "-",
        "kpiModel": "",
        "kpiType": null,
        "caliberContent": null,
        "releaseSource": "",
        "unit": "",
        "kpiDate": "",
        "kpiValue": 0,
        "yearErlier": "",
        "monthErlier": "",
        "yearSum": null,
        "daySum": null,
        "monthSum": 0,
        "targetValue": '-',
        "completeValue": '-',
        "completeRate": "",
        "warningLevel": 1,
        "kpiRank": '-',
        "targetDifference": '-',
        "timeSchedule": "",
        "sumRank": '-',
        "warningContent": "",
        "focusFlag": false,
        "focusNumber": 0,
        "customLabels": null,
        "chkMetd": "0",
        "alarmCnt": 0,
        "alarmRule": null,
        "effectTime": null,
        "correKpiId": null,
        "areaRankDes": "",
        "areaName": ""
      }
    },

    updateKpiData(idx, newData, isInit) {
      if(isInit) {
        const emptyData = this.initKpiData(this.lists[idx]);
        for(var item in this.lists[idx]) {
          this.lists[idx][item] = emptyData[item];
        }
        return;
      }

      for(var item in this.lists[idx]) {
        this.lists[idx][item] = newData[item];
      }
    },

    getTabDatas() {

    }
  },

  created() {
    this.loading = true;
    this.getDatas(this.pageNum);
  }
};
</script>
<style lang="scss">
	.recommand-list {
    width:100%; 
    height:auto; 

    >.title {
    	line-height: 30px;
    	font-size: 15px;
    	font-weight: 500;
    	display: flex;
    	align-items:center;
    	padding: 0 12px;
    	box-sizing: border-box;
    	color:#5C636B;

    	&::before {
    		content: '';
    		display: inline-block;
    		width: 3px;
    		background: #03A0FF;
    		height: 14px;
    		margin-right: 5px;
    	}
    }

    .card-wrap {
      width:100%;
      padding: 10px;
      box-sizing:border-box;
      column-count:2;
      column-gap: 10px;
    }

    .tips {
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      float:left;
      width: 100%;
      color: #8F939C;
      background: none;
      border:0px;
    }

    .custom-swipe-wrap {
       height:100%; 
       min-height:100%;
       overflow:hidden;
    }
	}
</style>

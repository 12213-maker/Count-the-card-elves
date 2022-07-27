<template>
	<div  class="card-list" style="width:100%; height:100%; display:flex; flex-direction:column;">
		<search-bar 
    ref="searchBar"
    :detailView="detailView"
    :search="search"
    :tabIndex='index'
    @changeView="changeView" 
    @kpiTypeChange="kpiTypeChange"
    @orderChange="orderChange">
    </search-bar>

    <div  v-if="keyword" class="tag-wrap">
      <van-tag plain type="primary" closeable @close="onTagClosed">{{keyword}}</van-tag>
    </div>
	  <div class="content" @scroll="onscroll" ref='cardListContent'>  
      <p v-show='showNote && !hideList' class="note-text">抱歉，没有查询到相关指标</p>
      <div v-show="!detailView && lists.length && !hideList" class="card-wrap" ref="cardWrap">
        <index-card 
        v-for='(item,idx) in lists' 
        :key='idx' 
        :data='item'
        :index='idx'
        :tabIndex='index'
        :areaId='areaId'
        :search='search'
        :marginBottom="lists.length>2?'10px':0"
        @onCardClick="onCardClick"/>
      </div>
      <van-loading type="spinner" v-show="!detailView && loading && !hideList" style="width:100%;margin-top: 14px;">加载中...</van-loading>
      
      <div v-show="detailView  && lists.length && !hideList" class='custom-swipe-wrap' >
        <swiper :options="swiperOption" ref="mySwiper"  @slide-change="onSlideChange">
          <!-- slides -->
          <swiper-slide
          v-for='(item,idx) in lists' 
          :key='idx'>
            <detail-card 
            :data='item'
            :tabIndex='index'
            :index='idx'
            :detailView="detailView"
            :search='search'
            :initKpiData='initKpiData'
            @updateKpiData='updateKpiData'
            :ref="'detailcard'+idx"/>
            <van-loading type="spinner" v-show="detailView && loading && idx==lists.length-1" style="width:100%;margin-top: 14px;">加载中...</van-loading>
          </swiper-slide>
        </swiper>
      </div>
    
      <recommand-list
      ref="recommandList"
      v-show="!detailView"
      :searchForm='search'
      :class="lists.length==0||detailView?'mt10':''" 
      @hideLists="hideLists"
      v-if="finished && index!==1"/>
	  </div>
  </div>
</template>
<script>
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { getKpiDataDetailList } from '@/api/home/index.js'

export default {
  name: 'CardList',
  props:["lists","getListData","index","keyword","areaId","search","showNote","formatterDate"],
  components:{swiper,swiperSlide},
  data () {
    return {
    	detailDate:'',
      detailView: false,
      pageNum:0,
      finished:false,
      pages:0,
      loading: true,

      scrollTop:0,
      cardHeight: 178 * window.devicePixelRatio,
      searchBarHeight: 44 * window.devicePixelRatio,

      currentIdx: 0,
      cardScrollTop:0,

      searchForm: {
        kpiType:'',
        labelName:'',
        order:'0'
      },

      canGetData: true,

      swiperOption:{
        direction:'vertical',
        height:720
      },

      changedKpiIds: new Set(),
      changedKpiIndex: new Set(),

      hideList: false
    };
  },

  watch:{
    lists(val) {
      if(val.length==0) {

      }
    }
  },

 computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },

  methods: {
  	changeView(val) {
      if(val) {
        this.cardScrollTop = this.$refs.cardListContent.scrollTop;  
        const cards = this.$refs.cardListContent.querySelectorAll('.index-card');
        let flag = false;

        for(let i = 0; i < cards.length; i ++) {
          if( !flag && cards[i].offsetTop > this.scrollTop ){
            this.currentIdx = i;
            flag = true;
            break;
          }
        }
      } else {
        if(this.detailView != val && this.changedKpiIds.size) {
          this.getDetailLists();
        }
      }

      this.detailView = val;

      if(this.detailView) {
        setTimeout( () => {
          this.swiper.slideTo(this.currentIdx);
        },0) 
      } else {
        
        
      setTimeout( () => {
          // console.log('回到 cardScrollTop:',this.cardScrollTop)
          this.$refs.cardListContent.scrollTop = this.cardScrollTop;
        },10)
      }

      this.$emit('notifyViewChange',this.index,this.detailView);
    },

    onListLoad(pageNum) {

      if(this.getListData && this.canGetData) {
        this.canGetData = false;
        this.getListData({
          pageNum, 
          kpiType:this.searchForm.kpiType, 
          labelName:this.searchForm.labelName, 
          order:this.searchForm.order, 
          downFn:(pages,pageNum,isLastPage) => {
            this.pageNum = pageNum;
            this.pages = pages;
            if(isLastPage) { 
              this.finished = true;
              this.loading = false;
            } else {
              this.finished = false; 
              // this.loading = false;
            }

            this.canGetData = true;
          },

          errorFn:() => {
            this.loading = false;
            this.finished = true;
          }
        });
      }
    },

    onscroll(e) {
      // console.warn(e.currentTarget.scrollTop + e.currentTarget.clientHeight >= e.currentTarget.scrollHeight,this.finished);
      if(!this.detailView) {
        this.scrollTop = e.currentTarget.scrollTop;
        if (
          e.currentTarget.scrollTop + e.currentTarget.clientHeight >=
          e.currentTarget.scrollHeight - 100
        ) {
          // this.loading = true;
          // 业务逻辑...
          !this.finished && this.onListLoad(this.pageNum + 1);
        }
      }
      
    },

    onSlideChange() {
      // console.log(this.$refs.mySwiper.swiper.activeIndex,this.lists.length);
      let activeIndex = this.$refs.mySwiper.swiper.activeIndex;
      this.currentIdx = activeIndex;

      this.getDetailList(this.detailDate);

      if(activeIndex == this.lists.length-3 && !this.finished) {
        this.loading = true;
        this.onListLoad(this.pageNum + 1);
      }
      // console.log(this.$refs.mySwiper.swiper,this.$refs.mySwiper.swiper.isEnd)
    },

    onCardClick(index) {
      this.detailView = true;
      this.currentIdx = index;
      this.cardScrollTop = this.$refs.cardListContent.scrollTop;  

      setTimeout( () => {
        this.swiper.slideTo(index);
      },50) 
    },

    onTagClosed() {
      this.$emit('clearKeyword');
    },

    kpiTypeChange(val) {
      if(val.value === '' && this.searchForm.kpiType !== val.value) {
        this.searchForm.kpiType = '';
        this.searchForm.labelName = '';
        this.reGetDatas();
      }

      if(val.type === "kpiType" && this.searchForm.kpiType !== val.value) {
        this.searchForm.kpiType = val.value;
        this.searchForm.labelName = '';
        this.reGetDatas();
      } else if(val.type === "labelName" && this.searchForm.labelName !== val.value) {
        this.searchForm.labelName = val.value;
        this.searchForm.kpiType = '';
        this.reGetDatas();
      }
      // this.getTabDatas();
    },

    orderChange(val) {
      this.searchForm.order = val;
      this.$emit('clearLists');
      this.loading = true;
      this.getListData && this.onListLoad(1);
    },


    reGetDatas() {
      this.$emit('clearLists');
      this.loading = true;
      this.getListData && this.onListLoad(1);
    },

    // 批量更新数据
    getDetailLists() {
      let changedKpiIds = Array.from(this.changedKpiIds);
      let changedKpiIndex = Array.from(this.changedKpiIndex);

      console.warn(changedKpiIds)
      getKpiDataDetailList({
        kpiIds: changedKpiIds,
        dateTime: this.formatterDate(this.search.dateTime,'y-m-d'),
        areaId: this.search.areaCode,
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

    // 查询单个大卡数据
    getDetailList(date) {
      if(date!='') {
        let cardCom =  this.$refs['detailcard'+this.currentIdx][0];
        // 收集改变了日期的指标ID，用于切换至小卡时重新请求数据更改替换
        console.warn(cardCom.data.kpiId);
        this.changedKpiIds.add(cardCom.data.kpiId);
        this.changedKpiIndex.add(cardCom.index);
        cardCom.getKpiDataDetail(cardCom.data,false,date,true);
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

    hideLists(flag) {
      this.hideList = flag;
    }
  },

  created() {
    if(this.$route.params.detailView) {
      if(this.$route.params.tabIndex === this.index){
        this.detailView =  this.$route.params.detailView;  
        this.$emit('notifyViewChange',this.index, this.detailView);
      }
    }
  },

  mounted() {
    this.getListData && this.onListLoad(1);

  }
};
</script>
<style lang='scss'>

.card-list {
  .note-text {
    line-height: 50px;
    height:50px;
    font-size:12px;
    color:#999;
  }
  .content {
    width:100%;
    height: 100%;
    -flex-grow:2;
    overflow:auto;
    display:flex;
    display:flex;
    flex-direction:column;
  }

  .tag-wrap {
    margin-top:12px;
    display:flex;
    padding: 0 10px;
    box-sizing: border-box;
    justify-content: flex-start;
  }

  .van-tag {
    display: inline-block;
    height:24px;
    line-height:25px;
    border-radius: 11px;
    padding: 0 10px;
    position: relative;
    font-size:11px;
  }

  .van-tag__close {
    position: absolute;
    top: -8px;
    width: 16px;
    height: 16px;
    background: #3296FA;
    color: #fff;
    border-radius: 10px;
    font-size: 9px;
    line-height: 16px;
  }
      

  .card-wrap {
    width:100%;
    padding: 10px;
    box-sizing:border-box;
    column-count:2;
    column-gap: 10px;
  }

  .mt10 {
    margin-top:8px;
  }

  .van-list__loading {
    width:100%;
    float: left;
  }

  .van-list__placeholder {
    width: 100%;
  }

  .custom-swipe-wrap {
     height:100%; 
     min-height:100%;
     overflow:hidden;
  }

}

  

</style>

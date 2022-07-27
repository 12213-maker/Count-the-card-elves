<template>
  <div class="home-page">
    <HeaderComponent
    :tabIndex="active" 
    :parent="parent"
    :detailDate="detailDate"
    :detailView="tabs[active].detailView"
    ref="header"
    @areaCodeChange="areaCodeChange" 
    @dateChange="dateChange"
    @kpiModelChange="kpiModelChange"></HeaderComponent>

    <van-tabs 
    v-model="active" 
    class='tab' 
    @click='tabChange' 
    style="min-height:200px; flex-grow:2;">
      <van-tab
      v-for="(item,index) in tabs" 
      :key="index" 
      :title="item.title">
        <card-list 
        :parent="parent"
        :lists='item.lists' 
        :getListData="item.getListData" 
        :ref="'cardList'+index" 
        :index='index'
        :keyword="searchForm.keyword"
        :areaId='searchForm.areaCode'
        :search='searchForm'
        :showNote = "item.showNote"
        :formatterDate = "formatterDate"
        @clearKeyword="clearKeyword"
        @clearLists="clearLists(index)"
        @notifyViewChange="notifyViewChange">
        </card-list>
      </van-tab>
    </van-tabs>
    
  </div>
</template>

<script>
import CardList from '@/components/CardList';

import {
  getCheckKpiData,
  getAllKpiData,
  getFocusKpiData,
  getRecommendKpiData
} from '@/api/home/index.js';

export default {
  name: 'Home',
  components:{
    CardList
  },
  data() {
    const date = this.$store.state.dateTime?this.$store.state.dateTime:new Date().getTime();
    const _this = this;
    return {
      parent: _this,
      cascaderValue:'',
      searchForm:{
        kpiModel:'',
        // kpiType:'',
        // labelName:'',
        // rank:0,
        keyword: '',
        dateTime:date,
        areaCode: sessionStorage.getItem('currentAreaCode') ? sessionStorage.getItem('currentAreaCode') : sessionStorage.getItem('areaId'),
        pageSize:10,
        areaName: sessionStorage.getItem('currentAreaName') ? sessionStorage.getItem('currentAreaName') : sessionStorage.getItem('areaName')
      },
      
      active:0,

      tabs:[
        {
          title:'应知', 
          lists:[],
          detailView:false,
          getListData:  _this.getCheckKpiData,
          showNote: false
        },
        {
          title:'推荐', 
          lists:[],
          detailView:false,
          getListData:  _this.getRecommendKpiData,
          showNote: false
        },
        {
          title:'关注', 
          lists:[],
          detailView:false,
          getListData:  _this.getFocusKpiData,
          showNote: false
        },
        {
          title:'全部', 
          lists:[],
          detailView:false,
          getListData:  _this.getAllKpiData,
          showNote: false
        }
      ],

      detailDate:''

    };
  },
 

  provide() {
    return {
      parent: this  
    }
  },

  watch: {
    focusChange(val) {
      if(val) {

      }
    },

    detailDate(val) {
      console.log('detailDate 改变了',val)
    }

  },

  created() {
    if(this.$store.state.dateTime=='') {
      this.$store.commit('setDateTime',new Date());  
    }
  },

  mounted() {
    console.warn('route params',this.$route.params);
    
    if(this.$route.params.keyword) {
      localStorage.setItem('keyword',this.$route.params.keyword);
    }

    if(localStorage.getItem('clearKeyword')==='false') {
      this.searchForm.keyword =  localStorage.getItem('keyword',this.$route.params.keyword);
    }

    if(this.$route.params.tabIndex) {
      this.active =  parseInt(this.$route.params.tabIndex);
    }

    /*setTimeout(()=>{
      this.active = parseInt(localStorage.getItem('homeActive'));  
    },0)*/
  },

  methods:{

    tabChange(val) {
      // tab点击切换数据
      localStorage.setItem('homeActive',val);
      setTimeout(()=>{
        this.detailDate = '';  
        this.$refs.header.dateTime = this.searchForm.dateTime;
        this.$refs[`cardList${val}`][0].changeView(false);
      },1)
    },

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

    dealListsData(data,idx,callback) {
      console.warn(data);

      let tempArr = JSON.parse( JSON.stringify(this.tabs[idx].lists) );
      if(tempArr.length && !tempArr[tempArr.length - 1].kpiName) {
        tempArr.splice(arr.length - 1);
      }
      
      tempArr = tempArr.concat(data.list);
      /*
      if(tempArr.length % 2 !== 0) {
        tempArr.push({
          kpiName: null
        });
      }
      */

      this.tabs[idx].lists = tempArr;
      callback && callback(data.pages,data.pageNum,data.isLastPage);
      
    },

    getDatas(params,api,tabIdx) {
      const data = {
        areaId: this.searchForm.areaCode,
        dateTime: this.formatterDate(this.searchForm.dateTime,'y-m-d'),
        kpiModel: this.searchForm.kpiModel,
        kpiType:params.kpiType,
        labelName:params.labelName,
        kpiName: this.searchForm.keyword,
        userId: '1',
        pageSize: this.searchForm.pageSize,
        pageNum:params.pageNum,
        order:params.order
      };

      api(data).then((res) => {
        if(res.success) {
          if(res.data.total==0) {
            this.tabs[tabIdx].showNote = true;
          } else {
            this.tabs[tabIdx].showNote = false;
          }
          this.dealListsData(res.data, tabIdx, params.downFn);
        } else {
          params.errorFn && params.errorFn();
        }
      }).catch((err) => {
        params.errorFn && params.errorFn();
      });
    },

    // 应知列表
    getCheckKpiData(params) {
      this.getDatas(params,getCheckKpiData,0);
    },

    // 推荐列表
    getRecommendKpiData(params) {
      this.getDatas(params,getRecommendKpiData,1);
    },

    // 关注列表
    getFocusKpiData(params) {
      this.getDatas(params,getFocusKpiData,2);
    },

    // 全部列表
    getAllKpiData(params) {
      this.getDatas(params,getAllKpiData,3);
    },

    getTabDatas() {
      this.tabs.forEach((tab,idx) => {
        this.tabs[idx].lists = [];
        const refName = `cardList${idx}`;
        if(this.$refs[refName]){
          this.$refs[refName][0].loading = true;
          this.$refs[refName][0].onListLoad(1);
          // this.$refs[refName][0].$refs.searchBar.getKpiType();
          // this.$refs[refName][0].$refs.searchBar.getCustomLabel();
        }
      })
    },

    areaCodeChange(val,name) {
      console.warn('this.searchForm.areaCode',val,name);
      if(this.searchForm.areaCode !== val) {
        this.searchForm.areaCode = val;
        this.searchForm.areaName = name;
        sessionStorage.setItem('currentAreaCode',val);
        sessionStorage.setItem('currentAreaName',name);
        this.getTabDatas();
      }
    },

    dateChange(val) {
      const cardList = this.$refs[`cardList${this.active}`][0];
      const recommandList = this.$refs[`cardList${this.active}`][0].$refs.recommandList;

      if( !cardList.detailView && (!recommandList || (recommandList && !recommandList.detailView))  ){
        if(this.searchForm.dateTime !== val) {
          this.searchForm.dateTime = val;
          this.getTabDatas();
        }
      }

      if(recommandList && recommandList.detailView) {
        this.detailDate = recommandList.detailDate = val;   
        recommandList.getDetailList(val);
      }
      
      // 大卡时，根据日期查询当前大卡数据
      if(cardList.detailView) {
        this.detailDate = cardList.detailDate = val;  
        cardList.getDetailList(val);
      }
    },

    kpiModelChange(val) {
      if(this.searchForm.kpiModel !== val) {
        this.searchForm.kpiModel = val;
        this.getTabDatas();
      }
    },

    clearKeyword() {
      this.searchForm.keyword = '';
      localStorage.setItem('clearKeyword',true);
      localStorage.setItem('keyword','');
      this.getTabDatas();
      /*this.tabs[this.active].lists = [];
      callback && callback();*/
    },

    clearLists(index) {
      this.tabs[index].lists = [];
    },

    notifyViewChange(tabindex, detailView){
      this.tabs[tabindex].detailView = detailView;
      if(!detailView) {
        this.$refs[`cardList${tabindex}`][0].detailDate = '';  
        this.detailDate = '';  
        this.$refs.header.dateTime = this.searchForm.dateTime;
      }
    }

  }
};
</script>
<style lang="scss">


.home-page {
  display:flex;
  flex-direction:column;
  
  .van-tabs {
   display: flex;
   flex-direction: column;
  }
  .van-tabs__wrap {
    box-sizing:border-box;
    background:#fff;
    border-bottom: 1px solid #eee; 
    height:42px;
    min-height:42px;
  }
  .van-tabs__content {
    flex-grow:2;
    min-height: 100px;

    .van-tab__pane {
      height: 100%;
      display:flex;
      flex-direction:column;

    }
  }
}
</style>

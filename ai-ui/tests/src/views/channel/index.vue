<!--
 * @Author: your name
 * @Date: 2022-02-17 14:49:16
 * @LastEditTime: 2022-03-01 16:58:46
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \gz-index\ai-ui\src\views\channel\index.vue
-->
<template>
  <div class="channel-page">
    <div class="page-header">
      <a class="location-wrap" @click="onShowArea">
        <van-icon :name="require('@/assets/images/location-icon.png')" class="icon" />
        <span class="location">{{ area.areaName }}</span>
      </a>

      <van-dropdown-menu>
        <van-dropdown-item v-model="searchForm.index" :options="indexOptions" />
      </van-dropdown-menu>

      <a class="operation-wrap">
        <van-icon
          :name="require('@/assets/images/search-icon.png')"
          class="icon date-icon"
          @click="doSearch"
        />
        <span class="date" @click="calendarShow = !calendarShow">{{
          currentDate | formatDate($dayjs)
        }}</span>
      </a>
    </div>
    <div class="page-content">
      <van-tabs v-model="active" class="tab">
        <van-tab v-for="(item, index) in tabs" :key="index" :title="item.title">
          <channel-list
            :dateTime="dateTime"
            :list="item.list"
            @onRefresh="onRefresh"
            @getDatas="getNextPageData"
            :finished="item.finished"
          />
        </van-tab>
      </van-tabs>
    </div>

    <!-- <van-calendar v-model="calendarShow" @confirm="onDateConfirm" /> -->
    <van-action-sheet v-model="calendarShow">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        @confirm="onDateConfirm"
        @cancel="onDateCancel"
      />
    </van-action-sheet>

    <!-- <van-action-sheet v-model="showArea">
      <van-area
        title="选择地区"
        :area-list="areaList"
        @confirm="onAreaFinish"
        @cancel="onCancel"
      />
    </van-action-sheet> -->
    <van-popup v-model="showArea" round position="bottom">
      <van-cascader
        v-model="area.areaId"
        ref="cascader"
        title="请选择所在地区"
        :options="areaList"
        :field-names="{
          text: 'areaName',
          value: 'areaId'
        }"
        @close="showArea = false"
        @finish="onAreaFinish"
        @change="onChange"
      />
    </van-popup>
  </div>
</template>

<script>
import ChannelList from './ChannelList.vue';
import channelApi from '@/api/channel';
export default {
  name: 'Channel',
  components: {ChannelList},
  data() {
    return {
      searchForm: {
        index: 0,
        type: '全部分类',
        typeCode: 0,
        rank: 0,
        keyword: ''
      },

      indexOptions: [
        {text: '全部类型', value: 0},
        {text: '小时指标', value: 1},
        {text: '日指标', value: 2},
        {text: '月指标', value: 3}
      ],

      active: 2,
      showArea: false,
      tabs: [
        {
          title: '应知', 
          lists: [], 
          finished:false,
          page: {
            pageNum: 1,
            pageSize: 20,
            total: 0
          },
          list:[]
        },
        {
          title: '关注', 
          lists: [], 
          finished:false,
          page: {
            pageNum: 1,
            pageSize: 20,
            total: 0
          },
          list:[]
        },
        {
          title: '全部', 
          lists: [], 
          finished:false,
          page: {
            pageNum: 1,
            pageSize: 200,
            total: 0
          },
          list:[]
        }
      ],
      areaList: [],

      calendarShow: false,
      currentDate: new Date(),
      /*page: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },*/
      // list: [],

      finished:false,

      areaId:sessionStorage.getItem('areaId'),
      areaName:sessionStorage.getItem('areaName'),
      areaLevel:sessionStorage.getItem('areaLevel'),
      area: {
        areaName: sessionStorage.getItem('currentAreaName1') || sessionStorage.getItem('areaName'),
        areaLevel: sessionStorage.getItem('areaLevel'),
        areaId: sessionStorage.getItem('currentAreaCode1') || sessionStorage.getItem('areaId') //已选地区编码
      },
      areaTree: {},
      dateTime:''
    };
  },
  filters: {
    formatDate(value, dayjs) {
      return dayjs(value).format('YYYYMMDD');
    }
  },
  watch: {
    active(val) {
        this.tabs[val].list = [];
        this.tabs[val].page.pageNum = 1;
        this.getData(val);
    },
    'searchForm.index': function () {
      this.tabs.forEach(tab=>{
        tab.list = [];
        tab.page.pageNum = 1;
      })
      this.getData(this.active);
    }
  },
  created() {
    const {keyword} = this.$route.query;
    this.searchForm.keyword = keyword;
    this.areaTree[this.area.areaId] = {...this.area};
    this.getAreaInfo();
    this.getData(this.active);
    this.getChannelUpdateDate();
  },
  methods: {
    onAreaFinish(data) {
      this.showArea = false;
      console.log('选择区域完毕', data, this.areaTree);
      const {value} = data;
      if (value.indexOf('all') != -1) {
        const areaId = value.split('-')[1];

        if(data.selectedOptions.length==1) {
          this.area.areaName = this.areaName;
          this.area.areaId = this.areaId;
        } else {
          // this.$emit('areaCodeChange', areaId, this.areaTree[areaId].areaName);

          this.area.areaName = this.areaTree[areaId].areaName;
          this.area.areaLevel = this.areaTree[areaId].areaLevel;
          this.area.areaId = areaId;
        }

        sessionStorage.setItem('currentAreaCode1',areaId);
        sessionStorage.setItem('currentAreaName1',this.area.areaName);
      } else {
        this.area.areaName = this.areaTree[value].areaName;
        sessionStorage.setItem('currentAreaCode1',this.areaTree[value].areaId);
        sessionStorage.setItem('currentAreaName1',this.areaTree[value].areaName);
      }

      this.tabs.forEach(tab=>{
        tab.list = [];
        tab.page.pageNum = 1;
      })
      this.getData(this.active);
    },
    // 切换区域选择
    onChange(data) {
      sessionStorage.setItem('selectedOptions1',JSON.stringify(data.selectedOptions));
      const {value} = data;
      if ((this.areaTree[value] && this.areaTree[value].areaLevel == '6')) return;
      const params = {
        areaId: value,
        areaLevel: this.areaTree[value].areaLevel
      };
      channelApi.getAreaInfo(params).then((res) => {
        if (res.code == 0) {
          const children = (res.data || []).map((ele) => {
            const {areaId, areaLevel} = ele;
            if (areaLevel != '6') {
              ele.children = [];
            }
            this.areaTree[areaId] = ele;
            return ele;
          });
          const allData = {
            areaName: '全部',
            areaId: `all-${params.areaId}`,
            areaLevel: `all-${params.areaLevel}`
          };
          this.areaTree[value].children = [allData, ...children];
          this.$refs.cascader.tabs[data.tabIndex+1].options = [allData, ...children];

          setTimeout(()=>{
            if (value.indexOf('all') != -1) return;  
          },200)
        }
      });
    },

    onDateConfirm(val) {
      this.calendarShow = false;
      this.currentDate = val;
      this.tabs.forEach(tab=>{
        tab.list = [];
        tab.page.pageNum = 1;
      })

      this.getData(this.active);
    },

    onDateCancel() {
      this.calendarShow = false;
    },
    // 查询区域
    getAreaInfo() {
      const params = {
        areaId: this.areaId,
        areaLevel: this.areaLevel
      };
      channelApi.getAreaInfo(params).then((res) => {
        if (res.code == 0) {
          const children = (res.data || []).map((ele) => {
            const {areaId, areaLevel} = ele;
            if (areaLevel != '6') {
              ele.children = [];
            }
            this.areaTree[areaId] = ele;
            return ele;
          });
          const allData = {
            areaName: '全部',
            areaId: `all-${params.areaId}`,
            areaLevel: `all-${params.areaLevel}`
          };
          this.areaList = [allData, ...children];
        }
      });
    },
    // 查询应知渠道洞察
    getData(idx) {
      let func = '';
      switch (idx) {
        case 0:
          func = 'getCheckChannelInsight';
          break;

        case 1:
          func = 'getFocusChannelInsight';
          break;

        case 2:
          func = 'getAllChannelInsight';
          break;

        default:
          break;
      }
      const {pageNum, pageSize} = this.tabs[idx].page;
      let areaId = '';
      if (this.area.areaId.indexOf('all') != -1) {
        areaId = this.area.areaId.split('-')[1];
      } else {
        areaId = this.area.areaId;
      }
      const data = {
        areaId,
        dateTime: this.$dayjs(this.currentDate).format('YYYY-MM-DD HH:mm:ss'),
        kpiModel: this.searchForm.index || undefined,
        kpiName: this.searchForm.keyword,
        pageNum,
        pageSize
      };

      if (func == 'getFocusChannelInsight') {
        data.userId = '1';
      }
      channelApi[func](data).then((res) => {
        if (res.code == 0) {
          this.tabs[idx].list = this.tabs[idx].list.concat(res.data.list);
          this.tabs[idx].page.total = res.data.total;
          this.tabs[idx].finished = res.data.isLastPage;
        }
      });
    },

    getNextPageData() {
      if(!this.tabs[this.active].finished) {
        this.tabs[this.active].page.pageNum++;
        this.getData(this.active);
      }
    },

    // 下拉刷新
    onRefresh() {
      this.tabs[this.active].list = [];
      this.tabs[this.active].page.pageNum = 1;
      this.getData(this.active);
    },

    // 搜索
    doSearch() {
      const {name} = this.$route;
      this.$router.push({
        path: '/search/index',
        query: {
          redirectUrl: name,
          noInput: true
        }
      });
    },

    getChannelUpdateDate() {
      channelApi.getChannelUpdateDate()
      .then(res => {
        this.dateTime = res.msg;
      })
    },

    onShowArea() {
      if(this.area.areaLevel != 6) {
        this.showArea = true;

        let selectedOptions = JSON.parse(sessionStorage.getItem('selectedOptions1'));
        let idx = 0;
        setTimeout(()=>{
          console.log(this.$refs.cascader,selectedOptions)
          this.$refs.cascader.tabs[idx].selectedOption = selectedOptions[idx];
          this.updateTabs(idx,selectedOptions);
        },0);
      }
    },


    updateTabs(idx,selectedOptions){

      this.areaTree[selectedOptions[idx].areaId] = selectedOptions[idx]; 
      if(selectedOptions[idx].children) {
        selectedOptions[idx].children.forEach(item=>{
          this.areaTree[item.areaId] = item;
        })
      }

      if(selectedOptions[idx+1]) {
        this.$refs.cascader.tabs.push({
          options:[],
          selectedOption:[]
        })
        // this.getAreaInfoById(selectedOptions[idx].areaId, selectedOptions[idx].areaLevel, idx, selectedOptions);
        
        setTimeout(()=>{
          console.log(this.$refs.cascader.tabs[idx+1])
          this.$refs.cascader.activeTab = idx+1;
          this.$refs.cascader.tabs[idx+1].options = selectedOptions[idx].children;
          this.$refs.cascader.tabs[idx+1].selectedOption = selectedOptions[idx+1];  
          idx++;
          this.updateTabs(idx,selectedOptions);
        },100)
      }
    },
  }
};
</script>

<style scoped lang="scss">
.channel-page {
  display: flex;
  flex-direction: column;
  overflow: hidden !important;
  .page-header {
    display: flex;
    background: #53a7ff;
    align-items: center;

    justify-content: space-between;

    // height: 44px;
    padding: 0 12px;
    box-sizing: border-box;

    ::v-deep .van-dropdown-menu__bar {
      background: none;
      box-shadow: none;
    }

    ::v-deep .van-dropdown-menu__title {
      color: #fff;
      font-size: 17px;
    }

    ::v-deep .van-dropdown-menu__title::after {
      font-size: 14px;
      border-color: transparent transparent #fff #fff;
    }
  }
  .page-content {
    flex: 1;
    overflow: auto;
  }
  .location-wrap {
    color: #fff;
    display: flex;
    align-items: center;
    z-index: 99;
    height: 38px;
    box-sizing: border-box;

    .location {
      font-size: 12px;
      width: 42px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .operation-wrap {
    color: #fff;
    display: flex;
    align-items: center;
    width: auto;
    height: 38px;
    justify-content: center;
    z-index: 99;

    .van-icon-search {
      display: flex;
      width: 44px;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    .date {
      display: inline-block;
      width: auto;
      font-size: 12px;
    }
    .date-icon {
      width: 44px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  ::v-deep .van-tabs {
    display: flex;
    flex-direction: column;
  }
  ::v-deep .van-tabs__wrap {
    box-sizing: border-box;
    background: #fff;
    border-bottom: 1px solid #eee;
  }
  ::v-deep .van-tabs__content {
    flex-grow: 2;

    .van-tab__pane {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>

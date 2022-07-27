<template>
  <div class="report-layout">
    <!-- <h2>指标报表</h2> -->
    <div class="report-title">
      <h2>指标报表</h2>
      <van-icon name="plus" @click="jumpToAdd" class="icon-plus" />
    </div>
    <van-tabs v-model="tabActive" class="tab" @click="tabChange" type="line">
      <van-dropdown-menu duration="0.3">
        <van-dropdown-item title="排序" ref="dropdownItem1">
          <header class="header-sort-style">排序方式</header>
          <div class="selected">
            <p @click="activeSortType = 2">
              创建时间 倒序排序
              <span v-show="activeSortType == 2"
                ><img src="@/assets/images/select-icon.png" alt=""
              /></span>
            </p>
          </div>
          <div class="selected">
            <p @click="activeSortType = 1">
              创建时间 正序排序<span v-show="activeSortType == 1"
                ><img src="@/assets/images/select-icon.png" alt=""
              /></span>
            </p>
          </div>
          <footer class="confirm-filter">
            <div class="reset-all filter-button-style" @click="sortReset">
              重置
            </div>
            <div class="confirm-select filter-button-style" @click="sortByType">
              确定
            </div>
          </footer>
        </van-dropdown-item>
        <van-dropdown-item title="筛选" ref="dropdownItem2">
          <header class="key-search-style">关键词查询</header>
          <van-search v-model="keySearchValue" placeholder="输入搜索关键词" />
          <div class="box"></div>
          <footer class="confirm-filter">
            <div class="reset-all filter-button-style" @click="searchReset">
              重置
            </div>
            <div
              class="confirm-select filter-button-style"
              @click="searchByKey"
            >
              确定
            </div>
          </footer>
        </van-dropdown-item>
      </van-dropdown-menu>
      <van-tab v-for="(tab, index) in tabs" :key="index" :title="tab.title">
        <van-list
          v-model="tab.loading"
          :finished="tab.isLastPage"
          finished-text="没有更多了"
          @load="tab.onLoad"
        >
          <div
            class="msg-list-wrap"
            v-for="(msg, idx) in tab.lists"
            :key="idx"
            @click="onMsgClick(msg, idx)"
          >
            <div class="msg-list-wrap-left">
              <div v-show="tabActive == 0">
                <span>{{ msg.taskName }}</span>
                <p>考核类型：{{ msg.taskType == "1" ? "绩效考核" : "" }}</p>
                <p>考核周期：{{ msg.taskCycleStr }}</p>
              </div>
              <div v-show="tabActive == 1">
                <p>{{ msg.taskName }}<i v-show="msg.isRead == 0" style="background: red"></i></p>
                <p>浏览数量：{{ msg.viewsNumber }}</p>
                <p>截止时间：{{ msg.deadlineDate }}</p>
              </div>
            </div>
            <div class="msg-list-wrap-right">
              <div v-show="tabActive == 0">
                <p v-if="msg.taskState == '131'">
                  <i style="background: red"></i><span>已完结</span>
                </p>
                <p v-if="msg.taskState == '130'">
                  <i style="background: green"></i><span>进行中</span>
                </p>
                <p>{{ msg.userName }}</p>
              </div>
              <div v-show="tabActive == 1">
                <p v-if="msg.state == 0">
                  <i style="background: red"></i><span>已过期</span>
                </p>
                <p v-if="msg.state == 1">
                  <i style="background: green"></i><span>进行中</span>
                </p>
                <p>{{ msg.createUserName }}</p>
              </div>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { getKpiTask, getKpiSpecTask } from "@/api/report/index.js";
export default {
  data() {
    const _this = this;
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        areaId: sessionStorage.getItem("areaId"), //区域id
        areaLevel: sessionStorage.getItem("areaLevel"), //区域等级
        // areaId: '851', //区域id
        // areaLevel: 2, //区域等级
        dateTime: "", //创建时间
        order: 2, //默认2为时间倒序,1为时间正序
        //taskName:"" //搜索关键词
      },
      tabActive: 0,
      activeSortType: 2, //排序方式:2为默认时间倒序,1为时间正序
      keySearchValue: "", //搜索关键词
      searchForm: {
        tab0: {
          sortType: 2,
          searchKey: "",
        },
        tab1: {
          sortType: 2,
          searchKey: "",
        },
      },
      tabs: [
        {
          title: "考核报表",
          pageNum: 1,
          isLastPage: false,
          loading: false,
          lists: [],
          finished: false,
          onLoad() {
            console.log('load data-------------')
            _this.getMessage(0);
          },
        },
        {
          title: "专题报表",
          pageNum: 1,
          isLastPage: false,
          loading: false,
          lists: [],
          finished: false,
          onLoad() {
            _this.getMessage(1);
          },
        },
      ],
    };
  },
  watch: {
    tabActive() {
      console.log("tab值改变",console.log(this.tabActive));
      this.activeSortType = this.searchForm[`tab${this.tabActive}`].sortType;
      this.keySearchValue = this.searchForm[`tab${this.tabActive}`].searchKey;
    },
  },
  created() {
    //获取离开当前页面时的tab值和筛选与排序的值
    if (
      sessionStorage.getItem("tabIndx") ||
      sessionStorage.getItem("searchForm")
    ) {
      this.tabActive = JSON.parse(sessionStorage.getItem("tabIndx"));
      this.searchForm = JSON.parse(sessionStorage.getItem("searchForm"));
    }
  },
  mounted() {
    this.getMessage(this.tabActive);
    //this.tabs[index].onLoad()
  },
  destroyed() {
    //记录销毁当前页面时的tab值和筛选与排序的值
    sessionStorage.setItem("tabIndx", JSON.stringify(this.tabActive));
    sessionStorage.setItem("searchForm", JSON.stringify(this.searchForm));
  },
  methods: {
    //请求数据的方法
    getMessage(tabIndx) {
      console.log("tabIndx:", tabIndx);
      this.tabs[tabIndx].loading = true;
      this.queryParams.pageNum = this.tabs[tabIndx].pageNum;
      //根据关键词搜索
      if (this.searchForm[`tab${this.tabActive}`].searchKey != "") {
        this.queryParams.taskName =
          this.searchForm[`tab${this.tabActive}`].searchKey;
      }
      if (this.searchForm[`tab${this.tabActive}`].sortType) {
        this.queryParams.order =
          this.searchForm[`tab${this.tabActive}`].sortType;
      }

      if(this.queryParams.pageNum==1){
        this.tabs[tabIndx].lists = [];
      }

      if (tabIndx == 0) {
        getKpiTask(this.queryParams)
          .then((res) => {
            // res.data.list.forEach((i) => this.tabs[tabIndx].lists.push(i));
            this.tabs[tabIndx].lists = this.tabs[tabIndx].lists.concat(res.data.list);

            // this.tabs[tabIndx].lists = res.data.list;
            this.tabs[tabIndx].loading = false;
            this.tabs[tabIndx].isLastPage = res.data.isLastPage;
            if (res.data.isLastPage) {
              return;
            }
            this.tabs[tabIndx].pageNum++;
          })
          .finally(() => {
            this.$toast.clear();
          });
      } else {
        getKpiSpecTask(this.queryParams)
          .then((res) => {
            // res.data.list.forEach((i) => this.tabs[tabIndx].lists.push(i));
            this.tabs[tabIndx].lists = this.tabs[tabIndx].lists.concat(res.data.list);
            // this.tabs[tabIndx].lists = res.data.list;
            this.tabs[tabIndx].loading = false;
            this.tabs[tabIndx].isLastPage = res.data.isLastPage;
            if (res.data.isLastPage) {
              return;
            }
            this.tabs[tabIndx].pageNum++;
          })
          .finally(() => {
            this.$toast.clear();
          });
      }
    },

    //事件的方法
    tabChange(tabIndx) {
      delete this.queryParams.taskName
      if (this.tabs[tabIndx].lists.length == 0) {
        this.getMessage(tabIndx);
      }
    },
    onMsgClick(msg) {
      if (this.tabActive == 0) {
        sessionStorage.setItem("reportDetail", JSON.stringify(msg));
        this.$router.push({ path: "/reportDetail/index", query: msg });
      } else if (this.tabActive == 1) {
        sessionStorage.setItem("specialReportDetail", JSON.stringify(msg));
        this.$router.push({ path: "/specialReportDetail/index", query: msg });
      }
    },
    sortReset() {
      this.activeSortType = 2;
      this.searchForm[`tab${this.tabActive}`].sortType = 2;
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.tabs[this.tabActive].pageNum =1;
      this.getMessage(this.tabActive);
      //点击按钮后隐藏下拉框
      this.$refs.dropdownItem1.toggle(false);
    },
    sortByType() {
      this.searchForm[`tab${this.tabActive}`].sortType = this.activeSortType;
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.tabs[this.tabActive].pageNum =1;

      this.getMessage(this.tabActive);
      this.$refs.dropdownItem1.toggle(false);
    },
    searchReset() {
      this.keySearchValue = "";
      this.searchForm[`tab${this.tabActive}`].searchKey = "";
      delete this.queryParams.taskName;
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.tabs[this.tabActive].pageNum =1;
      this.getMessage(this.tabActive);
      this.$refs.dropdownItem2.toggle(false);
    },
    searchByKey() {
      this.searchForm[`tab${this.tabActive}`].searchKey = this.keySearchValue;
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      //
      if (
        this.queryParams.taskName !=
        this.searchForm[`tab${this.tabActive}`].searchKey
      ) {
        delete this.queryParams.taskName;
      }
      this.tabs[this.tabActive].pageNum =1;
      this.getMessage(this.tabActive);
      this.$refs.dropdownItem2.toggle(false);
    },
    //跳转到新增页面
    jumpToAdd() {
      this.$router.push({
        path: "/newAdd/index",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
$primary-color: #53a7ff;
.report-layout {
  .report-title {
    ::v-deep .icon-plus,
    .van-icon van-icon-plus {
      color: white !important;
      font-size: 16px !important;
      position: absolute;
      top: 13px;
      right: 20px;
    }
  }
  .box {
    height: 200px;
  }
  background: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  ::v-deep .van-tabs__line {
    position: absolute;
    bottom: 15px;
    left: 0;
    z-index: 1;
    min-width: 100px;
    height: 30px;
    padding: 0 10px;
    background-color: $primary-color;
    border-radius: 30px;
    box-sizing: content-box;
    color: #fff;
  }
  ::v-deep .van-tab--active {
    font-weight: 500;
    color: #fff;
    z-index: 999;
  }
  ::v-deep .van-tab__text--ellipsis {
    margin-top: 1rem;
  }
  h2 {
    font-size: 18px;
    line-height: 45px;
    height: 45px;
    background: $primary-color;
    color: #fff;
    width: 100%;
    font-weight: 400;
  }
  .tab {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    .header-sort-style,
    .key-search-style {
      height: 1.5rem;
      text-align: left;
      padding-left: 0.5rem;
      background-color: #fff;
      padding: 0px 30px 0px 20px;
      font-size: 14px;
      color: #666666;
      font-family: "微软雅黑 Bold", "微软雅黑 Regular", "微软雅黑", sans-serif;
      font-weight: 700;
      font-style: normal;
      text-align: left;
      line-height: 20px;
    }
    ::v-deep .van-dropdown-menu {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
    }
    /* ::v-deep .van-tab__pane {
      margin-top:55px ;
    } */
    .selected:nth-child(3) {
      margin-bottom: 200px;
    }
    .selected {
      width: 335px;
      height: 40px;
      border: 1px solid #f7f7f7;
      line-height: 40px;
      margin: 0 auto;
      p {
        text-align: left;
        text-indent: 2rem;
        font-size: 12px;
        span {
          float: right;
          img {
            margin-right: 10px;
          }
        }
      }
    }
    .confirm-filter {
      display: flex;
      background-color: #f1f1f1;
      width: 100%;
      border-top: 2px solid #f7f7f7;
      .filter-button-style {
        width: 50%;
        font-size: 0.8rem;
        line-height: 50px;
        height: 50px;
        // .van-search {
        //   margin-bottom: 100px;
        // }
      }
      .reset-all {
        background-color: #fff;
        border: 0.025rem solid #fff;
      }
      .confirm-select {
        background-color: $primary-color;
        color: #fff;
        border: 0.025rem solid $primary-color;
        span {
          color: #fff;
        }
      }
    }
    ::v-deep .van-tabs__content {
      flex: 1;
      overflow: auto;
      width: 100%;
      background: #f5f5f5;
    }

    .msg-list-wrap {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: space-between;
      margin-bottom: 10px;
      background: #fff;
      border-radius: 10px;
      padding: 10px;
      margin: 10px;
      color: rgb(153, 163, 183);
      cursor: pointer;
      .msg-list-wrap-left {
        text-align: left;
        i {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            vertical-align: 2px;
            margin-left: 5px;

          }
        p {
          display: inline-block;
          line-height: 24px;
          height: 24px;
          width: 280px;
          font-size: 13px;
          font-weight: bold;
          word-break: break-all;/* 允许在单词内换行 */
          /* text-overflow:ellipsis; 
          overflow:hidden;
          white-space: nowrap; */
        }
        p {
          line-height: 24px;
          font-size: 12px;
          
        }
      }
      .msg-list-wrap-right {
        font-size: 12px;
        p {
          width: 45px;
          i {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            vertical-align: 2px;
            margin-right: 3px;
          }
          line-height: 36px;
        }
      }
    }
  }
}
</style>

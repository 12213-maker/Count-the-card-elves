<template>
  <div class="report-layout">
    <h2>指标报表</h2>
    <van-tabs v-model="active" class="tab" @click="tabChange">
      <van-tab v-for="(tab, index) in tabs" :key="index" :title="tab.title">
        <van-list
          v-model="tab.loading"
          :finished="tab.isLastPage"
          finished-text="没有更多了"
          @load="getMessage"
        >
          <div
            class="msg-list-wrap"
            v-for="(msg, idx) in tab.lists"
            :key="idx"
            @click="onMsgClick(msg, idx)"
          >
            <div class="msg-list-wrap-left">
              <span>{{ msg.taskName }}</span>
              <p>考核类型：{{ msg.taskType == "1" ? "绩效考核" : "" }}</p>
              <p>考核周期：{{ msg.taskCycleStr }}</p>
            </div>
            <div class="msg-list-wrap-right">
              <p v-if="msg.taskState == '131'">
                <i style="background: red"></i><span>已完结</span>
              </p>
              <p v-if="msg.taskState == '130'">
                <i style="background: green"></i><span>进行中</span>
              </p>
              <p>{{ msg.userName }}</p>
            </div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { getKpiTask } from "@/api/report/index.js";

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
      },
      active: 0,
      tabs: [
        {
          title: "考核报表",
          pageNum: 1,
          isLastPage: false,
          loading: false,
          lists: [],
          finished: false,
          onLoad() {
            _this.getMessage(0);
          },
        },
        // {
        //   title: "专题报表",
        //   pageNum: 1,
        //   isLastPage: false,
        //   loading: false,
        //   lists: [],
        //   finished: false,
        //   onLoad() {
        //     _this.getMessage(1);
        //   },
        // },
        // {
        //   title: "全部",
        //   pageNum: 1,
        //   isLastPage: false,
        //   loading: false,
        //   lists: [],
        //   finished: false,
        //   onLoad() {
        //     _this.getMessage(1);
        //   },
        // },
      ],
    };
  },
  mounted() {
    this.getMessage(0);
  },
  methods: {
    getMessage(tabIndx) {
      console.log(tabIndx);
      this.tabs[tabIndx].loading = true;
      this.queryParams.pageNum = this.tabs[tabIndx].pageNum;
      getKpiTask(this.queryParams).then((res) => {
        res.data.list.forEach((i) => {
          this.tabs[tabIndx].lists.push(i);
        });
        // this.tabs[tabIndx].lists = res.data.list;
        this.tabs[tabIndx].loading = false;
        console.log(res.data.isLastPage);
        if (res.data.isLastPage) {
          this.tabs[this.active].isLastPage = true;
          return;
        }
        this.tabs[tabIndx].pageNum++;
      });
    },
    tabChange(val) {
      if (this.tabs[val].lists.length == 0) {
        this.getMessage(val);
      }
    },
    onMsgClick(msg) {
      sessionStorage.setItem("reportDetail", JSON.stringify(msg));
      this.$router.push({ path: "/reportDetail/index", query: msg });
    },
  },
};
</script>
<style  lang="scss" scoped>
.report-layout {
  background: #fff;
  height: 100vh;
  display: flex;
  flex-direction: column;
  h2 {
    font-size: 18px;
    line-height: 45px;
    height: 45px;
    background: #53a7ff;
    color: #fff;
    width: 100%;
    font-weight: 400;
  }
  .tab {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    // ::v-deep .van-tabs__wrap {
    //   // background: #fff;
    //   height: 35px;
    //   width: 100%;
    //   margin-top: 10px;
    //   margin-bottom: 5px;

    //   .van-tabs__nav--card {
    //     border: none;
    //     .van-tab--active {
    //       border-radius: 15px;
    //       background: #eeeeee;
    //       color: #000;
    //     }
    //     .van-tab {
    //       border: none;
    //       margin: 0 10px 0 5px;
    //     }
    //   }
    // }
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
        span {
          display: inline-block;
          line-height: 24px;
          height: 24px;
          font-size: 13px;
          font-weight: bold;
        }
        p {
          line-height: 24px;
          font-size: 12px;
        }
      }
      .msg-list-wrap-right {
        font-size: 12px;
        p {
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
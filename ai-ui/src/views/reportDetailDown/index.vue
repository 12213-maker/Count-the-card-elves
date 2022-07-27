<template>
  <div class="reportDetailDown-layout">
    <div class="reportDetailDown-header">
      <p><van-icon name="arrow-left" @click="goBack" /></p>
      <h2>{{ kpiName }}</h2>
      <span></span>
    </div>
    <div class="reportDetailDown-content">
      <div class="reportDetailDown-infoState">
        <ul>
          <li>
            <p>考核名称</p>
            <span>{{ detailList.taskName }}</span>
          </li>
          <li>
            <p>考核类型</p>
            <span>{{ detailList.taskType == "1" ? "绩效考核" : "" }}</span>
          </li>
          <li>
            <p>考核状态</p>
            <span>{{
              detailList.taskState == "130" ? "进行中" : "已完结"
            }}</span>
          </li>
          <li>
            <p>考核周期</p>
            <span>{{ detailList.taskCycleStr }}</span>
          </li>
        </ul>
      </div>
      <div class="reportDetailDown-location">
        <span>当前位置: {{ objName }}</span>
      </div>
      <van-list
        v-model="tabs.loading"
        :finished="tabs.isLastPage"
        finished-text="没有更多了"
        @load="getKpiTaskAreaDown"
      >
        <div class="reportDetailDown-table">
          <!-- 指标title -->
          <van-row style="display: flex" class="title">
            <van-col span="2">排序</van-col>
            <van-col span="6">区域名称</van-col>
            <van-col span="4"
              >完成值<img
                v-if="completeAllValue"
                :src="state.completeAllValue ? img.des : img.asc"
                alt=""
                @click="sort(1, state.completeAllValue)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(1, state.completeAllValue)"
            /></van-col>
            <van-col span="4"
              >目标值<img
                v-if="baseTarget"
                :src="state.baseTarget ? img.des : img.asc"
                alt=""
                @click="sort(2, state.baseTarget)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(2, state.baseTarget)"
            /></van-col>
            <van-col span="4"
              >目标差值<img
                v-if="targetDiff"
                :src="state.targetDiff ? img.des : img.asc"
                alt=""
                @click="sort(3, state.targetDiff)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(3, state.targetDiff)"
            /></van-col>
            <van-col span="4"
              >得分<img
                v-if="score"
                :src="state.score ? img.des : img.asc"
                alt=""
                @click="sort(4, state.score)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(4, state.score)"
            /></van-col>
          </van-row>
          <!-- 展开内容 -->
          <van-row
            class="content"
            v-for="(item, idx) in tabs.lists"
            :key="item.key"
            style="display: flex"
          >
            <van-col span="2">{{ idx + 1 }}</van-col>
            <van-col
              span="6"
              style="color: #02a7f0"
              @click="detailDown(item)"
              >{{ item.objName }}</van-col
            >
            <van-col span="4">{{ item.completeAllValue }}</van-col>
            <van-col span="4">{{ item.baseTarget }}</van-col>
            <van-col span="4">{{ item.targetDiff }}</van-col>
            <van-col span="4">{{ item.score }}</van-col>
          </van-row>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
import { getKpiTaskAreaDown } from "@/api/report/index.js";

export default {
  data() {
    const { kpiName, kpiCode, areaLevel, objCode, objName } = this.$route.query;
    const { mainTaskId, taskId } = JSON.parse(
      sessionStorage.getItem("reportDetail")
    );
    return {
      kpiName,
      objName,
      detailList: JSON.parse(sessionStorage.getItem("reportDetail")),
      queryParams: {
        // areaId: "5101", //区域id
        areaId: objCode, //区域id
        areaLevel: areaLevel, //区域等级
        // areaLevel: 3, //区域等级
        // kpiCode: "C_0020",
        kpiCode,
        // mainTaskId: "857001",
        mainTaskId,
        // taskId: "857002",
        taskId,
        pageNum: 1,
        pageSize: 10,
        orderType: 1,
        order: 1,
      },
      tabs: {
        pageNum: 1,
        isLastPage: false,
        loading: false,
        lists: [],
        finished: false,
      },
      img: {
        order: require("@/assets/images/order.png"),
        des: require("@/assets/images/des.png"),
        asc: require("@/assets/images/asc.png"),
      },
      state: {
        completeAllValue: true,
        baseTarget: false,
        targetDiff: false,
        score: false,
      },
      completeAllValue: true,
      baseTarget: false,
      targetDiff: false,
      score: false,
      backShow: false,
      paramsList: [],
    };
  },
  destroyed() {
    sessionStorage.removeItem("queryParams");
  },
  mounted() {
    this.getKpiTaskAreaDown();
    this.paramsList[0] = JSON.parse(JSON.stringify(this.queryParams));
  },
  methods: {
    // 返回上一级
    goBack() {
      const { areaLevel, objName } = this.$route.query;
      const params = JSON.parse(sessionStorage.getItem("queryParams"));
      console.log(areaLevel, this.queryParams.areaLevel);
      if (!params) {
        this.$router.go(-1);
        return;
      }
      if (this.queryParams.areaLevel == areaLevel) {
        this.$router.go(-1);
        return;
      }
      if (this.queryParams.areaLevel - 1 == areaLevel) {
        this.queryParams = params[0];
        this.objName = objName;
      } else {
        this.queryParams = params[params.length - 2];
        this.objName = params[params.length - 2].objName;
      }
      this.tabs.pageNum = 1;
      this.tabs.isLastPage = false;
      this.tabs.lists = [];
      this.getKpiTaskAreaDown();
    },
    // 排序
    sort(val, s) {
      this.tabs.pageNum = 1;
      this.tabs.isLastPage = false;
      this.tabs.lists = [];
      this.baseTarget = false;
      this.targetDiff = false;
      this.score = false;
      this.completeAllValue = false;
      switch (val) {
        case 1:
          this.completeAllValue = true;
          this.state.completeAllValue = !this.state.completeAllValue;
          break;
        case 2:
          this.baseTarget = true;
          this.state.baseTarget = !this.state.baseTarget;
          break;
        case 3:
          this.targetDiff = true;
          this.state.targetDiff = !this.state.targetDiff;
          break;
        case 4:
          this.baseTarget = true;
          this.state.baseTarget = !this.state.baseTarget;
          break;
        default:
          break;
      }
      this.queryParams.orderType = val;
      s ? (this.queryParams.order = 2) : (this.queryParams.order = 1);
      this.getKpiTaskAreaDown();
    },
    // 下钻
    detailDown(val) {
      this.backShow = true;
      this.tabs.lists = [];
      this.tabs.pageNum = 1;
      this.tabs.isLastPage = false;
      this.queryParams.areaLevel = val.areaLevel;
      this.queryParams.areaId = val.objCode;
      this.objName = val.objName;
      this.queryParams.objName = val.objName;
      this.getKpiTaskAreaDown();

      this.paramsList.push(JSON.parse(JSON.stringify(this.queryParams)));
      if (
        this.queryParams.areaLevel ==
        this.paramsList[this.paramsList.length - 2].areaLevel
      )
        return;
      sessionStorage.setItem("queryParams", JSON.stringify(this.paramsList));
    },
    getKpiTaskAreaDown() {
      this.tabs.loading = true;
      this.queryParams.pageNum = this.tabs.pageNum;
      getKpiTaskAreaDown(this.queryParams).then((res) => {
        res.data.list.forEach((i) => {
          this.tabs.lists.push(i);
        });
        // this.tabs.lists = res.data.list;
        this.tabs.loading = false;
        if (res.data.isLastPage) {
          this.tabs.isLastPage = true;
          return;
        }
        this.tabs.pageNum++;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.reportDetailDown-layout {
  display: flex;
  flex-direction: column;
  background-color: rgb(249, 249, 249);
  .reportDetailDown-header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 50px;
    line-height: 50px;
    font-size: 12px;
    padding: 0 10px;
    background: #53a7ff;
    color: #fff;
    h2 {
      font-size: 18px;
      font-weight: 400;
    }
  }
  .reportDetailDown-content {
    flex: 1;
    overflow: auto;
    .reportDetailDown-infoState {
      background: #fff;
      ul {
        display: flex;
        padding: 10px 0;
        li {
          flex: 1;
          font-size: 12px;
          p {
            color: #1e1919;
            height: 24px;
          }
          span {
            color: #999;
            height: 24px;
          }
        }
      }
    }
    .reportDetailDown-location {
      height: 44px;
      line-height: 44px;
      background: #fff;
      font-size: 12px;
      font-weight: bold;
      text-align: left;
      margin-top: 20px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 20px;
        height: 20px;
      }
    }
    .reportDetailDown-table {
      font-size: 12px;
      margin-top: 20px;
      .title {
        font-weight: 500;
        height: 45px;
        background: rgb(240, 248, 253);
        color: rgba(0,0,0,.8509803921568627);
        align-items: center;
      }
      .content {
        background: #fff;
        height: 45px;
        align-items: center;
        border-bottom: 1px solid #eee;
      }
      img {
        vertical-align: -2px;
        padding-left: 3px;
      }
    }
  }
}
</style>
<template>
  <div class="reportDetail-layout">
    <div class="reportDetail-header">
      <p><van-icon name="arrow-left" @click="$router.go(-1)" /></p>
      <h2>{{ detailList.taskName }}</h2>
      <!-- <span>202202</span> -->
      <span></span>
    </div>
    <van-divider />
    <div class="reportDetail-content">
      <div class="reportDetail-infoState">
        <ul>
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
      <div class="reportDetail-info">
        <h2><img src="../../assets/images/logo.png" alt="" /> 基本信息</h2>
        <van-cell-group>
          <van-cell title="创建人" :value="detailList.userName"></van-cell>
          <van-cell title="创建时间" :value="detailList.createTime"></van-cell>
        </van-cell-group>
      </div>
      <!-- <div class="reportDetail-table" v-for=" i in columns" :key="i.key"> -->
      <van-list
        v-model="tabs.loading"
        :finished="tabs.isLastPage"
        finished-text="没有更多了"
        @load="getMessage"
      >
        <div class="reportDetail-table" v-for="i in tabs.lists" :key="i.key">
          <van-row
            style="background: #fff; font-size: 14px;padding:5px 0;"
            class="title"
            @click="jumpKpi(i)"
          >
            <van-col span="24" style="color: #02a7f0;" >{{
              i.kpiName
            }}</van-col>
            <div style="line-height: 20px;background: #fff;color: #02a7f0;">{{i.kpiCode}}</div>
            </van-row
          >
          <!-- 指标title -->
          <van-row style="display: flex" class="title">
            <van-col span="2">排序</van-col>
            <van-col span="6">地域</van-col>
            <van-col span="4"
              >完成值<img
                v-if="i.resetCompleteAllValue"
                :src="i.completeAllValue ? img.des : img.asc"
                alt=""
                @click="sort(1, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(1, i)"
            /></van-col>
            <van-col span="4"
              >目标值<img
                v-if="i.resetBaseTarget"
                :src="i.baseTarget ? img.des : img.asc"
                alt=""
                @click="sort(2, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(2, i)"
            /></van-col>
            <van-col span="4"
              >目标差值<img
                v-if="i.resetTargetDiff"
                :src="i.targetDiff ? img.des : img.asc"
                alt=""
                @click="sort(3, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(3, i)"
            /></van-col>
            <van-col span="4"
              >得分<img
                v-if="i.resetScore"
                :src="i.score ? img.des : img.asc"
                alt=""
                @click="sort(4, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(4, i)"
            /></van-col>
          </van-row>
          <!-- 折叠区 -->
          <div v-if="i.kpiMainTaskScoreVo">
            <van-row style="display: flex" class="content">
              <van-col
                span="2"
                @click="showList(i)"
                v-if="i.kpiTaskScoreVos.length > 0"
                ><van-icon v-if="i.show" name="arrow-up" /><van-icon
                  v-if="!i.show"
                  name="arrow-down"
              /></van-col>
              <van-col span="2" v-else></van-col>
              <van-col span="6">{{ i.kpiMainTaskScoreVo.objName }}</van-col>
              <van-col span="4">{{
                i.kpiMainTaskScoreVo.completeAllValue
              }}</van-col>
              <van-col span="4">{{ i.kpiMainTaskScoreVo.baseTarget }}</van-col>
              <van-col span="4">{{ i.kpiMainTaskScoreVo.targetDiff }}</van-col>
              <van-col span="4">{{ i.kpiMainTaskScoreVo.score }}</van-col>
            </van-row>
          </div>
          <!-- 展开内容 -->
          <van-row
            v-show="i.show"
            class="content"
            v-for="(item, idx) in i.kpiTaskScoreVos"
            :key="item.key"
            style="display: flex"
          >
            <van-col span="2">{{ idx + 1 }}</van-col>
            <van-col
              span="6"
              style="color: #02a7f0"
              @click="detailDown(item, i)"
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
import { getKpiTaskDetail } from "@/api/report/index.js";

export default {
  name: "reportDetail",
  data() {
    const { taskId, mainTaskId } = this.$route.query;
    return {
      detailList: this.$route.query,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // areaId: "851", //区域id
        areaId: sessionStorage.getItem("areaId"), //区域id
        areaLevel: sessionStorage.getItem("areaLevel"), //区域等级
        // areaLevel: 2, //区域等级
        mainTaskId,
        taskId,
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
    };
  },
  mounted() {
    this.getMessage();
  },
  methods: {
    sortNum(list, state, prop) {
      state
        ? list.sort((a, b) => b[prop] - a[prop])
        : list.sort((a, b) => a[prop] - b[prop]);
    },
    // 排序
    sort(val, item) {
      item.resetCompleteAllValue = false;
      item.resetBaseTarget = false;
      item.resetTargetDiff = false;
      item.resetScore = false;
      switch (val) {
        case 1:
          item.resetCompleteAllValue = true;
          this.sortNum(
            item.kpiTaskScoreVos,
            item.completeAllValue,
            "completeAllValue"
          );
          item.completeAllValue = !item.completeAllValue;
          break;
        case 2:
          item.resetBaseTarget = true;
          this.sortNum(item.kpiTaskScoreVos, item.baseTarget, "baseTarget");
          item.baseTarget = !item.baseTarget;
          break;
        case 3:
          item.resetTargetDiff = true;
          this.sortNum(item.kpiTaskScoreVos, item.targetDiff, "targetDiff");
          item.targetDiff = !item.targetDiff;
          break;
        case 4:
          item.resetScore = true;
          this.sortNum(item.kpiTaskScoreVos, item.score, "score");
          item.score = !item.score;
          break;
        default:
          break;
      }
    },
    // 跳转指标洞察
    jumpKpi(val) {
      this.$router.push({
        path: "/detail/index",
        query: {
          // kpiId: "102858",
          kpiId: val.kpiCode,
          areaId: this.queryParams.areaId,
          dataTime: this.$store.state.dataTime,
          areaCode: this.queryParams.areaId,
        },
      });
    },
    // 下钻页面
    detailDown(val, i) {
      val.kpiName = i.kpiName;
      val.kpiCode = i.kpiCode;
      this.$router.push({ path: "/reportDetailDown/index", query: val });
    },
    showList(i) {
      i.show = !i.show;
    },
    getMessage() {
      this.tabs.loading = true;
      this.queryParams.pageNum = this.tabs.pageNum;
      getKpiTaskDetail(this.queryParams).then((res) => {
        res.data.list.forEach((i) => {
          if (!i.kpiMainTaskScoreVo) {
            i.show = true;
          } else {
            i.show = false;
          }
        });
        // 将初始的排序状态值添加进数据
        res.data.list.forEach((i) => {
          i.resetCompleteAllValue = true;
          i.resetBaseTarget = false;
          i.resetTargetDiff = false;
          i.resetScore = false;
          i.completeAllValue = true;
          i.baseTarget = false;
          i.targetDiff = false;
          i.score = false;
          i.kpiTaskScoreVos.sort(
            (a, b) => a.completeAllValue - b.completeAllValue
          );
          this.tabs.lists.push(i);
        });
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
.reportDetail-layout {
  display: flex;
  flex-direction: column;
  background-color: rgb(249, 249, 249);
  .reportDetail-header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    height: 45px;
    line-height: 45px;
    font-size: 12px;
    padding: 0 10px;
    background: #53a7ff;
    color: #fff;
    h2 {
      font-size: 18px;
      font-weight: 400;
    }
  }
  .van-divider {
    padding: 5px 0;
    margin: 0;
    background: #fff;
  }
  .reportDetail-content {
    flex: 1;
    overflow: auto;
    .reportDetail-infoState {
      background: #fff;
      ul {
        display: flex;
        padding: 10px 0;
        li {
          flex: 1;
          font-size: 12px;
          p {
            color: #1e1919;
            line-height: 24px;
          }
          span {
            color: #999;
            line-height: 24px;
          }
        }
      }
    }
    .reportDetail-info {
      flex: 1;
      overflow: auto;
      h2 {
        text-align: left;
        font-size: 12px;
        font-weight: 700;
        padding-left: 8px;
        line-height: 36px;
        img {
          width: 10px;
          height: 10px;
        }
      }
    }
    .van-cell__title {
      text-align: left;
    }
    .reportDetail-table {
      font-size: 12px;
      margin-top: 20px;
      .title {
        font-weight: 500;
        // line-height: 45px;
        height: 45px;
        background: rgb(240, 248, 253);
        color: rgba(0, 0, 0, 0.8509803921568627);
        align-items: center;
        img {
          vertical-align: -2px;
          padding-left: 3px;
        }
      }
      .content {
        background: #fff;
        .van-col {
          line-height: 45px;
          border-bottom: 1px solid #eee;
        }
      }
    }
  }
}
</style>
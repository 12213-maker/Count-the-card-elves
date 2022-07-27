<template>
  <div class="reportDetail-layout">
    <div class="reportDetail-header">
      <p><van-icon name="arrow-left" @click="$router.go(-1)" /><span class="placeholder">--------</span></p>
      <h2>{{ detailList.taskName }}</h2>
      <span class="right-time" @click="calendarShow = !calendarShow">{{ formatterDate(currentDate) }}</span>
    </div>
    <van-divider />
    <div class="reportDetail-content">
      <div class="reportDetail-infoState">
        <ul>
          <li>
            <p>报表状态</p>
            <span>{{ detailList.deadlineDate ? "进行中" : "已过期" }}</span>
          </li>
          <li>
            <p>浏览数量</p>
            <span>{{ detailList.viewsNumber }}</span>
          </li>
        </ul>
      </div>
      <div class="reportDetail-info">
        <h2><img src="../../assets/images/logo.png" alt="" /> 基本信息</h2>
        <van-cell-group>
          <van-cell
            title="创建人"
            :value="detailList.createUserName"
          ></van-cell>
          <van-cell title="创建时间" :value="detailList.createDate"></van-cell>
          <van-cell
            title="截止时间"
            :value="detailList.deadlineDate"
          ></van-cell>
          <van-cell title="推送人员">
            <span>{{detailList.userName[0]}} </span>
            <span v-show="detailList.userName.length > 1">...等</span>
            <span>{{detailList.userNumber}}个对象</span>
          </van-cell>
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
            style="background: #fff; line-height: 45px; font-size: 14px"
            class="title"
          >
            <van-col span="24" style="color: #02a7f0" @click="jumpKpi(i)">{{
              i.kpiName
            }}</van-col></van-row
          >
          <!-- 指标title -->
          <van-row style="display: flex" class="title">
            <van-col span="2">排序</van-col>
            <van-col span="6">地域</van-col>
            <van-col span="4"
              >指标值<img
                v-if="i.a"
                :src="i.kpiValue ? img.des : img.asc"
                alt=""
                @click="sort(1, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(1, i)"
            /></van-col>
            <van-col span="4"
              >累计值<img
                v-if="i.b"
                :src="i.totalValue ? img.des : img.asc"
                alt=""
                @click="sort(2, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(2, i)"
            /></van-col>
            <van-col span="4"
              >环比<!-- <img
                v-if="i.c"
                :src="i.monthErlier ? img.des : img.asc"
                alt=""
                @click="sort(3, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(3, i)"
            /> --></van-col>
            <van-col span="4"
              >同比<!-- <img
                v-if="i.d"
                :src="i.yearErlier ? img.des : img.asc"
                alt=""
                @click="sort(4, i)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(4, i)"
            /> --></van-col>
          </van-row>
          <!-- 折叠区 -->
          <div v-if="i.mainSpecTaskVos">
            <van-row style="display: flex" class="content">
              <van-col
                span="2"
                @click="showList(i)"
                v-if="i.kpiSpecTaskVos.length > 0"
                ><van-icon v-if="i.show" name="arrow-up" /><van-icon
                  v-if="!i.show"
                  name="arrow-down"
              /></van-col>
              <van-col span="2" v-else></van-col>
              <van-col span="6">{{ i.mainSpecTaskVos.areaName }}</van-col>
              <van-col span="4">{{
                i.mainSpecTaskVos.kpiValue
              }}</van-col>
              <van-col span="4">{{ i.mainSpecTaskVos.totalValue }}</van-col>
              <van-col span="4">{{ i.mainSpecTaskVos.monthErlier}}</van-col>
              <van-col span="4">{{ i.mainSpecTaskVos.yearErlier }}</van-col>
            </van-row>
          </div>
          <!-- 展开内容 -->
          <van-row
            v-show="i.show"
            class="content"
            v-for="(item, idx) in i.kpiSpecTaskVos"
            :key="item.key"
            style="display: flex"
          >
            <van-col span="2">{{ idx + 1 }}</van-col>
            <van-col
              span="6"
              style="color: #02a7f0"
              @click="detailDown(item, i)"
              >{{ item.areaName }}</van-col
            >
            <van-col span="4">{{ item.kpiValue }}</van-col>
            <van-col span="4">{{ item.totalValue }}</van-col>
            <van-col span="4">{{ item.monthErlier }}</van-col>
            <van-col span="4">{{ item.yearErlier }}</van-col>
          </van-row>
        </div>
      </van-list>
    </div>

    <van-action-sheet v-model="calendarShow">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        @confirm="onDateConfirm"
        @cancel="onDateCancel"
      />
    </van-action-sheet>
  </div>
</template>
<script>
import { getKpiSpecTaskDetail } from "@/api/report/index.js";
import { dateFormat } from "@/utils/index";
export default {
  name: "specialReportDetail",
  data() {
    const { taskId } = this.$route.query;
    // const date = sessionStorage.getItem("myDateTime")
    //   ? sessionStorage.getItem("myDateTime")
    //   : new Date();
    const myDate = sessionStorage.getItem("myDateTime")
    ? sessionStorage.getItem("myDateTime")
    : dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    //const currentDate = sessionStorage.getItem("myDateTime") ? sessionStorage.getItem("myDateTime") : new Date();
    //const headerDate = dateFormat(currentDate, "yyyyMMdd");
    //const queryDate = dateFormat(date, "yyyy-MM-dd HH:mm:ss");
    console.log(this.$route.query);
    const _this = this;
    return {
      detailList: this.$route.query,
      //headerDate,
      myDate,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2040, 12, 31),
      calendarShow: false,
      currentDate: _this.$store.state.dateTime,
      //queryDate: myDate,
      orderNum: 1,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // areaId: "851", //区域id
        areaId: sessionStorage.getItem("areaId"), //区域id
        areaLevel: sessionStorage.getItem("areaLevel"), //区域等级
        // areaLevel: 2, //区域等级
        taskId,
        dateTime: dateFormat(_this.$store.state.dateTime, "yyyy-MM-dd HH:mm:ss"),
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
      // state: {
      //   completeAllValue: true,
      //   baseTarget: false,
      //   targetDiff: false,
      //   score: false,
      // },
      // completeAllValue: true,
      // baseTarget: false,
      // targetDiff: false,
      // score: false,
    };
  },
  mounted() {
   if(!sessionStorage.getItem('myDateTime')) {
      sessionStorage.setItem('myDateTime',dateFormat(new Date(this.myDate), "yyyy-MM-dd HH:mm:ss"))
    } else {
      this.currentDate = this.$store.state.dateTime;
    }
    this.getMessage();
    console.log(this.currentDate);
  },
  destroyed() {
    sessionStorage.setItem('myDateTime',dateFormat(new Date(this.currentDate), "yyyy-MM-dd HH:mm:ss"))
  },
  // watch: {
  //   currentDate() {
  //     this.queryParams.dateTime = dateFormat(date, "yyyy-MM-dd HH:mm:ss");
  //   }
  // },
  methods: {
    formatterDate(val) {
      val = new Date(val);
      const year = val.getFullYear();
      const month =
        val.getMonth() + 1 < 10 ? `0${val.getMonth() + 1}` : val.getMonth() + 1;
      const date = val.getDate() < 10 ? `0${val.getDate()}` : val.getDate();
      return year.toString() + month.toString() + date.toString();
    },
    sortNum(list, state, prop) {
      console.log(state);
      state
        ? list.sort((a, b) => b[prop] - a[prop])
        : list.sort((a, b) => a[prop] - b[prop]);
    },
    // 排序
    sort(val, item) {
      this.orderNum = val
      console.log(item);
      item.a = false;
      item.b = false;
      item.c = false;
      item.d = false;
      switch (val) {
        case 1:
          item.a = true;
          this.sortNum(
            item.kpiSpecTaskVos,
            item.kpiValue,
            "kpiValue"
          );
          item.kpiValue = !item.kpiValue;
          break;
        case 2:
          item.b = true;
          this.sortNum(item.kpiSpecTaskVos, item.totalValue, "totalValue");
          item.totalValue = !item.totalValue;
          break;
        // case 3:
        //   item.c = true;
        //   this.sortNum(item.kpiSpecTaskVos, item.monthErlier, "monthErlier");
        //   item.monthErlier = !item.monthErlier;
        //   break;
        // case 4:
        //   item.d = true;
        //   this.sortNum(item.kpiSpecTaskVos, item.yearErlier, "yearErlier");
        //   item.yearErlier = !item.yearErlier;
        //   break;
        default:
          break;
      }
    },
    jumpKpi(val) {
      console.log(val);
      const date = dateFormat(new Date(this.currentDate), "yyyy-MM-dd HH:mm:ss")
      console.log(date);
      this.$router.push({
        path: "/specialDetail/index",
        // query: { kpiId: val.kpiCode, areaId: this.queryParams.areaId ,dataTime:this.$store.state.dataTime},
        query: {
          correKpiId: val.correKpiId,
          areaId: this.queryParams.areaId,
          dateTime: date,
          //areaCode: this.queryParams.areaId,
        },
      });
    },
    // 下钻页面
    detailDown(val,i) {
      // val.kpiName = i.kpiName;
      // val.kpiCode = i.kpiCode;
      const value = {}
      value.areaId = val.areaId
      value.kpiId = i.kpiId
      value.dateTime = this.queryParams.dateTime,
      value.order = 1
      value.kpiName = i.kpiName;
      value.orderType = 1
      value.areaName = val.areaName
      value.areaLevel = val.areaLevel
      console.log(value);
      console.log(val);
      console.log(i);
      this.$router.push({ path: "/specialReportDetailDown/index", query: value });
    },
    showList(i) {
      i.show = !i.show;
    },
    getMessage() {
      this.tabs.loading = true;
      this.tabs.lists = [];
      this.queryParams.pageNum = this.tabs.pageNum;
      this.queryParams.dateTime = dateFormat(this.currentDate, "yyyy-MM-dd HH:mm:ss")
      getKpiSpecTaskDetail(this.queryParams).then((res) => {
        res.data.list.forEach((i) => {
          if (!i.mainSpecTaskVos) {
            i.show = true;
          } else {
            i.show = false;
          }
        });
        console.log(res.data.list);
        res.data.list.forEach((i) => {
          i.a = true;
          i.b = false;
          i.c = false;
          i.d = false;
          i.kpiValue = true;
          i.totalValue = false;
          i.targetDiff = false;
          i.score = false;
          if (i.kpiSpecTaskVos) {
            i.kpiSpecTaskVos.sort(
              (a, b) => a.kpiValue - b.kpiValue
            );
          }

          this.tabs.lists.push(i);
        });
        console.log(res.data.list);

        // this.tabs.lists = res.data.list;
        this.tabs.loading = false;
        if (res.data.isLastPage) {
          this.tabs.isLastPage = true;
          return;
        }
        this.tabs.pageNum++;
      }).finally(() => {
        this.$toast.clear()
      });
    },
    // 日期选择确认
    onDateConfirm(val) {
      this.calendarShow = false;
      console.log(val);
      this.$store.commit("setDateTime", val);
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      this.getMessage()
      //this.$emit("dateChange", val);
      //this.$store.commit("setDateTime", val);
    },

    // 取消选择日期
    onDateCancel() {
      this.calendarShow = false;
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
    .placeholder {
      color: #53a7ff;
    }
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
      text-overflow:ellipsis; 
      overflow:hidden;
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

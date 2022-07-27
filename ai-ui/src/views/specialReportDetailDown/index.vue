<template>
  <div class="reportDetailDown-layout">
    <div class="reportDetailDown-header">
      <p><van-icon name="arrow-left" @click="goBack" /></p>
      <h2>{{ kpiName }}</h2>
      <span class="right-time" @click="calendarShow = !calendarShow">{{ formatterDate(currentDate) }}</span>
    </div>
    <div class="reportDetailDown-content">
      <div class="reportDetailDown-location">
        <span>当前位置: {{ areaName }}</span>
      </div>
      <van-list
        v-model="tabs.loading"
        :finished="tabs.isLastPage"
        finished-text="没有更多了"
        @load="getKpiSpecTaskAreaDown"
      >
        <div class="reportDetailDown-table">
          <!-- 指标title -->
          <van-row style="display: flex" class="title">
            <van-col span="2">排序</van-col>
            <van-col span="6">区域名称</van-col>
            <van-col span="4"
              >指标值<img
                v-if="kpiValue"
                :src="state.kpiValue ? img.des : img.asc"
                alt=""
                @click="sort(1, state.kpiValue)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(1, state.kpiValue)"
            /></van-col>
            <van-col span="4"
              >累计值<img
                v-if="totalValue"
                :src="state.totalValue ? img.des : img.asc"
                alt=""
                @click="sort(2, state.totalValue)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(2, state.totalValue)"
            /></van-col>
            <van-col span="4"
              >环比<!-- <img
                v-if="monthErlier"
                :src="state.monthErlier ? img.des : img.asc"
                alt=""
                @click="sort(3, state.monthErlier)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(3, state.monthErlier)"
            /> --></van-col>
            <van-col span="4"
              >同比<!-- <img
                v-if="yearErlier"
                :src="state.yearErlier ? img.des : img.asc"
                alt=""
                @click="sort(4, state.yearErlier)" /><img
                v-else
                :src="img.order"
                alt=""
                @click="sort(4, state.yearErlier)"
            /> --></van-col>
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
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="onDateConfirm"
        @cancel="onDateCancel"
      />
    </van-action-sheet>
  </div>
</template>

<script>
import { getKpiSpecTaskAreaDown } from "@/api/report/index.js";
import { dateFormat } from "@/utils/index";
export default {
  data() {
    const { kpiName, areaLevel, areaName, areaId, dateTime, kpiId } = this.$route.query;
    const { taskId } = JSON.parse(
      sessionStorage.getItem("specialReportDetail")
    );
    /* const date = sessionStorage.getItem("myDateTime")
      ? sessionStorage.getItem("myDateTime")
      : new Date(); */
    const myDate = sessionStorage.getItem("myDateTime")
    ? sessionStorage.getItem("myDateTime")
    : dateFormat(new Date(), "yyyy-MM-dd HH:mm:ss");
    //const currentDate = this.dateTime;
    //const myDateTime = sessionStorage.getItem('myDateTime')
    return {
      kpiName,
      areaName,
      myDate,
      minDate: new Date(2018, 0, 1),
      maxDate: new Date(2040, 12, 31),
      //myDateTime,
      calendarShow: false,
      currentDate: new Date(dateTime),
      detailList: JSON.parse(sessionStorage.getItem("specialReportDetail")),
      queryParams: {
        areaId,
        dateTime/*  : '2023-07-21 00:00:00' */,
        areaName,
        kpiId,
        areaLevel, //区域等级
        // areaLevel: 3, //区域等级
        // kpiCode: "C_0020",
        //kpiCode,
        // mainTaskId: "857001",
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
        kpiValue: true,
        totalValue: false,
        monthErlier: false,
        yearErlier: false,
      },
      kpiValue: true,
      totalValue: false,
      monthErlier: false,
      yearErlier: false,
      backShow: false,
      paramsList: [],
    };
  },
  destroyed() {
    sessionStorage.removeItem("queryParams");
    sessionStorage.setItem('myDateTime',dateFormat(new Date(this.currentDate), "yyyy-MM-dd HH:mm:ss"))
  },
  mounted() {
    if(!sessionStorage.getItem('myDateTime')) {
      sessionStorage.setItem('myDateTime',dateFormat(new Date(this.currentDate), "yyyy-MM-dd HH:mm:ss"))
    } else {
      this.currentDate = new Date(sessionStorage.getItem('myDateTime'))
    }
    this.paramsList[0] = JSON.parse(JSON.stringify(this.queryParams));
    console.log(this.currentDate);
    this.getKpiSpecTaskAreaDown();
  },
  methods: {
    formatterDate(val) {
      val = new Date(val);
      const year = val.getFullYear();
      const month =
        val.getMonth() + 1 < 10 ? `0${val.getMonth() + 1}` : val.getMonth() + 1;
      const date = val.getDate() < 10 ? `0${val.getDate()}` : val.getDate();
      return year.toString() + month.toString() + date.toString();
    },
    // 返回上一级
    goBack() {
      const { areaLevel, areaName } = this.$route.query;
      if(this.paramsList.length==0) {
        this.$router.go(-1);
        return; 
      }
      // const params = JSON.parse(sessionStorage.getItem("queryParams"));
      const params = this.paramsList.pop();
      console.log(areaLevel, this.queryParams.areaLevel);
      /*if (!params) {
        this.$router.go(-1);
        return;
      }*/
      /*if (this.queryParams.areaLevel == areaLevel) {
        this.$router.go(-1);
        return;
      }*/
      /*if (this.queryParams.areaLevel - 1 == areaLevel) {
        this.queryParams = params;
        this.areaName = params.areaName;
      }
      if (this.queryParams.areaLevel - 2 == areaLevel) {
        this.queryParams = params;
        this.areaName = params.areaName;
      }
      if (this.queryParams.areaLevel - 3 == areaLevel) {
        
      } else {
        this.$router.go(-1);
      }*/

      this.queryParams = JSON.parse(JSON.stringify (params));
      this.areaName = params.areaName;

      this.tabs.pageNum = 1;
      this.tabs.isLastPage = false;
      this.tabs.lists = [];
      this.getKpiSpecTaskAreaDown(false);
    },
    // 排序
    sort(val, s) {
      this.tabs.pageNum = 1;
      this.tabs.isLastPage = false;
      this.tabs.lists = [];
      this.baseTarget = false;
      this.targetDiff = false;
      this.score = false;
      this.kpiValue = false;
      switch (val) {
        case 1:
          this.kpiValue = true;
          this.state.kpiValue = !this.state.kpiValue;
          break;
        case 2:
          this.totalValue = true;
          this.state.totalValue = !this.state.totalValue;
          break;
        // case 3:
        //   this.targetDiff = true;
        //   this.state.targetDiff = !this.state.targetDiff;
        //   break;
        // case 4:
        //   this.baseTarget = true;
        //   this.state.baseTarget = !this.state.baseTarget;
        //  break;
        default:
          break;
      }
      this.queryParams.orderType = val;
      s ? (this.queryParams.order = 2) : (this.queryParams.order = 1);
      this.getKpiSpecTaskAreaDown();
    },
    // 下钻
    detailDown(val) {
      console.log(val);
      this.backShow = true;
      this.tabs.lists = [];
      this.tabs.pageNum = 1;
      this.tabs.isLastPage = false;
      this.queryParams.areaLevel = val.areaLevel;
      this.queryParams.areaId = val.areaId;
      this.areaName = val.areaName;
      this.queryParams.areaName = val.areaName;
      this.getKpiSpecTaskAreaDown(true);

    
     /* if (
        this.queryParams.areaLevel ==
        this.paramsList[this.paramsList.length - 2].areaLevel
      )
        return;*/
      sessionStorage.setItem("queryParams", JSON.stringify(this.paramsList));
    },
    getKpiSpecTaskAreaDown(isDown) {
      this.tabs.loading = true;
      this.tabs.lists = []
      this.queryParams.pageNum = this.tabs.pageNum;
      this.queryParams.dateTime = dateFormat(this.currentDate, "yyyy-MM-dd HH:mm:ss")
      getKpiSpecTaskAreaDown(this.queryParams).then((res) => {
        if(res.data && res.data.list.length>0) {
            if(isDown) this.paramsList.push(JSON.parse(JSON.stringify(this.queryParams)));
            

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

            
        }
        
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
      this.getKpiSpecTaskAreaDown()
      //this.$emit("dateChange", val);
      //this.$store.commit("setDateTime", val);
    },

    // 取消选择日期
    onDateCancel(val) {
      this.calendarShow = false;
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
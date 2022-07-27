<template>
  <div class="drillClass">
    <div>
      <DetailHeader
        @back="back"
        @dateChange="dateChange"
        :data="routerdata"
        :areaLevel="areaLevel"
        :date="date"
      ></DetailHeader>
    </div>
    <div class="titleshow">当前位置：{{ CurrentPosition }}</div>
    <div class="tableShow">
      <ve-table
        ref="ve-table"
        :style="{ 'word-break': 'break-all' }"
        is-horizontal-resize
        :columns="columns"
        :sort-option="sortOption"
        :table-data="listData"
        :event-custom-option="eventCustomOption"
        :fixed-header="true"
        :cell-style-option="cellStyleOption"
        :max-height="maxHeight"
        row-key-field-name="areaId"
        :virtual-scroll-option="virtualScrollOption"
        row-click-color="#edf7ff"
      >
      </ve-table>
      <div v-show="showEmpty" class="empty-data">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { getKpiAreaDown } from "@/api/drill/index";
import { dateFormat } from "@/utils/index";
import DetailHeader from "../detail/components/DetailHeader.vue";
export default {
  name: "dirll",
  components: { DetailHeader },
  data() {
    return {
      showEmpty: false,
      dateFormat,
      date: "",
      position: [],
      len: 0,
      areaLevel: [],
      listData: [],
      pageNum: 1,
      pageSize: 10,
      isLastPage: false,
      areaName: ["地市", "区县", "网格", "微格", "渠道"],
      level: "",
      order: 1,
      columnsFlag: 1,
      columns: [],
      columns1: [
        { field: "kpiRank", key: "a", title: "排序", width: "17%" ,sortBy: "asc",},
        {
          field: "areaName",
          key: "b",
          title: "区县",
          width: "18%",
        },
        {
          field: "kpiValue",
          key: "c",
          title: "指标值",
          // sortBy: "asc",
          width: "25%",
        },
        { field: "totalValue", key: "d", title: "累计", width: "19%" },
        { field: "monthErlier", key: "e", title: "环比", width: "18%" },
      ],
      columns2: [
        { field: "kpiRank", key: "a", title: "排序", width: "17%",sortBy: "asc" },
        {
          field: "areaName",
          key: "b",
          title: "区县",
          width: "14%",
        },
        {
          field: "kpiValue",
          key: "c",
          title: "指标值",
          // sortBy: "asc",
          width: "21%",
        },
        { field: "targetValue", key: "d", title: "目标值", width: "15%" },
        { field: "targetDiff", key: "e", title: "目标差值", width: "14%" },
        { field: "score", key: "f", title: "得分", width: "14%" },
      ],
      sortOption: {
        sortChange: (params) => {
          this.sortChange(params);
        },
      },
      cellStyleOption: {
        bodyCellClass: ({ row, column, rowIndex }) => {
          if (column.field === "areaName") {
            return "cell-edit-color";
          }
        },
      },
      virtualScrollOption: {
        enable: true,
        scrolling: this.scrolling,
      },
      isScroll: true,
      eventCustomOption: {
        bodyCellEvents: ({ row, column, rowIndex }) => {
          return {
            click: () => {
              if (column.field === "areaName") {
                this.rowClick(row);
              }
            },
          };
        },
      },
      maxHeight: document.body.offsetHeight - 49 - 45 - 55,
    };
  },
  computed: {
    routerdata() {
      return this.$route.query;
    },
    CurrentPosition() {
      const [currentposition] = this.position.slice(-1);
      return currentposition;
    },
  },
  watch: {
    level: {
      handler(value) {
        const titlevalue = this.areaName[value - 1];
        // const [titlevalue] = title;
        console.warn("我可以一开始就被触发", value, titlevalue);
        const columnsTemp = this.columns1.map((item, index) => {
          if (index === 1) {
            item.title = titlevalue;
            item.key = item.title;
          }
          return item;
        });
        this.columns = columnsTemp;
      },
      immediate: true,
    },

    columnsFlag: {
      handler(value) {
        if (value == 1) this.columns = this.columns1;
        else this.columns = this.columns2;
      },
      immediate: true,
    },
  },

  methods: {
    getKpiAreaDown(data, flag = "defaultFlag") {
      this.$toast.loading({
        message: "数据正在加载中",
        forbidClick: true,
        duration: 0,
      });

      const { kpiId } = data;
      const date = this.date;
      const areaId = data.areaId ? data.areaId : data.areaCode;

      console.warn(flag, 999999999);

      if (flag != "scroll") {
        this.pageNum = 1;
      }
      getKpiAreaDown({
        areaId,
        dateTime: this.dateFormat(new Date(date), "yyyy-MM-dd 23:59:59"),
        kpiId,
        order: this.order,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      })
        .then((res) => {
          console.log(res, "我是返回的数据", this.routerdata, flag);
          this.isLastPage = res.data.isLastPage;
          if (res.data.list.length != 0) {
            const [a] = res.data.list;
            const { targetValue } = a;
            if (targetValue) {
              this.columnsFlag = 2;
            } else {
              this.columnsFlag = 1;
            }
          }

          if (flag === "scroll") {
            this.listData.push(...res.data.list);
          } else {
            this.listData = res.data.list;
            if (this.listData.length == 0) {
              this.showEmpty = true;
            } else {
              this.showEmpty = false;
            }

            console.log(this.showEmpty, "************");
            //根据这个areaId来回溯以前的数据
            this.areaLevel.push(areaId);
          }
          this.isScroll = true;
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.$toast.clear();
        });
    },
    //点击进入下一级
    rowClick(row) {
      this.level++;
      if (this.level === 6) {
        console.log("我是最后一级");
        return;
      }
      this.position.push(row.areaName);
      console.warn("增加position", this.areaLevel, this.position);
      const data = Object.assign(this.routerdata, row);
      this.getKpiAreaDown(data, row.areaName);
      // if (this.len != 0) {
      //   this.position.push(row.areaName);
      // }
    },
    //返回上一级
    back() {
      this.level--;
      const tempareaLevel = new Set(this.areaLevel);
      this.areaLevel = [...tempareaLevel];

      this.areaLevel.pop();
      this.position.pop();
      console.warn("减少position", this.areaLevel, this.position);
      if (this.areaLevel.length === 0) {
        this.$router.go(-1);
      }
      const [tempAreaId] = this.areaLevel.splice(-1, 1);
      this.routerdata.areaId = tempAreaId;
      this.getKpiAreaDown(this.routerdata);
    },
    //时间选择
    dateChange(value) {
      this.date = value;
      this.routerdata.date = this.date;
      this.getKpiAreaDown(this.routerdata);
      this.$store.commit("setDateTime", value);
      console.log(this.$store.state.dateTime, "我是时间55555555555");
    },
    //排序
    sortChange(params) {
      if (params.kpiRank === "asc") {
        console.log("我是增加排序");
        this.order = 1;
        this.getKpiAreaDown(this.routerdata, "sort");
      } else if (params.kpiRank === "desc") {
        console.log("我是递减排序");
        this.order = 2;
        this.getKpiAreaDown(this.routerdata, "sort");
      } else {
        return 0;
      }
    },
    //懒加载
    scrolling({ visibleEndIndex }) {
      if (
        this.listData.length &&
        visibleEndIndex >= this.listData.length - 3 &&
        !this.isLastPage &&
        this.isScroll
      ) {
        this.isScroll = false;
        this.pageNum += 1;
        this.getKpiAreaDown(this.routerdata, "scroll");
      }
    },
  },
  created() {
    this.position.push(this.routerdata.position);
    console.warn("增加position", this.areaLevel, this.position);
    this.date = this.$route.query.date;
    console.error(this.routerdata, "我到底会不会改变");
    this.routerdata.areaCode = window.sessionStorage.getItem("drillAreaId")
      ? window.sessionStorage.getItem("drillAreaId")
      : window.sessionStorage.getItem("areaId");
    this.level = window.sessionStorage.getItem("drillAreaLevel")
      ? window.sessionStorage.getItem("drillAreaLevel")
      : window.sessionStorage.getItem("areaLevel");
    console.error(this.routerdata, "第一次申请数据的时候");
    this.getKpiAreaDown(this.routerdata);
  },
  mounted() {},
};
</script>

<style lang="scss">
.drillClass {
  display: flex;
  flex-direction: column;
  .titleshow {
    padding-left: 10px;
    background-color: white;
    height: 40px;
    line-height: 40px;
    text-align: left;
    font-size: 14px;
    text-justify: left;
  }
  .cell-edit-color {
    color: rgb(2, 167, 240) !important;
  }
  .ve-table-header-th:nth-child(1) {
    // background-color: pink !important;
    padding-bottom: 13px !important;
  }
  .empty-data {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%);
    color: rgb(100, 101, 102);
  }
}
</style>
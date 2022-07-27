<template>
  <div style="width: 100%" class="detail-wrap" v-if="show">
    <div class="data-info">
      <div class="title-wrap">
        <div class="left" style="flex-grow: 2">
          <a style="text-align: left">{{ kpiData.kpiName }}</a>
          <van-icon
            v-if="kpiData.chkMetd != 0"
            name="warning"
            :size="16"
            class="note-icon"
            :color="iconType(kpiData.warningLevel)"
            @click="
              showInfo(kpiData.alarmCnt, kpiData.alarmRule, kpiData.effectTime)
            "
          />
        </div>
        <div
          class="right"
          style="display: flex; width: 30%; justify-content: flex-end"
        >
          <span @click="diaoTitle">口径</span>
          <van-icon name="question" color="#ff5454" :size="13" />
        </div>
      </div>
      <div class="number-wrap">
        <div class="left">{{ kpiData.kpiValue }}</div>
      </div>

      <div class="desc-wrap" v-if="parseInt(kpiData.totalFlag) == 1">
        <span class="item">
          {{
            kpiData.kpiModel == 1
              ? "日累计："
              : kpiData.kpiModel == 2
              ? "月累计："
              : "年累计："
          }}
          {{
            kpiData.kpiModel == 1
              ? kpiData.daySum
              : kpiData.kpiModel == 2
              ? kpiData.monthSum
              : kpiData.yearSum
          }}
        </span>

        <span class="item" v-if="kpiData.kpiModel == 2">
          年累计：{{ kpiData.yearSum ? kpiData.yearSum : "-" }}
        </span>
      </div>

      <div class="desc-wrap">
        <div class="item">
          指标类型：{{ indexTypes[parseInt(kpiData.kpiModel)] }}
        </div>
        <div class="item">
          发布来源：{{ kpiData.releaseSource ? kpiData.releaseSource : "-" }}
        </div>
      </div>

      <div class="legent-wrap">
        <div class="item">
          同比:<van-icon
            name="play"
            :color="
              kpiData.yearErlier && kpiData.yearErlier.indexOf('-') == 0
                ? '#FC3434'
                : '#16B90F'
            "
            :class="
              kpiData.yearErlier && kpiData.yearErlier.indexOf('-') == 0
                ? 'descend'
                : 'ascend'
            "
          />{{ kpiData.yearErlier }}
        </div>
        <div class="item">
          环比:<van-icon
            name="play"
            :color="
              kpiData.monthErlier && kpiData.monthErlier.indexOf('-') == 0
                ? '#FC3434'
                : '#16B90F'
            "
            :class="
              kpiData.monthErlier && kpiData.monthErlier.indexOf('-') == 0
                ? 'descend'
                : 'ascend'
            "
          />{{ kpiData.monthErlier }}
        </div>
      </div>
    </div>

    <div class="echaret-wrap" style="background: #fff">
      <div class="card-title">
        <i></i>
        指标趋势
      </div>
      <div ref="line_chart" class="line_chart"></div>
    </div>

    <div class="table-wrap" style="background: #fff">
      <div class="form-wrap">
        <div class="left">{{ kpiData.areaRankDes }}</div>
        <div class="desc">数据周期：{{ kpiData.kpiDate }}</div>
      </div>
      <!-- <div class="table-box">
        <div class="table-header">
          <div class="tr">
            <div class="td rank">排名</div>
            <div class="td">区域名称</div>
            <div class="td">指标值</div>
            <div class="td" v-if="showTotal">累计值</div>
            <div class="td" v-if="showTotal">环比</div>
            <div class="td" v-if="showTarget">目标值</div>
            <div class="td" v-if="showTarget">目标差值</div>
            <div class="td" v-if="showTarget">得分</div>
          </div>
        </div>
        <div class="table-body" v-if='list.length!=0'>
          <div class="tr" 
          v-for="(item,index) in list" 
          :key="index" 
          :style="{backgroundColor: index==0?'#86aaff':'#5e646d'}" >
            <div class="td rank">{{ item.kpiRank }}</div>
            <div class="td" @click="goDrill(item.areaName || item.searchAreaName)">{{ item.areaName || item.searchAreaName}}</div>

            <div class="td">{{ item.kpiValue }}</div>

            <div class="td" 
            v-if="showTotal">{{ item.totalValue?item.totalValue:'-' }}</div>

            <div class="td" v-if="showTotal">{{ item.monthErlier?item.monthErlier:'-' }}</div>

            <div class="td" v-if="showTarget">{{ item.targetValue?item.targetValue:'-' }}</div>

            <div class="td" v-if="showTarget">{{ item.targetDiff?item.targetDiff:'-' }}</div>

            <div class="td" v-if="showTarget">{{ item.score?item.score:'-' }}</div>
          </div>
        </div>
        <div v-else class="note">
          暂无数据
        </div>
        <div class="table-footer" @click="loadMore"  v-if='!finished'>
          <span>查看更多>></span>
        </div>
      </div> -->
      <ve-table
        ref="ve-table"
        :style="{ 'word-break': 'break-all' }"
        is-horizontal-resize
        :columns="columns"
        :sort-option="sortOption"
        :table-data="list"
        :event-custom-option="eventCustomOption"
        :fixed-header="true"
        :cell-style-option="cellStyleOption"
        row-click-color="#edf7ff"
        row-key-field-name="areaId"
      >
      </ve-table>
      <!-- <ve-table
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
      </ve-table> -->
    </div>

    <van-dialog v-model="alarmShow" :title="alarmDialogTitle">
      <p class="dialog-text"><b>报警规则：</b>{{ alarmInfo.alarmRule }}</p>
      <p class="dialog-text"><b>生效时间：</b>{{ alarmInfo.effectTime }}</p>
      <p class="dialog-text"><b>预警次数：</b>{{ alarmInfo.alarmCnt }}</p>
    </van-dialog>
  </div>
</template>

<script>
import pointApi from "@/api/point/index";
import * as echarts from "echarts";
import { dateFormat } from "@/utils/index";
import { getKpiDetail } from "@/api/home/index.js";

export default {
  name: "detail",
  props: ["data", "searchForm", "areaCode", "date"],
  data() {
    return {
      maxHeight: document.body.offsetHeight - 46 - 305 - 37,
      columnsFlag: 1,
      columns: [],
      isLastPage: false,
      columns1: [
        {
          field: "kpiRank",
          key: "a",
          title: "排序",
          width: "17%",
          sortBy: "asc",
        },
        {
          field: "areaName",
          key: "b",
          title: "区域名称",
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
        {
          field: "kpiRank",
          key: "a",
          title: "排序",
          width: "17%",
          sortBy: "asc",
        },
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
      eventCustomOption: {
        bodyCellEvents: ({ row, column, rowIndex }) => {
          return {
            click: () => {
              if (column.field === "areaName") {
                this.goDrill(row);
              }
            },
          };
        },
      },
      cellStyleOption: {
        bodyCellClass: ({ row, column, rowIndex }) => {
          if (rowIndex == 0) {
            if (column.field === "areaName") {
              return "hightlight-row cell-edit-color";
            } else {
              return "hightlight-row";
            }
          } else if (column.field === "areaName") {
            return "cell-edit-color";
          }
        },
      },
      virtualScrollOption: {
        enable: true,
        scrolling: this.scrolling,
      },
      order: 1,
      isScroll: true,

      echart: null,

      alarmShow: false,
      alarmDialogTitle: "预警信息",
      alarmInfo: {
        alarmCnt: "",
        alarmRule: "",
        effectTime: "",
      },

      finished: false,
      list: [],

      page: {
        pageNum: 1,
        pageSize: 100,
        total: 0,
      },

      indexTypes: {
        1: "小时指标",
        2: "日指标",
        3: "月指标",
      },
      dateFormat,
      kpiData: new Object(),
      show: false,
    };
  },

  watch: {
    columnsFlag: {
      handler(value) {
        if (value == 1) this.columns = this.columns1;
        else this.columns = this.columns2;
      },
      immediate: true,
    },
    date(val) {
      this.list = [];
      this.page.pageNum = 1;
      this.getKpiDetail();
    },
  },

  computed: {
    showTotal() {
      return (
        this.list.length >= 1 &&
        !this.list[0].targetValue &&
        (this.list[0].monthErlier || this.list[0].totalValue)
      );
    },

    showTarget() {
      return (
        this.list.length >= 1 &&
        this.list[0].targetValue &&
        this.list[0].targetValue.toString()
      );
    },
  },

  created() {},

  mounted() {
    for (var item in this.data) {
      this.kpiData[item] = this.data[item];
    }
    this.show = true;

    this.getKpiDetail();
    setTimeout(() => {
      this.echart = echarts.init(this.$refs["line_chart"]);
    }, 100);
  },

  methods: {
    scrolling({ visibleEndIndex }) {
      if (
        this.list.length > 6 &&
        visibleEndIndex >= this.list.length - 3 &&
        !this.isLastPage &&
        this.isScroll
      ) {
        this.isScroll = false;
        this.pageNum += 1;
        this.getGridRank();
      }
    },

    //排序
    sortChange(params) {
      if (params.kpiRank === "asc") {
        this.$toast.loading({
          message: "数据正在加载中",
          forbidClick: true,
          duration: 0,
        });
        this.list = [];
        console.log("递增");
        this.order = 1;
        this.getGridRank();
      } else if (params.kpiRank === "desc") {
        this.$toast.loading({
          message: "数据正在加载中",
          forbidClick: true,
          duration: 0,
        });
        this.list = [];
        console.log("递减");
        this.order = 2;
        this.getGridRank();
      } else {
        return 0;
      }
    },
    // 获取指标详情
    getKpiDetail() {
      this.$toast.loading({
        message: "加载中",
        forbidClick: true,
        duration: 0,
      });
      console.log(this.kpiData);
      getKpiDetail({
        areaId: this.kpiData.areaId,
        dateTime: this.dateFormat(new Date(this.date), "yyyy-MM-dd 23:59:59"),
        kpiId: this.kpiData.correKpiId,
        // "userId": "1"
      })
        .then((res) => {
          if (res.data) {
            this.$nextTick(() => {
              for (var item in res.data) {
                this.$set(this.kpiData, item, res.data[item]);
              }
            });
            return;
          }
          this.clearData();
        })
        .catch((err) => {
          this.clearData();
        })
        .finally(() => {
          this.drawLine();
          this.getGridRank();
        });
    },

    clearData() {
      this.$nextTick(() => {
        for (const item in this.kpiData) {
          console.log(item);
          if (item != "kpiId" && item != "kpiName" && item != "areaId")
            this.$set(this.kpiData, item, "");
        }
      });
    },

    iconType(type) {
      let color = "";
      switch (parseInt(type)) {
        case 1:
          color = "#13C41F";
          break;
        case 2:
          color = "#ffcd53";
          break;
        case 3:
          color = "#ff9653";
          break;
        case 4:
          color = "#fd4f4f";
          break;
      }
      return color;
    },

    diaoTitle() {
      this.$dialog.confirm({
        title: "口径信息",
        allowHtml: true,
        message: `指标ID：${this.kpiData.correKpiId}\n${this.kpiData.caliberContent}`,
        showCancelButton: false,
      });
    },

    drawLine() {
      const { correKpiId, kpiModel, kpiDate, areaId } = this.kpiData;
      const data = {
        kpiId:correKpiId,
        kpiModel,
        dateTime: this.dateFormat(new Date(this.date), "yyyy-MM-dd 23:59:59"),
        // kpiDate,
        areaId: this.kpiData.areaId,
      };
      pointApi.getKpiTread(data).then((res) => {
        if (res.code == 0) {
          console.log(123, res);
          const { data } = res;
          const xAxisData = data.map((ele) => ele.kpiDate);
          const yAxisData = data.map((ele) => Number(ele.kpiValue));
          const option = {
            grid: {
              show: false,
              left: 14,
              top: 39,
              right: 10,
              bottom: 20,
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: xAxisData,
              axisLine: {
                show: true,
                lineStyle: {
                  color: "#d5dae0",
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                color: "#8F939C",
                fontSize: 11,
              },
            },

            yAxis: {
              type: "value",
              name: "单位：" + data[0].unit,
              nameTextStyle: {
                color: "#46a9ff",
                fontSize: 10,
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                color: "#8F939C",
                fontSize: 11,
                fontWeight: "bold",
              },
              splitLine: {
                lineStyle: {
                  type: "dashed",
                },
              },
            },
            dataZoom: [
              {
                id: "dataZoomX",
                type: "inside",
                xAxisIndex: [0],
                bottom: 0,
                filterMode: "filter",
                brushSelect: false,
                maxValueSpan: 6,
                height: 10,
                textStyle: {
                  fontSize: 0,
                },
              },
            ],
            tooltip: {
              show: true,
              trigger: "axis",
              triggerOn: "mousemove",
            },
            series: [
              {
                data: yAxisData,
                type: "line",
                areaStyle: {
                  color: "#f0f9ff",
                },
                lineStyle: {
                  color: "#6dc7ff",
                },
                itemStyle: {
                  color: "#6dc7ff",
                },
              },
            ],
          };
          this.echart.setOption(option);
        }
      });
    },

    // 查询网格排名
    getGridRank() {
      console.log(1,this.data);
      const { correKpiId, kpiModel, kpiDate, areaId, dateTime } = this.data;
      const { pageNum, pageSize } = this.page;
      const order = this.order;
      const data = {
        kpiId: correKpiId,
        dateTime: this.dateFormat(new Date(this.date), "yyyy-MM-dd 23:59:59"),
        pageNum,
        pageSize,
        areaId,
        order,
      };
      pointApi
        .getGridRank(data)
        .then((res) => {
          if (res.code == 0) {
            // this.list.push(this.data);
            if (pageNum == 1) {
              this.list.push(res.data.kpiDataGridSelfVo);
            }
            this.list = this.list.concat(res.data.kpiDataGridVos.list);
            this.page.total = res.data.total;
            const { isLastPage } = res.data.kpiDataGridVos;
            this.finished = isLastPage;
            this.isLastPage = isLastPage;
            this.isScroll = true;

            const { targetValue } = res.data.kpiDataGridSelfVo;
            if (targetValue) {
              this.columnsFlag = 2;
            } else {
              this.columnsFlag = 1;
            }
          }
        })
        .finally(() => {
          this.isScroll = true;
          this.$toast.clear();
        });
    },

    showInfo(alarmCnt, alarmRule, effectTime) {
      this.alarmShow = true;
      this.alarmInfo.alarmCnt = alarmCnt;
      this.alarmInfo.alarmRule = alarmRule;
      this.alarmInfo.effectTime = effectTime;
    },

    // 加载更多
    loadMore() {
      if (this.finished) return;
      this.page.pageNum++;
      this.getGridRank();
    },
    //跳转到drill页面
    goDrill({ areaName }) {
      const { kpiId, kpiModel, kpiDate, areaId } = this.kpiData;
      const FormatDate = this.dateFormat(
        new Date(this.date),
        "yyyy-MM-dd 23:59:59"
      );
      this.$router.push({
        path: "/drill/index",
        query: {
          date: FormatDate,
          areaCode: this.areaCode,
          kpiId,
          kpiModel,
          data: this.data,
          position: areaName,
          titleName: this.kpiData.kpiName,
        },
      });
    },
  },
};
</script>

<style lang='scss'>
.detail-wrap {
  .note {
    line-height: 50px;
    font-size: 12px;
    color: #999;
  }

  .ascend {
    transform: rotate(-90deg);
    color: #16b90f;
    margin-right: 2px;
  }

  .descend {
    transform: rotate(90deg);
    color: #fc3434;
    margin-right: 2px;
  }

  .data-info {
    padding: 12px;
    background: #fff;
    .title-wrap {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: bold;
        color: #4a5057;
        display: flex;
        align-items: center;
        i {
          margin-left: 10px;
        }
      }
      .right {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #5c636b;
        i {
          margin-left: 5px;
        }
      }
    }
    .number-wrap {
      margin-top: 13px;
      display: flex;
      align-items: center;
      .left {
        font-size: 22px;
        font-family: DINAlternate, DINAlternate-Bold;
        font-weight: bold;
        color: #53a7ff;
        line-height: 22px;
      }
      .right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
        .item {
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #4a5057;
          margin-left: 20px;
        }
      }
    }
    .desc-wrap {
      margin-top: 12px;
      display: flex;
      .item {
        font-size: 11px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #828b96;
        margin-right: 15px;
        line-height: 12px;
      }
    }
    .legent-wrap {
      margin-top: 12px;
      display: flex;
      .item {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #575c61;
        line-height: 12px;
        margin-right: 15px;
        i {
          margin: 0 3px;
          &.arrow-top {
            transform: rotate(-90deg);
            color: #13c41f;
          }
          &.arrow-bottom {
            transform: rotate(90deg);
            color: #fc3434;
          }
        }
      }
    }
  }
  .card-title {
    height: 35px;
    background: #f7f9fb;
    border: 0.5px solid #d3dbe3;
    backdrop-filter: blur(5.21px);
    font-size: 13px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: bold;
    text-align: left;
    color: #5c636b;
    padding-left: 17px;
    display: flex;
    align-items: center;
    i {
      width: 3px;
      height: 13px;
      background: #03a0ff;
      display: inline-block;
      margin-right: 5px;
    }
  }
  .echaret-wrap {
    -padding-bottom: 10px;
    .line_chart {
      height: 190px;
    }
  }
  .table-wrap {
    margin-top: 14px;
    padding-top: 10px;

    .form-wrap {
      padding: 0 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .left {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: bold;
        color: #575c61;
      }
      .select-wrap {
        width: 109px;
        height: 24px;
        background: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 2px;
        padding: 0 5px 0 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #575c61;
      }
      .desc {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
      }
    }

    .table-box {
      margin-top: 13px;
      .table-header {
        .tr {
          background: #f0f8fd !important;
          border: 1px solid #eaeaea;
        }
      }
      .tr {
        display: flex;
        height: 35px;
        .td {
          flex: 1;
          text-align: center;
          line-height: 35px;
          font-size: 12px;
          font-weight: bold;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:nth-child(2) {
            color: rgb(84, 167, 255);
          }
        }

        .td.rank {
          max-width: 50px;
        }

        &:nth-child(2n) {
          background: #fbfdff;
          border: 1px solid #eaeaea;
        }
        &:nth-child(2n + 1) {
          background: #ffffff;
          // border: 1px solid #eaeaea;
        }
      }
      .table-footer {
        line-height: 35px;
        text-align: center;
        font-size: 11px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: bold;
        color: #3296fa;
      }
    }
    .cell-edit-color {
      color: rgb(2, 167, 240) !important;
    }

    .hightlight-row {
      background-color: #e0f3ff !important;
    }
    .ve-table-header-th:nth-child(1) {
      // background-color: pink !important;
      padding-bottom: 13px !important;
    }
  }
}
</style>
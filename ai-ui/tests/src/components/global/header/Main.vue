<template>
  <div style="width: 100%" class="header-wrap">
    <div class="header">
      <a class="location-wrap">
        <van-icon name="arrow-left" class="icon" @click="backToApp" />
        <span class="location" @click="onShowArea" v-show="showLoc">{{
          area.areaName
        }}</span>
      </a>

      <van-dropdown-menu>
        <van-dropdown-item
          v-model="kpiModel"
          :options="indexOptions"
          @change="onkpiModelChange"
        />
      </van-dropdown-menu>

      <a class="operation-wrap">
        <van-icon
          :name="require('@/assets/images/search-icon.png')"
          class="icon date-icon"
          @click="toSearch"
        />
        <span class="date" @click="calendarShow = !calendarShow">{{
          formatterDate(date)
        }}</span>
      </a>
    </div>

    <!-- <van-action-sheet v-model="showArea">
      <van-cascader
        v-model="areaCode"
        title="请选择所在地区"
        :options="areaList"
        :field-names="{
          text: 'areaName',
          value: 'areaId',
          children: 'children'
        }"
        @close="onAreaCancel"
      />
    </van-action-sheet> -->

    <van-popup v-model="showArea" round position="bottom">
      <van-cascader
        ref="cascader"
        v-model="area.areaId"
        title="请选择所在地区"
        :options="areaList"
        :field-names="{
          text: 'areaName',
          value: 'areaId',
        }"
        @close="showArea = false"
        @finish="onAreaFinish"
        @change="onChange"
      />
    </van-popup>

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
import { getAreaInfo } from "@/api/home/index.js";
import channelApi from "@/api/channel";
export default {
  name: "HeaderComponent",
  props: ["tabIndex", "parent", "detailDate", "detailView"],
  data() {
    
    const date = this.$store.state.dateTime
      ? this.$store.state.dateTime
      : new Date().getTime();
    const _this = this;
    return {
      active: 0,
      location: "贵州省",
      areaLevel: sessionStorage.getItem("areaLevel"),
      areaName: sessionStorage.getItem("areaName"),
      areaId: sessionStorage.getItem("areaId"),
      showArea: false,
      tabs: ["应知", "推荐", "关注", "全部"],

      kpiModel: "",

      indexOptions: [
        { text: "全部指标", value: "" },
        { text: "小时指标", value: "1" },
        { text: "日指标", value: "2" },
        { text: "月指标", value: "3" },
      ],

      areaList: [],
      areaTree: [],

      area: {
        areaName: "",
        areaId: "", //已选地区编码
        areaLevel: "",
      },

      calendarShow: false,
      currentDate: new Date(date),
      areaCode: "",

      dateTime: new Date(date),
      showLoc: false,
    };
  },

  computed: {
    date() {
      return this.detailDate ? this.detailDate : this.dateTime;
    },
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

    // 地区选择完毕
    onAreaFinish(data) {
      const { selectedOptions } = data;
      if (selectedOptions.length === 1) {
        let [temparr] = selectedOptions;
        let { areaId: drillAreaId, areaLevel: drillAreaLevel } = temparr;
        drillAreaId = drillAreaId.split('-')[1]
        drillAreaLevel = drillAreaLevel.split('-')[1]
        window.sessionStorage.setItem("drillAreaId", drillAreaId);
        window.sessionStorage.setItem("drillAreaLevel", drillAreaLevel);
      } else {
        const temparr = selectedOptions.slice(-2, -1);
        const { areaId: drillAreaId, areaLevel: drillAreaLevel } = temparr[0];
        window.sessionStorage.setItem("drillAreaId", drillAreaId);
        window.sessionStorage.setItem("drillAreaLevel", drillAreaLevel);
      }

      this.showArea = false;
      console.error("选择区域完毕-------", data);
      const { value } = data;
      if (value.indexOf("all") != -1) {
        const areaId = value.split("-")[1];

        if (data.selectedOptions.length == 1) {
          this.$emit("areaCodeChange", this.areaId, this.areaName);
        } else {
          this.$emit("areaCodeChange", areaId, this.areaTree[areaId].areaName);
        }

        if (parseInt(areaId) == this.areaId) {
          this.area.areaName = this.areaName;
          this.area.areaId = areaId;
        } else {
          this.area.areaName = this.areaTree[areaId].areaName;
        }
      } else {
        this.$emit("areaCodeChange", value, this.areaTree[value].areaName);
        this.area.areaName = this.areaTree[value].areaName;
      }
    },

    // 切换区域选择，请求下级数据
    onChange(data) {
      // console.warn('678',data.selectedOptions[data.selectedOptions.length-1].areaLevel);

      sessionStorage.setItem(
        "selectedOptions",
        JSON.stringify(data.selectedOptions)
      );
      const { value } = data;
      const areaLevel =
        data.selectedOptions[data.selectedOptions.length - 1].areaLevel;
      if (this.areaTree[value] && this.areaTree[value].areaLevel == "6") return;

      const params = {
        areaId: value,
        areaLevel: areaLevel,
      };

      channelApi.getAreaInfo(params).then((res) => {
        if (res.code == 0) {
          const children = (res.data || []).map((ele) => {
            const { areaId, areaLevel } = ele;
            if (areaLevel != "6") {
              ele.children = [];
            }
            this.areaTree[areaId] = ele;
            return ele;
          });
          const allData = {
            areaName: "全部",
            areaId: `all-${params.areaId}`,
          };
          if (this.areaTree[value]) {
            this.areaTree[value].children = [allData, ...children];
          }
          this.$refs.cascader.tabs[data.tabIndex + 1].options = [
            allData,
            ...children,
          ];

          setTimeout(() => {
            if (value.indexOf("all") != -1) return;
          }, 200);
        }
      });
    },

    // 日期选择确认
    onDateConfirm(val) {
      this.calendarShow = false;
      if (!this.detailView) {
        this.dateTime = val;
      }

      this.$emit("dateChange", val);
      this.$store.commit("setDateTime", val);
    },

    // 取消选择日期
    onDateCancel() {
      this.calendarShow = false;
    },

    // 指标类型改变
    onkpiModelChange(val) {
      this.$emit("kpiModelChange", val);
    },

    // 查询初始化区域
    getAreaInfo() {
      const params = {
        areaId: sessionStorage.getItem("areaId"),
        areaLevel: sessionStorage.getItem("areaLevel"),
      };

      channelApi.getAreaInfo(params).then((res) => {
        if (res.code == 0) {
          const children = (res.data || []).map((ele) => {
            const { areaId, areaLevel } = ele;
            if (areaLevel != "6") {
              ele.children = [];
            }
            this.areaTree[areaId] = ele;
            return ele;
          });
          const allData = {
            areaName: "全部",
            areaId: `all-${params.areaId}`,
            areaLevel: `all-${params.areaLevel}`,
          };
          this.areaList = [allData, ...children];

          this.showLoc = true;
        }
      });
    },

    // 显示地区选择器
    onShowArea() {
      if (this.areaLevel != 6) {
        this.showArea = true;
        let selectedOptions = JSON.parse(
          sessionStorage.getItem("selectedOptions")
        );
        let idx = 0;
        setTimeout(() => {
          this.$refs.cascader.tabs[idx].selectedOption = selectedOptions[idx];
          this.updateTabs(idx, selectedOptions);
        }, 0);
      }
    },

    // 更新请求地区数据
    updateTabs(idx, selectedOptions) {
      this.areaTree[selectedOptions[idx].areaId] = selectedOptions[idx];
      if (selectedOptions[idx].children) {
        selectedOptions[idx].children.forEach((item) => {
          this.areaTree[item.areaId] = item;
        });
      }

      if (selectedOptions[idx + 1]) {
        this.$refs.cascader.tabs.push({
          options: [],
          selectedOption: [],
        });
        // this.getAreaInfoById(selectedOptions[idx].areaId, selectedOptions[idx].areaLevel, idx, selectedOptions);

        setTimeout(() => {
          this.$refs.cascader.activeTab = idx + 1;
          this.$refs.cascader.tabs[idx + 1].options =
            selectedOptions[idx].children;
          this.$refs.cascader.tabs[idx + 1].selectedOption =
            selectedOptions[idx + 1];
          idx++;
          this.updateTabs(idx, selectedOptions);
        }, 100);
      }
    },

    getAreaInfoById(areaId, areaLevel, idx, selectedOptions) {
      const params = {
        areaId,
        areaLevel,
      };

      channelApi.getAreaInfo(params).then((res) => {
        if (res.code == 0) {
          const children = (res.data || []).map((ele) => {
            const { areaId, areaLevel } = ele;
            if (areaLevel != "6") {
              ele.children = [];
            }
            this.areaTree[areaId] = ele;
            return ele;
          });
          const allData = {
            areaName: "全部",
            areaId: `all-${params.areaId}`,
          };
          this.areaTree[areaId].children = [allData, ...children];
          this.$refs.cascader.tabs[idx + 1].options = [allData, ...children];

          setTimeout(() => {
            this.$refs.cascader.activeTab = idx + 1;
            this.$refs.cascader.tabs[idx + 1].selectedOption =
              selectedOptions[idx + 1];
            idx++;
            this.updateTabs(idx, selectedOptions);
          }, 100);
        }
      });
    },

    // 跳转至搜索页面
    toSearch() {
      localStorage.setItem("clearKeyword", false);
      this.$router.push({
        name: "search-index",
        query: {
          redirectUrl: this.$route.name,
          tabIndex: this.tabIndex,
          detailView: this.parent.tabs[this.tabIndex].detailView,
        },
      });
    },

    // 返回APP首页
    backToApp() {
      let curCard = this.parent.$refs["cardList" + this.parent.active][0];
      if (curCard.detailView) {
        curCard.changeView(false);
      } else if (
        curCard.$refs.recommandList &&
        curCard.$refs.recommandList.detailView
      ) {
        this.$nextTick(() => {
          this.parent.detailDate = "";
          curCard.$refs.recommandList.detailDate = "";
          this.dateTime = this.parent.searchForm.dateTime;
        });
        curCard.$refs.recommandList.changeView(true);

        console.warn(
          "detailDate:",
          this.parent.detailDate,
          "dateTime:",
          this.parent.searchForm.dateTime
        );
      } else {
        location.href = "https://117.187.6.80:8443/oneclickh5/#/kpiView/0";
      }
    },
  },

  created() {
    this.getAreaInfo();
  },

  mounted() {
    this.area.areaId = sessionStorage.getItem("currentAreaCode") || this.areaId;
    this.area.areaName =
      sessionStorage.getItem("currentAreaName") || this.areaName;
    this.area.areaLevel = this.areaLevel;
    this.$dateTime = this.date;
    // this.areaTree[this.area.areaId] = this.area;
  },
};
</script>
<style lang="scss">
.header-wrap {
  .header {
    width: 100%;
    height: 46px;
    min-height: 46px;
    display: flex;
    padding: 0 12px;
    box-sizing: border-box;
    background: #53a7ff;
    justify-content: space-between;
    align-items: center;

    .van-dropdown-menu__bar {
      background: none;
      box-shadow: none;
    }

    .van-dropdown-menu__title {
      color: #fff;
      font-size: 17px;
    }

    .van-dropdown-menu__title::after {
      font-size: 14px;
      border-color: transparent transparent #fff #fff;
    }
  }

  .location-wrap {
    color: #fff;
    display: flex;
    align-items: center;
    z-index: 99;
    height: 38px;
    box-sizing: border-box;

    .icon {
      padding-right: 16px;
    }

    .location {
      font-size: 12px;
      width: 60px;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin-left: 2px;
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
}
</style>

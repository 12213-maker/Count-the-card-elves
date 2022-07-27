<template>
  <div class="detail-header">
    <van-icon
      class="icon-arrow"
      name="arrow-left"
      color="#ffffff"
      :size="17"
      @click="back"
    />

    <span class="title">{{ title }}</span>

    <span class="date" @click="calendarShow = !calendarShow">{{
      dateFormat(new Date(date), "yyyyMMdd")
    }}</span>

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
import { dateFormat } from "@/utils/index";
import { emit } from "process";
export default {
  name: "detail-header",
  components: {},
  props: ["data","areaLevel"],
  data() {
    let _this = this;
    return {
      calendarShow: false,
      currentDate: "",
      dateFormat,
      date: _this.$store.state.dateTime
    };
  },
  provide() {
    const _this = this;
    return {
      parent: _this,
    };
  },

  computed: {
    arealevel() {
      return this.areaLevel ? this.areaLevel : [];
    },
    title() {
      return this.data.titleName ? this.data.titleName : "指标洞察";
    },
  },

  created() {},

  mounted() {
    this.currentDate = new Date(this.date);
    console.warn(this.date,this.currentDate);
  },

  watch: {
    date(val) {
      this.currentDate = new Date(val);
    },
  },

  methods: {
    back() {
      if (this.arealevel.length !== 0) {
        this.$emit("back");
      } else {
        // this.$router.push({
        //   name: "home-index",
        //   params: {
        //     detailView: this.data.detailView,
        //     tabIndex: this.data.tabIndex,
        //   },
        // });
        this.$router.go(-1);
      }
    },

    // 日期选择确认
    onDateConfirm(val) {
      this.calendarShow = false;
      this.date = val;
      this.$emit("dateChange", val);
    },

    // 取消选择日期
    onDateCancel() {
      this.calendarShow = false;
    },
  },
};
</script>

<style lang="scss">
.detail-header {
  height: 44px;
  font-size: 17px;
  font-family: PingFangSC, PingFangSC-Medium;
  text-align: center;
  color: #ffffff;
  background: #53a7ff;
  line-height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .date {
    font-size: 12px;
  }

  .title {
    //单行显示
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    margin-left: 16px;
  }
}
</style>

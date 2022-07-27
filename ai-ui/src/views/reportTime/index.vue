<template>
  <div class="reporttime">
    <div class="header">
      <Header
        @clickHeader="clickHeader"
        left="返回"
        mid="选择时间范围"
        right="确定"
      ></Header>
    </div>
    <div class="timepicker">
      <van-calendar
        type="single"
        :poppable="false"
        :show-confirm="false"
        :style="{ height: '450px' }"
        color="rgb(82, 193, 245)"
        row-height="60"
        :show-title="false"
        @confirm="onConfirmDate"
        :default-date="date"
      />
    </div>
    <!-- <div class="tip">无截止时间</div> -->
  </div>
</template>

<script>
import Header from "../newAdd/components/Header.vue";
export default {
  components: { Header },
  name: "reporttime",
  data() {
    return {
      date:'',
    };
  },
  methods: {
    clickHeader(value) {
      if (value == "left") {
        this.$router.go(-1);
      } else {
        this.$router.go(-1);
      }
    },
    onConfirmDate(value){
      this.date = value
      this.$store.commit('setDate',this.date)
    }

  },
  created(){
    this.date = this.$store.state.date
    if(this.date =='')
    this.date = new Date()
  }
};
</script>

<style lang="scss">
.reporttime {
  .timepicker {
    margin-top: 5px;
    height: 450px;
    background-color: rgb(255, 255, 255);
  }
  .tip {
    margin-top: 20px;
    height: 50px;
    background-color: rgb(255, 255, 255);
    line-height: 50px;
    font-size: 15px;
    color: rgb(255, 59, 48);
  }
  .van-calendar__selected-day {
    width: 50px !important;
    height: 50px !important;
    border-radius: 50px !important;
  }
}
</style>
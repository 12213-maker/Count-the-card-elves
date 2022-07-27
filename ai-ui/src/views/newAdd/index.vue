<template>
  <div class="newaddmain">
    <div class="header">
      <Header
        @clickHeader="clickHeader"
        left="取消"
        mid="生成报表"
        right="提交"
      ></Header>
    </div>
    <div class="main">
      <div class="first">
        <div class="firstItme">
          <div>报表标题 <span style="color: red">*</span></div>
          <div class="titleposition">
            <van-field
              @input="titleblur"
              v-model="reportTitle"
              placeholder="点击填写"
            />
          </div>
        </div>
        <div class="firstItme">
          <div>报表时效 <span style="color: red">*</span></div>
          <div
            class="colorchange"
            @click="clickRouterPush('/reporttime/index')"
          >
            <span v-show="date == ''" class="datechange">点击选择<van-icon name="arrow" /></span>
            <span v-show="date != ''" class="dateposition">{{ newdate }}</span>
          </div>
        </div>
      </div>
      <div class="first">
        <div class="firstItme">
          <div>
            选择指标<span class="starts">*</span>({{ this.choice_1.length }})
          </div>
          <div
            class="colorchange"
            @click="clickRouterPush('/reportChoiceIndicator/index')"
          >
            <span>点击选择 <van-icon name="arrow" /></span>
          </div>
        </div>
        <div class="firstItme first-2">
          <div>
            推送对象<span class="starts">*</span>({{ this.choice_2.length }})
          </div>
          <div
            class="colorchange spacile"
            @click="clickRouterPush('/reportpush/index')"
          >
            <span>点击选择 <van-icon name="arrow" /></span>
          </div>
        </div>
      </div>
      <div class="showname">
        <van-button
          v-for="(item, index) in choice_2"
          :key="index"
          size="small"
          type="default"
          round
          >{{ item }}</van-button
        >
      </div>
      <span class="bottom">注: 生成报表后,将自动通知到所选对象</span>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import { addSpecTask } from "../../api/report/index";
import { dateFormat } from "@/utils/index";
export default {
  components: { Header },
  name: "newAdd",
  data() {
    return {
      date: "",
      reportTitle: "",
      //选择指标的结果
      choice_1: [],
      //推送对象的结果
      choice_2: [],

      result1: [],
      result2: [],
      userChlanName: [],
      areaName: [],
      roleNames: [],
      areaIds: [],
      kpiIds: [],
      userName: [],
      dateFormat,
    };
  },
  computed: {
    newdate() {
      return this.dateFormat(new Date(this.date), "yyyy-MM-dd");
    },
  },
  methods: {
    async clickHeader(value) {
      if (value == "left") {
        this.$router.push("/report/index");
      } else {
        const data = {
          areaIds: this.areaIds,
          deadlineDate: this.dateFormat(
            new Date(this.date),
            "yyyy-MM-dd 23:59:59"
          ),
          kpiIds: this.kpiIds,
          roleNames: this.roleNames,
          taskName: this.reportTitle,
          userIds: this.userName,
        };
        // if(this.reportTitle.length>20){
        //   this.$toast.fail("请填写二十个字以内的标题");
        //   return
        // }
        //提交之前还要验证数据是否完整
        if (
         
          this.reportTitle == "" ||
          this.date == "" ||
          this.kpiIds.length == 0 ||
          (this.areaIds.length == 0 &&
          this.roleNames.length == 0 &&
          this.userName.length == 0)
        ) {
          console.log(this.areaIds.length,this.date,this.kpiIds.length,this.roleNames.length,this.reportTitle,this.userName.length,'我都是一些什么东西');
          this.$toast.fail("请将表单填写完整");
          return;
        }
        

        this.$toast.loading({
          message: "提交中",
          forbidClick: true,
          duration: 0,
        });
        const res = await addSpecTask(data);
        this.$toast.clear();
        //跳过去的时候把所有数据都清空
        this.$store.commit("setTitle", "");
        this.$store.commit("setDate", "");
        this.$store.commit("setResult1", { flag: 0, trueValue: [] });
        this.$store.commit("setResult2", { flag: 0, trueValue: [] });
        this.$router.push("/report/index");
        console.log(res, "我是提交的结果");
      }
    },

    clickRouterPush(value) {
      //选择指标
      if (value == "/reportChoiceIndicator/index") {
        this.$router.push({
          path: value,
          query: {
            result1: this.result1,
          },
        });
      } else if (value == "/reportpush/index") {
        this.$router.push({
          path: value,
          query: {
            result1: this.result2,
          },
        });
      } else {
        this.$router.push(value);
      }
    },
    titleblur() {
      if(this.reportTitle.length>20){
        this.reportTitle.split('').splice(19,-1).join('')
        this.reportTitle = this.reportTitle.slice(0,19)
        return; 
      }
      else
      {
        this.$store.commit("setTitle", this.reportTitle);
      }
      console.log('我又没有运行',this.reportTitle.length);
    },
    //初始化
    init() {
      this.result1 = JSON.parse(JSON.stringify(this.$store.state.result1));
      this.result2 = JSON.parse(JSON.stringify(this.$store.state.result2));
      this.date = this.$store.getters.newdate;
      Object.keys(this.result2).forEach((i, index) => {
        const item = this.result2[i];
        item.forEach((name, index) => {
          if (i == "value1") {
            this.userChlanName.push(name.userChlanName);
            this.userName.push(name.userName);
          } else if (i == "value2") {
            this.areaName.push(name.areaName);
            this.areaIds.push(name.areaId);
          } else {
            this.roleNames.push(name.roleName);
          }
        });
      });

      this.choice_2.push(
        ...this.userChlanName,
        ...this.areaName,
        ...this.roleNames
      );

      Object.keys(this.result1).forEach((i) => {
        const item = this.result1[i];
        if (item.length != 0) {
          item.forEach((item2) => {
            this.choice_1.push(item2.kpiName);
            this.kpiIds.push(item2.kpiId);
          });
        }
      });

      this.data = this.$store.getters.userName;
      this.reportTitle = this.$store.state.title;
    },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss">
.newaddmain {
  .header{
    position: fixed;
    width:100%;
    z-index: 999;
  }
  .main {
    position: relative;
    top:28px;

    overflow: hidden;
    .first {
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      .firstItme {
        background-color: white;
        height: 50px;
        padding: 0 20px;
        margin: 1px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        color: rgb(102, 102, 102);
        font-size: 15px;
        .van-cell,
        .van-field {
          // background-color: pink;
          width: 150px;
          font-size: 15px;
          position: relative;
          left: 34px;
          padding:0;
        }
        &:nth-child(2) {
          padding-right: 37px;
        }
        .colorchange {
          color: rgb(0, 121, 254);
          .datechange{
            // background-color: pink;
            // transform: translate(50%);
            position: relative;
            left:15px;
            & i{
              transform: translate(30%,-25%);
              // background-color: blue  ;
            }
          }
          .dateposition{
            position: relative;
            left:8px;
          }
        }
        .titleposition{
         overflow: hidden;
        }
        .van-icon,
        .van-icon-arrow {
          font-size: 13px;
          position: relative;
          left: -5px;
          top: 1px;
        }
        .starts {
          color: red;
          padding-right: 7px;
          padding-left: 3px;
        }
        .van-field__control {
          color: rgb(0, 121, 254);
        }
      }
      .spacile {
        position: relative;
        left: 17px;
      }
    }
    .showname {
      padding: 20px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      background-color: white;
      color: rgb(153, 153, 153);
      .van-button,
      .van-button--default,
      .van-button--small,
      .van-button--round {
        width: 33%;
        // 单行省略
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        //指定两行 , 超过省略
        // //将父级元素变为弹性盒模型
        // display: -webkit-box;
        // //设置子元素的排列方式
        // -webkit-box-orient: vertical;
        // //控制文本显示的行数
        // -webkit-line-clamp: 2;
        // overflow: hidden;
        // text-overflow: ellipsis;
      }
    }
    .van-button,
    .van-button--default,
    .van-button--normal,
    .van-button--round {
      color: rgb(153, 153, 153);
      margin: 10px 0px;
      font-size: 15px;
      padding: 0 20px;
    }

    .bottom {
      display: block;
      padding: 20px 0;
      padding-top: 15px;
      font-size: 13px;
      color: rgb(153, 153, 153);
    }
  }
}
</style>
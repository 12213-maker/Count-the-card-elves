<template>
  <div class="reportchoise">
    <div class="header">
      <Header
        @clickHeader="clickHeader"
        left="返回"
        mid="选择指标"
        right=""
      ></Header>
    </div>
    <div class="dicator">
      <van-tabs type="card">
        <!-- 小时指标 -->
        <van-tab title="小时指标">
          <van-search
            v-model="searchvalue_1"
            shape="round"
            background="rgb(248, 248, 248)"
            placeholder="搜索"
            @search="onSearch(1)"
            @clear="onSearch(1)"
            @input="debounceinput(1)"
          />
          <div v-if="this.result_1_1.length" class="checkedtrueorfalse">
            已选
          </div>
          <div v-if="this.result_1_1.length">
            <van-cell-group>
              <van-cell
                v-for="(item, cindex) in this.result_1_1"
                @click="checkItem(item.correKpiId, 1)"
                clickable
                :key="cindex"
              >
                <div class="flexrow">
                  <div class="bothtitle">
                    <div class="big">{{ item.kpiName }}</div>
                    <div class="litte">{{ item.correKpiId }}</div>
                  </div>
                  <van-checkbox
                    :name="item.kpiName"
                    v-model="item.checked"
                    ref="checkboxes"
                  />
                </div>
              </van-cell>
            </van-cell-group>
          </div>

          <div v-if="Object.keys(finallylist_1).length != 0">
            <van-index-bar
              highlight-color="rgb(83, 167, 255)"
              :index-list="FirstPin"
              :sticky-offset-top="100"
            >
              <div
                class="itembox"
                v-for="(item_1, index) in finallylist_1"
                :key="index"
              >
                <van-index-anchor :index="index" :title="index">
                  <span>{{ index }}</span>
                </van-index-anchor>
                <van-cell
                  v-for="(item, cindex) in item_1"
                  @click="checkItem(item.correKpiId, 1)"
                  clickable
                  :key="cindex"
                >
                  <div class="flexrow">
                    <div class="bothtitle">
                      <div class="big">{{ item.kpiName }}</div>
                      <div class="litte">{{ item.correKpiId }}</div>
                    </div>
                    <van-checkbox
                      :name="item.kpiName"
                      v-model="item.checked"
                      ref="checkboxes"
                    />
                  </div>
                </van-cell>
              </div>
            </van-index-bar>
          </div>
          <div v-else class="nodata">暂无数据</div>
        </van-tab>

        <!-- 日指标 -->
        <van-tab title="日指标">
          <van-search
            v-model="searchvalue_2"
            shape="round"
            background="rgb(248, 248, 248)"
            placeholder="搜索"
            @search="onSearch(2)"
            @clear="onSearch(2)"
            @input="debounceinput(2)"
          />

          <div v-if="this.result_1_2.length" class="checkedtrueorfalse">
            已选
          </div>
          <div v-if="this.result_1_2.length">
            <van-cell-group>
              <van-cell
                v-for="(item, cindex) in this.result_1_2"
                @click="checkItem(item.correKpiId, 2)"
                clickable
                :key="cindex"
              >
                <div class="flexrow">
                  <div class="bothtitle">
                    <div class="big">{{ item.kpiName }}</div>
                    <div class="litte">{{ item.correKpiId }}</div>
                  </div>
                  <van-checkbox
                    :name="item.kpiName"
                    v-model="item.checked"
                    ref="checkboxes"
                  />
                </div>
              </van-cell>
            </van-cell-group>
          </div>
          <div v-if="Object.keys(finallylist_2).length != 0">
            <van-index-bar
              highlight-color="#fb6463"
              :sticky-offset-top="100"
              :index-list="FirstPin"
            >
              <div
                class="itembox"
                v-for="(item_2, index) in finallylist_2"
                :key="index"
              >
                <van-index-anchor :index="index" :title="index">
                  <span>{{ index }}</span>
                </van-index-anchor>
                <van-cell
                  v-for="item in item_2"
                  @click="checkItem(item.correKpiId, 2)"
                  clickable
                  :key="item.correKpiId"
                >
                  <div class="flexrow">
                    <div class="bothtitle">
                      <div class="big">{{ item.kpiName }}</div>
                      <div class="litte">{{ item.correKpiId }}</div>
                    </div>
                    <van-checkbox
                      :name="item.kpiName"
                      v-model="item.checked"
                      ref="checkboxes"
                    />
                  </div>
                </van-cell>
              </div>
            </van-index-bar>
          </div>
          <div v-else class="nodata">暂无数据</div>
        </van-tab>

        <!-- 月指标 -->
        <van-tab title="月指标">
          <van-search
            v-model="searchvalue_3"
            shape="round"
            background="rgb(248, 248, 248)"
            placeholder="搜索"
            @search="onSearch(3)"
            @clear="onSearch(3)"
            @input="debounceinput(3)"
          />
          <div v-if="this.result_1_3.length" class="checkedtrueorfalse">
            已选
          </div>
          <div v-if="this.result_1_3.length">
            <van-cell-group>
              <van-cell
                v-for="(item, cindex) in this.result_1_3"
                @click="checkItem(item.correKpiId, 3)"
                clickable
                :key="cindex"
              >
                <div class="flexrow">
                  <div class="bothtitle">
                    <div class="big">{{ item.kpiName }}</div>
                    <div class="litte">{{ item.correKpiId }}</div>
                  </div>
                  <van-checkbox
                    :name="item.kpiName"
                    v-model="item.checked"
                    ref="checkboxes"
                  />
                </div>
              </van-cell>
            </van-cell-group>
          </div>
          <div v-if="Object.keys(finallylist_3).length != 0">
            <van-index-bar
              highlight-color="#fb6463"
              :sticky-offset-top="100"
              :index-list="FirstPin"
            >
              <div
                class="itembox"
                v-for="(item_1, index) in finallylist_3"
                :key="index"
              >
                <van-index-anchor :index="index" :title="index">
                  <span>{{ index }}</span>
                </van-index-anchor>
                <van-cell
                  v-for="(item, cindex) in item_1"
                  @click="checkItem(item.correKpiId, 3)"
                  clickable
                  :key="cindex"
                >
                  <div class="flexrow">
                    <div class="bothtitle">
                      <div class="big">{{ item.kpiName }}</div>
                      <div class="litte">{{ item.correKpiId }}</div>
                    </div>
                    <van-checkbox
                      :name="item.name"
                      v-model="item.checked"
                      ref="checkboxes"
                    />
                  </div>
                </van-cell>
              </div>
            </van-index-bar>
          </div>
          <div v-else class="nodata">暂无数据</div>
        </van-tab>
      </van-tabs>
    </div>
    <div class="bottom">
      <van-button
        @click="choisedone"
        round
        type="info"
        size="small"
        color="rgb(0, 121, 254)"
      >
        确定({{ count }})
      </van-button>
    </div>
  </div>
</template>

<script>
import Header from "../newAdd/components/Header.vue";
import { getKpiDefine } from "../../api/report/index";
export default {
  components: { Header },
  name: "reportChoiceIndicator",
  data() {
    return {
      //小时指标
      checkboxstatus_1: [],
      searchvalue_1: "",
      showList_1: {},
      result_1_1: [],
      count_1: 0,
      finallylist_1: {},

      //日指标
      checkboxstatus_2: [],
      searchvalue_2: "",
      showList_2: {},
      result_1_2: [],
      count_2: 0,
      finallylist_2: {},

      //月指标
      checkboxstatus_3: [],
      searchvalue_3: "",
      showList_3: {},
      result_1_3: [],
      count_3: 0,
      finallylist_3: {},

      FirstPin: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        "#",
      ],
      count: 0,
    };
  },
  watch: {
    searchvalue_1(newval) {
      if (newval == "") {
        this.reset(1);
        this.getKpiDefine(1);
      }
    },
    searchvalue_2(newval) {
      if (newval == "") {
        this.reset(2);
        this.getKpiDefine(2);
      }
    },
    searchvalue_3(newval) {
      if (newval == "") {
        this.reset(3);
        this.getKpiDefine(3);
      }
    },
  },
  methods: {
    clickHeader() {
      this.$router.push({
        path: "/newadd/index",
        query: {
          result1: [],
        },
      });
    },

    checkItem(id, flag) {
      if (flag === 1) {
        console.log("我是小时指标");
        let itemnow;
        let flag_temp = 1;
        //得到当前点击的item
        for (let i in this.finallylist_1) {
          const item1 = this.finallylist_1[i];
          item1.forEach((item) => {
            if (item.correKpiId == id) {
              flag_temp = 0;
              item.checked = !item.checked;
              itemnow = item;
            }
          });
          if (flag_temp == 0) break;
        }
        //点击确认
        if (itemnow.checked) {
          console.log("我要改变了");
          this.result_1_1.push(itemnow);
          this.count++;
        } else {
          this.result_1_1 = this.result_1_1.filter((i) => {
            return i.correKpiId != id;
          });
          this.count--;
        }

        this.clearchoices(1);
      } else if (flag === 2) {
        console.log("我是日指标", flag);
        let itemnow;
        let flag_temp = 1;
        //得到当前点击的item
        for (let i in this.finallylist_2) {
          const item1 = this.finallylist_2[i];
          item1.forEach((item) => {
            if (item.correKpiId == id) {
              flag_temp = 0;
              item.checked = !item.checked;
              itemnow = item;
            }
          });
          if (flag_temp == 0) break;
        }
        //点击确认
        if (itemnow.checked) {
          console.log("我要改变了2");
          this.result_1_2.push(itemnow);
          this.count++;
        } else {
          this.result_1_2 = this.result_1_2.filter((i) => {
            return i.correKpiId != id;
          });
          this.count--;
        }

        this.clearchoices(2);
      } else {
        console.log("我是月指标", flag);
        let itemnow;
        let flag_temp = 1;
        //得到当前点击的item
        for (let i in this.finallylist_3) {
          const item1 = this.finallylist_3[i];
          item1.forEach((item) => {
            if (item.correKpiId == id) {
              flag_temp = 0;
              item.checked = !item.checked;
              itemnow = item;
            }
          });
          if (flag_temp == 0) break;
        }
        //点击确认
        if (itemnow.checked) {
          console.log("我要改变了3");
          this.result_1_3.push(itemnow);
          this.count++;
        } else {
          this.result_1_3 = this.result_1_3.filter((i) => {
            return i.correKpiId != id;
          });
          this.count--;
        }
        this.clearchoices(3);
      }
    },

    //选中一个指标的时候清空其它指标
    clearchoices(flag) {
      if (flag == 1) {
        //选中日指标的时候取消其它指标的选中以及checked置为false
        this.result_1_2 = [];
        this.result_1_3 = [];
        for (let i in this.finallylist_2) {
          const item1 = this.finallylist_2[i];
          item1.forEach((item) => {
            item.checked = false;
          });
        }
        for (let i in this.finallylist_3) {
          const item1 = this.finallylist_3[i];
          item1.forEach((item) => {
            item.checked = false;
          });
        }
        //count只是当前选中的数量
        this.count = this.result_1_1.length;
      } else if (flag == 2) {
        //选中日指标的时候取消其它指标的选中以及checked置为false
        this.result_1_1 = [];
        this.result_1_3 = [];
        for (let i in this.finallylist_1) {
          const item1 = this.finallylist_1[i];
          item1.forEach((item) => {
            item.checked = false;
          });
        }
        for (let i in this.finallylist_3) {
          const item1 = this.finallylist_3[i];
          item1.forEach((item) => {
            item.checked = false;
          });
        }
        //count只是当前选中的数量
        this.count = this.result_1_2.length;
      } else {
        //选中日指标的时候取消其它指标的选中以及checked置为false
        this.result_1_2 = [];
        this.result_1_1 = [];
        for (let i in this.finallylist_2) {
          const item1 = this.finallylist_2[i];
          item1.forEach((item) => {
            item.checked = false;
          });
        }
        for (let i in this.finallylist_1) {
          const item1 = this.finallylist_1[i];
          item1.forEach((item) => {
            item.checked = false;
          });
        }
        //count只是当前选中的数量
        this.count = this.result_1_3.length;
      }
    },

    //点击确认
    choisedone() {
      const newresult = [];
      this.result_1_1.forEach((item) => {
        if (newresult.indexOf(item) === -1) {
          newresult.push(item);
        }
      });
      const newresult2 = [];
      this.result_1_2.forEach((item) => {
        if (newresult2.indexOf(item) === -1) {
          newresult2.push(item);
        }
      });
      const newresult3 = [];
      this.result_1_3.forEach((item) => {
        if (newresult3.indexOf(item) === -1) {
          newresult3.push(item);
        }
      });
      this.$store.commit("setResult1", {
        flag: 1,
        trueValue: JSON.parse(JSON.stringify(newresult)),
      });
      this.$store.commit("setResult1", {
        flag: 2,
        trueValue: JSON.parse(JSON.stringify(newresult2)),
      });
      this.$store.commit("setResult1", {
        flag: 3,
        trueValue: JSON.parse(JSON.stringify(newresult3)),
      });

      this.$router.push({
        path: "/newadd/index",
        query: {
          result1: newresult,
        },
      });
    },
    //初始化
    init() {
      this.count =
        this.result_1_1.length +
        this.result_1_2.length +
        this.result_1_3.length;

      this.$nextTick(() => {
        console.log("我是init");
        const id1 = [];
        for (let i in this.result_1_1) {
          const item = this.result_1_1[i];
          item.checked = true;
          id1.push(item.correKpiId);
        }
        let count1 = id1.length;
        for (let i in this.finallylist_1) {
          const item1 = this.finallylist_1[i];
          item1.forEach((item) => {
            if (id1.includes(item.correKpiId)) {
              count1--;
              item.checked = true;
            }
          });
          if (count1 == 0) break;
        }

        const id2 = [];
        for (let i in this.result_1_2) {
          const item = this.result_1_2[i];
          item.checked = true;
          id2.push(item.correKpiId);
        }
        let count = id2.length;
        for (let i in this.finallylist_2) {
          const item1 = this.finallylist_2[i];
          item1.forEach((item) => {
            if (id2.includes(item.correKpiId)) {
              count--;
              item.checked = true;
              console.log(item);
            }
          });
          if (count == 0) break;
        }

        const id3 = [];
        for (let i in this.result_1_3) {
          const item = this.result_1_3[i];
          item.checked = true;
          id3.push(item.correKpiId);
        }
        let count3 = id3.length;
        for (let i in this.finallylist_3) {
          const item1 = this.finallylist_3[i];
          item1.forEach((item) => {
            if (id3.includes(item.correKpiId)) {
              count3--;
              item.checked = true;
            }
          });
          if (count3 == 0) break;
        }
      });
    },
    //查询数据
    async getKpiDefine(flag) {
      if (flag == 1) {
        let data1;
        if (this.searchvalue_1 != "") {
          data1 = {
            kpiModel: "1",
            kpiName: this.searchvalue_1,
          };
        } else {
          data1 = {
            kpiModel: "1",
          };
        }

        const { data } = await getKpiDefine(data1);
        let counttemp = 0;
        for (let i in data) {
          counttemp += data[i].length;
        }
        this.checkboxstatus_1 = new Array(counttemp).fill(false);
        this.showList_1 = data;

        let obj = {};
        for (let i in this.showList_1) {
          let item = this.showList_1[i];
          if (item.length) {
            obj[i] = item;
          }
        }

        let index = 0;
        for (let i in obj) {
          const item = obj[i];
          item.forEach((item2, index2) => {
            item[index2].index = index++;
            this.$set(item[index2], "checked", false);
            // if(this.result_1_1.includes())
          });
        }

        this.finallylist_1 = obj;
      } else if (flag == 2) {
        let data1;
        if (this.searchvalue_2 != "") {
          data1 = {
            kpiModel: "2",
            kpiName: this.searchvalue_2,
          };
        } else {
          data1 = {
            kpiModel: "2",
          };
        }

        const { data } = await getKpiDefine(data1);
        console.log("我是日指标", data);
        let counttemp = 0;
        for (let i in data) {
          counttemp += data[i].length;
        }
        this.checkboxstatus_2 = new Array(counttemp).fill(false);
        this.showList_2 = data;

        let obj = {};
        for (let i in this.showList_2) {
          let item = this.showList_2[i];
          if (item.length) {
            obj[i] = item;
          }
        }
        let index = 0;
        for (let i in obj) {
          const item = obj[i];
          item.forEach((item2, index2) => {
            this.$set(item[index2], "checked", false);
          });
        }
        this.finallylist_2 = obj;
      } else {
        let data1;
        if (this.searchvalue_3 != "") {
          data1 = {
            kpiModel: "3",
            kpiName: this.searchvalue_3,
          };
        } else {
          data1 = {
            kpiModel: "3",
          };
        }

        const { data } = await getKpiDefine(data1);
        console.log("我是月指标", data);
        let counttemp = 0;
        for (let i in data) {
          counttemp += data[i].length;
        }
        this.checkboxstatus_3 = new Array(counttemp).fill(false);
        this.showList_3 = data;

        let obj = {};
        for (let i in this.showList_3) {
          let item = this.showList_3[i];
          if (item.length) {
            obj[i] = item;
          }
        }
        let index = 0;
        for (let i in obj) {
          const item = obj[i];
          item.forEach((item2, index2) => {
            item[index2].index = index++;
            this.$set(item[index2], "checked", false);
          });
        }
        this.finallylist_3 = obj;
      }
      this.init();
    },
    //点击搜索框
    onSearch(flag) {
      if (flag == 1) {
        this.reset(1);
        this.getKpiDefine(1);
      } else if (flag == 2) {
        this.reset(2);
        this.getKpiDefine(2);
      } else {
        this.reset(3);
        this.getKpiDefine(3);
      }
    },
    reset(flag) {
      if (flag == 1) {
        this.finallylist_1 = [];
      } else if (flag == 2) {
        this.finallylist_2 = [];
      } else {
        this.finallylist_3 = [];
      }
    },
    //延迟搜索
    debounceinput(flag) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        if (flag == 1) {
          this.onSearch(1);
        } else if (flag == 2) {
          this.onSearch(2);
        } else {
          this.onSearch(3);
        }
      }, 500);
    },
  },
  async created() {
    this.$toast.loading({
      message: "加载中",
      forbidClick: true,
      duration: 0,
    });
    await Promise.all([
      this.getKpiDefine(1),
      this.getKpiDefine(2),
      this.getKpiDefine(3),
    ]);
    this.result_1_1 = JSON.parse(
      JSON.stringify(this.$store.state.result1.value1)
    );
    this.result_1_2 = JSON.parse(
      JSON.stringify(this.$store.state.result1.value2)
    );
    this.result_1_3 = JSON.parse(
      JSON.stringify(this.$store.state.result1.value3)
    );
    this.init();
    this.$toast.clear();
  },
};
</script>

<style lang="scss">
.reportchoise {
  .header {
    position: fixed;
    z-index: 999;
    width: 100%;
  }
  .dicator {
    position: relative;
    top: 45px;
    height: 50px;
    background-color: rgb(255, 255, 255);
    .nodata {
      color: rgb(102, 102, 102);
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%);
    }
    .van-tabs__wrap {
      position: fixed;
      z-index: 999;
      width: 100%;
      background-color: rgb(255, 255, 255);
    }
    .van-tabs__content {
      position: relative;
      top: 50px;
    }
    .van-tabs__wrap {
      height: 50px;
      padding: 10px 0;
      .van-tabs__nav,
      .van-tabs__nav--card {
        border-radius: 1vw !important;
      }
    }

    .van-index-anchor {
      padding-left: 30px;
      display: flex;
      justify-items: flex-start;
      color: rgb(153, 153, 153);
      font-size: 18px;
      background-color: rgb(249, 249, 249);
      height: 40px;
      line-height: 40px;
    }
    .flexrow {
      padding-left: 50px;
      padding-right: 20px;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: center;
      position: relative;
      .bothtitle {
        display: flex;
        flex-direction: column;
        justify-content: center;
        // background-color: pink;
        width: 95%;

        .big {
          color: rgb(102, 102, 102);
        }
        .litte {
          color: rgb(204, 204, 204);
          font-size: 13px;
        }
      }
      .van-checkbox__icon,
      .van-checkbox__icon--round {
        font-size: 16px;
        border-color: rgb(185, 182, 182);
        // background-color: pink;
        position: absolute;
        right: 15px;
      }
    }

    .van-search__content,
    .van-search__content--round {
      background-color: white;
      height: 35px;
    }
    .van-index-bar__index {
      color: rgb(159, 155, 168);
      font-size: 14px;
      padding: 3px 0;
    }
    .van-cell {
      font-size: 15px;
      color: rgb(107, 107, 107);
    }
    --van-index-bar-index-active-color {
      background-color: blue;
    }
    .van-index-anchor,
    .van-index-anchor--sticky,
    .van-hairline--bottom {
      color: rgb(168, 168, 168) !important;
      font-weight: 600 !important;
    }
    /* 索引栏的样式 */
    .van-index-bar__index,
    .van-index-bar__index--active {
      color: rgb(168, 164, 176) !important;
      // display: flex;
      // justify-items: center;
      // align-items: center;
      // text-align: center;
      // &:hover{
      //   color: white !important;
      //   background-color: rgb(0, 121, 254);
      //   width: 15px;
      //   height: 20px;
      //   line-height: 20px;
      //   border-radius: 20px;

      // }
    }
  }
  .bottom {
    width: 100vw;
    height: 60px;
    padding-right: 20px;
    border-top: 3px solid rgb(241, 241, 241);
    position: absolute;
    bottom: 0;
    z-index: 999;
    background-color: white;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
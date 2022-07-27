<template>
  <div class="reportchoise">
    <!-- 头部 -->
    <div class="header">
      <Header
        @clickHeader="clickHeader"
        left="返回"
        mid="选择推送对象"
        right=""
      ></Header>
    </div>
    <div class="dicator">
      <van-tabs type="card">
        <!-- 手机号码 -->
        <van-tab title="手机号码">
          <van-search
            v-model="searchvalue_1"
            shape="round"
            background="rgb(248, 248, 248)"
            placeholder="搜索"
            @search="onSearch(1)"
            @clear="onSearch(1)"
            @input="debounceinput(1)"
          />
          <div v-if="this.result2_1.length" class="checkedtrueorfalse">
            已选
          </div>
          <div v-if="result2_1">
            <van-cell
              v-for="(item, index) in result2_1"
              @click="checkItemdone(index, item)"
              clickable
              :key="index"
            >
              <div class="flexrow">
                <div class="flexrow_row">
                  <span class="icona"><van-icon name="user-circle-o" /></span>
                  <div class="bothtitle">
                    <div class="big">{{ item.userChlanName }}</div>
                    <div class="litte">{{ item.userName }}</div>
                  </div>
                </div>
                <van-checkbox
                  icon-size="19px"
                  :name="item.name"
                  v-model="item.checked"
                  ref="checkboxes"
                />
              </div>
            </van-cell>
          </div>

          <div class="checkedtrueorfalse">选择区</div>
          <van-list
            :loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getUserByTelz"
          >
            <van-cell
              v-for="(item, index) in phoneList"
              @click="checkItem(index, item)"
              clickable
              :key="index"
            >
              <div class="flexrow">
                <div class="flexrow_row">
                  <span class="icona"><van-icon name="user-circle-o" /></span>
                  <div class="bothtitle">
                    <div class="big">{{ item.userChlanName }}</div>
                    <div class="litte">{{ item.userName }}</div>
                  </div>
                </div>
                <van-checkbox
                  icon-size="19px"
                  :name="item.name"
                  v-model="item.checked"
                  ref="checkboxes"
                />
              </div>
            </van-cell>
          </van-list>
        </van-tab>

        <!-- 地市/区县 -->
        <div class="city">
          <van-tab title="地市/区县">
            <van-collapse v-model="activeNames">
              <div @click="clickall" class="allchecked">
                <div>全部</div>
                <van-checkbox
                  icon-size="17px"
                  shape="square"
                  @click.stop
                  v-model="checkall"
                />
              </div>
              <van-collapse-item
                v-for="(item, index) in tabcontent2"
                :key="index"
                :icon="iconstatus[index] ? 'arrow-down' : 'arrow-up'"
              >
                <!-- item的标题 -->
                <template #title>
                  <div @click.self="changeItem2(index)" class="cityitem">
                    <div>{{ item.areaName }}</div>
                    <div>
                      <van-checkbox
                        @click.stop="Item2checkbox(item.areaId, item)"
                        icon-size="17px"
                        v-model="item.checked"
                        shape="square"
                        checked-color="rgb(83, 167, 255)"
                      />
                    </div>
                  </div>
                </template>

                <van-cell
                  v-for="(item2, id) in item.countys"
                  :key="id"
                  clickable
                  @click.stop="ccheckboxInner(item2.areaId)"
                >
                  <div class="flexrow">
                    <div class="bothtitle">
                      <div class="big">{{ item2.areaName }}</div>
                    </div>
                    <van-checkbox
                      icon-size="17px"
                      v-model="item2.checked"
                      shape="square"
                      checked-color="rgb(83, 167, 255)"
                    />
                  </div>
                </van-cell>
              </van-collapse-item>
            </van-collapse>
          </van-tab>
        </div>

        <!-- 角色 -->
        <van-tab title="角色"
          ><van-search
            v-model="searchvalue_3"
            shape="round"
            background="rgb(248, 248, 248)"
            placeholder="搜索"
            @search="onSearch(3)"
            @clear="onSearch(3)"
            @input="debounceinput(3)"
          />
          <div v-if="this.result2_3.length" class="checkedtrueorfalse">
            已选
          </div>
          <div v-if="this.result2_3.length">
            <van-cell-group>
              <van-cell
                class="role"
                v-for="(item, index) in this.result2_3"
                clickable
                :key="item.name"
                :title="`${item.roleName}`"
                @click="toggledone(index, item)"
              >
                <template #right-icon>
                  <van-checkbox
                    icon-size="17px"
                    shape="square"
                    :name="item.name"
                    v-model="item.checked"
                    ref="checkboxes3"
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </div>
          <div class="checkedtrueorfalse">选择区</div>
          <van-list
            :loading="loading3"
            :finished="finished3"
            finished-text="没有更多了"
            @load="getRole"
          >
            <van-cell
              class="role"
              v-for="(item, index) in tabcontent3"
              clickable
              :key="index"
              :title="`${item.roleName}`"
              @click="toggle(index, item)"
            >
              <template #right-icon>
                <van-checkbox
                  icon-size="17px"
                  shape="square"
                  :name="index"
                  v-model="item.checked"
                  ref="checkboxes3"
                />
              </template>
            </van-cell>
          </van-list>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 底部 -->
    <div class="bottom">
      <van-button
        @click="choisedone"
        round
        type="info"
        size="small"
        color="rgb(0, 121, 254)"
      >
        <!-- 确定({{ count }}) -->
        确定({{ result2_1.length + result2_2.length + result2_3.length }})
      </van-button>
    </div>
  </div>
</template>

<script>
import Header from "../newAdd/components/Header.vue";
import { gettaskgetArea, getUserByTel, getRole } from "../../api/report/index";
export default {
  components: { Header },
  name: "reportChoiceIndicator",
  data() {
    let timer = null;
    return {
      //tab2的相关数据
      result2_2: [],
      activeNames: [],
      tabcontent2: [],
      iconstatus: [],
      count2: 0,
      checkall: false,
      lenall: 0,

      //tab3的相关数据
      result2_3: [],
      tabcontent3: [],
      count3: 0,
      searchvalue_3: "",

      //tab1的相关数据
      phoneList: [],
      result2_1: [],
      searchvalue_1: "",

      //list1 懒加载的相关数据
      pageNum: 1,
      pageSize: 30,
      loading: false,
      finished: false,
      nextPage: 1,

      //list3 懒加载相关数据
      pageNum3: 1,
      pageSize3: 30,
      loading3: false,
      finished3: false,
      nextPage3: 1,

      //选择的总数
      count: 0,
    };
  },
  watch: {
    result2_2: {
      handler(newval) {
        if (newval.length == this.lenall && newval.length != 0) {
          this.checkall = true;
        } else {
          this.checkall = false;
        }
        this.count2 = this.result2_2.length;
      },
    },
    count2: {
      handler(newval, oldval) {
        this.count -= oldval;
        this.count += newval;
      },
    },
    searchvalue_1(newval) {
      if (newval == "") {
        this.onSearch(1);
      }
    },
    searchvalue_3(newval) {
      if (newval == "") {
        this.onSearch(3);
      }
    },
  },
  methods: {
    //获取用户电话号码
    async getUserByTelz() {
      this.loading = true;
      const data1 = {
        pageNum: this.pageNum++,
        pageSize: this.pageSize,
        phoneNumber: this.searchvalue_1,
      };
      const res = await getUserByTel(data1);
      this.nextPage = res.data.isLastPage;
      this.phoneList.push(...res.data.list);
      this.loading = false;
      if (this.nextPage) {
        this.finished = true;
      }

      this.phoneList.forEach((item) => {
        this.$set(item, "checked", false);
      });
      console.log(res, "我是res");
      // this.keepstatus();

      let temparr_1 = [];
      this.result2_1.forEach((item) => {
        temparr_1.push(item.userName);
      });
      this.phoneList.forEach((itme) => {
        if (temparr_1.includes(itme.userName)) {
          itme.checked = true;
        }
      });
    },
    //获取角色名称
    async getRole() {
      this.loading3 = true;
      const data1 = {
        pageNum: this.pageNum3++,
        pageSize: this.pageSize3,
        roleName: this.searchvalue_3,
      };
      const res = await getRole(data1);
      this.nextPage3 = res.data.isLastPage;
      this.tabcontent3.push(...res.data.list);
      this.loading3 = false;
      if (this.nextPage3) {
        this.finished3 = true;
      }

      let index = 0;
      this.tabcontent3.forEach((item) => {
        this.$set(item, "checked", false);
        item.index = index++;
      });
      
      let temparr = [];
        this.result2_2.forEach((item) => {
          temparr.push(item.areaId);
        });
        let lenall = 0;
        this.tabcontent2.forEach((itme) => {
          let len = 0;
          itme.countys.forEach((item2) => {
            if (temparr.includes(item2.areaId)) {
              len++;
              item2.checked = true;
            }
          });
          if (len == itme.countys.length) {
            itme.checked = true;
            lenall++;
          }
        });
        if (lenall == this.tabcontent2.length && lenall != 0) {
          this.checkall = true;
          console.log("我们两个相等", lenall, this.tabcontent2.length);
        }
    },
    // 获取tab_2的数据
    async gettaskgetArea() {
      const { data } = await gettaskgetArea();
      this.tabcontent2 = data;

      //给每个可选的都绑定一个checked
      this.tabcontent2.forEach((item) => {
        this.$set(item, "checked", false);
        item.countys.forEach((itme2) => {
          this.$set(itme2, "checked", false);
          this.lenall++;
        });
      });

      //折叠栏的标识
      this.iconstatus = new Array(this.tabcontent2.length).fill(true);
    },
    //点击返回
    clickHeader() {
      this.$router.push({
        path: "/newadd/index",
        query: {
          result1: [],
        },
      });
    },
    checkItemdone(index, item) {
      this.result2_1 = this.result2_1.filter((i) => {
        return i.userName != item.userName;
      });
      this.phoneList.forEach((item1) => {
        if (item1.userName == item.userName) item1.checked = false;
      });
      this.count--;
    },

    //点击选中tab_1中的内容
    checkItem(index, item) {
      console.log("我是tab1");
      let status = this.phoneList[index].checked;
      this.phoneList[index].checked = !this.phoneList[index].checked;

      //根据check状态来装填
      if (!status) {
        //点击就加进去
        this.result2_1.push(item);
        this.count++;
      } else {
        //这里就取消选中
        this.result2_1 = this.result2_1.filter((i) => {
          return i.userName != item.userName;
        });
        this.count--;
      }
      this.result2_1 = [...new Set(this.result2_1)]
      this.clearchoice(1);
    },
    //点击tab_2全部
    clickall() {
      console.log("点击全部");
      this.checkall = !this.checkall;
      if (this.checkall) {
        this.result2_2 = [];
        //所有的checked置为true
        this.tabcontent2.forEach((item) => {
          item.checked = true;
          item.countys.forEach((item2) => {
            item2.checked = true;
            this.result2_2.push(item2);
          });
        });
      } else {
        this.tabcontent2.forEach((item) => {
          item.checked = false;
          item.countys.forEach((item2) => {
            item2.checked = false;
          });
        });
        this.result2_2 = [];
      }
      this.clearchoice(2);
    },
    //点击tab_2的item
    Item2checkbox(id, item) {
      console.log("我是tab2");
      let aid = [];
      this.tabcontent2.forEach((item) => {
        if (id == item.areaId) {
          item.countys.forEach((item2) => {
            aid.push(item2.areaId);
          });
        }
      });

      let status;
      //改变按钮的状态
      this.tabcontent2.forEach((item) => {
        if (id == item.areaId) {
          status = item.checked;
          //点击全选
          if (status) {
            this.result2_2.push(...item.countys);
            //还要改变所有checked的状态
            item.countys.forEach((item2) => {
              item2.checked = true;
            });
            //全不选
          } else {
            item.countys.forEach((item2) => {
              item2.checked = false;
            });
            this.checkall = false;
            this.result2_2 = this.result2_2.filter((i) => {
              return aid.includes(i.areaId) == false;
            });
          }
        }
      });

      let temp = new Set(this.result2_2);
      this.result2_2 = [...temp];
      this.clearchoice(2);
    },
    //点击tab_2里面的checkbox
    ccheckboxInner(id) {
      console.log("我被电击了");
      let status;
      let temp;
      //改变按钮的状态
      this.tabcontent2.forEach((item) => {
        item.countys.forEach((item2) => {
          if (id == item2.areaId) {
            item2.checked = !item2.checked;
            status = item2.checked;
            temp = item2;
          }
        });
      });

      if (status) {
        this.result2_2.push(temp);
      } else {
        this.checkall = false;
        this.result2_2 = this.result2_2.filter((item3) => {
          return id != item3.areaId;
        });
      }
      this.clearchoice(2);
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
        } else {
          this.onSearch(3);
        }
      }, 500);
    },
    //点击选tab_3的内容
    toggle(index, item) {
      console.log("我是tab3");
      let status = this.tabcontent3[index].checked;
      this.tabcontent3[index].checked = !this.tabcontent3[index].checked;

      if (!status) {
        this.result2_3.push(item);
        this.count++;
        this.count3++;
      } else {
        this.result2_3 = this.result2_3.filter((item3) => {
          return item3.index != item.index;
        });
        this.count--;
        this.count3--;
      }
      this.result2_3 = [...new Set(this.result2_3)]
      this.clearchoice(3);
    },
    clearchoice(flag) {
      if (flag == 1) {
        this.result2_2 = [];
        this.result2_3 = [];
        this.tabcontent2.forEach((itme, index) => {
          itme.checked = false;
          itme.countys.forEach((itme2) => {
            itme2.checked = false;
          });
          // console.log(itme);
        });
        this.tabcontent3.forEach((itme, index) => {
          itme.checked = false;
        });
        this.count = this.result2_1.length;
      } else if (flag == 2) {
        this.result2_1 = [];
        this.result2_3 = [];
        this.phoneList.forEach((itme, index) => {
          itme.checked = false;
        });
        // this.tabcontent2.forEach((itme,index)=>{
        //   itme.checked = false
        // })
        this.tabcontent3.forEach((itme, index) => {
          itme.checked = false;
        });
        this.count = this.result2_2.length;
      } else {
        this.result2_2 = [];
        this.result2_1 = [];
        this.phoneList.forEach((itme, index) => {
          itme.checked = false;
        });
        this.tabcontent2.forEach((itme, index) => {
          itme.checked = false;
          itme.countys.forEach((itme2) => {
            itme2.checked = false;
          });
        });
        // this.tabcontent3.forEach((itme,index)=>{
        //   itme.checked = false
        // })
        this.count = this.result2_3.length;
      }
    },

    toggledone(index, item) {
      this.result2_3 = this.result2_3.filter((item3) => {
        return item3.index != item.index;
      });
      this.tabcontent3.forEach((item3, index) => {
        if (item3.index == item.index) {
          item3.checked = false;
        }
      });
      this.count--;
      this.count3--;
    },
    //点击确认
    choisedone() {
      const newresult = [];
      this.result2_1.forEach((item) => {
        if (newresult.indexOf(item) === -1) {
          newresult.push(item);
        }
      });
      this.$store.commit("setResult2", {
        trueValue: JSON.parse(JSON.stringify(newresult)),
        flag: 1,
      });
      this.$store.commit("setResult2", {
        trueValue: JSON.parse(JSON.stringify(this.result2_2)),
        flag: 2,
      });
      this.$store.commit("setResult2", {
        trueValue: JSON.parse(JSON.stringify(this.result2_3)),
        flag: 3,
      });

      this.$router.push({
        path: "/newadd/index",
        query: {
          result2: newresult,
        },
      });
    },
    //恢复跳转走之前的状态
    keepstatus() {
      this.result2_1 = JSON.parse(
        JSON.stringify(this.$store.state.result2.value1)
      );
      this.result2_2 = JSON.parse(
        JSON.stringify(this.$store.state.result2.value2)
      );
      this.result2_3 = JSON.parse(
        JSON.stringify(this.$store.state.result2.value3)
      );

      //恢复选中的数量
      this.count =
        this.result2_1.length + this.result2_3.length + this.result2_2.length;

      //处理勾选状态
      this.$nextTick(() => {
        //1
        let temparr_1 = [];
        this.result2_1.forEach((item) => {
          temparr_1.push(item.userName);
        });
        this.phoneList.forEach((itme) => {
          if (temparr_1.includes(itme.userName)) {
            itme.checked = true;
          }
        });

        //2
        let temparr = [];
        this.result2_2.forEach((item) => {
          temparr.push(item.areaId);
        });
        let lenall = 0;
        this.tabcontent2.forEach((itme) => {
          let len = 0;
          itme.countys.forEach((item2) => {
            if (temparr.includes(item2.areaId)) {
              len++;
              item2.checked = true;
            }
          });
          if (len == itme.countys.length) {
            itme.checked = true;
            lenall++;
          }
        });
        if (lenall == this.tabcontent2.length && lenall != 0) {
          this.checkall = true;
          console.log("我们两个相等", lenall, this.tabcontent2.length);
        }

        //3
        let temparr_3 = [];
        this.result2_3.forEach((item) => {
          temparr_3.push(item.roleName);
          item.checked = true;
        });
        this.tabcontent3.forEach((itme) => {
          if (temparr_3.includes(itme.roleName)) {
            itme.checked = true;
          }
        });
      });
    },
    //点击折叠栏
    changeItem2(index) {
      this.iconstatus.splice(index, 1, !this.iconstatus[index]);
    },

    //点击搜索框
    onSearch(flag) {
      if (flag == 1) {
        this.reset(1);
        this.getUserByTelz();
      } else {
        this.reset(3);
        this.getRole();
      }
    },
    reset(flag) {
      if (flag == 1) {
        this.phoneList = [];
        this.pageNum = 1;
        this.nextPage = 1;
        this.finished = false;
      } else {
        this.tabcontent3 = [];
        this.pageNum3 = 1;
        this.nextPage3 = 1;
        this.finished3 = false;
      }
    },
  },

  async created() {
    this.$toast.loading({
      message: "加载中",
      forbidClick: true,
      duration: 0,
    });
    await Promise.all([
      this.gettaskgetArea(),
      this.getRole(),
      this.getUserByTelz(),
    ]);
    this.keepstatus();
    this.$toast.clear();
  },
};
</script>

<style lang="scss">
.reportchoise {
  .header {
    // position: fixed;
  }
  .dicator {
    height: 50px;
    background-color: rgb(255, 255, 255);
    .van-tabs__wrap {
      height: 50px;
      padding: 10px 0;
      .van-tabs__nav,
      .van-tabs__nav--card {
        border-radius: 1vw !important;
      }
    }
    .checkedtrueorfalse {
      height: 60px;
      line-height: 60px;
      text-align: left;
      background-color: rgb(249, 249, 249);
      color: rgb(153, 153, 153);
      font-size: 18px;
      font-weight: 700;
      padding-left: 30px;
    }
    .allchecked {
      height: 56px;
      background-color: rgb(249, 249, 249);
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-left: 56px;
      padding-right: 16px;
      font-size: 15px;
      color: rgb(114, 114, 114);
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
      padding-left: 0px;
      padding-right: 20px;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-content: center;

      .bothtitle {
        display: flex;
        flex-direction: column;
        justify-content: center;
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
      }
      .flexrow_row {
        // background-color: pink;
        display: flex;
        align-items: center;
        .icona {
          padding: 0 10px;
          font-size: 40px;
          // background-color: rgb(204, 204, 204);
          .van-icon,
          .van-icon-user-circle-o {
            // background-color: rgb(204, 204, 204);
            color: rgb(204, 204, 204);
          }
        }
      }
    }

    .role {
      padding-top: 15px;
      padding-bottom: 15px;
    }
    .van-search__content,
    .van-search__content--round {
      background-color: white;
      height: 35px;
    }
    .van-index-bar__index {
      // background-color: pink ;
      color: rgb(159, 155, 168);
      font-size: 14px;
      padding: 3px 0;
      padding-right: 5px;
    }
    .van-cell:not(:first-child) {
      // padding: 0 20px;
      // height: 60px;
      box-sizing: border-box;
      border-top: 1px solid rgb(234, 234, 234);
      border-bottom: 1px solid rgb(234, 234, 234);
      font-size: 15px;
      color: rgb(107, 107, 107);
    }
    .van-cell__title {
      // background-color: red !important;
      text-align: left;
      padding-left: 20px;
    }
    --van-index-bar-index-active-color {
      background-color: blue;
    }

    .city {
      .van-icon,
      .van-icon-arrow,
      .van-cell__right-icon {
        // background-color: pink !important;
        position: relative;
        // top:0;
      }
      .van-icon-arrow {
        display: none !important;
        opacity: 0 !important;
      }
      .cityitem {
        // background-color: pink;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }
      .van-cell__value,
      .van-cell__value--alone {
        // background-color: pink;
        position: relative;
        left: 35px;
      }
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
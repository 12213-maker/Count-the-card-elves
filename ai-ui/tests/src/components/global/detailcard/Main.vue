<template>
  <div class="detail-card" v-if="data.kpiName" :class="'detail-card-'+tabIndex+'-'+data.correKpiId">


    <p class="update-time">数据周期：{{ data.kpiDate }}</p>

    <div class="inner-wrap">
      <!-- 蓝色卡片 -->
      <div class="card">
        <p class="title">
          <span class="name-wrap">
            <span class="name">{{ data.kpiName }}</span>
            <van-icon
              v-if="data.chkMetd!=0"
              name="warning"
              :size="16"
              class="note-icon"
              :color="iconType(data.warningLevel)"
              @click="showInfo(data.alarmCnt, data.alarmRule, data.effectTime)"
            />
          </span>
          <a class="detail-btn" @click="routerToDetail">
            <van-icon
            name="newspaper-o"
            color="#fff"/>洞察
          </a>
        </p>
        <div class="card-body">
          <a class="circle left"></a>
          <a class="circle right"></a>
          <p class="value-wrap">{{ data.kpiValue||data.kpiValue==0?formatterNum(data.kpiValue):'-' }}<span>{{data.unit}}</span></p>
          <div class="desc-wrap">
            <p class="count-wrap" v-if="parseInt(data.totalFlag)==1">
              <span>
                {{data.kpiModel==1?'日累计：':(data.kpiModel==2?'月累计：':'年累计：')}}
                {{data.kpiModel==1?data.daySum:(data.kpiModel==2?data.monthSum:data.yearSum)}}
              </span>

              <span v-if='data.kpiModel==2'>
                年累计：{{data.yearSum?data.yearSum:'-'}}
              </span>
            </p>
            <p class="count-wrap">
              <!-- <span>年累计：{{ data.yearSum?formatterNum(data.yearSum):'-' }}</span> -->
              <span class="sub-desc">指标类型：{{ data.kpiModel?indexTypes[parseInt(data.kpiModel)]:'-' }}</span>
              <span class="sub-desc">发布来源：{{ data.releaseSource?data.releaseSource:'-' }}</span>
            </p>
          </div>
        </div>
      </div>

      <!-- 同环比值 -->
      <div class="percentage">
        <p>
          同比:&nbsp;
          <span style="display: flex; align-items: center">
            <van-icon
              name="play"
              :color="data.yearErlier.indexOf('-')==0 ? '#FC3434' : '#16B90F'"
              :class="data.yearErlier.indexOf('-')==0 ? 'descend' : 'ascend'"
            />
            <span class="count">{{ data.yearErlier }}</span>
          </span>
        </p>

        <p>
          环比:&nbsp;
          <span style="display: flex; align-items: center">
            <van-icon
              name="play"
              :color="data.monthErlier.indexOf('-')==0 ? '#FC3434' : '#16B90F'"
              :class="data.monthErlier.indexOf('-')==0 ? 'descend' : 'ascend'"
            />
            <span class="count">{{ data.monthErlier }}</span>
          </span>
        </p>
      </div>

      <!-- 排名及关注 -->
      <div class="rank-wrap">
        <a>
          {{data.areaRankDes}}：<span style="color: #53a7ff">{{ data.kpiRank }}</span>/{{ data.sumRank }}
        </a>
        <a class="fans">{{ data.focusNumber }}人关注</a>
      </div>

      <!-- 目标值、完成值、完成率 -->
      <div class="card-list-wrap">
        <div class="card">
          <p class="title1">目标值</p>
          <div class="card-body">
            <span class="value" style="color: #53a7ff">{{
              data.targetValue
            }}</span>
          </div>
        </div>
        <div class="card">
          <p class="title1">当前完成值</p>
          <div class="card-body">
            <span class="value" style="color: #10e055">{{
              data.completeValue
            }}</span>
          </div>
        </div>
        <div class="card">
          <!-- 1：完成差值  2：完成率 -->
          <p class="title1">{{data.chkMetd==2?'完成率':'目标差值'}}</p>
          <div class="card-body">
            <span class="value" style="color: #ff7253">
              {{data.chkMetd==2?data.completeRate:data.targetDifference}}
            </span>
          </div>
        </div>
      </div>

      <!-- 时间进度 -->
      <div class="progress-wrap" v-if="data.chkMetd==2">
        <div
          class="progress-inner"
          :style="{width: `${parseInt(data.timeSchedule)}%`}"
        ></div>
        <span class="desc" :style="{left: `${descLeft}px`}"
          >时间进度：{{ data.timeSchedule }}</span
        >
      </div>

      <div class="calibre-wrap">
        <h5>指标ID：{{data.correKpiId}}</h5>
      </div>

      <!-- 口径 -->
      <div class="calibre-wrap">
        <h5>口径：</h5>
        <p class="desc">{{ data.caliberContent }}</p>
        <p class="desc">第一负责人：{{data.kpiDemandProposePsn?data.kpiDemandProposePsn:'-'}}</p>
        <p class="desc">第二负责人：{{data.kpiDemandRp?data.kpiDemandRp:'-'}}</p>
      </div>

      <!-- 标签 -->
      <div class="detail-tag-wrap">

        <van-tag
        plain
        v-if='data.kpiType'
        type="primary">
          {{ data.kpiType }}
        </van-tag>

        <van-tag
          class="custom-tag"
          v-for="(tag, idx) in data.customLabels"
          :key="idx"
          closeable
          plain
          type="primary"
          @close="onTagClose(tag)"
          >{{ tag }}</van-tag
        >
        <van-tag
          plain
          type="primary"
          class="custom-tag"
          @click="openAddTagDialog"
          >+添加标签</van-tag
        >
      </div>

      <div class="fans-wrap">
        <van-button 
        round 
        type="info" 
        size="small"
        :loading="focusLoading"
        @click="onLike(data)">
          {{data.focusFlag ? '取消关注' : '关注指标'}}
        </van-button>
        <p class="fans">{{ data.focusNumber }}人关注</p>
      </div>
    </div>

    <van-dialog
      v-model="showAddTag"
      title="添加标签"
      show-cancel-button
      :getContainer='getContainer'
      @confirm="addTag"
      @closed="tagName = ''"
    >
      <van-field
        v-model="tagName"
        label="自定义标签："
        placeholder="请输入标签名称"
        autofocus
      />
    </van-dialog>

    <van-dialog v-model="alarmShow" :title="alarmDialogTitle">
      <p class="dialog-text"><b>报警规则：</b>{{alarmInfo.alarmRule}}</p>
      <p class="dialog-text"><b>生效时间：</b>{{alarmInfo.effectTime}}</p>
      <p class="dialog-text"><b>预警次数：</b>{{alarmInfo.alarmCnt}}</p>
    </van-dialog>
  </div>
</template>
<script>


import {
  focusKpi, 
  cancelFocus, 
  deleteCustomLabel, 
  addCustomLabel,
  getKpiDataDetail
} from '@/api/home/index.js';
export default {
  name: 'DetailCard',
  props: ["data", "detailView", "tabIndex","search","index",'initKpiData'],
  inject:['parent'],
  data() {
    return {
      likeIcon: 'like-o',
      // indexTypes: ['全部指标', '小时指标', '日指标', '月指标'],
      indexTypes:{
        1:'小时指标',
        2:'日指标',
        3:'月指标'
      },
      descLeft: 0,
      showAddTag: false,
      tagName: '',
      focusLoading:false,
      alarmShow: false,
      alarmDialogTitle:'预警信息',
      alarmInfo:{
        alarmCnt:'',
        alarmRule:'',
        effectTime:''
      }
    };
  },

  computed: {},

  watch: {
    detailView(val) {
      if (val) {
        setTimeout(() => {
          this.getDesLeft();
        }, 10);
      }
    }
  },

  mounted() {
  },

  methods: {
    
    getContainer() {
      return document.querySelector('detail-card-'+this.tabIndex+'-'+this.data.correKpiId);
    },

    getDesLeft() {
      const progress = document.querySelector('.progress-inner');
      if(progress) {
        const right = progress.clientWidth;
        // console.log(progress, right);
        this.descLeft = right > 40 ? right - 40 : 0;
      }
    },

    formatterNum(val) {
      // console.error('val',val)
      const a = val.toString().split('.');
      let s = a[0].replace(/(?=(?!(\b))(\d{3})+$)/g, ',');
      if (a[1]) s += `.${a[1]}`;
      return s;
    },

    onLike(data) {
      // 调接口
      this.focusLoading = true;
      if (data.focusFlag) {
        this.cancelFocus(data);
      } else {
        this.focusKpi(data);
      }
    },

    focusKpi(data) {
      focusKpi({
        kpiId: data.kpiId,
        userId: '1'
      }).then((res) => {
        if (res.success) {
          // data.focusFlag = true;
          this.getKpiDataDetail(data,true);
        } else {
          this.$toast.fail('关注失败，稍后再试');
        }
      }).catch((err) => {
        console.error(err)
        this.$toast.fail('关注失败，稍后再试');
      })
    },

    cancelFocus(data) {
      cancelFocus({
        kpiId: data.kpiId,
        userId: '1'
      })
      .then((res) => {
        if (res.success) {
          this.getKpiDataDetail(data,true);
        } else {
            this.$toast.fail('取消关注失败，稍后再试'); 
        }
      })
      .catch((err) => {
        console.error(err)
        this.$toast.fail('取消关注失败，稍后再试');
      })
    },

    iconType(type) {
      let color = '';
      switch (parseInt(type)) {
        case 1:
          color = '#13C41F';
          break;
        case 2:
          color = '#ffcd53';
          break;
        case 3:
          color = '#ff9653';
          break;
        case 4:
          color = '#fd4f4f';
          break;
      }
      return color;
    },

    showInfo(alarmCnt, alarmRule, effectTime) {
      this.alarmShow = true;
      this.alarmInfo.alarmCnt = alarmCnt;
      this.alarmInfo.alarmRule = alarmRule;
      this.alarmInfo.effectTime = effectTime;
    },

      // 删除标签
    onTagClose(tag) {
      this.$dialog
        .confirm({
          title: '提示',
          message: `确认删除“${tag}”标签吗？`
        })
        .then(() => {
          // 调用删除接口并刷新
          deleteCustomLabel({
            kpiId: this.data.kpiId,
            labelName: tag,
            userId: '1'
          }).then( (res) => {
            if(res.success) {
              this.getKpiDataDetail(this.data,false);
              this.updateCustomLabel();
            }
          })
          
        });
    },

    openAddTagDialog() {
      console.log(1)
      this.showAddTag = true;
    },

      // 添加自定义标签
    addTag() {
      // 此处调用添加自定义标签接口
      let tagName = this.tagName; 
      if(this.tagName && this.tagName.trim()) {
        addCustomLabel({
          kpiId: this.data.kpiId,
          labelName: this.tagName,
          userId: '1'
        }).then( (res) => {
          if(res.success) {
            this.getKpiDataDetail(this.data,false);
            this.updateCustomLabel();
          }
        })
      } else {
        this.$toast({
          duration: 1500, // 持续展示 toast
          forbidClick: true,
          message: '自定义标签不能为空',
        })
      }
      
    },

    updateCustomLabel() {
      console.error(this.parent.$refs)
      this.parent.$refs.cardList0 && this.parent.$refs.cardList0[0].$refs.searchBar.getCustomLabel();
      this.parent.$refs.cardList1 && this.parent.$refs.cardList1[0].$refs.searchBar.getCustomLabel();
      this.parent.$refs.cardList2 && this.parent.$refs.cardList2[0].$refs.searchBar.getCustomLabel();
      this.parent.$refs.cardList3 && this.parent.$refs.cardList3[0].$refs.searchBar.getCustomLabel();
    },

      // 跳转洞察页面
    routerToDetail() {
      // localStorage.setItem('homeActive',this.parent.active);
      this.$router.push({
        name: 'detail-index',
        query: {
          ...this.data,
          detailView: true,
          tabIndex: this.tabIndex,
          areaId: this.search.areaCode,
          searchKpiModel:this.search.kpiModel,
          searchDateTime:this.search.dateTime,
          searAreaCode:this.search.areaCode,
          searchAreaName:this.search.areaName
        }
      });
    },

    // 刷新数据
    getKpiDataDetail(data,isFocusChange,date,onlyCurrentData) {
      getKpiDataDetail({
        "areaId": this.search.areaCode,
        "dateTime": date ? this.formatterDate(date,'y-m-d'):this.formatterDate(this.search.dateTime,'y-m-d'),
        "kpiId": data.kpiId,
        "userId": "1"
      })
      .then(res=>{
        console.log()
        if(!onlyCurrentData) {
          this.updateData(res.data,isFocusChange);
        } else {
          this.$emit('updateKpiData',this.index, res.data,false);
        }
        
      })
      .catch(err=>{
        this.$emit('updateKpiData',this.index, null,true);
      })
      .finally(() => {
        setTimeout(()=>{
            this.focusLoading = false;  
        },0)
        
      })
    },

    // 更新各个模块数据
    updateData(data,isFocusChange) {
      this.parent.tabs.forEach((tab,tabidx) => {
        if(isFocusChange) {
          if(tab.title === '关注' && this.parent.$refs.cardList2){
            if(data.focusFlag) {
              // 关注并且列表数据更新完毕，将数据加入到列表中
              if(this.parent.$refs.cardList2[0].finished) {
                // 关注操作在关注列表增加此数据
                tab.showNote = false;
                tab.lists.push(data);  
              }
            } else {
              // 取消关注，则从关注列表中删除数据
              tab.lists.forEach((list,listIdx) => {
                if(list.kpiId === data.kpiId) {
                  tab.lists.splice(listIdx,1); 
                  if(tab.lists.length==0){
                    tab.showNote = true;
                  }
                }
              })
            }
          }  else {
            // 其他列表数据存在直接更新数据
            tab.lists.forEach((list,listIdx) => {
              if(list.kpiId === data.kpiId) {
                for(let item in list){
                  list[item] = data[item]
                }
              }
            })
          }
          
        } else {
          // 其他列表数据存在直接更新数据
          tab.lists.forEach((list,listIdx) => {
            if(list.kpiId === data.kpiId) {
              for(let item in list){
                list[item] = data[item]
              }
            }
          })
        }
      })

      this.updateCommandLists(data);
    },

      // 更新模块推荐列表数据
    updateCommandLists(data) {
      let arr = ['cardList0','cardList2','cardList3'];
      arr.forEach(item=>{
        // console.log(this.parent.$refs[item])
        if(this.parent.$refs[item] && this.parent.$refs[item][0].$refs.recommandList) {
          this.parent.$refs[item][0].$refs.recommandList.lists.forEach((list,listIdx) => {
            if(list.kpiId === data.kpiId) {
              for(let item in list){
                list[item] = data[item];
              }
            }
          })
        }
      })
    },


      // 日期格式化
    formatterDate(val,type) {
      val = new Date(val);
      const year = val.getFullYear();
      const month = (val.getMonth() + 1) < 10 ? `0${val.getMonth() + 1}` : val.getMonth() + 1;
      const date = val.getDate() < 10 ? `0${val.getDate()}` : val.getDate();

      if(type === 'y-m-d') {
        return `${year}-${month}-${date} 23:59:59`;
      } else {
        return `${year}${month}${date}`;  
      }
    },

  }
};
</script>
<style lang="scss">
.detail-card {
  width: 100%;
  height: auto;
  -margin-bottom: 20px;
  position:relative;

  .update-time {
    height:34px;
    min-height:34px;
    line-height: 34px;
    background: #f1f4f7;
    color: #999999;
    font-size: 12px;
    text-align: left;
    padding: 0px 12px;
    box-sizing: border-box;
  }

  .inner-wrap {
    padding: 12px;
    background: #fff;
    box-sizing: border-box;

    .card {
      border-radius: 2px;
      overflow: hidden;
      box-shadow: 0 2px 8px 1px rgba(42, 103, 167, 0.45);
      background: #fff;

      .title1 {
        font-size: 12px;
        color: #fff;
        line-height: 24px;
        height:24px;
        background: #53A7FF;
        display: flex;
        justify-content: center;
        position: relative;
      }

      .title {
        font-size: 14px;
        color: #fff;
        line-height: 36px;
        background: rgba(32, 138, 249, 1);
        display: flex;
        justify-content: center;
        position: relative;
        padding:0 60px 0 30px;
        box-sizing:border-box;

        .name-wrap {
          width:100%;
          display: flex; 
          align-items: center; 
          justify-content:center;

          .name {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
        }

        .note-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 10px;
        }

        .detail-btn {
          position: absolute;
          right: 12px;
        }
      }

      .card-body {
        height: 104px;
        position: relative;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background: rgba(83, 167, 255, 1);

        .circle {
          position: absolute;
          display: block;
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 100px;
        }

        .circle.left {
          top: -30px;
          left: -30px;
        }

        .circle.right {
          bottom: -55px;
          right: -40px;
        }
      }

      .value-wrap {
        font-size: 32px;
        font-weight: 600;
        color: #fff;
        line-height: 50px;

        span {
          font-size:12px;
          font-weight: 400;
          margin-left:6px;
        }
      }

      .desc-wrap {
        display: flex;
        flex-direction:column;
      }

      .count-wrap {
        width: 100%;
        display: flex;
        justify-content: space-around;
        font-size: 12px;
        color: #fff;
        font-weight: medium;
        line-height: 24px;

        .sub-desc {
          color: rgba(255, 255, 255, 0.5);
          font-size: 11px;
        }
      }
    }

    .percentage {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #575c61;
      column-gap: 30px;
      line-height: 30px;
      margin-top: 8px;

      p {
        display: flex;
        justify-content: space-between;
      }

      .count {
        font-size: 12px;
        color: #575c61;
      }
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

    .rank-wrap {
      font-size: 12px;
      color: #575c61;
      display: flex;
      justify-content: space-between;

      .fans {
        color: #828b96;
      }
    }

    .card-list-wrap {
      display: flex;
      column-gap: 10px;
      margin-top: 12px;

      .card {
        width: 100px;
        flex-grow: 2;
        height: 80px;
        box-shadow: 0 2px 4px rgba(42, 103, 167, 0.15);

        .title {
          background: #53a7ff;
          line-height: 24px;
          font-size: 12px;
        }

        .card-body {
          height: 56px;
          background: none;

          .value {
            font-size: 18px;
            font-weight: 600;
            line-height: 56px;
          }

          .percentage {
            line-height: 24px;
            position: absolute;
            bottom: 0px;
            width: 100%;

            p {
              width: 100%;
              justify-content: center;
              color: #575c61;
            }
          }
        }
      }
    }

    .progress-wrap {
      width: 100%;
      background: #e3f0fa;
      height: 8px;
      border-radius: 8px;
      margin-top: 20px;
      position: relative;
      margin-bottom: 34px;

      .progress-inner {
        height: 100%;
        background-image: linear-gradient(to right, #248cff, #00b8ff);
        border-radius: 8px;
        position: relative;

        &::after {
          content: '';
          display: inline-block;
          height: 36px;
          border-right: 1px dashed #01b6ff;
          position: absolute;
          top: -13px;
          right: 0px;
        }
      }

      .desc {
        position: absolute;
        font-size: 11px;
        color: #8f939c;
        text-align: center;
        top: 24px;
      }
    }

    .calibre-wrap {
      text-align: left;
      padding-top:20px;

      .desc {
        font-size: 12px;
        line-height: 20px;
        color: #656666;
        margin: 10px 0px;
        text-align: justify;
      }
    }

    .detail-tag-wrap {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      column-gap: 8px;
      row-gap: 6px;

      .van-tag {
        display: inline-block;
        height: 24px;
        line-height: 25px;
        border-radius: 11px;
        padding: 0 10px;
        position: relative;
        font-size: 11px;
      }

      .custom-tag.van-tag--plain::before {
        border-style: dashed;
      }

      .van-tag__close {
        position: absolute;
        top: -8px;
        width: 16px;
        height: 16px;
        background: #3296fa;
        color: #fff;
        border-radius: 10px;
        font-size: 9px;
        line-height: 16px;
      }
    }

    .fans-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 20px;

      .van-button {
        font-size: 16px;
      }

      .fans {
        color: #999999;
        font-size: 12px;
        margin-top: 12px;
      }
    }
  }

  .van-dialog__header {
    font-weight: 500;
  }

  .van-overlay {
    position:absolute;
  }

  .van-dialog {
    position:absolute;
  }
}
</style>

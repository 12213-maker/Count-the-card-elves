<template>
  <div class="index-card" v-if="data.kpiName" :style="{marginBottom:marginBottom}">
    <div class="index-inner-card">
      <van-icon
        v-if="data.chkMetd!=0"
        name="warning"
        size="16"
        class="note-icon"
        :color="iconType(data.warningLevel)"
        @click="showInfo(data.alarmCnt, data.alarmRule, data.effectTime)"
      />
      <p class="title" @click="onCardClick">{{ data.kpiName }}({{data.unit}})</p>
      <p class="value" @click="onCardClick" ref="title">
        <span 
        :style="{zoom:zoom}"  
        ref="title-span" 
        style="display:inline-block; width:auto;">{{ formatterNum(data.kpiValue) }} </span>
      </p>

      <div class="percentage">
        <p>
          同比:
          <span class="per-span">
            <van-icon
              name="play"
              :color="data.yearErlier&&data.yearErlier.indexOf('-')==0 ? '#FC3434' : '#16B90F'"
              :class="data.yearErlier&&data.yearErlier.indexOf('-')==0  ? 'descend' : 'ascend'"
            />
            <span class="count">{{ data.yearErlier }}</span>
          </span>
        </p>

        <p>
          环比:
          <span class="per-span">
            <van-icon
              name="play"
              :color="data.monthErlier.indexOf('-')==0 ? '#FC3434' : '#16B90F'"
              :class="data.monthErlier.indexOf('-')==0 ? 'descend' : 'ascend'"
            />
            <span class="count">{{ data.monthErlier }}</span>
          </span>
        </p>
      </div>

      <p class="time">数据周期：{{ data.kpiDate }}</p>
      <p class="time">指标类型：{{ indexTypes[parseInt(data.kpiModel)] }}</p>

      <div class="btn-wrap">
        <van-button icon="newspaper-o" size="mini" @click="routerToDetail">洞察 </van-button>
        <van-button icon="question-o" size="mini" @click="showCaliberContent(data)">口径 </van-button>
        <van-button 
        :icon="data.focusFlag ? 'like' : 'like-o'" 
        size="mini" 
        :loading="focusLoading"
        loading-text="关注"
        @click="onLike(data)">
            关注 
        </van-button>
      </div>
    </div>

    <van-dialog v-model="alarmShow" :title="alarmDialogTitle">
      <p class="dialog-text"><b>报警规则：</b>{{alarmInfo.alarmRule}}</p>
      <p class="dialog-text"><b>生效时间：</b>{{alarmInfo.effectTime}}</p>
      <p class="dialog-text"><b>预警次数：</b>{{alarmInfo.alarmCnt}}</p>
    </van-dialog>

  </div>

  <div
    class="index-card"
    v-else
    style="background: none; box-shadow: none"
  ></div>
</template>
<script>
import {focusKpi, cancelFocus, getKpiDataDetail,browseBigCard } from '@/api/home/index.js';

export default {
  name: 'IndexCard',
  props: ["data", "index", "tabIndex","areaId","search","marginBottom","detailPage"],
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
      focusLoading:false,

      zoom:1,

      alarmShow: false,
      alarmDialogTitle:'预警信息',
      alarmInfo:{
        alarmCnt:'',
        alarmRule:'',
        effectTime:''
      }
    };
  },

  watch:{
    search:{
      deep:true,
      handler(val){
        console.warn('search改变了',val)
      }
    }
  },

  methods: {
    formatterNum(val) {
      const a = val.toString().split('.');
      let s = a[0].replace(/(?=(?!(\b))(\d{3})+$)/g, ',');
      if (a[1]) s += `.${a[1]}`;
      return s;
    },

    onLike(data) {
      // 调接口
      /*this.$toast.loading({
        message: '',
        forbidClick: true,
        duration: 0
      });*/

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
      })
      .then((res) => {
        if (res.success) {
          // data.focusFlag = true;
          this.getKpiDataDetail(data,true);
        } else {
            this.$toast.fail('关注失败，稍后再试');  
        }
      })
      .catch((err) => {
        console.log(err)
        this.$toast.fail('关注失败，稍后再试');
      });
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
        console.log(err)
        this.$toast.fail('取消关注失败，稍后再试');
      });
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

    showCaliberContent(data) {
      this.$dialog.confirm({
        title: '口径信息',
        allowHtml: true,
        message:  `
          <p>指标ID：${data.correKpiId}\n${data.caliberContent}</p>
          <p style='margin:0px;'>第一负责人：${data.kpiDemandProposePsn?data.kpiDemandProposePsn:'-'}</p>
          <p style='margin:0px;'>第二负责人：${data.kpiDemandRp?data.kpiDemandRp:'-'}</p>
        `,
        showCancelButton: false
      });
    },

    routerToDetail() {
      // localStorage.setItem('homeActive',this.parent.active);
      console.warn('card-search',this.search,this.data,this.areaId)
      if(!this.detailPage) {
        this.$router.push({
          name: 'detail-index',
          query: {
            ...this.data,
            detailView: false,
            tabIndex: this.tabIndex,
            areaId: this.areaId,
            searchKpiModel:this.data.kpiModel,
            searchDateTime:this.data.kpiDate,
            searAreaCode:this.search.areaCode,
            searchAreaName:this.search.areaName
          }
        });
      } else {
        this.data.areaId = this.areaId;
        this.detailPage.data = this.data;
        this.detailPage.searchForm.kpiModel = this.data.kpiModel;
        this.detailPage.searchForm.dateTime = this.data.kpiDate;
        this.detailPage.searchForm.areaCode = this.areaId;
      }
      
    },

    onCardClick() {
      console.log(this.data)
      browseBigCard({
        kpiId:this.data.kpiId
      }).then(res=>{

      })
      this.$emit('onCardClick', this.index);
    },

    // 刷新数据
    getKpiDataDetail(data,isFocusChange) {
      getKpiDataDetail({
        "areaId": this.search.areaCode,
        "dateTime": this.formatterDate(this.search.dateTime,'y-m-d'),
        "kpiId": data.kpiId,
        "userId": "1"
      })
      .then(res=>{
        console.log('getKpiDataDetail',res.data);
        this.updateData(res.data,isFocusChange);
      })
      .catch(err=>{
        console.error(err)
      })
      .finally(() => {
        setTimeout(()=>{
            this.focusLoading = false;  
        },0)
        
      })
    },

    updateData(data,isFocusChange) {
      if(this.parent) {
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
      } else {
        this.data.focusFlag = data.focusFlag;
      }
      
    },

    updateCommandLists(data) {
      let arr = ['cardList0','cardList2','cardList3'];
      arr.forEach(item=>{
        // console.log(this.parent.$refs[item])
        if(this.parent && this.parent.$refs[item] && this.parent.$refs[item][0].$refs.recommandList) {
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


    getZoom() {
      let num = this.$refs.title.clientWidth/this.$refs['title-span'].clientWidth;
      this.zoom = num<1?num:1;
    }
  },

  mounted() {

    this.$nextTick(()=>{
      this.getZoom();
    })
    // console.log(1111,this.parent)
  }
};
</script>
<style lang="scss">
.index-card {
  width: 100%;
  max-width:100%;
  box-sizing: border-box;
  break-inside: avoid;
  display:block;
  -margin-bottom:10px;

  .index-inner-card {
    width: 100%;
    height: 100%;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding:6px 6px 0px 6px;
    background: #fff;
    box-sizing: border-box;
    position: relative;
  }

  .note-icon {
    position: absolute;
    right: 0px;
    top: 00px;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-weight: 500;
    font-size: 12px;
    margin-top: 5px 0;
    line-height:18px;
    width:100%;
    padding:0 16px;
    box-sizing:border-box;
  }

  .value {
    font-weight: 600;
    color: #54a7ff;
    font-size: 22px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin:6px 0;
  }

  .percentage {
    height: auto;
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    margin: 0px;
    font-size: 12px;
    color: #575c61;
    column-gap: 10px;

    p {
      width:100%;
      display: flex;
      font-size: 12px;
      height: 24px;
      line-height:24px;

      .per-span {
        display: flex; 
        height:16px; 
        align-items: center; 
        height:100%;
        margin-left: 10px;

        .van-icon {
          font-size: 14px;
          margin-right:4px;
        }
      }
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

  .time {
    color: #828b96;
    font-size: 11px;
    white-space: nowrap;
    text-align: justify;
    line-height: 20px;
    text-align: left;
    letter-spacing: -0.24px;
  }

  .btn-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 32px;
    font-size: 13px;

    .van-button {
      height:100%;
    }

    a {
      display: flex;
      align-items: center;
      height: 100%;

      .van-icon {
        font-size: 14px;
        margin-right: 2px;
      }
    }
  }

  .van-loading__spinner--circular {
    width: 12px !important;
  }

  .van-loading__circular circle {
    color: #53A7FF;
  }

  .van-button__icon {
    color: #53A7FF;
  }

  .van-button--default {
    border: none;
  }

  
}
</style>

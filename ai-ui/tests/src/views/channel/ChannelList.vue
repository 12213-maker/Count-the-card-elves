<!--
 * @Author: your name
 * @Date: 2022-02-17 15:20:11
 * @LastEditTime: 2022-02-23 15:23:47
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \gz-index\ai-ui\src\views\channel\ChannelList.vue
-->
<template>
  <div class="component_wrap">
    <div class="dateTime">数据周期：{{ dateTime }}</div>
    <div class="table-wrap">
      <div class="card-title">
        <i></i>
        渠道指标洞察
      </div>
      <div class="table-box">
        <ve-table 
        ref="ve-table"
        :style="{'word-break':'break-all'}"
        :columns="columns" 
        :virtual-scroll-option="virtualScrollOption"
        :table-data="listData" 
        :max-height="maxHeight"
        :fixed-header="true"
        :cell-style-option="cellStyleOption"
        row-key-field-name="kpiId"/>
        
      </div>
    </div>

    
  </div>
</template>

<script>
import channelApi from '@/api/channel';


export default {
  name: 'ChannelList',
  components: {},
  props: ["dateTime", "list", "finished"],
  data() {
    const _this = this;
    return {
      isLoading: false,
      loading: false,
      sort: true,

      columns: [
        { field: "kpiName", key: "a", title: "指标名称", align: "center",width:'16%'},
        { field: "kpiModel", key: "b", title: "指标类型", align: "center",width:'14%' },
        { field: "kpiValue", key: "c", title: "指标值", align: "center",width:'14%' },
        { field: "sumValue", key: "d", title: "累计值",width:'14%'},
        { field: "monthErlier", key: "e", title: "环比" ,width:'14%'},
        { field: "yearErlier", key: "f", title: "同比",width:'14%' },
        { field: "kpiRank", key: "g", title: "排名",width:'14%' },
      ],

      cellStyleOption: {
          bodyCellClass: ({ row, column, rowIndex }) => {
              if (rowIndex % 2 != 0) {
                  return "odd-row";
              }
          }
      },

      virtualScrollOption:{
        enable: true,
        scrolling:({visibleEndIndex})=>{
          if(visibleEndIndex == _this.list.length-20) {
            _this.$emit('getDatas')
          }
        }
      },

      maxHeight: document.body.offsetHeight-46-40-40-36-57
    };
  },
  computed: {
    listData() {
      const arr = [...this.list];
      return arr.sort((a, b) => {
        if (this.sort) {
          return Number(a.kpiRank) - Number(b.kpiRank);
        } else {
          return Number(b.kpiRank) - Number(a.kpiRank);
        }
      });
    }
  },
  watch: {
    list() {
      this.isLoading = false;
      this.loading = false;
    }
  },
  methods: {

    filterNet() {
      this.sort = !this.sort;
    },

    onTableScroll({visibleEndIndex}) {
      console.log(visibleEndIndex);
    }
  },
  mounted() {
    
  }
};
</script>

<style scoped lang="scss">

.component_wrap {
  width:100%;
  height:100%;
}
.dateTime {
  height:38px;
  line-height: 38px;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: center;
  color: #8f939c;
  text-align: center;
}
.table-wrap {
  background: #ffffff;
  height:auto;
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
.table-box {
  overflow: auto;

}

.notes {
  height:40px;
  line-height: 40px;
  font-size: 12px;
  color:#898989
}
</style>
<style type="text/css">
  .odd-row {
    background: #FBFDFF !important;
  }

  th.ve-table-header-th {
    background: #F0F8FD !important;
    font-size: 12px !important;
  }

  .ve-table-body-td {
    font-size: 12px !important;
  }
</style>

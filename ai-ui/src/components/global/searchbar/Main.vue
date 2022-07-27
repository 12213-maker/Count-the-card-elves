<template>
	<div class="search-bar">
    <van-dropdown-menu style="flex-grow:2;">
      <!-- <van-dropdown-item v-model="searchForm.type" :options="typeOptions" /> -->
      <van-dropdown-item :title="searchForm.type" ref="type-dropdown-menu" >
        <template v-for="(item,index) in typeOptions">
          <van-cell 
          v-if='!item.children' 
          :title='item.text' 
          style="text-align:left"  
          :style="searchForm.type==item.text?{'color':'#53a7ff'}:{}"
          :key='index'
          @click="onTypeSelected(item)">
            <template #right-icon v-if='searchForm.type==item.text'>
              <van-icon name="success" />
            </template>
          </van-cell>

          <van-cell-group 
          v-if='item.children' 
          :title="item.text" 
          style="text-align:left" 
          :key='index'>
            <van-cell 
            v-for="(child,idx) in item.children" 
            :title='child.text' 
            :key='idx' 
            :style="searchForm.type==child.text?{'color':'#53a7ff'}:{}"
            style="text-align:left"
            @click="onTypeSelected(child)">
              <template #right-icon v-if='searchForm.type==child.text'>
                <van-icon name="success" />
              </template>
            </van-cell>
          </van-cell-group>
        </template>
      </van-dropdown-item>

      <van-dropdown-item v-model="searchForm.order" :options="rankOptions" />
    </van-dropdown-menu>

    <!-- <van-icon :name="detailView?listIcon:detailIcon" class='icon' @click='changeView'/> -->
  </div>

</template>
<script>
import {getCustomLabel,getKpiType} from "@/api/home/index.js";
export default {
  name: 'SearchBar',
  props:["detailView","search","tabIndex"],
  data () {
    return {
      viewIcon:require('@/assets/images/detail.png'),

      detailIcon:require('@/assets/images/detail.png'),
      listIcon:require('@/assets/images/list.png'),

    	searchForm:{
        type:'全部分类',
        typeCode:0,
        order:'0'
      },


      typeOptions:[
        {text:'全部分类', value:''},
        {
          text:'业务分类',
          value:1,
          children:[]
        },{
          text:'自定义标签',
          value:2,
          children:[]
        }
      ],

      rankOptions:[
        {text:'默认排序', value:'0'},
        {text:'名称A-Z', value:'1'},
        {text:'名称Z-A', value:'2'},
        {text:'上线时间近-远', value:'3'},
        {text:'上线时间远-近', value:'4'},
        // {text:'关注量多-少', value:5},
        // {text:'关注量少-多', value:6}
      ],
    };
  },

  watch: {
    'searchForm.order'(val) {
      console.log('order',val, this);
      this.$emit('orderChange',val);
    }
  },

  methods: {
  	onTypeSelected(val) {
      this.searchForm.type = val.text;
      this.searchForm.typeCode = val.value;
      this.$refs['type-dropdown-menu'].toggle();
      this.$emit('kpiTypeChange',val);
    },

    changeView() {
      // this.viewIcon = this.detailView ? require('@/assets/images/detail.png') : require('@/assets/images/list.png');
      this.$emit('changeView', !this.detailView);
    },

    getCustomLabel() {
      getCustomLabel({
        "userId":'1',
        "areaId": this.search.areaCode,
        "dateTime": this.formatterDate(this.search.dateTime,'y-m-d'),
        "kpiModel": this.search.kpiModel,
        "sign": this.tabIndex+1
      }).then((res) => {
        console.log('getCustomLabel',res);
        this.typeOptions[2].children = [];
        res.data.forEach((item) => {
          this.typeOptions[2].children.push({
            text: item,
            value: item,
            type:'labelName'
          })
        })
      })
    },

    getKpiType() {
      getKpiType({
        "userId":'1',
        "areaId": this.search.areaCode,
        "dateTime": this.formatterDate(this.search.dateTime,'y-m-d'),
        "kpiModel": this.search.kpiModel,
        "sign": this.tabIndex+1
      }).then((res) => {
        console.log('getKpiType',res);
        res.data.forEach((item) => {
          this.typeOptions[1].children.push({
            text: item,
            value: item,
            type:'kpiType'
          })
        })
        
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
  },

  mounted() {
    this.getKpiType();

    this.getCustomLabel();
  }
};
</script>
<style lang='scss'>
	.search-bar {
    height: auto;
    display:flex;
    background: #fff;

    .icon {
      font-size: 16px;
      width: 50px;
      height: 100%;
    }


    .van-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .van-cell-group__title {
      text-align: left;
      font-weight:bold;
    }

    .van-cell__value {
      display:flex;
      justify-content: flex-end;
    }
  
  }
</style>

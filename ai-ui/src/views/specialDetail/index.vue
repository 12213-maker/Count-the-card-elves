<template>
  <div class="component_wrap">
    <DetailHeader :data="data" :date="date" @dateChange="onDateChange"/>
    <div class="component_wrap_content">

      <Detail 
      v-if="showDetail"
      :data="data"
      :date="date"
      :searchForm="searchForm"
      :areaCode="areaCode"/>

      <!-- <recommand-list 
      v-if="showRecommand"
      :searchForm='searchForm'
      :isDetailPage="true"
      :detailPage="detailPage"
      parent="self"/> -->
    </div>
  </div>
</template>

<script>
import Detail from './Detail';
import DetailHeader from './components/DetailHeader';
import { mapState } from 'vuex'

export default {
  name: 'detail',
  components: {Detail,DetailHeader},
  data() {
    let self = this;
    return {
      detailPage:self,
      show: false,
      actions: [{name: '选项一'}, {name: '选项二'}, {name: '选项三'}],
      data: {},
      areaCode:sessionStorage.getItem('areaId'),
      searchForm:{
        areaName:''
      },

      showRecommand: false,
      date:'',
      showDetail: false
    };
  },
  provide(){
    return {
      parent: undefined
    }
  },  
  computed: {
    ...mapState(['dateTime'])
  },

  created() {
    this.data = this.$route.query;
    console.log(this.data.dateTime);
    this.date = this.$store.state.dateTime;

    this.searchForm = {
        kpiModel: this.$route.query.searchKpiModel,
        dateTime: this.date,
        areaCode: this.data.areaId
    }
    this.showRecommand = true;
  },
  mounted() {
    this.showDetail = true;
  },
  methods: {

    onDateChange(val) {
      this.date = val;
      this.$store.commit("setDateTime", val);
    }
    
  }
};
</script>

<style scoped lang="scss">

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

.component_wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;

  
  
  .component_wrap_content {
    flex: 1;
    overflow: auto;
    background:#f9f9f9;
    
    ::v-deep .recommand-list > .title {
      height: 35px;
      background: #f7f9fb;
      border: 0.5px solid #d3dbe3;
    }
  }
}
</style>

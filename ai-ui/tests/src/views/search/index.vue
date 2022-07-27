<template>
  <div class="search-page">
    <van-search
      v-model="keyword"
      show-action
      shape="round"
      background="#53a7ff"
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
      @clear="onClear"
      @input="onInput"
    />

    <div class="search-list">
      <div class="history-list" v-if="showHistory && historyList.length">
        <h5 class="title">
          <span>搜索历史</span>
          <van-icon
            name="delete-o"
            @click="clearHistory"
            v-if="historyList.length"
            >清除</van-icon
          >
        </h5>

        <van-swipe-cell
        v-for="(item,index) in historyList"
        :key="index">
          <van-cell :border="false" :title="item" icon="clock-o" is-link  @click="backToHome(item)"/>
          <template #right>
            <van-button square type="danger" text="删除" @click="deleteHistoryItem(index)"/>
          </template>
        </van-swipe-cell>

        <!-- <van-cell
          v-for="item in historyList"
          :key="item"
          :title="item"
          icon="clock-o"
          @click="backToHome(item)"
        >
          <template #right-icon>
            <van-icon name="cross" class="search-icon" @click="clearHistory(item)"/>
          </template>
        </van-cell> -->
      </div>

      <div class="list" v-if="!showHistory">
        <van-cell
          v-for="item in remoteList"
          :key="item"
          :title="item"
          is-link
          @click="onSearch(item)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {getKpiName} from '@/api/home/index.js';

export default {
  name: 'Search',
  components: {},
  data() {
    return {
      keyword: '',
      historyList: [],
      remoteList: [],

      showHistory: true,
      tabIndex:0,
      detailView:false
    };
  },
  created() {
    this.redirectUrl = this.$route.query.redirectUrl || 'home-index';
    this.tabIndex = this.$route.query.tabIndex;
    this.detailView = this.$route.query.detailView;
  },
  mounted() {
    this.updateHistoryList();
  },

  methods: {
    // 更新历史搜索记录
    updateHistoryList() {
      const list = localStorage.getItem('historySearchList');
      if (list) {
        this.historyList = list.split(';fg;');
      }
    },

    // 搜索框-搜索事件
    onSearch(val) {
      // 调用搜索接口
      if (val) {
        const historyList = localStorage.getItem('historySearchList');
        let arr;
        if (historyList) {
          arr = historyList.split(';fg;');
        } else {
          arr = [];
        }
        if (!arr.includes(val)) {
          arr.push(val);
        }
        const str = arr.join(';fg;');
        localStorage.setItem('historySearchList', str);

        this.backToHome(val);
      }
    },

    // 搜索框-取消事件
    onCancel() {
      this.keyword = '';
      this.showHistory = true;
      this.$router.push({
        name: this.redirectUrl,
        params: {
          tabIndex: this.tabIndex
        }
      });
    },

    // 搜索框-清除关键字事件
    onClear() {
      this.showHistory = true;
    },

    // 搜索框-输入事件
    onInput(val) {
      if (this.$route.query.noInput) return;
      this.showHistory = !Boolean(val);
      // 请求远程关键字列表

      getKpiName({
        kpiName: val
      }).then((res) => {
        this.remoteList = res.data;
      });
    },

    // 清除历史记录
    clearHistory() {
      this.$dialog
        .confirm({
          title: '提示',
          message: '此操作将清除所有历史搜索记录，请确认！'
        })
        .then(() => {
          localStorage.removeItem('historySearchList');
          this.historyList = [];
        });
    },

    deleteHistoryItem(index){
      let arr = localStorage.getItem('historySearchList');
      arr = arr.split(';fg;');
      arr.splice(index,1);
      localStorage.setItem('historySearchList',arr.join(';fg;'));
      this.updateHistoryList();
    },

    backToHome(item) {
      if (this.$route.query.noInput) {
        this.$router.push({
          name: this.redirectUrl,
          query: {
            keyword: item
          }
        });
      } else {
        this.$router.push({
          name: this.redirectUrl,

          params: {
            keyword: item,
            tabIndex: this.tabIndex,
            detailView: this.detailView
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.search-page {
  display: flex;
  flex-direction: column;

  .van-search__action {
    color: #fff;
    margin: 0 12px 0 40px;
  }

  .search-list {
    height: 100px;
    flex-grow: 2;

    .van-cell {
      .van-icon {
        display:flex;
        align-items:center;
      }
    }
    .van-cell__title {
      text-align: left;
      font-size: 14px;
      color: #4a5057;
    }

    .history-list {
      .title {
        padding: 0 20px;
        box-sizing: border-box;
        line-height: 44px;
        text-align: left;
        color: #5c636b;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .empty {
        color: #999;
        font-size: 12px;
      }
    }
  }
}
</style>

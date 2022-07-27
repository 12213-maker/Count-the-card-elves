<template>
  <div class="message-page">
    <van-nav-bar
      title="消息列表"
      :left-arrow="false"
      @click-right="onClear"
    >
        <template #right>
        <van-icon name="delete-o" size='18'/>
      </template>
    </van-nav-bar>

    <van-tabs v-model="active" class='tab' @click='tabChange'>
      <van-tab v-for="(tab,index) in tabs" :key="index" :title="tab.title">
        <van-list
          v-model="tab.loading"
          :finished="tab.isLastPage"
          finished-text="没有更多了"
          @load="getMessage"
        >

          <div class="msg-list-wrap" v-for="(msg,idx) in tab.lists" :key="idx" @click="onMsgClick(msg,idx)">
            <a class="msg-title-wrap">
              <van-badge dot v-if="!parseInt(msg.isRead)">
                <span class="msg-title">{{msg.messageTitle}}</span>
              </van-badge>

              <span class="msg-title" v-else>{{msg.messageTitle}}</span>
              
              <span class="msg-time">{{msg.messageDate.split('.')[0]}}</span>
            </a>
            <p class="msg-content">{{msg.messageContent}}</p>
          </div>

        </van-list>
        <!-- <van-loading v-show="tab.loading" class="loading"/> -->
      </van-tab>
    </van-tabs>
    

    <van-dialog 
    v-model="showDialog" 
    :title="dialogTitle" 
    :message='dialogContent'
    @confirm = 'onConfirm'>
      
    </van-dialog>

  </div>
</template>

<script>

import {getMessage} from "@/api/message/index.js";


export default {
  name: 'Message',
  components:{
    
  },
  data() {
    const date = (new Date().getTime()) - (24 * 60 * 60 * 1000);
    const _this = this;
    return {
      active:0,
      tabs: [
        {
          title:'预警消息',
          pageNum:1,
          isLastPage:false,
          loading: false,
          lists:[
            /*{
              title:'5G套餐用户到达数-考核未达标',
              time:'2021/11/16 16:00:00',
              content: '你的考核目标是50,000，目前完成值是20,000,目标差距30,0000,000,目标差距30,000',
              isRead:false
            }*/
          ],
          finished:false,
          onLoad(){
            _this.getMessage(0);
          }
        },{
          title:'通知消息',
          pageNum:1,
          isLastPage:false,
          loading: false,
          lists:[
            /*{
              title:'5G套餐用户到达数-考核未达标',
              time:'2021/11/16 16:00:00',
              content: '你的考核目标是50,000，目前完成值是20,000,目标差距30,000',
              isRead:false
            }*/
          ],
          finished:false,
          onLoad(){
            _this.getMessage(1);
          }
        }
      ],

      showDialog: false,
      dialogTitle: '',
      dialogContent: '',
      currentMsgIdx:0
    };
  },
  mounted() {
    this.getMessage(0);
  },

  methods:{

    tabChange(val) {
      if(this.tabs[val].lists.length==0) {
        this.getMessage(val);  
      }
    },

    onClear() {
      this.$dialog.confirm({
        title: '提示',
        message: '此操作将清空消息列表，请确认！',
      }).then(() => {
        // 调用清空接口
        this.tabs[0].lists = [];
        this.tabs[1].lists = [];
      }); 
    },

    onMsgClick(msg,idx) {
      this.dialogTitle = msg.messageTitle;
      this.dialogContent = msg.messageContent;
      this.showDialog = true;
      this.currentMsgIdx = idx;
    },

    onConfirm() {
      // 调用已读接口
      this.tabs[this.active].lists[this.currentMsgIdx].isRead = '1';
    },

    getMessage(tabIndx) {
      this.tabs[tabIndx].loading = true;
      getMessage({
        messageType: tabIndx+1,
        userId:'1',
        pageSize:20,
        pageNum: this.tabs[tabIndx].pageNum
      }).then((res) => {
        this.tabs[tabIndx].lists = res.data.list;
        this.tabs[tabIndx].loading = false;
        if(res.data.isLastPage){
          this.tabs[this.active].isLastPage = true;
          return;
        }
        this.tabs[tabIndx].pageNum++;
      })
    }
  }
};
</script>
<style lang="scss">
.message-page {
  display:flex;
  flex-direction:column;

  .van-nav-bar {
    min-height: 46px;
  }

  .van-tabs {
     display: flex;
     flex-direction: column;
     flex-grow:2;
  }
  .van-tabs__wrap {
    box-sizing:border-box;
    background:#fff;
    border-bottom: 1px solid #eee; 
    margin-bottom: 12px;
  }
  .van-tabs__content {
    height:100px;
    flex-grow:2;
    overflow:auto;

    .van-tab__pane {
      height: 100%;
      display:flex;
      flex-direction:column;

      
      .msg-list-wrap {
        width: 100%;
        padding: 6px 12px 0px 12px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction:column;
        box-shadow: 0 2px 4px rgba(0,0,0,0.03);

        .van-badge--fixed {
          top: 12px;
          right: -10px;
        }

        .msg-title-wrap {
          display:flex;
          width:100%;
          line-height: 34px;
          justify-content: space-between;

          .msg-title {
            font-size: 14px;
            color:#4A5057;
            font-weight: 500;
          }

          .msg-time {
            font-size:11px;
            color:#828B96;
          }
        }

        .msg-content {
          font-size:11px;
          color:#828B96;
          text-align:left;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          border-bottom: 1px solid #EBEDF5;
          padding-bottom: 16px;
        }
      }
    }
  }


  .van-dialog__message {
    text-align:justify;
  }

  .loading {
    margin-top:20px;
  }

}
</style>

<template>
  <div class="main-layout">
    <router-view style="flex: 1; overflow: auto" @getNotReadMsgNum="getNotReadMsgNum"></router-view>

    <div class="footer" v-if="showTabbar">
      <van-tabbar v-model="active" @change="onChange">
        <van-tabbar-item icon="home-o" name="home-index">
          <span>指标大厅</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.index.active : icon.index.inactive"
            />
          </template>
        </van-tabbar-item>

        <!-- <van-tabbar-item icon="home-o" name="channel-index">
          <span>渠道洞察</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.channel.active : icon.channel.inactive"
            />
          </template>
        </van-tabbar-item> -->
        <van-tabbar-item icon="home-o" name="report-index" :dot="dotActive">
          <span>指标报表</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.channel.active : icon.channel.inactive"
            />
          </template>
        </van-tabbar-item>

        <van-tabbar-item
          icon="home-o"
          :badge="messagesNum"
          name="message-index"
        >
          <span>消息</span>
          <template #icon="props">
            <img
              :src="props.active ? icon.message.active : icon.message.inactive"
            />
          </template>
        </van-tabbar-item>
      </van-tabbar>
    </div>
  </div>
</template>
<script>
import {getNotReadMsgNum} from "@/api/message/index.js";
import {getKpiSpecIsRead} from "@/api/report/index.js";
import {mapState,mapMutations} from 'vuex';
import {setWaterMark} from '@/utils/waterMark.js';
import {validateToken} from "@/api/login/index.js";

export default {
  name: 'MainLayout',
  data() {
    return {
      transitionName: 'slide-left',
      active: 'home-index',
      dotActive: false,
      messagesNum: 0,

      icon: {
        index: {
          active: require('@/assets/images/selected-index-icon.png'),
          inactive: require('@/assets/images/index-icon.png')
        },

        channel: {
          active: require('@/assets/images/selected-channel-icon.png'),
          inactive: require('@/assets/images/channel-icon.png')
        },

        message: {
          active: require('@/assets/images/selected-message-icon.png'),
          inactive: require('@/assets/images/message-icon.png')
        }
      },

      // tabbarMenue: ['home-index', 'channel-index', 'message-index'],
      tabbarMenue: ['home-index', 'report-index', 'message-index'],
      showTabbar: false
    };
  },

  computed: {
    ...mapState([
      "authenticated"
    ]),
  },

  watch: {
    $route(to) {
      // TODO 配置页面转场
      // const toDepth = to.path.split('/').length;
      // const fromDepth = from.path.split('/').length;
      // this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
      // console.log(to);
      if(this.tabbarMenue.includes(to.name)) {
        this.active = to.name;
        this.toggleTabbar(to);
      }
    },

    authenticated(val) {
      // console.warn('============authenticated2-------------',val);
      if(val && sessionStorage.getItem('token')) {
        this.showTabbar = true;
        this.getNotReadMsgNum();
      } else {
        this.showTabbar = false;
      }
      
    }
  },
  created() {
    // console.log('main-layout',this.$route.query);

    if(sessionStorage.getItem('token')) {
      this.setAuthenticated(true);
      setWaterMark(sessionStorage.getItem('userId'), `${new Date().toLocaleDateString().replace(/\//g,'-')} ${new Date().toLocaleTimeString()}`);
      //指标报表有未读显示红点
      getKpiSpecIsRead().then(res => {this.dotActive = res.data ; console.error('指标报表有无未读',res.data);})
      this.$router.push('/home/index');
    } else {
      this.setAuthenticated(false);
      this.setShow404(false);
      this.$toast.loading({
        message: '权限验证',
        forbidClick: true,
        duration:0
      });
      this.getUserInfo();  
    }

    this.active = this.$route.name;
    if(this.authenticated) {
      this.showTabbar = true;
    }
  },

  mounted() {
  },

  methods: {

    ...mapMutations([
      "setAuthenticated",
      "setShow404"
    ]),


    getUserInfo() {
      let userId = this.getQueryVariable('userName_e') || sessionStorage.getItem('userId');
      let token = this.getQueryVariable('authtoken') || sessionStorage.getItem('token');
      let areaId = this.getQueryVariable('areaId') || sessionStorage.getItem('areaId');
      
      // 调用身份验证接口
      validateToken({
        // resId,
        userId,
        areaId,
        token
      }).then(res => {
        console.log('userInfo',res)
        this.$toast.clear();
        if(res.data && res.data.userId) {
          sessionStorage.setItem('token',res.data.token);
          sessionStorage.setItem('areaLevel',res.data.arealevel);
          sessionStorage.setItem('areaId',res.data.areaId);
          sessionStorage.setItem('areaName',res.data.areaName);
          sessionStorage.setItem('userId',res.data.userId);
          // 使用userId和当前时间,此处增加水印
          this.setAuthenticated(true);
          setWaterMark(res.data.userId, `${new Date().toLocaleDateString().replace(/\//g,'-')} ${new Date().toLocaleTimeString()}`);

          this.$router.push('/home/index');
        } else {
          this.setAuthenticated(false);
          this.setShow404(true);
        }
        
      }).catch(()=>{
        this.$toast.clear();
        this.setAuthenticated(false);
        this.setShow404(true);
      })
    },

    getQueryVariable(variable) {
       if(this.$route.query[variable]) {
        return this.$route.query[variable];
       }
       return(false);
    },


    toggleTabbar(to) {
      if (this.tabbarMenue.indexOf(to.name) !== -1) {
        this.showTabbar = true;
      } else {
        this.showTabbar = false;
      }
    },

    onChange(name) {
      this.$router.replace({
        name
      });
    },

    getNotReadMsgNum() {
      getNotReadMsgNum({
        userId:'1'
      }).then((res) => {
        this.messagesNum = res.data;
      })
    }
  }
};
</script>
<style lang="scss">
.main-layout {
  background-color: #f2f5f8;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .footer {
    width: 100%;
    height: 52px;
    min-height: 52px;
  }
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>

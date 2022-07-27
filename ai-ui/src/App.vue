
<template>
  <div id="app">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
  
</template>

<script>
import {setWaterMark} from '@/utils/waterMark.js';
export default {
  name: 'App',
};
</script>


<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html,body {
  width: 100%;
  height: 100%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2e2f30;
  height:100%;

}

.main-layout {
  width:100%;
  height:100%;
}


</style>

<template>
  <div class="newaddhadermain">
    <div @click="$emit('clickHeader','left')">{{left}}</div>
    <div class="headermid">{{mid}}</div>
    <div @click="$emit('clickHeader','right')">{{right}}</div>
  </div>
</template>

<script>
export default {
    props:['left','mid','right'],
    name:'Header',
    data() {
      return {
        
      }
    },
    methods:{
    }
}
</script>

<style lang="scss">
.newaddhadermain{
    height: 47.23px;
    background-color: rgb(83, 167, 255);
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
    font-size: 13px;
    color: white;
    .headermid{
        font-size: 4.8vw;
        color: white ;
        padding-bottom: 2px;
    }
}
</style>
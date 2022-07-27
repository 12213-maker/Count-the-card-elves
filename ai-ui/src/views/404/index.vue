<template>
  <div style="width:100%; height:100%; display:flex; flex-direction:column; justify-content:space-around; align-items:center; ">
    <div v-show="show404">
      <img :src="require('@/assets/permission.png')" width="80">
      <p style="font-size:0.8rem; line-height:2.4rem;">抱歉，您没有权限！</p>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  name: 'validate',
  data() {
    return {

    };
  },

  computed: {
    ...mapState([
      "show404"
    ]),

  },

  mounted() {
    console.log(this.$route.query);
  },

  methods:{

  }
};
</script>

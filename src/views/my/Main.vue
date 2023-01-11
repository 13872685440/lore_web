<template>
  <div class="components-layout-demo-basic da_my">
    <div class="da_img">
      <h2>{{ user_name }}</h2>
    </div>
    <div class="my_integral">
      <p>
        我的<i>积分</i> <b>{{ jf }}</b>
      </p>
    </div>
    <div class="my_list">
      <!-- <div class="my_box">
        <img src="~@/assets/images/icon-10.png" alt="" />
        个人信息
      </div> -->
      <div class="my_box" @click="wdsc()">
        <img src="~@/assets/images/icon-13.png" alt="" />
        我的收藏
      </div>
      <div class="my_box" @click="tohome()">
        <img src="~@/assets/images/icon-16.png" alt="" />
        返回主页
      </div>
    </div>
  </div>
</template>
<script>
import { queryService } from "@/api/manage";

export default {
  data() {
    return {
      jf: 0,
      user_name: "lore",
      path: {},
    };
  },
  created() {
    this.path.jf_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/userloreitg/myitg";
    this.view();
  },
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },

  methods: {
    async view() {
      await queryService(this.path.jf_path, {}).then((res) => {
        this.jf = res.result.jf;
        this.user_name = res.result.username;
      });
    },
    wdsc() {
      this.$router.push("/mark");
    },
    tohome() {
      console.log(1);
      this.$router.push("/index");
    },
  },
};
</script>
<style>
</style>

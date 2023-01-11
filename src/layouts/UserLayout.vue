<template>
  <div id="userLayout" :class="['login', device]">
    <!-- <div class="head">
      <a href="/">
        <img src="/logo.png" class="logo" alt="logo" />
        <span class="title">{{ project_name }}</span>
      </a>
    </div> -->
    <route-view></route-view>
  </div>
</template>

<script>
import RouteView from "./RouteView";
import { mixinDevice } from "@/utils/mixin";
import Vue from "vue";
import { SYSTEM_CONFIG } from "@/store/mutation-types";

export default {
  name: "UserLayout",
  components: { RouteView },
  mixins: [mixinDevice],
  data() {
    return {
      project_name: Vue.ls.get(SYSTEM_CONFIG).system_name,
    };
  },
  mounted() {
    document.querySelector("body").setAttribute("style", "margin:0px");
  },
  beforeDestroy() {},
};
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  .head {
    height: 62px;
    background-color: #fff;
    padding: 0 10%;
    .title {
      font-size: 16px;
      font-weight: inherit;
      height: 62px;
      line-height: 62px;
      cursor: pointer;
      margin: 0;
      padding: 0;
    }
    .logo {
      height: 50px;
      line-height: 50px;
      vertical-align: center;
      margin-right: 16px;
      border-style: none;
    }
  }
}
</style>

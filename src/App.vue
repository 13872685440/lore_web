<template>
  <a-locale-provider :locale="locale">
    <!-- <div id="app" v-wechat-title="config.system_name"> -->
      <div id="app" v-wechat-title="title"> 
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from "ant-design-vue/lib/locale-provider/zh_CN";
import { AppDeviceEnquire } from "@/utils/mixin";
import { axios } from "@/utils/request";
import { SYSTEM_CONFIG } from "@/store/mutation-types";
import Vue from "vue";

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      title:"宜昌市数字档案馆",
      locale: zhCN,
      config: {},
    };
  },
  mounted() {
    axios({
      url: "/system/init/getConfig?key=sys_config",
      method: "get",
    }).then((res) => {
      this.config = JSON.parse(res.result);
      Vue.ls.set(SYSTEM_CONFIG, this.config);
    });
  },
};
</script>
<style>
#app {
  height: 100%;
}
.fm2-container .el-footer {
  display: none;
}
</style>

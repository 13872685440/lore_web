<template>
  <div class="components-layout-demo-basic da_search">
    <div class="fm_padding">
      <div class="da_img">我的收藏</div>
      <div class="da_input">
        <a-space direction="vertical">
          <a-input-search
            v-model="vertical"
            placeholder="请输入关键字搜索"
            style="width: 100%"
            @search="onSearch"
          />
        </a-space>
      </div>
      <div class="da_list">
        <div class="dl_box dl_text_box" v-for="lore in lores" :key="lore.id">
          <div class="h_text" @click="toview(lore)">
            <h3>{{ lore.title }}</h3>
            <h4>关键字：{{ lore.keyword }}</h4>
            <h4>{{ lore.ct }} &nbsp; {{ lore.sqr_name }}</h4>
          </div>
          <div class="h_img">
            <img
              v-if="lore.fileExt == 'pdf'"
              src="~@/assets/images/pdf.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <div class="footMenu">
      <a-row>
        <a-col :span="12" @click="tomain()">
          <div class="fm_img">
            <img src="~@/assets/images/icon-16.png" alt="" />
          </div>
          <p class="fm_title">主页</p>
        </a-col>
        <a-col :span="12" @click="tomy()">
          <div class="fm_img">
            <img src="~@/assets/images/icon-10.png" alt="" />
          </div>
          <p class="fm_title">我的</p>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<script>
import { queryService } from "@/api/manage";
export default {
  data() {
    return {
      typename: "",
      typeid: "",
      path: {},
      lores: [],
    };
  },
  created() {
    this.path.lore_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/loremark/mymark";
    this.init();
  },
 
  methods: {
    tomy() {
      this.$router.push("/my");
    },
    tomain() {
      this.$router.push("/index");
    },

    beforeRouteLeave(to, from, next) {
      this.$destroy();
      next();
    },

    async init() {
      await queryService(this.path.lore_path, {
        keyword: "",
      }).then((res) => {
        this.lores = res.result;
      });
    },

    onSearch(value, event) {
      queryService(this.path.lore_path, {
        keyword: value,
      }).then((res) => {
        this.lores = res.result;
      });
    },
    toview(lore) {
      if (lore.nofile) {
        this.$router.push({
          path: "/loreview",
          query: { id: lore.id },
        });
      } else {
        this.$router.push({
          path: "/lorepdfview",
          query: { id: lore.id },
        });
      }
    },
  },
};
</script>
<style>
</style>

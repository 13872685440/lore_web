<template>
  <div class="components-layout-demo-basic home">
    <div class="fm_padding">
      <a-carousel autoplay>
        <div><img src="../../assets/images/banner_01.jpeg" alt="" /></div>
        <div><img src="../../assets/images/banner_02.jpeg" alt="" /></div>
        <div><img src="~@/assets/images/banner_03.png" alt="" /></div>
      </a-carousel>
      <div class="da_input">
        <a-space direction="vertical">
          <a-input-search
            v-model="select_value"
            placeholder="请输入关键字搜索"
            style="width: 100%"
            @search="onSearch"
          />
        </a-space>
      </div>
      <a-layout-content class="h_botton">
        <a-row justify="space-around">
          <a-col
            :span="6"
            v-for="type in loretypes"
            :key="type.id"
            @click="tolores(type)"
          >
            <div class="hb_img"></div>
            <p class="hb_title">{{ type.name }}</p>
          </a-col>
        </a-row>
      </a-layout-content>
      <div class="da_list">
        <h2 class="dl_title">为你推荐</h2>
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
      select_value: "",
      path: {},
      loretypes: [],
      lores: [],
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.type_path = prefix + "/loretype/types";
    this.path.lore_path = prefix + "/lore/lorelist";
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      await queryService(this.path.type_path, {}).then((res) => {
        this.loretypes = res.result;
      });
      await queryService(this.path.lore_path, {
        keyword: "",
        pagesize: 5,
        typeid: "",
      }).then((res) => {
        this.lores = res.result;
      });
    },
    onSearch(value, event) {
      queryService(this.path.lore_path, {
        keyword: value,
        pagesize: 5,
        typeid: "",
      }).then((res) => {
        this.lores = res.result;
      });
    },
    tomy() {
      this.$router.push("/my");
    },
    tomain() {
      this.$router.push("/index");
    },

    tolores(type) {
      this.$router.push({
        path: "/lorelist",
        query: { typeid: type.id, typename: type.name },
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
<style scoped>
.ant-carousel >>> .slick-slide {
  height: 160px;
  overflow: hidden;
}
</style>

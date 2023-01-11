<template>
  <div class="components-layout-demo-basic article">
    <div class="fm_padding">
      <div class="article_title">
        <h2>{{ lore.title }}</h2>
        <h4>关键字：{{ lore.keyword }}</h4>
        <h4>{{ lore.ct }} &nbsp; {{ lore.sqr_name }}</h4>
      </div>
      <div class="article_content">{{ lore.content }}</div>
    </div>
    <div class="footCollect">
      <a-layout-content>
        <a-row>
          <a-col :span="12" style="background-color: #8c3f2f">
            <a-rate v-model="hasmark" :count="1" @change="mark()" />
          </a-col>
          <a-col :span="12" style="background-color: #c09755" @click="tohome()">
            <a-icon class="download" type="home" />
          </a-col>
        </a-row>
      </a-layout-content>
    </div>
  </div>
</template>
<script>
import { queryService, saveService } from "@/api/manage";

export default {
  data() {
    return {
      overTimer: null,
      // 是否记录积分
      isOvertime: false,

      hasmark: 1,
      lore: {},
      path: {},
    };
  },
  created() {
    this.overTimer = setTimeout(() => {
      this.jf();
    }, 5000);
    this.path.edit_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/lore/view";
    this.path.save_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/loremark/mark";
    this.path.jf_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/useritgrcd/jf";
  },
  
  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },

  destroyed() {
    clearTimeout(this.overTimer);
  },

  mounted() {
    this.view(this.$route.query.id);
  },
  methods: {
    jf() {
      saveService(this.path.jf_path, {
        lore_id: this.lore.id,
      }).then((res) => {
        clearTimeout(this.overTimer);
      });
    },

    view(id) {
      queryService(this.path.edit_path, { id: id }).then((res) => {
        this.lore = res.result.lore;
        this.hasmark = res.result.hasmark;
      });
    },
    mark() {
      saveService(this.path.save_path, {
        loreId: this.lore.id,
        hasmark: this.hasmark,
      })
        .then((res) => {
          if (res.code == "400") {
            this.$notification.error({
              message: res.message,
              description: res.result,
            });
          } else {
            this.$notification.success({
              message: "收藏成功",
              description: "",
            });
          }
        })
        .catch(() => {});
    },
    tohome() {
      this.$router.push("/index");
    },
  },
};
</script>
<style>
</style>

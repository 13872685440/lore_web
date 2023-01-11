<template>
  <div>
    <div class="m-vue-pdf">
      <Pdf
        :src="pdfUrl"
        :page="currentPage"
        @num-pages="totalCount = $event"
        @page-loaded="currentPage = $event"
        @loaded="loadPdfHandler"
      />
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
import { saveService } from "@/api/manage";
import Pdf from "vue-pdf";
import { axios } from "@/utils/request";

export default {
  name: "VuePdfPaging",
  components: {
    Pdf,
  },
  data() {
    return {
      overTimer: null,
      // 是否记录积分
      isOvertime: false,
      hasmark: 1,
      loreid: "",
      path: {},
      loaded: false,
      rootSize: 0,
      startx: 0,
      starty: 0,
      endx: 0,
      endy: 0,
      currentPage: 1, // pdf文件页码
      totalCount: 0, // pdf文件总页数
      // 可引入网络文件或者本地文件
      pdfUrl:
        "http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf", // 如果引入本地pdf文件，需要将pdf放在public文件夹下，引用时使用绝对路径（/：表示public文件夹）
    };
  },
  created() {
    this.overTimer = setTimeout(() => {
      this.jf();
    }, 5000);
    this.path.save_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/loremark/mark";
    this.path.jf_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/useritgrcd/jf";
    this.path.download_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/miniofile/downloadFile";
  },

  beforeRouteLeave(to, from, next) {
    this.$destroy();
    next();
  },

  destroyed() {
    clearTimeout(this.overTimer);
  },

  mounted() {
    this.loreid = this.$route.query.id;
    this.download();
    document.body.addEventListener("touchmove", this.touchMove, {
      passive: false,
    }); // 禁用H5页面的下拉刷新
    document.body.addEventListener("touchstart", this.touchStart, false); // true: 表示在捕获阶段调用事件处理程序；false：表示在冒泡阶段调用事件处理程序
    document.body.addEventListener("touchend", this.touchEnd, false);
  },
  methods: {
    tohome() {
      this.$router.push("/index");
    },

    jf() {
      saveService(this.path.jf_path, {
        lore_id: this.loreid,
      }).then((res) => {
        clearTimeout(this.overTimer);
      });
    },

    download() {
      console.log(111);
      console.log(this.loreid);
      axios({
        url: this.path.download_path,
        method: "get",
        params: { blwdId: this.loreid, isOnLine: "1" },
        responseType: "blob",
      }).then((res) => {
        let blob = new Blob([res]);
        console.log(blob);
      });
    },
    mark() {
      saveService(this.path.save_path, {
        loreId: this.loreid,
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
              message: "操作成功",
              description: "",
            });
          }
        })
        .catch(() => {});
    },

    touchMove(e) {
      e.preventDefault();
      this.$once("hook:beforeDestroy", function () {
        removeEventListener("touchmove", this.touchMove);
      });
    },
    touchStart(e) {
      console.log("start:", e);
      this.startx = e.touches[0].pageX;
      this.starty = e.touches[0].pageY;
      console.log("start:", this.startx, this.starty);
      this.$once("hook:beforeDestroy", function () {
        removeEventListener("touchstart", this.touchStart);
      });
    },
    touchEnd(e) {
      console.log("end:", e);
      this.endx = e.changedTouches[0].pageX;
      this.endy = e.changedTouches[0].pageY;
      console.log("end:", this.endx, this.endy);
      // y方向上（或x方向上）滑动超过50px进行翻页
      if (
        (this.starty - this.endy) / this.rootSize > 5 ||
        (this.startx - this.endx) / this.rootSize > 5
      ) {
        this.nextPage();
      }
      if (
        (this.endy - this.starty) / this.rootSize > 5 ||
        (this.endx - this.startx) / this.rootSize > 5
      ) {
        this.prePage();
      }
      this.$once("hook:beforeDestroy", function () {
        removeEventListener("touchend", this.touchEnd);
      });
    },
    prePage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalCount) {
        this.currentPage++;
      }
    },
    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
      this.loaded = true;
    },
  },
};
</script>
<style>
</style>

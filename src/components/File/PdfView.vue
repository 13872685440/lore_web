<template>
  <a-modal
    :title="title"
    :width="650"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleOk"
  >
    <a-spin :spinning="confirmLoading">
      <div class="page-one">
        <div>
          <iframe
            :key="key"
            id="previewPdf"
            :src="fileUrl"
            :height="height"
            width="100%"
          ></iframe>
        </div>
      </div>
      <div style="text-align: center" id="footer">
        <span>检索关键字:{{ lore.keyword }}</span>
        <span style="margin-left: 10px">上传人:{{ lore.userName }}</span>
        <span style="margin-left: 10px">上传时间:{{ lore.userName }}</span>
      </div>
    </a-spin>
  </a-modal>
</template>
<script>
import { queryService, saveService } from "@/api/manage";
import { axios } from "@/utils/request";
export default {
  props: ["base", "readOnly"],
  data() {
    return {
      fileUrl: "",
      height: "250px",
      key: "1",
      loreId: "",
      showPdf: false,
      lore: {},
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      path: {},
      valid: true,
      title: "",
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/lore/edit";
    this.path.view_path = prefix + "/lore/fileView";
    this.path.read_path = prefix + "/lorereadrcd/save";
    this.title = "合同预览";
  },
  methods: {
    add(id) {
      this.visible = true;
      this.loreId = id;
      if (id) {
        this.confirmLoading = true;
        queryService(this.path.edit_path, { id: id }).then((res) => {
          this.lore = res.result;
          this.initView(id);
          this.confirmLoading = false;
        });
      }
    },

    readrcd() {
      saveService(this.path.read_path, {
        loreId: this.loreId,
      });
    },
    handleOk() {
      this.visible = false;
    },

    initView(id) {
      axios({
        url: this.path.view_path,
        method: "get",
        params: { id: id },
        responseType: "blob",
      }).then((res) => {
        this.fileUrl = "/pdfjs/web/viewer.html?file=" + this.getObjectURL(res);
        this.showPdf = true;
        this.spinning = false;
        this.height = document.body.clientHeight - 250 + "px";
        this.key = "2";
      });
    },
    getObjectURL(file) {
      let url = null;
      if (window.createObjectURL != undefined) {
        url = window.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        url = URL.createObjectURL(file);
      } else if (window.URL != undefined) {
        url = window.URL.createObjectURL(file);
      }
      return url;
    },
  },
};
</script>

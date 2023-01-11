<template>
  <a-upload
    @change="handleChange"
    @preview="handlePreview"
    :remove="handleRemove"
    :file-list="file_List"
    name="file"
    :multiple="multiple"
    :accept="accept"
    :data="file_data"
    :action="path.file_path"
    :headers="headers"
    :disabled="length === -1"
  >
    <span v-if="!length || file_List.length < length">
      <a-button> <a-icon type="upload" />点击上传 </a-button></span
    >
  </a-upload>
</template>
<script>
import { ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
import { queryService, download, toService } from "@/api/manage";
import { axios } from "@/utils/request";

export default {
  props: {
    form: {
      type: Object,
    },
    accept: { default: "" },
    file_data: {
      type: Object,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    fileList: {
      type: Array,
    },
    length: {
      type: Number,
    },
    //formId: { type: String },
    tmpId: { type: String },
  },
  data() {
    return {
      path: {},
      headers: {},
      file_List: [],
    };
  },
  created() {
    const file_prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.file_path = "/api" + file_prefix + "/miniofile/upload";
    this.path.download_path = file_prefix + "/miniofile/downloadFile";
    this.path.load_path = file_prefix + "/miniofile/load";
    this.path.delete_path = file_prefix + "/miniofile/deleteFile";
    this.path.pdf_path = file_prefix + "/file/pdfView";
    const token = Vue.ls.get(ACCESS_TOKEN);
    if (token) {
      this.headers["ACCESS-TOKEN"] = token;
    }
    this.file_data.isapp = false;
    this.file_data.keyValue = this.tmpId;
    console.log("this.file_data.keyValue" + this.file_data.keyValue);
    //  if (this.formId != null) {
    //    this.file_data.keyValue = this.formId;
    //   } else {
    // this.file_data.keyValue = this.tmpId;
    // }
  },
  async mounted() {
    if (this.fileList) {
      this.file_List = this.fileList;
    } else {
      await queryService(this.path.load_path, this.file_data).then((res) => {
        this.file_List = res.result;
        console.log("this.file_List");
        console.log(this.file_List);
      });
    }
    var map = {};
    map[this.file_data.sign] = this.file_List;
    this.form.setFieldsValue(map);
  },
  methods: {
    handleChange(info) {
      let fileList = [...info.fileList];
      let errorList = [];
      fileList = fileList.filter((file) => {
        if (file.status === "error") {
          errorList.push(file.name);
        } else if (file.status === "uploading") {
          return file;
        } else {
          if (file.response && file.response.status === 200) {
            if (file.response.fileinfo) {
              file.id = file.response.fileinfo.id;
            }
            return file;
          } else {
            errorList.push(file.name);
          }
        }
      });

      if (errorList.length > 0) {
        this.$notification.error({
          message: "上传失败",
          description: errorList,
        });
      }
      this.file_List = fileList;
      var map = {};
      map[this.file_data.sign] = this.file_List;
      this.form.setFieldsValue(map);
    },

    handlePreview(info) {
      var isChrome = navigator.userAgent.indexOf("Chrome") > -1;
      // alert(info.name);
      if (isChrome) {
        const params = {
          blwdId: info.id,
          isOnLine: "1",
        };
        download(this.path.download_path, params, info.name);
      } else {
        this.viewPdf(info.id);
      }
    },
    viewPdf(id) {
      axios({
        url: this.path.pdf_path,
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
    handleRemove(info) {
      return toService("post", this.path.delete_path, { id: info.id }).then(
        (res) => {
          if (res.code != "200") {
            this.$notification.error({
              message: "删除失败",
            });
            return false;
          }
        }
      );
    },
  },
};
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-list-item-name {
  cursor: pointer;
}
</style>
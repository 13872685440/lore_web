<template>
  <a-upload
    @change="handleChange"
    @preview="handlePreview"
    :remove="handleRemove"
    :file-list="file_List"
    name="file"
    :multiple="multiple"
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
import { queryService, download } from "@/api/manage";

export default {
  props: {
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
    this.path.file_path = "/api" + file_prefix + "/file/upload";
    this.path.download_path = file_prefix + "/file/downloadFile";
    this.path.load_path = file_prefix + "/file/loadFile";
    this.path.delete_path = file_prefix + "/file/deleteFile";

    const token = Vue.ls.get(ACCESS_TOKEN);
    if (token) {
      this.headers["ACCESS-TOKEN"] = token;
    }
  },
  async mounted() {
    if (this.fileList) {
      this.file_List = this.fileList;
    } else {
      console.log("fileList");
      console.log(this.file_data);
      await queryService(this.path.load_path, this.file_data).then((res) => {
        this.file_List = res.result;
      });
    }
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
    },
    handlePreview(info) {
      const params = {
        blwdId: info.id,
        isOnLine: "1",
      };
      download(this.path.download_path, params, info.name);
    },
    handleRemove(info) {
      return queryService(this.path.delete_path, { id: info.id }).then((res) => {
        if (res.code != "200") {
          this.$notification.error({
            message: "删除失败",
          });
          return false;
        }
      });
    },
  },
};
</script>

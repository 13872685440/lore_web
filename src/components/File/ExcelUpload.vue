<template>
  <a-upload
    ref="upload"
    :action="upload_path"
    :show-upload-list="false"
    :headers="headers"
    name="file"
    :beforeUpload="beforeUpload"
    @change="handleChange"
  >
    <a-button icon="upload"> 导入 </a-button>
  </a-upload>
</template>
<script>
import { ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";

export default {
  props: {
    upload_path: {
      type: String,
    },
  },
  data() {
    return {
      headers: {},
    };
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN);
    if (token) {
      this.headers["ACCESS-TOKEN"] = token;
    }
  },
  methods: {
    beforeUpload(file) {
      var names = file.name.split(".");
      var l = names.length;
      if (l < 2 || (names[l - 1] != "xls" && names[l - 1] != "xlsx")) {
        this.$message.error(
          "数据导入失败！" +
            "文件 " +
            file.name +
            " 格式不正确，请上传.xls,.xlsx文件。"
        );
        return false;
      }
    },
    handleChange(info) {
      let file = info.file;
      if (file.status === "error") {
        this.$message.error("数据导入失败！");
      } else if (file.status === "done") {
        if (file.response && file.response.status === 200) {
          this.$message.success(file.response.url);
          this.$emit("loadData");
        } else {
          this.$message.error("数据导入失败！");
        }
      }
    },
  },
};
</script>
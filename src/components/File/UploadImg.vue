<template>
  <div class="clearfix">
    <a-upload
      accept=".jpg, .jpeg, .png"
      @change="handleChange"
      @preview="handlePreview"
      :remove="handleRemove"
      :file-list="file_List"
      listType="picture-card"
      name="file"
      :multiple="multiple"
      :data="file_data"
      :action="path.file_path"
      :headers="headers"
      :disabled="length === -1"
      ><div v-if="!length || file_List.length < length">
        <a-icon type="plus" />
        <div class="ant-upload-text">上传图片</div>
      </div>
    </a-upload>
    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      :dialog-style="{ top: '10px' }"
    >
      <img :alt="previewImgname" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
import { ACCESS_TOKEN } from "@/store/mutation-types";
import Vue from "vue";
import { queryService, toService } from "@/api/manage";

export default {
  props: {
    form: {
      type: Object,
    },
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
    formId: { type: String },
    tmpId: { type: String },
  },
  data() {
    return {
      previewVisible: false,
      previewImage: "",
      previewImgname: "",
      path: {},
      headers: {},
      file_List: [],
    };
  },
  created() {
    const file_prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.file_path = "/api" + file_prefix + "/miniofile/upload";
    this.path.load_path = file_prefix + "/miniofile/load";
    this.path.delete_path = file_prefix + "/miniofile/deleteFile";
    this.path.view_path = "/api" + file_prefix + "/miniofile/viewimage?id=";

    const token = Vue.ls.get(ACCESS_TOKEN);
    if (token) {
      this.headers["ACCESS-TOKEN"] = token;
    }

    this.file_data.isapp = false;
    if (this.formId != null) {
      this.file_data.keyValue = this.formId;
    } else {
      this.file_data.keyValue = this.tmpId;
    }
  },
  async mounted() {
    if (this.fileList) {
      this.file_List = this.fileList;
    } else {
      await queryService(this.path.load_path, this.file_data).then((res) => {
        this.file_List = res.result.filter((file) => {
          file.url =
            this.path.view_path +
            file.id +
            "&token=" +
            this.headers["ACCESS-TOKEN"];
          return file;
        });
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
    handlePreview(file) {
      this.previewImage =
        this.path.view_path +
        file.id +
        "&token=" +
        this.headers["ACCESS-TOKEN"];
      this.previewImgname = file.name;
      this.previewVisible = true;
    },
    async handleRemove(info) {
      return await toService("post", this.path.delete_path, {
        id: info.id,
      }).then((res) => {
        if (res.code != "200") {
          this.$notification.error({
            message: "删除失败",
          });
          return false;
        }
      });
    },
    handleCancel() {
      this.previewVisible = false;
    },
  },
};
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-upload-list-item-info > span {
  height: 100%;
}
</style>

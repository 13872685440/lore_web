<template>
  <a-modal
    :title="title"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :key="key"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="key" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['key', { rules: [{ required: true, message: '请输入key' }] }]"
          />
        </a-form-item>
        <a-form-item label="路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="['path', { rules: [{ required: true, message: '请输入路径' }] }]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { queryService, saveService } from "@/api/manage";

export default {
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),

      path: {},
      title: "",
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.edit_path = prefix + "/system/path/edit_path";
    this.path.save_path = prefix + "/system/path/save_path";
  },
  methods: {
    add(id) {
      this.visible = true;
      if (id) {
        this.key = id;
        this.confirmLoading = true;
        queryService(this.path.edit_path, { id: id }).then((res) => {
          this.form.setFieldsValue(res.result);
          this.confirmLoading = false;
        });
      } else {
        const random = Math.random().toString(36).substring(2);
        this.key = random;
      }
    },
    handleSubmit() {
      const that = this;
      this.confirmLoading = true;
      this.form.validateFields((errors, values) => {
        if (!errors) {
          saveService(this.path.save_path, values)
            .then((res) => {
              console.log(res.code);
              if (res.code == "400") {
                that.$notification.error({
                  message: res.message,
                  description: res.result,
                });
              } else {
                that.$notification.success({
                  message: "保存成功",
                  description: "",
                });
              }
              that.$emit("ok");
              that.visible = false;
              that.confirmLoading = false;
            })
            .catch((error) => {
              that.confirmLoading = false;
              console.log(error);
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

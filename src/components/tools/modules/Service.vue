<template>
  <a-modal
    title="技术支持"
    :width="600"
    :visible="visible"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="false">
      <!-- <a-form-item v-bind="formItemLayout" label="开发单位">
        <span class="ant-form-text">{{ config.company_name }}</span>
      </a-form-item>-->
      <a-form-item v-bind="formItemLayout" label="项目经理">
        <span class="ant-form-text">{{ config.manager_name }}</span>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="联系电话">
        <span class="ant-form-text">{{ config.phone }}</span>
      </a-form-item>
      <a-form-item v-bind="formItemLayout" label="服务时间">
        <span class="ant-form-text">{{ config.service_time }}</span>
      </a-form-item>
    </a-spin>
  </a-modal>
</template>

<script>
import Vue from "vue";
import { SYSTEM_CONFIG } from "@/store/mutation-types";
export default {
  name: "Service",
  data() {
    return {
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 7 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 },
        },
      },
      visible: false,
      config: Vue.ls.get(SYSTEM_CONFIG),
    };
  },
  methods: {
    add() {
      this.visible = true;
    },
    //getService() {
    // queryService(this.GLOBAL.MODEL_SYSTEM + "/init/getConfig", {
    //   key: "sys_config",
    //  }).then((res) => {
    //    this.form.setFieldsValue(res.result);
    //   return res.result;
    // });
    // },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
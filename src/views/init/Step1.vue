<template>
  <a-form-model
    ref="entityForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="padding-top: 50px"
  >
    <a-form-model-item ref="system_name" label="系统名称" prop="system_name">
      <a-input v-model="form.system_name" />
    </a-form-model-item>
    <a-form-model-item label="数据库" prop="db_type">
      <a-select v-model="form.db_type" placeholder="请选择数据库">
        <a-select-option value="mysql"> mysql </a-select-option>
        <a-select-option value="oracle"> oracle </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item ref="company_name" label="开发单位" prop="company_name">
      <a-input v-model="form.company_name" />
    </a-form-model-item>
    <a-form-model-item ref="manager_name" label="项目经理" prop="manager_name">
      <a-input v-model="form.manager_name" /> </a-form-model-item
    ><a-form-model-item ref="phone" label="联系方式" prop="phone">
      <a-input v-model="form.phone" /> </a-form-model-item
    ><a-form-model-item ref="service_time" label="服务时间" prop="service_time">
      <a-input v-model="form.service_time" />
    </a-form-model-item>

    <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
      <a-button type="primary" @click="onSubmit"> 下一步 </a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import { axios } from "@/utils/request";
export default {
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      other: "",
      form: {
        system_name: "",
        db_type: undefined,
        company_name: "",
        manager_name: "",
        phone: "",
        service_time: "",
      },
      rules: {
        system_name: [
          {
            required: true,
            message: "请输入系统名称",
            trigger: "blur",
          },
        ],
        db_type: [
          {
            required: true,
            message: "请选择数据库",
            trigger: "change",
          },
        ],
        company_name: [
          {
            required: true,
            message: "请输入开发单位",
            trigger: "blur",
          },
        ],
        manager_name: [
          {
            required: true,
            message: "请输入项目经理",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "blur",
          },
        ],
        service_time: [
          {
            required: true,
            message: "请输入服务时间",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    axios({
      url: "/system/init/getConfig?key=sys_config",
      method: "get",
    }).then((res) => {
      if (res.result != null && res.result != "") {
        this.form = JSON.parse(res.result);
      }
    });
  },
  methods: {
    onSubmit() {
      this.$refs.entityForm.validate((valid) => {
        if (valid) {
          return axios({
            url: "/system/init/first",
            method: "post",
            data: this.form,
          }).then(() => {
            this.$emit("edit", { state: "2" });
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<template>
  <a-form-model
    ref="entityForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    style="padding-top: 50px"
  >
    <a-form-model-item label="是否引入组织机构" prop="hasOrgan">
      <a-radio-group v-model="form.hasOrgan">
        <a-radio value="1"> 是 </a-radio>
        <a-radio value="2"> 否 </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="是否引入岗位" prop="hasPost">
      <a-radio-group v-model="form.hasPost">
        <a-radio value="1"> 是 </a-radio>
        <a-radio value="2"> 否 </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="是否支持一人多部门" prop="mutiOrgan">
      <a-radio-group v-model="form.mutiOrgan">
        <a-radio value="1"> 是 </a-radio>
        <a-radio value="2"> 否 </a-radio>
      </a-radio-group>
    </a-form-model-item>
    <a-form-model-item label="是否支持一人多岗" prop="mutiPost">
      <a-radio-group v-model="form.mutiPost">
        <a-radio value="1"> 是 </a-radio>
        <a-radio value="2"> 否 </a-radio>
      </a-radio-group>
    </a-form-model-item>

    <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
      <a-button @click="onBack"> 上一步 </a-button>
      <a-button type="primary" @click="onSubmit" style="margin-left: 10px">
        下一步
      </a-button>
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
        hasOrgan: "",
        hasPost: "",
        mutiOrgan: "",
        mutiPost: "",
      },
      rules: {
        hasOrgan: [
          {
            required: true,
            message: "请选择是否引入组织机构",
            trigger: "change",
          },
        ],
        hasPost: [
          {
            required: true,
            message: "请选择是否引入岗位",
            trigger: "change",
          },
        ],
        mutiOrgan: [
          {
            required: true,
            message: "请选择是否支持一人多部门",
            trigger: "change",
          },
        ],
        mutiPost: [
          {
            required: true,
            message: "请选择是否支持一人多岗位",
            trigger: "change",
          },
        ],
      },
    };
  },
  mounted() {
    axios({
      url: "/system/init/getConfig?key=organ_config",
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
            url: "/system/init/sencond",
            method: "post",
            data: this.form,
          }).then(() => {
            this.$emit("edit", { state: "3" });
          });
        } else {
          return false;
        }
      });
    },
    onBack() {
      this.$emit("edit", { state: "1" });
    },
  },
};
</script>
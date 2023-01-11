<template>
  <x-form
    ref="rform"
    :form_params="form_params"
    :form_datas="form_datas"
    :service_path="service_path"
  >
  </x-form>
</template>
<script>
import XForm from "@/components/CRUD/XForm.vue";
import { col_2_all, col_3_frist, col_3_last_two } from "@/utils/style";
export default {
  components: { XForm },
  name: "Form_Base",
  props: {
    // 打开form时传递的参数
    form_params: {
      type: Object,
    },
    // 属性参数,用来加载公共属性，如list，tree等
    prop_params: {
      type: Object,
    },
  },
  data() {
    return {
      service_path: {},
      form_datas: [
        [
          {
            label: "版本号",
            prop: "version_code",
            type: "Input_Number",
            styles: col_3_frist,
            rules: [{ required: true }],
          },
          {
            label: "版本名称",
            prop: "version_name",
            type: "Input",
            rules: [
              { required: true, message: "请输入版本平台", whitespace: true },
            ],
            styles: col_3_last_two,
          },
        ],
        [
          {
            label: "版本描述",
            prop: "version_des",
            type: "Input",
            styles: col_3_frist,
          },
          {
            label: "版本平台",
            prop: "version_platform",
            type: "Input",
            rules: [
              { required: true, message: "请输入版本平台", whitespace: true },
            ],
            styles: col_3_last_two,
          },
        ],
        [
          {
            label: "安装文件",
            prop: "APP1",
            show: true,
            type: "UploadFile",
            datas: {
              ebcn: "com.cat.system.model.AppVersion",
              sign: "APP1",
            },
            styles: col_2_all,
          },
        ],
      ],
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.service_path.edit_path = prefix + "/appversion/edit";
    this.service_path.save_path = prefix + "/appversion/save";
  },
  mounted() {},
  methods: {},
};
</script>
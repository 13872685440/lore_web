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
import { col_3_frist, col_3_last } from "@/utils/style";
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
            label: "上级编码",
            prop: "scId",
            type: "Input",
            readOnly: true,
            styles: col_3_frist,
          },
          {
            label: "本级编码",
            prop: "clc",
            type: "Input",
            readOnly: true,
            styles: col_3_last,
          },
          {
            label: "完整编码",
            prop: "id",
            type: "Input",
            readOnly: true,
            styles: col_3_last,
          },
        ],
        [
          {
            label: "上级机构",
            prop: "scName",
            type: "Input",
            readOnly: true,
            styles: col_3_frist,
          },
          {
            label: "机构名称",
            prop: "name",
            type: "Input",
            rules: [
              { required: true, message: "请输入机构名称", whitespace: true },
            ],
            styles: col_3_last,
          },
          {
            label: "排序",
            prop: "xh",
            type: "Input_Number",
            rules: [
              { type: "number", message: "请输入数字", whitespace: true },
            ],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "组织机构类型",
            prop: "orgtype",
            placeholder: "请选择组织机构类型",
            rules: [
              {
                message: "请选择组织机构类型",
                whitespace: true,
                required: true,
              },
            ],
            datas: this.prop_params.orgtypes,
            mode: "default",
            type: "Select",
            styles: col_3_frist,
          },
          {
            label: "管理单位（验收审批时使用）",
            prop: "gldw_id",
            placeholder: "请选择管理单位",
            datas: this.prop_params.organs,
            mode: "default",
            type: "Select",
            styles: col_3_last,
          },
        ],
      ],
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    if (this.form_params.type == "addlower") {
      this.service_path.edit_path = prefix + "/organ/addlower";
    } else {
      this.service_path.edit_path = prefix + "/organ/edit";
    }
    this.service_path.save_path = prefix + "/organ/save";
  },
  mounted() {},
  methods: {},
};
</script>
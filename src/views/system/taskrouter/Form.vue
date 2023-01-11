<template>
  <x-form ref="rform" :form_params="form_params" :form_datas="form_datas">
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
            label: "上级",
            prop: "scName",
            type: "Input",
            readOnly: true,
            styles: col_3_frist,
          },
          {
            label: "任务名称",
            prop: "name",
            type: "Input",
            rules: [
              { required: true, message: "请输入任务名称", whitespace: true },
            ],
            styles: col_3_last,
          },
          {
            label: "步骤",
            prop: "step",
            type: "Input_Number",
            rules: [
              { type: "number", message: "请输入数字", whitespace: true },
            ],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "组件路径",
            prop: "component",
            type: "Input",
            styles: col_3_frist,
          },
        ],
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
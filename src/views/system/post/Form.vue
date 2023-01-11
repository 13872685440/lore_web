<template>
  <y-form ref="rform" :form_params="form_params" :form_datas="form_datas">
  </y-form>
</template>
<script>
import YForm from "@/components/CRUD/YForm.vue";

export default {
  components: { YForm },
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
        {
          label: "岗位编码",
          prop: "id",
          rules: [
            { required: true, message: "请输入岗位编码", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "岗位名称",
          prop: "name",
          rules: [
            { required: true, message: "请输入岗位名称", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "组织机构类型",
          prop: "org_ls",
          placeholder: "请选择该岗位关联组织机构类型",
          rules: [
            {
              message: "请选择该岗位关联组织机构类型",
              whitespace: true,
              required: true,
              type: "array",
            },
          ],
          datas: this.prop_params.orgtypes,
          mode: "multiple",
          type: "Select",
        },
        {
          label: "关联角色",
          prop: "role_ls",
          placeholder: "请选择该岗位关联角色",
          rules: [
            {
              message: "请选择该岗位关联角色",
              whitespace: true,
              required: true,
              type: "array",
            },
          ],
          datas: this.prop_params.roles,
          mode: "multiple",
          type: "Select",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
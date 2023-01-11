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
          label: "角色名",
          prop: "id",
          rules: [
            { required: true, message: "请输入角色名", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "角色描述",
          prop: "des",
          rules: [
            { required: true, message: "请输入角色描述", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "角色类型",
          prop: "rtype",
          rules: [
            {
              required: true,
              message: "请选择角色类型",
              whitespace: true,
            },
          ],
          type: "Radio",
          datas: [
            { id: "RT000", name: "管理角色" },
            { id: "RT001", name: "通用角色" },
            { id: "RT002", name: "岗位角色" },
            { id: "RT003", name: "领导角色" },
          ],
        },
        {
          label: "选择所属部门",
          prop: "org_data",
          rules: [{ type: "array" }],
          type: "Tree_Multiple",
          datas: this.prop_params.organ_trees,
        },
        {
          label: "选择菜单",
          prop: "app_data",
          rules: [{ type: "array" }],
          type: "Tree_Multiple",
          datas: this.prop_params.trees,
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {},
};
</script>
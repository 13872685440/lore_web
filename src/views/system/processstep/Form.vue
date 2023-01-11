<template>
  <y-form
    ref="rform"
    :form_params="form_params"
    :form_datas="form_datas"
    :hidden_datas="hidden_datas"
    ><a-select
      slot="csr_type"
      size="default"
      @change="changeshr_type"
      v-decorator="[
        'csr_type',
        {
          rules: [{ required: true, message: '请选择' }],
        },
      ]"
    >
      <a-select-option key="1" value="1">用户</a-select-option>
      <a-select-option key="2" value="2">岗位角色</a-select-option>
      <a-select-option key="3" value="3">领导角色</a-select-option>
    </a-select>
    <a-tree-select
      slot="cs_user_s"
      :treeData="prop_params.users"
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      placeholder="请选择"
      allowClear
      multiple
      v-decorator="[
        'cs_user_s',
        {
          rules: [
            { required: shr_type_v == '1' ? true : false, message: '请选择' },
          ],
        },
      ]"
    ></a-tree-select>
    <a-select
      slot="cs_role_s"
      size="default"
      mode="multiple"
      :placeholder="请选择"
      v-decorator="[
        'cs_role_s',
        {
          rules: [
            { required: shr_type_v == '2' ? true : false, message: '请选择' },
          ],
        },
      ]"
    >
      <a-select-option
        v-for="type in prop_params.roles"
        :key="type.id"
        :value="type.id"
        >{{ type.name }}</a-select-option
      >
    </a-select>
    <a-select
      slot="cs_ld_role_s"
      size="default"
      mode="multiple"
      :placeholder="请选择"
      v-decorator="[
        'cs_ld_role_s',
        {
          rules: [
            { required: shr_type_v == '3' ? true : false, message: '请选择' },
          ],
        },
      ]"
    >
      <a-select-option
        v-for="type in prop_params.ld_roles"
        :key="type.id"
        :value="type.id"
        >{{ type.name }}</a-select-option
      >
    </a-select>
    <a-select
      slot="cs_role_type"
      size="default"
      @change="changerole_type"
      v-decorator="[
        'cs_role_type',
        {
          rules: [
            { required: shr_type_v == '2' ? true : false, message: '请选择' },
          ],
        },
      ]"
    >
      <a-select-option key="1" value="1">上级部门</a-select-option>
      <a-select-option key="2" value="2">本级部门</a-select-option>
      <a-select-option key="3" value="3">指定部门</a-select-option>
      <a-select-option key="4" value="4">不指定部门</a-select-option>
    </a-select>
    <a-tree-select
      slot="cs_organ_s"
      :treeData="prop_params.organs"
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      placeholder="请选择"
      allowClear
      multiple
      treeDefaultExpandAll
      v-decorator="[
        'cs_organ_s',
        {
          rules: [
            {
              required: shr_type_v == '2' && role_type_v == '3' ? true : false,
              message: '请选择',
            },
          ],
        },
      ]"
    ></a-tree-select>
  </y-form>
</template>
<script>
import YForm from "@/components/CRUD/YForm.vue";
import { queryService } from "@/api/manage";
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
    hidden_datas: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      shr_type_v: "",
      role_type_v: "",
      form_datas: [
        {
          label: "流程编码",
          prop: "id",
          rules: [{ required: true, message: "请输入编码", whitespace: true }],
          type: "Input",
        },
        {
          label: "流程名称",
          prop: "name",
          rules: [
            { required: true, message: "请输入流程名称", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "组件路径",
          prop: "component",
          type: "Input",
        },
        {
          label: "服务主路径",
          prop: "service_path",
          type: "Input",
        },
        {
          label: "服务子路径",
          prop: "service_path_type",
          type: "Input",
        },
        {
          label: "关联数据库表",
          prop: "table_name",
          rules: [
            { required: true, message: "请输入关联数据库表", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "超时时间",
          prop: "time_out",
          rules: [
            {
              type: "number",
              message: "请输入超时时间",
              whitespace: true,
            },
          ],
          type: "Input_Number",
        },
        {
          label: "关联菜单",
          prop: "appId",
          rules: [{ required: true, message: "请选择关联菜单" }],
          type: "Tree_Simple",
          datas: this.prop_params.apps,
        },
        {
          label: "抄送人类型",
          prop: "csr_type",
          type: "Slot",
        },
        {
          label: "选择抄送人",
          prop: "cs_user_s",
          type: "Slot",
          show: false,
        },
        {
          label: "选择角色",
          prop: "cs_ld_role_s",
          type: "Slot",
          show: false,
        },
        {
          label: "选择抄送角色",
          prop: "cs_role_s",
          type: "Slot",
          show: false,
        },
        {
          label: "抄送角色类型",
          prop: "cs_role_type",
          type: "Slot",
          show: false,
        },
        {
          label: "关联机构",
          prop: "cs_organ_s",
          type: "Slot",
          show: false,
        },
      ],
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      if (this.form_params.entity_datas.ct != null) {
        this.initAppPers(this.form_params.entity_datas.id);

        this.changeshr_type(this.form_params.entity_datas.shr_type);

        if (this.form_params.entity_datas.shr_type == "2") {
          this.changerole_type(this.form_params.entity_datas.role_type);
        }
      }
    },
    async initAppPers(id) {
      await queryService(this.modal_form_params.query_path, {
        step_id: id,
      }).then((res) => {
        this.datas = res.result;
        if (res.result.length <= 5) {
          this.pagination = false;
        }
      });
    },
    changeshr_type(v) {
      this.shr_type_v = v;
      if (v == "1") {
        this.form_datas[9].show = true;
        this.form_datas[10].show = false;
        this.form_datas[11].show = false;
        this.form_datas[12].show = false;
        this.form_datas[13].show = false;
      } else if (v == "2") {
        this.form_datas[9].show = false;
        this.form_datas[10].show = false;
        this.form_datas[11].show = true;
        this.form_datas[12].show = true;
        this.form_datas[13].show = false;
        // this.form_datas[3][2].hidden = true;
      } else if (v == "3") {
        this.form_datas[9].show = false;
        this.form_datas[10].show = true;
        this.form_datas[11].show = false;
        this.form_datas[12].show = false;
        this.form_datas[13].show = false;
      } else {
        this.form_datas[9].show = false;
        this.form_datas[10].show = false;
        this.form_datas[11].show = false;
        this.form_datas[12].show = false;
        this.form_datas[13].show = false;
      }
    },
    changerole_type(v) {
      this.role_type_v = v;
      if (v == "3") {
        this.form_datas[13].show = true;
      } else {
        this.form_datas[13].show = false;
      }
    },
  },
};
</script>
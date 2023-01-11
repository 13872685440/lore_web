<template>
  <div>
    <tree-list
      :list_columns="list_columns"
      :tree_params="tree_params"
      ref="slist"
    >
      <span slot="ac_button">
        <a-button type="primary" icon="plus" @click="handle_edit_new('add')"
          >新建</a-button
        ></span
      >
      <span slot="oper_action" slot-scope="record">
        <template v-if="record.data.id.length == 4">
          <a @click="handle_edit_lower(record.data, 'addlower')">
            <a-icon type="plus-circle" style="color: #478fca" />
          </a>
          <a-divider type="vertical" />
          <a
            @click="
              handle_edit({ record: record.data, readOnly: false }, 'add')
            "
            title="编辑"
          >
            <a-icon type="edit" style="color: #69aa46" />
          </a>
          <a-divider type="vertical"
        /></template>
        <template v-else
          ><a
            @click="
              handle_edit({ record: record.data, readOnly: false }, 'addlower')
            "
            title="编辑"
          >
            <a-icon type="edit" style="color: #69aa46" />
          </a>
          <a-divider type="vertical"
        /></template>
        <a
          @click="handle_delete(record.data.id)"
          v-if="record.data.name != '系统管理员'"
        >
          <a-icon
            type="delete"
            style="color: #ff6347"
            title="删除"
          /> </a></span></tree-list
    ><a-drawer
      width="85%"
      :title="draw_params.title"
      placement="right"
      :closable="draw_params.closable"
      :visible="draw_params.visible"
      :maskClosable="draw_params.maskClosable"
      :key="form_params.query_params.id"
      @close="onClose"
      ><s-form
        v-if="form_type == 'add'"
        :form_params="form_params"
        :prop_params="prop_params"
        :hidden_datas="hidden_datas"
        :key="form_params.query_params.tmp_id + 'a'"
        ref="sform"
      >
      </s-form
      ><s-base
        v-else
        :form_params="form_params"
        :prop_params="prop_params"
        :key="form_params.query_params.tmp_id + 'a'"
        ref="sform"
      >
      </s-base>

      <div class="a-folat">
        <a-spin :spinning="spinning">
          <a-button @click="onClose">关闭</a-button>

          <a-button
            style="margin-left: 8px"
            @click="handle_save"
            type="primary"
            v-if="!form_params.readOnly"
            >保存</a-button
          >
        </a-spin>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import TreeList from "@/components/CRUD/TreeList.vue";
import SForm from "./Form";
import SBase from "./Base";
import { queryService, save } from "@/api/manage";
import { main } from "@/utils/mixin";
import axios from "axios";

export default {
  name: "Main_User",
  mixins: [main],
  components: {
    TreeList,
    SForm,
    SBase,
  },
  data() {
    return {
      form_type: "",
      list_columns: [
        {
          title: "编码",
          dataIndex: "id",
          sorter: true,
        },
        {
          title: "名称",
          dataIndex: "name",
        },
        {
          title: "上级",
          dataIndex: "scName",
        },
        {
          title: "组件",
          dataIndex: "component",
        },
        {
          title: "步骤",
          dataIndex: "step",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
      tree_params: {
        params: {
          table_name: "Task_Process_Step",
          props: "o.id,o.name,o.sc_id",
        },
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化方法
    init() {
      this.draw_params.title = "流程配置";
      this.form_params.reRender = true;
      this.hidden_datas = ["clc"];
      const that = this;
      axios
        .all([
          queryService(this.get_path("/tree/get"), {
            table_name: "SYS_App_Tree",
            other: 1,
          }),
          queryService(this.get_path("/tree/get_user"), {
            other: 1,
          }),
          queryService(this.get_path("/tree/get"), {
            table_name: "Org_Organ",
            other: 1,
          }),
          queryService(this.get_path("/tree/getList"), {
            table_name: "SYS_Role",
            key: "r_type",
            root: "RT002",
            props: "o.id,o.des",
          }),
          queryService(this.get_path("/tree/getList"), {
            table_name: "SYS_Role",
            key: "r_type",
            root: "RT003",
            props: "o.id,o.des",
          }),
        ])
        .then(
          axios.spread(function (a1, a2, a3, a4, a5) {
            if (
              a1.code === "400" ||
              a2.code === "400" ||
              a3.code === "400" ||
              a4.code === "400" ||
              a5.code === "400"
            ) {
              that.$notification.error({
                message: "参数错误",
                description: "请求出现错误，请联系管理员",
              });
            } else {
              that.prop_params.apps = a1.result;
              that.prop_params.users = a2.result;
              that.prop_params.organs = a3.result;
              that.prop_params.roles = a4.result;
              that.prop_params.ld_roles = a5.result;
            }
          })
        );
    },
    handle_save() {
      this.spinning = true;
      const that = this.$refs.sform.$refs.rform;
      save(that).then((val) => {
        if (val == 1) {
          this.onClose();
          this.$refs.slist.refreshTable();
        } else if (val == 2) {
          this.$refs.slist.refreshTable();
        }
        this.spinning = false;
      });
    },
    handle_edit_new(type) {
      this.form_type = type;
      this.edit_new();
    },
    handle_edit_lower(data, type) {
      this.form_type = type;
      this.edit_lower(data);
    },
    handle_edit(data, type) {
      this.form_type = type;
      this.edit(data);
    },
    handle_delete(id) {
      this.$refs.slist.handle_delete(id);
    },
  },
};
</script>
<style>
.a-folat {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 4px 4px;
}
</style>

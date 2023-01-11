<template>
  <div>
    <tree-list
      :list_columns="list_columns"
      :tree_params="tree_params"
      ref="slist"
    >
      <span slot="ac_button">
        <a-button type="primary" icon="plus" @click="edit_new()"
          >新建</a-button
        ></span
      >
      <span slot="oper_action" slot-scope="record">
        <a @click="edit_lower(record.data)">
          <a-icon type="plus-circle" style="color: #478fca" />
        </a>
        <a-divider type="vertical" />
        <a @click="edit({ record: record.data, readOnly: false })" title="编辑">
          <a-icon type="edit" style="color: #69aa46" />
        </a>
        <a-divider type="vertical" />
        <a @click="handle_delete(record.data.id)">
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
        :form_params="form_params"
        :prop_params="prop_params"
        :key="form_params.query_params.tmp_id + 'a'"
        ref="sform"
      >
      </s-form>

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
import { save } from "@/api/manage";
import { main } from "@/utils/mixin";

export default {
  name: "Main_Dictionary",
  mixins: [main],
  components: {
    TreeList,
    SForm,
  },
  data() {
    return {
      // query_params: [{ name: "菜单名称", code: "name" }],
      list_columns: [
        {
          title: "编码",
          dataIndex: "id",
          sorter: true,
        },
        {
          title: "名称",
          dataIndex: "name",
          //  scopedSlots: { customRender: "name" },
        },
        {
          title: "上级",
          dataIndex: "scName",
        },
        {
          title: "排序",
          dataIndex: "xh",
          sorter: true,
        },
        {
          title: "类型编码",
          dataIndex: "typeCode",
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
          table_name: "Data_Dictionary",
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
      this.draw_params.title = "数据字典";
      this.form_params.reRender = true;
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

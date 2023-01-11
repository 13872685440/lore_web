<template>
  <div>
    <s-list :list_columns="list_columns" ref="slist"
      ><span slot="rtype" slot-scope="record">
        <template v-if="record.data.rtype === 'RT000'">
          <div>管理角色</div>
        </template>
        <template v-if="record.data.rtype === 'RT001'">
          <div>通用角色</div>
        </template>
        <template v-else-if="record.data.rtype === 'RT002'">
          <div>岗位角色</div>
        </template>
        <template v-else-if="record.data.rtype === 'RT003'">
          <div>领导角色</div>
        </template> </span
      ><span slot="app_data_names" slot-scope="record">
        <template v-for="(item, i) in record.data.app_data_names">
          <div :key="'A' + i">{{ item }}</div>
        </template> </span
      ><span slot="org_data_names" slot-scope="record">
        <template v-for="(item, i) in record.data.org_data_names">
          <div :key="'A' + i">{{ item }}</div>
        </template>
      </span>
      <span slot="ac_button">
        <a-button type="primary" icon="plus" @click="edit_new()"
          >新建</a-button
        ></span
      >
      <span slot="oper_action" slot-scope="record">
        <a-divider type="vertical" />
        <a @click="edit({ record: record.data, readOnly: false })" title="编辑">
          <a-icon type="edit" style="color: #69aa46" />
        </a>
        <a-divider type="vertical" />
        <a
          @click="handle_delete(record.data.id)"
          v-if="record.data.id !== 'SYS_ADMINISTRATOR'"
        >
          <a-icon type="delete" style="color: #ff6347" title="删除" /> </a
      ></span>
    </s-list>
    <a-drawer
      width="85%"
      :title="draw_params.title"
      placement="right"
      :closable="draw_params.closable"
      :visible="draw_params.visible"
      :maskClosable="draw_params.maskClosable"
      :key="form_params.query_params.tmp_id"
      @close="onClose"
      ><s-form
        :prop_params="prop_params"
        :form_params="form_params"
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
import SList from "@/components/CRUD/SList.vue";
import SForm from "./Form";
import { queryService, save } from "@/api/manage";
import { main } from "@/utils/mixin";
import axios from "axios";

export default {
  name: "Main_Role",
  mixins: [main],
  components: {
    SList,
    SForm,
  },
  data() {
    return {
      // 整理一下params
      // list 查询参数
      //query_params: [
      // { name: "角色", code: "id" },
      //  { name: "描述", code: "des" },
      // ],
      // list 列参数
      list_columns: [
        {
          title: "角色名",
          dataIndex: "id",
          sorter: true,
        },
        {
          title: "描述",
          dataIndex: "des",
        },
        {
          title: "角色类型",
          dataIndex: "rtype",
          scopedSlots: { customRender: "rtype" },
        },
        {
          title: "关联菜单",
          dataIndex: "app_data_names",
          scopedSlots: { customRender: "app_data_names" },
        },
        {
          title: "关联部门",
          dataIndex: "org_data_names",
          scopedSlots: { customRender: "org_data_names" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化方法
    init() {
      this.draw_params.title = "角色管理";
      this.form_params.reRender = true;

      this.path.apptree_path = this.get_path("/tree/get");
      const that = this;
      axios
        .all([
          queryService(this.path.apptree_path, {
            table_name: "sys_app_tree",
            other: 1,
          }),
          queryService(this.path.apptree_path, {
            table_name: "org_organ",
            other: 0,
          }),
        ])
        .then(
          axios.spread(function (r1, r2) {
            if (r1.code === "400" || r2.code === "400") {
              that.$notification.error({
                message: "参数错误",
                description: "请求出现错误，请联系管理员",
              });
            } else {
              that.prop_params.trees = r1.result;
              that.prop_params.organ_trees = r2.result;
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

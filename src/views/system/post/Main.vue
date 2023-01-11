<template>
  <div>
    <s-list
      :columns="columns"
      :query_params="query_params"
      @edit="edit"
      ref="slist"
    >
      <span slot="org_names" slot-scope="record">
        <template v-for="(item, i) in record.data.org_names">
          <div :key="i">{{ item }}</div>
        </template> </span
      ><span slot="role_names" slot-scope="record">
        <template v-for="(item, i) in record.data.role_names">
          <div :key="i">{{ item }}</div>
        </template>
      </span>
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
        :form_params="form_params"
        :prop_params="prop_params"
        :task_params="task_params"
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
import { MODEL_SYSTEM_DICTIONARY } from "@/store/mutation-types";
import axios from "axios";

export default {
  name: "Main_Post",
  mixins: [main],
  components: {
    SList,
    SForm,
  },
  data() {
    return {
      // 整理一下params
      // list 查询参数
      query_params: [
        { name: "编码", code: "id" },
        { name: "名称", code: "name" },
      ],
      // list 列参数
      columns: [
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
          title: "组织机构类型",
          dataIndex: "org_names",
          scopedSlots: { customRender: "org_names" },
        },
        {
          title: "角色",
          dataIndex: "role_names",
          scopedSlots: { customRender: "role_names" },
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
      this.draw_params.title = "岗位管理";
      this.form_params.reRender = true;

      this.path.role_path = this.get_path("/tree/getList");
      const that = this;
      axios
        .all([
          queryService(MODEL_SYSTEM_DICTIONARY, {
            typeCode: "ORG_TYPE",
          }),
          queryService(this.path.role_path, {
            table_name: "SYS_Role",
            key: "r_type",
            root: "RT002",
            props: "o.id,o.des",
          }),
        ])
        .then(
          axios.spread(function (a1, a2) {
            if (a1.code === "400" || a2.code === "400") {
              that.$notification.error({
                message: "参数错误",
                description: "请求出现错误，请联系管理员",
              });
            } else {
              that.prop_params.orgtypes = a1.result;
              that.prop_params.roles = a2.result;
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

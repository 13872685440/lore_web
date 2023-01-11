<template>
  <div>
    <tree-list
      :columns="columns"
      :query_params="query_params"
      :tree_params="tree_params"
      @edit="edit"
      ref="slist"
      ><span slot="mul_selects" slot-scope="record">
        <template v-for="(item, i) in record.data.mul_selects">
          <div :key="i">{{ item }}</div>
        </template> </span
      ><span slot="action1" slot-scope="record">
        <a @click="handle_lower(record.data)">
          <a-icon type="plus-circle" style="color: #478fca" />
        </a>
        <a-divider type="vertical" /></span></tree-list
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
        :task_params="task_params"
        :key="form_params.query_params.tmp_id + 'a'"
        :hidden_datas="hidden_datas"
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
import TreeList from "@/components/CRUD/TreeList2.vue";
import { queryService, save } from "@/api/manage";
import { main } from "@/utils/mixin";
import SForm from "./Form";

export default {
  name: "Main_DemoTree",
  mixins: [main],
  components: {
    TreeList,
    SForm,
  },
  data() {
    return {
      // 整理一下params
      // list 查询参数
      query_params: [{ name: "输入框", code: "input" }],

      // list 列参数
      columns: [
        {
          title: "输入框",
          dataIndex: "input",
          sorter: true,
        },
        {
          title: "多选",
          dataIndex: "mul_selects",
          scopedSlots: { customRender: "mul_selects" },
        },
        {
          title: "当前节点",
          dataIndex: "step_name",
        },
        {
          title: "结论",
          dataIndex: "conclusion",
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
      this.draw_params.title = "示例流程";
      this.form_params.reRender = true;
      this.form_params.needId = true;
      this.hidden_datas = ["clc", "scId"];
      //this.form_params.needProcess = true;
      // this.task_params.open_task = true;
      this.path.apptree_path = this.get_path("/tree/get");
      this.tree_params.params = {
        table_name: "Demo_Tree",
        props: "o.id,o.input,o.sc_id",
      };

      queryService(this.path.apptree_path, {
        table_name: "sys_app_tree",
        other: 1,
      }).then((res) => {
        if (res.code === "400") {
          this.$notification.error({
            message: "参数错误",
            description: "请求出现错误，请联系管理员",
          });
        } else {
          this.prop_params.trees = res.result;
        }
      });
    },
    handle_save() {
      this.spinning = true;
      const that = this.$refs.sform.$refs.rform;
      save(that).then((val) => {
        if (val == 1) {
          this.onClose();
          this.$refs.slist.$refs.table.refresh(true);
        } else if (val == 2) {
          this.$refs.slist.$refs.table.refresh(true);
        }
        this.spinning = false;
      });
    },
    handle_lower(data) {
      this.edit_lower(data);
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
  z-index: 1000;
}
</style>

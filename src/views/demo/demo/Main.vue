<template>
  <div>
    <s-list
      :columns="columns"
      :query_params="query_params"
      @edit="edit"
      ref="slist"
      ><span slot="mul_selects" slot-scope="record">
        <template v-for="(item, i) in record.data.mul_selects">
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

          <a-button style="margin-left: 8px" @click="handle_view_image"
            >流程图</a-button
          >

          <a-button
            style="margin-left: 8px"
            @click="handle_save"
            type="primary"
            v-if="!form_params.readOnly"
            >保存</a-button
          >
          <template v-if="!form_params.readOnly">
            <a-button
              style="margin-left: 8px"
              @click="handle_submit_cxtj"
              type="danger"
              v-if="
                form_params.entity_datas != null &&
                form_params.entity_datas.step_id != null
              "
              >重新提交</a-button
            >
            <a-button
              style="margin-left: 8px"
              @click="handle_submit"
              type="danger"
              v-else
              >提交</a-button
            ></template
          ></a-spin
        >
      </div>
    </a-drawer>
  </div>
</template>

<script>
import SList from "@/components/CRUD/SList.vue";
import SForm from "./Form";
import { queryService, save, submit, submit_cxtj } from "@/api/manage";
import { main } from "@/utils/mixin";

export default {
  name: "Main_Demo",
  mixins: [main],
  components: {
    SList,
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
      this.form_params.needProcess = true;
      this.task_params.open_task = true;
      this.path.apptree_path = this.get_path("/tree/get");
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
          this.$refs.slist.refreshTable();
        } else if (val == 2) {
          this.$refs.slist.refreshTable();
        }
        this.spinning = false;
      });
    },
    handle_submit() {
      this.spinning = true;
      const that = this.$refs.sform.$refs.rform;
      submit(that).then((val) => {
        if (val == 1) {
          this.onClose();
          this.$refs.slist.refreshTable();
        }
        this.spinning = false;
      });
    },
    async handle_submit_cxtj() {
      const that = this.$refs.sform.$refs.rform;

      submit_cxtj(that, null, this.form_params.entity_datas.step_id, null).then(
        (val) => {
          if (val == 1) {
            this.onClose();
            this.$refs.slist.refreshTable();
          }
          this.spinning = false;
        }
      );
    },
    handle_view_image() {
      const that = this.$refs.sform.$refs.rform.$refs.processview;
      that.showDrawer();
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

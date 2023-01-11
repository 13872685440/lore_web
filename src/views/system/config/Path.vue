<template>
  <a-spin :spinning="spinning">
    <a-button
      type="primary"
      icon="plus"
      @click="$refs.createPath.add('')"
      v-action:SYS_ADMINISTRATOR
      v-if="!isview"
      >新建</a-button
    >
    <a-table
      :columns="columns"
      :dataSource="data"
      :pagination="false"
      :loading="spinning"
      ref="table"
    >
      <span
        slot="action"
        slot-scope="text, record"
        v-action:SYS_ADMINISTRATOR
        v-if="!isview"
      >
        <template>
          <a-divider type="vertical" />
          <a @click="$refs.createPath.add(record.key)">
            <a-icon type="edit" style="color: #69aa46" />
          </a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record.key)">
            <a-icon type="delete" style="color: #ff6347" />
          </a>
        </template>
      </span>
    </a-table>
    <create-path
      ref="createPath"
      @ok="handleOk"
    />
  </a-spin>
</template>
<script>
import CreatePath from "./modules/CreatePath";
import { queryService, toService } from "@/api/manage";

export default {
  name: "Form_Path",
  components: {
    CreatePath,
  },
  data() {
    return {
      spinning: true,
      columns: [
        {
          title: "key",
          dataIndex: "key",
        },
        {
          title: "路径",
          dataIndex: "path",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
      data: [],
      path: {},
    };
  },
  mounted() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.query_path = prefix + "/system/path/query_path";
    this.path.delete_path = prefix + "/system/path/delete_path";

    this.renderTable();
    this.spinning = false;
  },
  methods: {
    handleOk() {
      this.renderTable();
    },
    async renderTable() {
      await queryService(this.path.query_path, {
      }).then((res) => {
        this.data = res.result;
      });
    },
    handleDelete(name) {
      this.spinning = true;
      const that = this;
      const parameter = { id: name };
      this.$confirm({
        title: "提示",
        content: "真的要删除该记录吗 ?",
        onOk() {
          toService("post", that.path.delete_path, parameter).then((res) => {
            if (res.code === "200") {
              that.$notification.success({
                message: "删除成功",
                description: "",
              });
              that.renderTable();
            } else {
              that.$notification.error({
                message: "删除失败",
                description: res.result,
              });
            }
          });
        },
        onCancel() {},
      });
      this.spinning = false;
    },
  },
};
</script>

<style lang="less" scoped>
.ant-table-wrapper {
  padding-top: 10px;
}
</style>

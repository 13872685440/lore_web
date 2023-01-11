<template>
  <a-modal
    title="审核历史"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :footer="null"
  >
    <div v-if="comments.length > 0">
      <a-table
        :columns="columns"
        :dataSource="comments"
        :pagination="false"
        :loading="loading"
      ></a-table>
      <br /></div
  ></a-modal>
</template>
<script>
import { queryService } from "@/api/manage";

export default {
  props: {
    ebcn: {
      type: String,
    },
  },
  data() {
    return {
      comments: [],
      path: {},
      visible: false,
      loading: true,
      confirmLoading: false,
      id: "",
      columns: [
        {
          title: "办理节点",
          dataIndex: "shjd",
          key: "shjd",
        },
        {
          title: "办理时间",
          dataIndex: "shtime",
          key: "shtime",
        },
        {
          title: "办理结论",
          dataIndex: "shjl",
          key: "shjl",
        },
        {
          title: "办理意见",
          dataIndex: "shyj",
          key: "shyj",
        },
        {
          title: "办理机构",
          dataIndex: "shjgName",
          key: "shjgName",
        },
        {
          title: "办理人",
          dataIndex: "shr",
          key: "shr",
        },
      ],
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.comment_path = prefix + "/task/comments";
  },
  mounted() {},
  methods: {
    add(id) {
      this.id = id;

      queryService(this.path.comment_path, {
        id: id,
        bean_ebcn: this.ebcn,
      }).then((res) => {
        this.comments = res.result;
        this.loading = false;
      });
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>

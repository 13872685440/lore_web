<template>
  <div v-if="comments.length>0">
    <a-divider v-if="divider===0" />
    <a-table :columns="columns" :dataSource="comments" :pagination="false" :loading="loading"></a-table>
    <br />
  </div>
</template>
<script>
import { queryService } from "@/api/manage";

export default {
  props: {
    id: {
      type: String
    },
    ebcn: {
      type: String
    },
    divider: {
      type: Number
    }
  },
  data() {
    return {
      comments: [],
      path: {},
      loading: true,
      columns: [
        {
          title: "评论时间",
          dataIndex: "shtime",
          key: "shtime"
        },   
        {
          title: "意见",
          dataIndex: "shyj",
          key: "shyj"
        },
        {
          title: "评论人机构",
          dataIndex: "shjgName",
          key: "shjgName"
        },
        {
          title: "评论人",
          dataIndex: "shr",
          key: "shr"
        }
      ]
    };
  },
  created() {
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.path.comment_path = prefix + "/task/common_comments";
  },
  mounted() {
    queryService(this.path.comment_path, {
      id: this.id,
      bean_ebcn: this.ebcn
    }).then(res => {
      this.comments = res.result;
      this.loading = false;
    });
  }
};
</script>
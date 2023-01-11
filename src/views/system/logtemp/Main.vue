<template>
  <div>
    <s-list
      :columns="columns"
      :query_params="query_params"
      @edit="edit"
      ref="slist"
    >
    </s-list>
  </div>
</template>

<script>
import SList from "@/components/CRUD/SList.vue";
import { main } from "@/utils/mixin";

export default {
  name: "Main_Logtemp",
  mixins: [main],
  components: {
    SList,
  },
  data() {
    return {
      // 整理一下params
      // list 查询参数
      query_params: [{ name: "用户", code: "name" }],
      // list 列参数
      columns: [
        {
          title: "访问接口",
          dataIndex: "service",
        },
        {
          title: "访问用户",
          dataIndex: "userName",
        },
        {
          title: "访问时间",
          dataIndex: "date",
        },
        {
          title: "用户IP",
          dataIndex: "remoteAddr",
        },
        {
          title: "用户端口",
          dataIndex: "remotePort",
        },
      ],
    };
  },
  created() {},
  methods: {},
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

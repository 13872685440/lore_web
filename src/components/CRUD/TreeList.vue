<template>
  <a-card :bordered="false"
    ><a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="tree ? tree : []"
          :search="true"
          :expandedKeys.sync="expandedKeys"
          :selectedKeys.sync="selectedKeys"
          :autoExpandParent="autoExpandParent"
          :defaultExpandedKeys="defaultExpandedKeys"
          :searchValue="searchValue"
          @expand="onExpand"
          @select="select"
          @change="onChange"
          ref="tree"
        ></s-tree>
      </a-col>
      <a-col :span="19">
        <div class="table-page-search-wrapper">
          <a-form layout="inline" v-show="list_query_params != null">
            <a-row :gutter="48">
              <a-col
                :md="8"
                :sm="24"
                v-for="(item, i) in list_query_params"
                :key="i"
              >
                <a-form-item :label="item.name">
                  <a-input v-model="queryParam[item.code]" placeholder />
                </a-form-item>
              </a-col>
              <a-col :md="(!advanced && 8) || 24" :sm="24">
                <span
                  class="table-page-search-submitButtons"
                  :style="
                    (advanced && { float: 'right', overflow: 'hidden' }) || {}
                  "
                >
                  <a-button type="primary" @click="$refs.table.refresh(true)"
                    >查询</a-button
                  >
                  <a-button
                    style="margin-left: 8px"
                    @click="
                      () => {
                        queryParam = {};
                        $refs.table.refresh(true);
                      }
                    "
                    >重置</a-button
                  >
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table-operator"><slot name="ac_button"></slot></div>
        <s-table
          ref="table"
          size="default"
          :columns="columns"
          :data="loadData"
          :pageSize="pageSize"
        >
          <template
            v-for="item in columns"
            :slot="item.dataIndex"
            slot-scope="text, record"
          >
            <slot :name="item.dataIndex" :data="record"></slot> </template
          >><span slot="action" slot-scope="text, record"
            ><slot
              name="oper_action"
              :data="record"
            ></slot></span></s-table></a-col
    ></a-row>
  </a-card>
</template>
<script>
import { queryList, treeList, generateList } from "@/utils/mixin";
import { queryService, handle_delete } from "@/api/manage";
import { STable } from "@/components";
import STree from "@/components/Tree/STree.vue";

export default {
  components: { STable, STree },
  mixins: [queryList, treeList],
  props: {
    // list参数
    list_params: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 查询参数
    list_query_params: {
      type: Array,
    },
    // list 列参数
    list_columns: {
      type: Array,
    },
    // 树参数
    tree_params: {
      type: Object,
    },
  },
  data() {
    return {
      loadData: (parameter) => {
        this.handleIniTree();
        this.queryParam.code = this.code;
        parameter.params = this.queryParam;
        return queryService(this.path.query_path, parameter).then((res) => {
          return res.result;
        });
      },
    };
  },
  created() {
    this.init();
    this.init_tree();
  },
  methods: {
    handleIniTree() {
      if (this.code === "" && this.tree_params.searchCode != null) {
        this.code = this.searchCode;
      }
      queryService(this.path.tree_path, this.tree_params.params).then((res) => {
        this.tree = res.result;
        console.log("xxxxxxxxxxxxxxxx");
        console.log(this.tree);
        this.expandedKeys.push(this.code);
        this.selectedKeys.push(this.code);
        generateList(res.result, this.dataList);
      });
    },
    select(key) {
      this.code = key[0];
      this.selectedKeys = key;
      this.$refs.table.refresh(true);
    },
    refreshTable() {
      this.$refs.table.refresh(true);
    },
    handle_delete(id) {
      handle_delete(this, id, this.path.delete_path).then((val) => {
        if (val == 0) {
          this.refreshTable();
        }
      });
    },
  },
};
</script>

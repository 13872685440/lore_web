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
          <a-form layout="inline" v-show="hasQuery && query_params != null">
            <a-row :gutter="48">
              <a-col
                :md="8"
                :sm="24"
                v-for="(item, i) in query_params"
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
        <div class="table-operator">
          <a-button
            v-show="permission_map.canNew"
            type="primary"
            icon="plus"
            v-action="permission_map['add']"
            @click="handle_edit({}, false)"
            >新建</a-button
          ><slot name="ac_button"></slot>
        </div>
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
          ><span slot="action" slot-scope="text, record"
            ><slot name="action1" :data="record"></slot>
            <template v-action="permission_map['edit']"
              ><span
                v-show="
                  record.canEdit != null
                    ? record.canEdit
                    : permission_map.canEdit
                "
              >
                <a @click="handle_edit(record, false)" title="编辑">
                  <a-icon type="edit" style="color: #69aa46" />
                </a>
                <a-divider type="vertical"
              /></span>
            </template>
            <slot name="action2" :data="record"></slot>
            <template v-action="permission_map['view']"
              ><span
                v-show="
                  record.canView != null
                    ? record.canView
                    : permission_map.canView
                "
              >
                <a @click="handle_edit(record, true)" title="查看">
                  <a-icon type="eye" style="color: #46a3ff" />
                </a>
                <a-divider type="vertical"
              /></span>
            </template>
            <slot name="action3" :data="record"></slot>
            <template v-action="permission_map['delete']">
              <span
                v-show="
                  record.canDelete != null
                    ? record.canDelete
                    : permission_map.canDelete
                "
              >
                <a @click="handle_delete(record.id)">
                  <a-icon type="delete" style="color: #ff6347" title="删除" />
                </a>
                <a-divider type="vertical"
              /></span>
            </template>
            <slot name="action4" :data="record"></slot>
          </span> </s-table
        ><slot name="modal" :refreshTable="refreshTable"></slot></a-col
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
    // 系统参数，包含name_path
    sys_params: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // 打开list时传递的参数
    list_params: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // list 查询参数
    query_params: {
      type: Array,
    },
    // list 初始化参数
    init_params: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // list 操作权限
    oper_roles: {
      type: Object,
      default: function () {
        return {};
      },
    },
    // list 列参数
    columns: {
      type: Array,
    },
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
    if (this.tree_params.path_tree == null) {
      this.path.tree_path = this.get_path("/tree", "/get");
    } else {
      this.path.tree_path = this.tree_params.path_tree;
    }
  },
  methods: {
    handleIniTree() {
      if (this.code === "") {
        this.code = this.searchCode;
      }
      queryService(this.path.tree_path, this.tree_params.params).then((res) => {
        this.tree = res.result;
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

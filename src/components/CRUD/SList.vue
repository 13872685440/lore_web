<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline" v-show="list_query_params != null">
        <a-row :gutter="48">
          <template v-for="(item, i) in list_query_params">
            <a-col :md="item.md != null ? item.md : 8" :sm="24" :key="i">
              <a-form-item :label="item.name">
                <a-input
                  v-model="queryParam[item.code]"
                  placeholder
                  v-if="item.type === 'Input'"
                /><a-select
                  v-if="item.type === 'Select'"
                  size="default"
                  :allowClear="true"
                  :mode="item.mode"
                  placeholder="请选择"
                  v-model="queryParam[item.code]"
                >
                  <a-select-option
                    v-for="type in item.datas"
                    :key="type.id"
                    :value="type.id"
                    >{{ type.name }}</a-select-option
                  > </a-select
                ><span v-if="item.type === 'Date_Double'"
                  ><a-date-picker
                    style="width: 45%"
                    :format="item.format"
                    v-model="queryParam[item.code]" />
                  -
                  <a-date-picker
                    style="width: 45%"
                    :format="item.format"
                    v-model="queryParam[item.code1]" /></span
                ><span v-if="item.type === 'Date'"
                  ><a-date-picker
                    style="width: 100%"
                    :format="item.format"
                    v-model="queryParam[item.code]"
                  />
                </span>
                <slot
                  :name="item.code"
                  :queryParam="queryParam"
                  v-if="item.type === 'Slot'"
                ></slot>
              </a-form-item>
            </a-col>
          </template>
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
      <slot name="ac_button"></slot>
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
        ><slot name="oper_action" :data="record"></slot>
      </span>
    </s-table>
    <slot name="modal" :refreshTable="refreshTable"></slot>
  </a-card>
</template>
<script>
import { queryList } from "@/utils/mixin";
import { queryService, handle_delete } from "@/api/manage";
import { STable } from "@/components";
import moment from "moment";

export default {
  components: { STable },
  mixins: [queryList],
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
  },

  data() {
    return {
      loadData: (parameter) => {
        for (var key in this.init_params) {
          this.queryParam[key] = this.init_params[key];
        }
        if (this.list_query_params) {
          this.list_query_params.forEach((item) => {
            if (item.type == "Date") {
              if (this.queryParam[item.code]) {
                this.queryParam[item.code] = moment(
                  this.queryParam[item.code]
                ).format(item.format);
              }
            } else if (item.type == "Date_Double") {
              if (this.queryParam[item.code]) {
                this.queryParam[item.code] = moment(
                  this.queryParam[item.code]
                ).format(item.format);
              }
              if (this.queryParam[item.code1]) {
                this.queryParam[item.code1] = moment(
                  this.queryParam[item.code1]
                ).format(item.format);
              }
            }
          });
        }
        parameter.params = this.queryParam;
        return queryService(this.path.query_path, parameter).then((res) => {
          return res.result;
        });
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
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

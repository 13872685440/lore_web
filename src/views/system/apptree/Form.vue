<template>
  <x-form
    ref="rform"
    :form_params="form_params"
    :form_datas="form_datas"
    :service_path="service_path"
  >
    <template
      slot="forms"
      slot-scope="record"
      v-if="record.form.getFieldValue('ct') != null"
    >
      <a-card size="small">
        <span slot="title"
          >权限控制
          <a style="padding-left: 10px; color: red" @click="add('')"
            ><a-icon type="plus-circle" /></a
        ></span>
        <a-list
          itemLayout="vertical"
          size="small"
          :grid="{ gutter: 16, column: 4 }"
          :pagination="pagination"
          :dataSource="datas"
          v-if="datas != null && datas.length > 0"
          ref="_task"
        >
          <a-list-item slot="renderItem" slot-scope="item" key="item.id">
            <a-card>
              <span slot="title"> {{ item.oper }}</span>
              <span slot="extra"
                ><a @click="add(item)">编辑</a>
                <a
                  style="padding-left: 10px; color: red"
                  @click="deleteTable(item.id)"
                  >删除</a
                ></span
              >
              {{ item.role }}</a-card
            >
          </a-list-item>
        </a-list>
      </a-card>
      <modal-form
        ref="modal_form"
        :form_datas="modal_form_datas"
        :hidden_datas="modal_hidden_datas"
        :init_params="modal_init_params"
        :form_params="modal_form_params"
        @ok="initAppPers(record.form.getFieldValue('id'))"
      >
      </modal-form>
    </template>
  </x-form>
</template>
<script>
import XForm from "@/components/CRUD/XForm.vue";
import { col_3_frist, col_3_last, col_2_all } from "@/utils/style";
import ModalForm from "@/components/CRUD/ModalForm.vue";
import { queryService, handle_delete } from "@/api/manage";
export default {
  components: { XForm, ModalForm },
  name: "Form_Base",
  props: {
    // 打开form时传递的参数
    form_params: {
      type: Object,
    },
    // 属性参数,用来加载公共属性，如list，tree等
    prop_params: {
      type: Object,
    },
  },
  data() {
    return {
      service_path: {},
      form_datas: [
        [
          {
            label: "上级编码",
            prop: "scId",
            type: "Input",
            readOnly: true,
            styles: col_3_frist,
          },
          {
            label: "本级编码",
            prop: "clc",
            type: "Input",
            readOnly: true,
            styles: col_3_last,
          },
          {
            label: "完整编码",
            prop: "id",
            type: "Input",
            readOnly: true,
            styles: col_3_last,
          },
        ],
        [
          {
            label: "上级菜单",
            prop: "scName",
            type: "Input",
            readOnly: true,
            styles: col_3_frist,
          },
          {
            label: "菜单名称",
            prop: "name",
            type: "Input",
            rules: [
              { required: true, message: "请输入菜单名称", whitespace: true },
            ],
            styles: col_3_last,
          },
          {
            label: "排序",
            prop: "xh",
            type: "Input_Number",
            rules: [
              { type: "number", message: "请输入数字", whitespace: true },
            ],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "服务路径",
            prop: "path",
            type: "Input",
            styles: col_3_frist,
          },
          {
            label: "组件路径",
            prop: "component",
            type: "Input",
            styles: col_3_last,
          },
          {
            label: "多端渲染",
            prop: "multi_apes",
            placeholder: "请选择渲染在哪种终端",
            mode: "multiple",
            type: "Select",
            datas: [
              { id: "web", name: "web" },
              { id: "app", name: "app" },
            ],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "图标库(app)",
            prop: "fontFamily",
            type: "Input",
            styles: col_3_frist,
          },
          {
            label: "图标字体代码(app)",
            prop: "fontCode",
            type: "Input",
            styles: col_3_last,
          },
          {
            label: "图标背景颜色(app)",
            prop: "colorCode",
            type: "Input",
            styles: col_3_last,
          },
        ],
        [
          {
            label: "查询参数",
            prop: "query_params",
            type: "Input",
            styles: col_2_all,
          },
        ],
        [
          {
            label: "关联表",
            prop: "relational_table",
            type: "Input_Textarea",
            styles: col_2_all,
          },
        ],
      ],
      columns: [
        {
          title: "操作",
          dataIndex: "oper",
        },
        {
          title: "角色",
          dataIndex: "roles",
          scopedSlots: { customRender: "roles" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
      modal_form_datas: [
        {
          label: "应用名称",
          prop: "appName",
          rules: [
            { required: true, message: "请输入应用名称", whitespace: true },
          ],
          type: "Input",
          readOnly: true,
        },
        {
          label: "操作",
          prop: "oper",
          rules: [
            {
              required: true,
              message:
                "请输入操作（新增：add;修改：edit;查看：view;删除：delete）",
              whitespace: true,
            },
          ],
          type: "Input",
        },
        {
          label: "可操作角色",
          prop: "roles",
          placeholder: "请选择该操作关联角色",
          rules: [
            {
              message: "请选择该操作关联角色",
              whitespace: true,
              required: true,
              type: "array",
            },
          ],
          datas: this.prop_params.roles,
          mode: "multiple",
          type: "Select",
        },
      ],
      modal_hidden_datas: ["app"],
      modal_init_params: {
        needId: true,
        needBase: true,
        form_type: "yform",
        title: "权限控制",
        width: 800,
      },
      modal_form_params: {
        edit_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/apppermission/edit",
        query_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/apppermission/main",
        save_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/apppermission/save",
        delete_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/apppermission/delete",
      },
      datas: [],
      pagination: {
        size: 5,
      },
    };
  },
  created() {
    this.init();
    const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    if (this.form_params.type == "addlower") {
      this.service_path.edit_path = prefix + "/apptree/addlower";
    } else {
      this.service_path.edit_path = prefix + "/apptree/edit";
    }
    this.service_path.save_path = prefix + "/apptree/save";
  },
  mounted() {},
  methods: {
    async init() {
      if (this.form_params.entity_datas.ct != null) {
        this.initAppPers(this.form_params.entity_datas.id);
      }
    },
    async initAppPers(id) {
      await queryService(this.modal_form_params.query_path, {
        pageSize: -1,
        params: { app: id },
      }).then((res) => {
        this.datas = res.result.data;
        if (res.result.totalCount <= 5) {
          this.pagination = false;
        }
      });
    },
    add(record) {
      var that = this.$refs.rform;
      var data = {};
      if (record != "") {
        data = record;
      } else {
        data = {
          entity_datas: {
            app: that.form.getFieldValue("id"),
            appName: that.form.getFieldValue("name"),
          },
        };
      }
      this.$refs.modal_form.add(data);
    },
    async deleteTable(id) {
      handle_delete(this, id, this.modal_form_params.delete_path).then(
        (val) => {
          if (val == 0) {
            this.initAppPers();
          }
        }
      );
    },
  },
};
</script>
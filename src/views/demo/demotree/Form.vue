<template>
  <span>
    <x-form
      ref="rform"
      :form_params="form_params"
      :form_datas="xform_datas"
      :task_params="task_params"
      :hidden_datas="hidden_datas"
      ><a-select
        slot="slot_select"
        size="default"
        mode="default"
        @change="onChangeSlot"
        v-decorator="[
          'slot_select',
          { rules: [{ required: true, message: '请选择' }] },
        ]"
      >
        <a-select-option
          v-for="type in slot_select_datas"
          :key="type.id"
          :value="type.id"
          >{{ type.name }}</a-select-option
        >
      </a-select>
      <template
        slot="forms"
        slot-scope="record"
        v-if="record.form.getFieldValue('ct') != null"
        ><div style="padding-bottom: 50px">
          <a-card>
            <span slot="title"
              >弹出示例：<a
                style="padding-left: 10px; color: red"
                @click="add('')"
                ><a-icon type="plus-circle" /></a
            ></span>
            <a-table :columns="columns" :data-source="datas">
              <span slot="action" slot-scope="text, record"
                ><a @click="add(record)" title="编辑">
                  <a-icon type="edit" style="color: #69aa46" />
                </a>
                <a-divider type="vertical" />
                <a @click="deleteTable(record.id)">
                  <a-icon
                    type="delete"
                    style="color: #ff6347"
                    title="删除"
                  /> </a
              ></span>
            </a-table>
          </a-card>
        </div>
        <modal-form
          ref="modal_form"
          :form_datas="modal_form_datas"
          :hidden_datas="modal_hidden_datas"
          :init_params="modal_init_params"
          :form_params="modal_form_params"
          @ok="initDemos(record.form.getFieldValue('id'))"
          ><a-select
            slot="slot_select"
            size="default"
            mode="default"
            :disabled="readOnly ? readOnly : false"
            @change="onChangeSlot"
            v-decorator="[
              'slot_select',
              { rules: [{ required: true, message: '请选择' }] },
            ]"
          >
            <a-select-option
              v-for="type in slot_select_datas"
              :key="type.id"
              :value="type.id"
              >{{ type.name }}</a-select-option
            >
          </a-select>
        </modal-form>
      </template>
    </x-form>
  </span>
</template>
<script>
import XForm from "@/components/CRUD/XForm.vue";
import { queryService, handle_delete } from "@/api/manage";
import ModalForm from "@/components/CRUD/ModalForm.vue";
import {
  col_3_frist,
  col_3_last,
  col_2_all,
  col_3_last_two,
  col_3_frist_two,
  col_2_frist,
  col_2_last,
} from "@/utils/style";
export default {
  components: { XForm, ModalForm },
  name: "Form_Demo",
  props: {
    // 打开form时传递的参数
    form_params: {
      type: Object,
    },
    // 属性参数,用来加载公共属性，如list，tree等
    prop_params: {
      type: Object,
    },
    // 隐藏参数
    hidden_datas: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // 流程属性
    task_params: { type: Object },
  },
  data() {
    return {
      form_prop_params: {},
      xform_datas: [
        [
          {
            label: "输入框",
            prop: "input",
            type: "Input",
            rules: [{ required: true, message: "请输入", whitespace: true }],
            styles: col_3_frist,
          },
          {
            label: "数字输入框",
            prop: "inputNumber",
            type: "Input_Number",
            rules: [{ required: true, message: "请输入" }],
            styles: col_3_last,
          },
          {
            label: "密码输入框",
            prop: "pwd",
            type: "Input_Password",
            rules: [{ required: true, message: "请输入", whitespace: true }],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "多行输入框",
            prop: "textarea",
            rules: [{ required: true, message: "请输入", whitespace: true }],
            type: "Input_Textarea",
            rows: 4,
            styles: col_2_all,
          },
        ],
        [
          {
            label: "时间选择（yyyymmdd）",
            prop: "yymmdd",
            rules: [{ required: true, message: "请选择时间" }],
            type: "Date",
            format: "YYYY-MM-DD",
            styles: col_3_frist,
          },
          {
            label: "时间选择（yymmddhhmmss）",
            prop: "yymmddhhmmss",
            rules: [{ required: true, message: "请选择时间" }],
            type: "Date",
            format: "YYYY-MM-DD HH:mm:ss",
            styles: col_3_last,
          },
        ],
        [
          {
            label: "选择器（单选）",
            prop: "sim_select",
            rules: [{ required: true, message: "请选择" }],
            type: "Select",
            mode: "default",
            datas: [
              { id: "111", name: "111" },
              { id: "222", name: "222" },
            ],
            styles: col_3_frist,
          },
          {
            label: "选择器（Slot）",
            prop: "slot_select",
            type: "Slot",
            styles: col_3_last_two,
          },
        ],
        [
          {
            label: "选择器（多选）",
            prop: "mul_selects",
            rules: [{ required: true, message: "请选择" }],
            type: "Select",
            mode: "multiple",
            datas: [
              { id: "111", name: "111" },
              { id: "222", name: "222" },
            ],
            styles: col_3_frist_two,
          },
        ],
        [
          {
            label: "树（单选）",
            prop: "sim_tree",
            rules: [{ required: true, message: "请选择" }],
            type: "Tree_Simple",
            datas: this.prop_params.trees,
            styles: col_2_frist,
          },
          {
            label: "树（多选）",
            prop: "mul_trees",
            rules: [{ required: true, message: "请选择" }],
            type: "Tree_Multiple",
            datas: this.prop_params.trees,
            styles: col_2_last,
          },
        ],
        [
          {
            label: "单选框",
            prop: "radio",
            rules: [
              {
                required: true,
                message: "请选择",
                whitespace: true,
              },
            ],
            type: "Radio",
            datas: [
              { id: "111", name: "111" },
              { id: "222", name: "222" },
            ],
            styles: col_3_frist,
          },
          {
            label: "开关",
            prop: "switch_sel",
            type: "Switch",
            switch_value: {
              open: "开",
              close: "关",
            },
            styles: col_3_last,
          },
          {
            label: "是否",
            prop: "checkbox_b",
            type: "Checkbox",
            styles: col_3_last,
          },
        ],
        [
          {
            label: "多选checkbox",
            prop: "checkboxs",
            type: "CheckboxGroup",
            rules: [
              {
                required: true,
                message: "请选择",
              },
            ],
            datas: [
              {
                label: "111",
                value: "111",
              },
              {
                label: "222",
                value: "222",
              },
            ],
            styles: col_3_frist_two,
          },
          {
            label: "评分",
            prop: "rate",
            type: "Rate",
            rules: [{ required: true, message: "请选择" }],
            allowHalf: true,
            count: 10,
            styles: col_3_last,
          },
        ],
        [
          {
            label: "上传文件",
            prop: "a1",
            type: "UploadFile",
            datas: {
              ebcn: "com.cat.demo.model.Demo",
              sign: "A1",
            },
            styles: col_2_frist,
          },
          {
            label: "上传文件2",
            prop: "a2",
            type: "UploadFile",
            datas: {
              ebcn: "com.cat.demo.model.Demo",
              sign: "A2",
            },
            styles: col_2_last,
          },
        ],
        [
          {
            label: "上传图片",
            prop: "i1",
            type: "UploadImg",
            datas: {
              ebcn: "com.cat.demo.model.Demo",
              sign: "I1",
            },
            styles: col_2_all,
          },
        ],
      ],
      slot_select_datas: [
        { id: "111", name: "111" },
        { id: "222", name: "222" },
      ],
      form_type: 1,
      path: {},
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
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
      modal_form_datas: [
        [
          {
            label: "demo_tree",
            prop: "demo_tree_input",
            rules: [{ required: true, message: "请输入", whitespace: true }],
            type: "Input",
            readOnly: true,
            styles: col_3_frist,
          },
        ],
        [
          {
            label: "输入框",
            prop: "input",
            type: "Input",
            rules: [{ required: true, message: "请输入", whitespace: true }],
            styles: col_3_frist,
          },
          {
            label: "数字输入框",
            prop: "inputNumber",
            type: "Input_Number",
            rules: [{ required: true, message: "请输入" }],
            styles: col_3_last,
          },
          {
            label: "密码输入框",
            prop: "pwd",
            type: "Input_Password",
            rules: [{ required: true, message: "请输入", whitespace: true }],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "多行输入框",
            prop: "textarea",
            rules: [{ required: true, message: "请输入", whitespace: true }],
            type: "Input_Textarea",
            rows: 4,
            styles: col_2_all,
          },
        ],
        [
          {
            label: "时间选择（yyyymmdd）",
            prop: "yymmdd",
            rules: [{ required: true, message: "请选择时间" }],
            type: "Date",
            format: "YYYY-MM-DD",
            styles: col_3_frist,
          },
          {
            label: "时间选择（yymmddhhmmss）",
            prop: "yymmddhhmmss",
            rules: [{ required: true, message: "请选择时间" }],
            type: "Date",
            format: "YYYY-MM-DD HH:mm:ss",
            styles: col_3_last,
          },
        ],
        [
          {
            label: "选择器（单选）",
            prop: "sim_select",
            rules: [{ required: true, message: "请选择" }],
            type: "Select",
            mode: "default",
            datas: [
              { id: "111", name: "111" },
              { id: "222", name: "222" },
            ],
            styles: col_3_frist,
          },
          {
            label: "选择器（Slot）",
            prop: "slot_select",
            type: "Slot",
            styles: col_3_last_two,
          },
        ],
        [
          {
            label: "选择器（多选）",
            prop: "mul_selects",
            rules: [{ required: true, message: "请选择" }],
            type: "Select",
            mode: "multiple",
            datas: [
              { id: "111", name: "111" },
              { id: "222", name: "222" },
            ],
            styles: col_3_frist_two,
          },
        ],
        [
          {
            label: "树（单选）",
            prop: "sim_tree",
            rules: [{ required: true, message: "请选择" }],
            type: "Tree_Simple",
            datas: this.prop_params.trees,
            styles: col_2_frist,
          },
          {
            label: "树（多选）",
            prop: "mul_trees",
            rules: [{ required: true, message: "请选择" }],
            type: "Tree_Multiple",
            datas: this.prop_params.trees,
            styles: col_2_last,
          },
        ],
        [
          {
            label: "单选框",
            prop: "radio",
            rules: [
              {
                required: true,
                message: "请选择",
                whitespace: true,
              },
            ],
            type: "Radio",
            datas: [
              { id: "111", name: "111" },
              { id: "222", name: "222" },
            ],
            styles: col_3_frist,
          },
          {
            label: "开关",
            prop: "switch_sel",
            type: "Switch",
            switch_value: {
              open: "开",
              close: "关",
            },
            styles: col_3_last,
          },
          {
            label: "是否",
            prop: "checkbox_b",
            type: "Checkbox",
            styles: col_3_last,
          },
        ],
        [
          {
            label: "多选checkbox",
            prop: "checkboxs",
            type: "CheckboxGroup",
            rules: [
              {
                required: true,
                message: "请选择",
              },
            ],
            datas: [
              {
                label: "111",
                value: "111",
              },
              {
                label: "222",
                value: "222",
              },
            ],
            styles: col_3_frist_two,
          },
          {
            label: "评分",
            prop: "rate",
            type: "Rate",
            rules: [{ required: true, message: "请选择" }],
            allowHalf: true,
            count: 10,
            styles: col_3_last,
          },
        ],
        [
          {
            label: "上传文件",
            prop: "a1",
            type: "UploadFile",
            datas: {
              ebcn: "com.cat.demo.model.Demo",
              sign: "A1",
            },
            styles: col_2_frist,
          },
          {
            label: "上传文件2",
            prop: "a2",
            type: "UploadFile",
            datas: {
              ebcn: "com.cat.demo.model.Demo",
              sign: "A2",
            },
            styles: col_2_last,
          },
        ],
        [
          {
            label: "上传图片",
            prop: "i1",
            type: "UploadImg",
            datas: {
              ebcn: "com.cat.demo.model.Demo",
              sign: "I1",
            },
            styles: col_2_all,
          },
        ],
      ],
      modal_hidden_datas: ["demo_tree_id"],
      modal_init_params: {
        needId: true,
        needBase: true,
        form_type: "xform",
        title: "步骤条件",
        width: 1200,
      },
      modal_form_params: {
        edit_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/demo/edit",
        query_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/demo/main",
        save_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/demo/save",
        delete_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/demo/delete",
      },
      datas: [],
      pagination: {
        size: 5,
      },
    };
  },
  created() {
    this.form_prop_params.save_path = this.get_path("/demo/save");
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
        this.xform_datas[5][0].datas = res.result;
        this.xform_datas[5][1].datas = res.result;
      }
    });
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      if (this.form_params.entity_datas.ct != null) {
        this.initDemos(this.form_params.entity_datas.id);
      }
    },
    onChangeSlot(e) {
      console.log("onChangeSlot" + e);
    },
    get_path(path) {
      return "/" + this.GLOBAL.MODEL_SYSTEM + path;
    },
    async initDemos(id) {
      await queryService(this.modal_form_params.query_path, {
        demo_tree_id: id,
      }).then((res) => {
        this.datas = res.result.data;
        if (res.result.length <= 5) {
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
            demo_tree_id: that.form.getFieldValue("id"),
            demo_tree_input: that.form.getFieldValue("input"),
          },
        };
      }
      this.$refs.modal_form.add(data);
    },
    async deleteTable(id) {
      var that = this.$refs.rform;
      handle_delete(this, id, this.modal_form_params.delete_path).then(
        (val) => {
          if (val == 0) {
            this.initDemos(that.form.getFieldValue("id"));
          }
        }
      );
    },
  },
};
</script>
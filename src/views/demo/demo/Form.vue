<template>
  <span
    ><a-radio-group v-model="form_type">
      <a-radio :value="1"> 一行多列 </a-radio>
      <a-radio :value="2"> 一行一列 </a-radio>
    </a-radio-group>
    <x-form
      ref="rform"
      v-if="form_type == 1"
      :form_params="form_params"
      :form_datas="xform_datas"
      :task_params="task_params"
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
    </x-form>
    <y-form
      ref="rform"
      v-if="form_type == 2"
      :form_params="form_params"
      :form_datas="yform_datas"
      :task_params="task_params"
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
    </y-form>
  </span>
</template>
<script>
import YForm from "@/components/CRUD/YForm.vue";
import XForm from "@/components/CRUD/XForm.vue";
import { queryService } from "@/api/manage";
import {
  col_3_frist,
  col_3_last,
  col_2_all,
  col_3_last_two,
  col_3_frist_two,
  col_2_frist,
  col_2_last,
} from "@/utils/style";
const style_col = {
  labelCol: { lg: { span: 7 }, sm: { span: 7 } },
  wrapperCol: { lg: { span: 7 }, sm: { span: 7 } },
};
export default {
  components: { XForm, YForm },
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
      yform_datas: [
        {
          label: "输入框",
          prop: "input",
          rules: [{ required: true, message: "请输入", whitespace: true }],
          type: "Input",
          style_col: {
            labelCol: { lg: { span: 7 }, sm: { span: 7 } },
            wrapperCol: { lg: { span: 12 }, sm: { span: 12 } },
          },
        },
        {
          label: "数字输入框",
          prop: "inputNumber",
          rules: [{ required: true, message: "请输入" }],
          type: "Input_Number",
          style_col: style_col,
        },
        {
          label: "密码输入框",
          prop: "pwd",
          rules: [{ required: true, message: "请输入", whitespace: true }],
          type: "Input_Password",
          style_col: style_col,
        },
        {
          label: "多行输入框",
          prop: "textarea",
          rules: [{ required: true, message: "请输入", whitespace: true }],
          type: "Input_Textarea",
          rows: 4,
          style_col: style_col,
        },
        {
          label: "时间选择（yyyymmdd）",
          prop: "yymmdd",
          rules: [{ required: true, message: "请选择时间" }],
          type: "Date",
          format: "YYYY-MM-DD",
          style_col: style_col,
        },
        {
          label: "时间选择（yymmddhhmmss）",
          prop: "yymmddhhmmss",
          rules: [{ required: true, message: "请选择时间" }],
          type: "Date",
          format: "YYYY-MM-DD HH:mm:ss",
          style_col: style_col,
        },
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
          style_col: style_col,
        },
        {
          label: "选择器（Slot）",
          prop: "slot_select",
          type: "Slot",
          style_col: style_col,
        },
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
          style_col: style_col,
        },
        {
          label: "树（单选）",
          prop: "sim_tree",
          rules: [{ required: true, message: "请选择" }],
          type: "Tree_Simple",
          datas: this.prop_params.trees,
          style_col: style_col,
        },
        {
          label: "树（多选）",
          prop: "mul_trees",
          rules: [{ required: true, message: "请选择" }],
          type: "Tree_Multiple",
          datas: this.prop_params.trees,
          style_col: style_col,
        },
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
          style_col: style_col,
        },
        {
          label: "开关",
          prop: "switch_sel",
          type: "Switch",
          switch_value: {
            open: "开",
            close: "关",
          },
          style_col: style_col,
        },
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
          style_col: style_col,
        },
        {
          label: "是否",
          prop: "checkbox_b",
          type: "Checkbox",
          style_col: style_col,
        },
        {
          label: "评分",
          prop: "rate",
          type: "Rate",
          rules: [{ required: true, message: "请选择" }],
          allowHalf: true,
          count: 10,
          style_col: style_col,
        },
        {
          label: "上传文件",
          prop: "a1",
          type: "UploadFile",
          datas: {
            ebcn: "com.cat.demo.model.Demo",
            sign: "A1",
          },
          style_col: style_col,
        },
        {
          label: "上传文件2",
          prop: "a2",
          type: "UploadFile",
          datas: {
            ebcn: "com.cat.demo.model.Demo",
            sign: "A2",
          },
          style_col: style_col,
        },
        {
          label: "上传图片",
          prop: "i1",
          type: "UploadImg",
          datas: {
            ebcn: "com.cat.demo.model.Demo",
            sign: "I1",
          },
          style_col: style_col,
        },
      ],
      form_type: 1,
      path: {},
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
  },
  mounted() {},
  methods: {
    onChangeSlot(e) {
      console.log("onChangeSlot" + e);
    },
    get_path(path) {
      return "/" + this.GLOBAL.MODEL_SYSTEM + path;
    },
  },
};
</script>
<template>
  <x-form
    ref="rform"
    :form_params="form_params"
    :form_datas="form_datas"
    :hidden_datas="hidden_datas"
    :service_path="service_path"
  >
    <a-select
      slot="shr_type"
      size="default"
      @change="changeshr_type"
      v-decorator="[
        'shr_type',
        {
          rules: [{ required: true, message: '请选择' }],
        },
      ]"
    >
      <a-select-option key="1" value="1">用户</a-select-option>
      <a-select-option key="2" value="2">岗位角色</a-select-option>
      <a-select-option key="3" value="3">领导角色</a-select-option>
      <a-select-option key="4" value="4">其他</a-select-option
      ><a-select-option key="4" value="5">会签</a-select-option>
    </a-select>
    <a-tree-select
      slot="user_s"
      :treeData="prop_params.users"
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      placeholder="请选择"
      allowClear
      multiple
      v-decorator="[
        'user_s',
        {
          rules: [
            { required: shr_type_v == '1' ? true : false, message: '请选择' },
          ],
        },
      ]"
    ></a-tree-select>
    <a-select
      slot="role_s"
      size="default"
      mode="multiple"
      :placeholder="请选择"
      v-decorator="[
        'role_s',
        {
          rules: [
            { required: shr_type_v == '2' ? true : false, message: '请选择' },
          ],
        },
      ]"
    >
      <a-select-option
        v-for="type in prop_params.roles"
        :key="type.id"
        :value="type.id"
        >{{ type.name }}</a-select-option
      >
    </a-select>
    <a-select
      slot="ld_role_s"
      size="default"
      mode="multiple"
      :placeholder="请选择"
      v-decorator="[
        'ld_role_s',
        {
          rules: [
            { required: shr_type_v == '3' ? true : false, message: '请选择' },
          ],
        },
      ]"
    >
      <a-select-option
        v-for="type in prop_params.ld_roles"
        :key="type.id"
        :value="type.id"
        >{{ type.name }}</a-select-option
      >
    </a-select>
    <a-select
      slot="role_type"
      size="default"
      @change="changerole_type"
      v-decorator="[
        'role_type',
        {
          rules: [
            { required: shr_type_v == '2' ? true : false, message: '请选择' },
          ],
        },
      ]"
    >
      <a-select-option key="1" value="1">上级部门</a-select-option>
      <a-select-option key="2" value="2">本级部门</a-select-option>
      <a-select-option key="3" value="3">指定部门</a-select-option>
      <a-select-option key="4" value="4">不指定部门</a-select-option>
    </a-select>
    <a-tree-select
      slot="organ_s"
      :treeData="prop_params.organs"
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      placeholder="请选择"
      allowClear
      multiple
      treeDefaultExpandAll
      v-decorator="[
        'organ_s',
        {
          rules: [
            {
              required: shr_type_v == '2' && role_type_v == '3' ? true : false,
              message: '请选择',
            },
          ],
        },
      ]"
    ></a-tree-select>
    <template
      slot="forms"
      slot-scope="record"
      v-if="record.form.getFieldValue('ct') != null"
    >
      <a-card size="small">
        <span slot="title"
          >步骤条件
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
          <a-list-item slot="renderItem" slot-scope="record" :key="record.id">
            <a-card>
              <span slot="title" :style="{ color: record.color }">
                {{ record.name }}</span
              >
              <span slot="extra"
                ><a @click="add(record)">编辑</a>
                <a
                  style="padding-left: 10px; color: red"
                  @click="deleteTable(record.id)"
                  >删除</a
                ></span
              >

              <a-row :gutter="16">
                <a-col :span="10" style="text-align-last: justify"
                  >下一步节点:</a-col
                >
                <a-col :span="8">{{ record.next_step_name }} </a-col> </a-row
              ><a-row :gutter="16">
                <a-col :span="10" style="text-align-last: justify">结论:</a-col>
                <a-col :span="10">{{ record.conclusion }}</a-col> </a-row
              ><a-row :gutter="16">
                <a-col :span="10" style="text-align-last: justify">排序:</a-col>
                <a-col :span="10">{{ record.xh }}</a-col>
              </a-row>
            </a-card>
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
import { col_3_frist, col_3_last } from "@/utils/style";
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
      shr_type_v: "",
      role_type_v: "",
      hidden_datas: ["clc", "scId"],
      form_datas: [
        [
          {
            label: "本级编码",
            prop: "id",
            type: "Input",
            styles: col_3_frist,
          },
          {
            label: "流程名称",
            prop: "scName",
            type: "Input",
            readOnly: true,
            styles: col_3_last,
          },
          {
            label: "超时时间",
            prop: "time_out",
            type: "Input_Number",
            rules: [
              {
                type: "number",
                message: "请输入超时时间",
                whitespace: true,
              },
            ],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "节点名称",
            prop: "name",
            type: "Input",
            rules: [
              { required: true, message: "请输入节点名称", whitespace: true },
            ],
            styles: col_3_frist,
          },
          {
            label: "组件路径",
            prop: "component",
            type: "Input",
            styles: col_3_last,
          },
          {
            label: "步骤",
            prop: "step",
            type: "Input_Number",
            rules: [
              {
                required: true,
                type: "number",
                message: "请输入步骤",
                whitespace: true,
              },
            ],
            styles: col_3_last,
          },
        ],
        [
          {
            label: "步骤审核人类型",
            prop: "shr_type",
            type: "Slot",
            styles: col_3_frist,
          },
          {
            label: "选择该步骤审核人",
            prop: "user_s",
            type: "Slot",
            show: false,
            styles: col_3_last,
          },
        ],
        [
          {
            label: "选择角色",
            prop: "ld_role_s",
            type: "Slot",
            show: false,
            styles: col_3_frist,
          },
          {
            label: "选择该步骤审核角色",
            prop: "role_s",
            type: "Slot",
            show: false,
            styles: col_3_frist,
          },
          {
            label: "审核角色类型",
            prop: "role_type",
            type: "Slot",
            show: false,
            styles: col_3_last,
          },
          {
            label: "关联机构",
            prop: "organ_s",
            type: "Slot",
            show: false,
            styles: col_3_last,
          },
        ],
      ],

      modal_form_datas: [
        {
          label: "步骤",
          prop: "step_name",
          rules: [{ required: true, message: "请输入步骤", whitespace: true }],
          type: "Input",
          readOnly: true,
        },
        {
          label: "条件名",
          prop: "name",
          rules: [
            { required: true, message: "请输入条件名", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "结论",
          prop: "conclusion",
          rules: [{ required: true, message: "请输入结论", whitespace: true }],
          type: "Input",
        },
        {
          label: "指向节点",
          prop: "to_next",
          rules: [{ required: true, message: "请输入指向节点" }],
          type: "Input_Number",
        },
        {
          label: "是否需要填写意见",
          prop: "showYj",
          rules: [{ required: true, message: "请选择是否需要填写意见" }],
          type: "Select",
          mode: "default",
          datas: [
            { id: "0", name: "不填写意见" },
            { id: "1", name: "可填写意见" },
            { id: "2", name: "意见必填" },
          ],
        },
        {
          label: "排序",
          prop: "xh",
          type: "Input_Number",
        },
        {
          label: "按钮颜色",
          prop: "color",
          rules: [{ message: "请输入按钮颜色", whitespace: true }],
          type: "Input",
        },
      ],
      modal_hidden_datas: ["step_id"],
      modal_init_params: {
        needId: true,
        needBase: true,
        form_type: "yform",
        title: "步骤条件",
        width: 800,
      },
      modal_form_params: {
        edit_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/stepcondition/edit",
        query_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/stepcondition/get",
        save_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/stepcondition/save",
        delete_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/stepcondition/delete",
      },
      datas: [],
      pagination: {
        size: 5,
      },
    };
  },
  created() {
    this.init();
    //const prefix = "/" + this.GLOBAL.MODEL_SYSTEM;
    this.service_path.edit_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/processstep/addlower";
  },
  mounted() {},
  methods: {
    async init() {
      if (this.form_params.entity_datas.ct != null) {
        this.initAppPers(this.form_params.entity_datas.id);

        this.changeshr_type(this.form_params.entity_datas.shr_type);

        if (this.form_params.entity_datas.shr_type == "2") {
          this.changerole_type(this.form_params.entity_datas.role_type);
        }
      }
    },
    async initAppPers(id) {
      await queryService(this.modal_form_params.query_path, {
        step_id: id,
      }).then((res) => {
        this.datas = res.result;
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
            step_id: that.form.getFieldValue("id"),
            step_name: that.form.getFieldValue("name"),
          },
        };
      }
      this.$refs.modal_form.add(data);
    },
    async deleteTable(id) {
      handle_delete(this, id, this.modal_form_params.delete_path).then(
        (val) => {
          if (val == 0) {
            this.initAppPers(this.form_params.entity_datas.id);
          }
        }
      );
    },
    changeshr_type(v) {
      this.shr_type_v = v;
      if (v == "1") {
        this.form_datas[2][1].show = true;
        this.form_datas[3][0].show = false;
        this.form_datas[3][1].show = false;
        this.form_datas[3][2].show = false;
        this.form_datas[3][3].show = false;
      } else if (v == "2") {
        this.form_datas[2][1].show = false;
        this.form_datas[3][0].show = false;
        this.form_datas[3][1].show = true;
        this.form_datas[3][2].show = true;
        // this.form_datas[3][2].hidden = true;
      } else if (v == "3") {
        this.form_datas[2][1].show = false;
        this.form_datas[3][0].show = true;
        this.form_datas[3][1].show = false;
        this.form_datas[3][2].show = true;
      } else {
        this.form_datas[2][1].show = false;
        this.form_datas[3][0].show = false;
        this.form_datas[3][1].show = false;
        this.form_datas[3][2].show = false;
        this.form_datas[3][3].show = false;
      }
    },
    changerole_type(v) {
      this.role_type_v = v;
      if (v == "3") {
        this.form_datas[3][3].show = true;
      } else {
        this.form_datas[3][3].show = false;
      }
    },
  },
};
</script>
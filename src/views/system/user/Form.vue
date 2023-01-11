<template>
  <y-form ref="rform" :form_params="form_params" :form_datas="form_datas"
    ><a-input
      :readOnly="true"
      v-decorator="['radom']"
      slot="radom"
      slot-scope="record"
    >
      <a-icon
        slot="addonAfter"
        type="reload"
        style="color: red; cursor: pointer"
        @click="reset(record.form)"
        v-show="
          form_params.query_params.id != null &&
          form_params.query_params.id != ''
        "
      />
    </a-input>
    <template
      slot="forms"
      slot-scope="record"
      v-if="
        record.form.getFieldValue('ct') != null &&
        record.form.getFieldValue('ct') != ''
      "
    >
      <a-card size="small">
        <span slot="title"
          >任职部门
          <a
            style="padding-left: 10px; color: red"
            @click="add('')"
            v-show="!form_params.readOnly"
            ><a-icon type="plus-circle" /></a
        ></span>
        <a-table
          :columns="modal_columns"
          :data-source="datas"
          :pagination="pagination"
          ><span slot="isleaf" slot-scope="record">
            <span v-if="record.isleaf == 'LF001'">在职</span
            ><span v-if="record.isleaf == 'LF002'">兼职</span
            ><span v-if="record.isleaf == 'LF003'">离职</span>
          </span>
          <span
            slot="action"
            slot-scope="record"
            v-show="!form_params.readOnly"
          >
            <a title="编辑">
              <a-icon type="edit" style="color: #69aa46" @click="add(record)" />
            </a>
            <a-divider type="vertical" />
            <a>
              <a-icon
                type="delete"
                style="color: #ff6347"
                title="删除"
                @click="deleteTable(record.id)"
              /> </a
          ></span>
        </a-table>
      </a-card>
      <modal-form
        ref="modal_form"
        :form_datas="modal_form_datas"
        :hidden_datas="modal_hidden_datas"
        :init_params="modal_init_params"
        :form_params="modal_form_params"
        @ok="initAppPers(record.form.getFieldValue('id'))"
      >
        <a-tree-select
          slot="organId"
          :treeData="prop_params.orgs"
          :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
          allowClear
          treeDefaultExpandAll
          @change="onChangeRole"
          v-decorator="[
            'organId',
            {
              rules: [{ required: true, message: '请选择任职部门' }],
            },
          ]"
        ></a-tree-select
        ><a-checkbox-group
          slot="roles"
          v-decorator="['role_ls']"
          :options="role_s"
        />
      </modal-form>
    </template>
  </y-form>
</template>
<script>
import YForm from "@/components/CRUD/YForm.vue";
import ModalForm from "@/components/CRUD/ModalForm.vue";
import { queryService, toService } from "@/api/manage";
export default {
  components: { YForm, ModalForm },
  name: "Form_User",
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
      form_datas: [
        {
          label: "姓名",
          prop: "name",
          rules: [{ required: true, message: "请输入姓名", whitespace: true }],
          type: "Input",
        },
        {
          label: "手机号码",
          prop: "phone",
          rules: [
            { required: true, message: "请输入手机号码", whitespace: true },
          ],
          type: "Input",
        },
        {
          label: "排序",
          prop: "xh",
          rules: [{ required: true, message: "请输入数字" }],
          type: "Input_Number",
        },
        {
          label: "重置密码",
          prop: "radom",
          type: "Slot",
        },
        {
          label: "领导角色",
          prop: "role_ls",
          type: "CheckboxGroup",
          datas: this.prop_params.ld_roles,
        },
      ],
      modal_form_datas: [
        {
          label: "姓名",
          prop: "userName",
          rules: [{ required: true, message: "请输入姓名", whitespace: true }],
          type: "Input",
          readOnly: true,
        },
        {
          label: "任职部门",
          prop: "organId",
          type: "Slot",
        },
        {
          label: "职务",
          prop: "duty",
          type: "Input",
        },
        {
          label: "任职状态",
          prop: "isleaf",
          rules: [
            {
              required: true,
              message: "请选择任职状态",
              whitespace: true,
            },
          ],
          type: "Radio",
          datas: [
            { id: "LF001", name: "在职" },
            { id: "LF002", name: "兼职" },
            { id: "LF003", name: "离职" },
          ],
        },
        {
          label: "关联角色",
          prop: "roles",
          type: "Slot",
        },
      ],
      modal_columns: [
        {
          title: "部门",
          dataIndex: "organName",
          key: "organName",
        },
        {
          title: "职务",
          dataIndex: "duty",
          key: "duty",
        },
        {
          title: "任职状态",
          dataIndex: "",
          key: "1",
          scopedSlots: { customRender: "isleaf" },
        },
        {
          title: "角色",
          dataIndex: "price",
          key: "2",
        },
        {
          title: "操作",
          dataIndex: "",
          key: "x",
          scopedSlots: { customRender: "action" },
        },
      ],
      modal_hidden_datas: ["userId"],
      modal_init_params: {
        needId: true,
        needBase: true,
        form_type: "yform",
        title: "任职部门",
        width: 800,
      },
      modal_form_params: {
        edit_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/edit",
        query_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/main",
        save_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/save",
        delete_path: "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/delete",
      },
      path: {},
      role_s: [],
      datas: [],
      pagination: {
        size: 10,
      },
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    reset(form) {
      const parameter = {
        id: this.form_params.query_params.id,
      };
      const that = this;
      this.$confirm({
        title: "提示",
        content: "真的要重置密码吗 ?",
        onOk() {
          toService(
            "post",
            "/" + that.GLOBAL.MODEL_SYSTEM + "/user/reset",
            parameter
          ).then((res) => {
            form.setFieldsValue(res.result);
            that.$notification.success({
              message: "密码重置成功",
              description: "密码重置成功",
            });
          });
        },
        onCancel() {},
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
            userId: that.form.getFieldValue("id"),
            userName: that.form.getFieldValue("name"),
          },
        };
      }
      this.$refs.modal_form.add(data);
    },
    async onChangeRole(e) {
      await queryService(
        "/" + this.GLOBAL.MODEL_SYSTEM + "/tree/getList_NQ_CheckBox",
        {
          namespace: "Organ",
          xmlpath: "system",
          methodname: "Role_by_Organ",
          map: [
            { ids: e.length == 0 ? ["asdasweeesdas"] : e },
            { r_type: ["RT002"] },
          ],
        }
      ).then((res) => {
        if (res.code === "400") {
          this.$notification.error({
            message: "参数错误",
            description: "请求出现错误，请联系管理员",
          });
        } else {
          this.role_s = res.result;
        }
      });
    },
    async init() {
      if (this.form_params.entity_datas.ct != null) {
        this.initAppPers(this.form_params.query_params.id);
      }
    },
    async initAppPers(id) {
      await queryService(this.modal_form_params.query_path, {
        pageSize: -1,
        params: { userId: id },
      }).then((res) => {
        this.datas = res.result.data;
        if (res.result.totalCount <= 10) {
          this.pagination = false;
        }
      });
    },
  },
};
</script>
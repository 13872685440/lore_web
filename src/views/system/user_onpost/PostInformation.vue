<template>
  <span>
    <s-list
      :canNew="false"
      :canEdit="false"
      :columns="columns"
      :name_path="name_path"
      :path_query="path_query"
      :path_delete="path_delete"
      :query_params="query_params"
      ><span slot="post_names" slot-scope="record">
        <template v-for="(item, i) in record.data.post_names">
          <div :key="i">{{ item }}</div>
        </template>
      </span>
      <span slot="action1" slot-scope="record">
        <a @click="add(record.data)">
          <a-icon type="edit" style="color: #69aa46" />
        </a>
        <a-divider type="vertical" />
      </span>
      <a-button type="primary" icon="plus" @click="add('')" slot="ac_button"
        >新建</a-button
      >
      <template #modal="{ refreshTable }">
        <modal-form
          ref="modal_form"
          title="任职经历"
          form_type="xform"
          :width="800"
          :form_datas="form_datas"
          :hidden_datas="hidden_datas"
          :entity_datas="entity_datas"
          :edit_path="path.edit_path"
          @ok="refreshTable"
          @handleSubmit="handleSubmit"
        >
          <a-tree-select
            slot="organId"
            :treeData="orgs"
            :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
            allowClear
            treeDefaultExpandAll
            @change="onChange"
            v-decorator="[
              'organId',
              {
                rules: [{ required: true, message: '请选择任职部门' }],
              },
            ]"
          ></a-tree-select
          ><a-select
            slot="post_ls"
            size="default"
            mode="multiple"
            @change="onChangePost"
            v-decorator="[
              'post_ls',
              { rules: [{ required: true, message: '请选择岗位' }] },
            ]"
          >
            <a-select-option
              v-for="type in posts"
              :key="type.id"
              :value="type.id"
              >{{ type.name }}</a-select-option
            >
          </a-select>
          <a-checkbox-group
            slot="roles"
            disabled
            v-model="roles"
            :options="roles"
          />
        </modal-form> </template></s-list
  ></span>
</template>
<script>
import SList from "@/components/CRUD/SList.vue";
import ModalForm from "@/components/CRUD/ModalForm.vue";
import { col_2_frist, col_2_last, col_2_all } from "@/utils/style";
import { queryService, saveService } from "@/api/manage";
import moment from "moment";
export default {
  components: { SList, ModalForm },
  name: "Form_PostInformation",
  props: ["name_path", "type", "entity_form", "orgs"],
  data() {
    return {
      path_query: "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/main",
      path_delete: "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/delete",
      path: {},
      query_params: {
        userId: this.entity_form.id,
      },
      entity_datas: {},
      posts: [],
      roles: [],
      columns: [
        {
          title: "任职部门",
          dataIndex: "organName",
        },
        {
          title: "岗位",
          dataIndex: "post_names",
          scopedSlots: { customRender: "post_names" },
        },
        {
          title: "入职时间",
          dataIndex: "entrytime",
        },
        {
          title: "离职时间",
          dataIndex: "leaftime",
        },
        {
          title: "任职状态",
          dataIndex: "isleaf",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
      hidden_datas: ["userId"],
      form_datas: [
        [
          {
            label: "姓名",
            prop: "userName",
            rules: [
              { required: true, message: "请输入姓名", whitespace: true },
            ],
            type: "Input",
            readOnly: true,
            styles: col_2_frist,
          },
          {
            label: "任职部门",
            prop: "organId",
            styles: col_2_last,
            type: "Slot",
          },
        ],
        [
          {
            label: "岗位",
            prop: "post_ls",
            type: "Slot",
            styles: col_2_frist,
          },
          {
            label: "职务",
            prop: "duty",
            type: "Input",
            styles: col_2_last,
          },
        ],
        [
          {
            label: "是否在职",
            prop: "isleaf",
            rules: [
              { required: true, message: "请输入姓名", whitespace: true },
            ],
            type: "Select",
            datas: [
              { id: "在职", name: "在职" },
              { id: "离职", name: "离职" },
            ],
            styles: col_2_frist,
          },
          {
            label: "入职时间",
            prop: "entrytime",
            rules: [{ required: true, message: "请输入入职时间" }],
            type: "Date",
            format: "YYYY-MM-DD",
            styles: col_2_last,
          },
        ],
        [
          {
            label: "关联角色",
            prop: "roles",
            type: "Slot",
            styles: col_2_all,
          },
        ],
      ],
    };
  },
  created() {
    this.path.post_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/tree/getList_NQ";
    this.path.role_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/tree/getList_S";
    this.path.save_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/save";
    this.path.edit_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/edit";
    this.path.delete_path =
      "/" + this.GLOBAL.MODEL_SYSTEM + "/postinformation/delete";
  },
  mounted() {},
  methods: {
    add(record) {
      var data = {};
      this.posts = [];
      if (record != "") {
        data = record;
        this.onChange(record.organId);

        this.onChangePost(record.post_ls);
      } else {
        data = {
          entity_datas: {
            userId: this.entity_form.id,
            userName: this.entity_form.name,
          },
        };
      }

      this.$refs.modal_form.add(data);
    },
    handleSubmit(callback) {
      this.$refs.modal_form.form.validateFields((errors, values) => {
        if (!errors) {
          if (values.entrytime) {
            values.entrytime = moment(values.entrytime).format("YYYY-MM-DD");
          }
          saveService(this.path.save_path, values)
            .then((res) => {
              console.log(res.code);
              if (res.code == "400") {
                this.$notification.error({
                  message: res.message,
                  description: res.result,
                });
              } else {
                this.$notification.success({
                  message: "保存成功",
                  description: "",
                });
              }
              callback("1");
            })
            .catch(() => {
              callback("2");
            });
        } else {
          callback("2");
        }
      });
    },
    async onChange(e) {
     // this.$refs.modal_form.form.setFieldsValue({ post_ls: [] });
     // this.onChangePost([]);
      await queryService(this.path.post_path, {
        namespace: "Post",
        xmlpath: "system",
        methodname: "Post_by_OrganType",
        map: { orgId: e }, 
      }).then((res) => {
        if (res.code === "400") {
          this.$notification.error({
            message: "参数错误",
            description: "请求出现错误，请联系管理员",
          });
        } else {
          //this.$refs.modal_form.form.setFieldsValue({ post_ls: [] });
          // this.onChangePost([]);
          this.posts = res.result;
        }
      });
    },
    async onChangePost(e) {
      await queryService(this.path.role_path, {
        namespace: "Post",
        xmlpath: "system",
        methodname: "Role_by_Post",
        map: { ids: e.length == 0 ? ["asdasweeesdas"] : e },
      }).then((res) => {
        if (res.code === "400") {
          this.$notification.error({
            message: "参数错误",
            description: "请求出现错误，请联系管理员",
          });
        } else {
          this.roles = res.result;
        }
      });
    },
  },
};
</script>
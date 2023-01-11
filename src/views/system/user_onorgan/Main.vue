<template>
  <div>
    <s-list
      v-if="currentTab === 'list'"
      :hasQuery="true"
      :columns="columns"
      :name_path="name_path"
      :params="params"
      @edit="edit"
    ></s-list
    ><s-form
      v-if="currentTab === 'add'"
      @edit="edit"
      :formId="id"
      :name_path="name_path"
      :type="type"
      :roles="roles"
    >
    </s-form>
  </div>
</template>

<script>
import SList from "@/components/CRUD/SList.vue";
import SForm from "./Form";
import { queryService } from "@/api/manage";
export default {
  name: "Main_UserOnorgan",
  components: {
    SList,
    SForm,
  },
  data() {
    return {
      name_path: "/useronorgan/",
      currentTab: "list",
      entity_form: {},
      id: "",
      type: "",
      path: {},
      columns: [
        {
          title: "姓名",
          dataIndex: "name",
          sorter: true,
        },
        {
          title: "手机号码",
          dataIndex: "phone",
        },
        {
          title: "操作",
          dataIndex: "action",
          width: "150px",
          scopedSlots: { customRender: "action" },
        },
      ],
      params: [{ name: "姓名", code: "name" }],
      roles: [],
    };
  },
  created() {
    this.spinning = false;
    this.path.prop_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/tree/getList";
    queryService(this.path.prop_path, {
      table_name: "SYS_Role",
      key: "r_type",
      root: "RT002",
      props: "o.id,o.des",
    }).then((res) => {
      if (res.code === "400") {
        this.$notification.error({
          message: "参数错误",
          description: "请求出现错误，请联系管理员",
        });
      } else {
        this.roles = res.result;
      }
      this.spinning = false;
    });
  },
  methods: {
    edit(data) {
      this.currentTab = data.state;
      this.entity_form = data.id;
      this.id = this.entity_form.id;
      this.type = data.type;
    },

    callback(entity_form) {
      this.entity_form = entity_form;
    },
  },
};
</script>

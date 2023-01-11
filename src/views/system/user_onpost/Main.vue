<template>
  <div>
    <tree-list
      v-if="currentTab === 'list'"
      :hasQuery="true"
      :columns="columns"
      :name_path="name_path"
      :tree_params="tree_params"
      :params="params"
      @edit="edit"
    ></tree-list>
    <menu-form
      v-if="currentTab === 'add'"
      @edit="edit"
      :menuitems="menuitems"
      :formId="id"
      ><span slot="tables" slot-scope="record">
        <s-base
          v-if="record.data === 0"
          :name_path="name_path"
          :formId="id"
          :type="type"
          @callback="callback"
        ></s-base
        ><post-information
          v-if="record.data === 1"
          :name_path="name_path"
          :entity_form="entity_form"
          :type="type"
          :orgs="orgs"
          @callback="callback"
        ></post-information> </span
    ></menu-form>
  </div>
</template>

<script>
import TreeList from "@/components/CRUD/TreeList2.vue";
import SBase from "./Base";
import PostInformation from "./PostInformation";
import { queryService } from "@/api/manage";
import MenuForm from "@/components/CRUD/MenuForm.vue";

export default {
  name: "Main_UserOnpost",
  components: {
    TreeList,
    SBase,
    MenuForm,
    PostInformation,
  },
  data() {
    return {
      name_path: "/useronpost/",
      currentTab: "list",
      entity_form: {},
      id: "",
      type: "",
      path: {},
      orgs: [],
      tree_params: {
        table_name: "Org_Organ",
      },
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
      menuitems: ["用户信息", "任职信息"],
    };
  },
  created() {
    this.spinning = true;
    this.path.org_path = "/" + this.GLOBAL.MODEL_SYSTEM + "/tree/get";
    queryService(this.path.org_path, {
      table_name: "Org_Organ",
      other: 1,
    }).then((res) => {
      if (res.code === "400") {
        this.$notification.error({
          message: "参数错误",
          description: "请求出现错误，请联系管理员",
        });
      } else {
        this.orgs = res.result;
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

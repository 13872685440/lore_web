<template>
  <a-card
    :body-style="{ padding: '24px 32px' }"
    :bordered="false"
    :title="title"
    class="card"
    ><s-form
      :title="title"
      :needId="needId"
      :name_path="name_path"
      :form_datas="form_datas"
      :type="type"
      :formId="formId"
      :reRender="reRender"
      @callback="callback"
      @edit="edit"
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
          v-show="formId != null && formId != ''"
        />
      </a-input> </s-form
  ></a-card>
</template>
<script>
import SForm from "@/components/CRUD/YForm.vue";
import { toService } from "@/api/manage";
export default {
  components: { SForm },
  name: "Form_User_Onorgan",
  props: ["name_path", "type", "formId", "roles"],
  data() {
    return {
      title: "用户管理",
      needId: true,
      reRender: true,
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
          label: "重置密码",
          prop: "radom",
          type: "Slot",
        },
        {
          label: "关联角色",
          prop: "role_ls",
          placeholder: "请选择该用户关联角色",
          rules: [
            {
              message: "请选择该用户关联角色",
              whitespace: true,
              required: true,
              type: "array",
            },
          ],
          datas: this.roles,
          mode: "multiple",
          type: "Select",
        },
      ],
    };
  },
  created() {},
  mounted() {},
  methods: {
    callback(data) {
      this.$emit("callback", data.data);
    },
    edit(data) {
      this.$emit("edit", data);
    },
    reset(form) {
      const parameter = {
        id: this.formId,
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
  },
};
</script>
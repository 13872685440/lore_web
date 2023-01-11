<template>
  <a-modal
    title="修改密码"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="当前用户">
          <span class="ant-form-text">{{ nickname() }}</span>
        </a-form-item>
        <a-form-item label="原密码">
          <a-input-password
            v-decorator="[
              'oldpwd',
              {
                rules: [{ required: true, message: '请输入原密码' }],
              },
            ]"
          />
        </a-form-item>
        <a-form-item label="新密码" has-feedback :validate-status="new_pwd">
          <a-input-password
            style="width: 100%"
            v-decorator="[
              'newpwd',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: strongPassword,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
        <a-form-item
          label="新密码确认"
          has-feedback
          :validate-status="new_pwd2"
        >
          <a-input-password
            v-decorator="[
              'newpwd2',
              {
                rules: [
                  { required: true, message: '' },
                  {
                    validator: twoPassword,
                  },
                ],
              },
            ]"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MakePassword",
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
      visible: false,
      confirmLoading: false,

      form: this.$form.createForm(this),

      path: {},

      new_pwd: "",

      new_pwd2: "",
    };
  },
  created() {},
  methods: {
    ...mapActions(["MakePwd"]),
    ...mapGetters(["nickname", "userId"]),
    add() {
      this.visible = true;
      this.form.resetFields();
    },
    strongPassword(rule, value, callback) {
      const form = this.form;
      if (value) {
        if (value.length < 8) {
          this.new_pwd = "error";
          callback("请至少输入8位密码");
        } else {
          var x = this.checkStrong(value);
          if (x < 3) {
            this.new_pwd = "error";
            callback("请输入强密码，密码至少包含大写字母、小写字母和数字");
          } else {
            var npwd2 = form.getFieldValue("newpwd2");
            if (npwd2 && value != form.getFieldValue("newpwd2")) {
              this.new_pwd = "error";
              callback("两次密码输入不一致");
            } else {
              this.new_pwd = "success";
              callback();
            }
          }
        }
      } else {
        this.new_pwd = "error";
        callback("请输入新密码");
      }
    },
    twoPassword(rule, value, callback) {
      const form = this.form;
      if (value) {
        if (value != form.getFieldValue("newpwd")) {
          this.new_pwd2 = "error";
          callback("两次密码输入不一致");
        } else {
          this.new_pwd2 = "success";
          callback();
        }
      } else {
        this.new_pwd2 = "error";
        callback("请再次输入新密码");
      }
    },

    handleCancel() {
      this.visible = false;
    },
    checkStrong(sValue) {
      console.log(sValue);
      var modes = 0;
      if (sValue.length < 8) return modes;
      if (/\d/.test(sValue)) modes++;
      if (/[a-z]/.test(sValue)) modes++;
      if (/[A-Z]/.test(sValue)) modes++;
      switch (modes) {
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
          return 3;
      }
      return modes;
    },

    handleSubmit() {
      this.confirmLoading = true;
      this.form.validateFields((errors, values) => {
        if (!errors) {
          values.userId = this.userId();
          this.MakePwd(values)
            .then((result) => {
              console.log(result);
              if (result.code == "400") {
                this.form.setFields({
                  oldpwd: {
                    value: values.oldpwd,
                    errors: [
                      {
                        message: result.message,
                        field: "oldpwd",
                      },
                    ],
                  },
                });
                this.confirmLoading = false;
              } else {
                this.confirmLoading = false;
                this.visible = false;
                this.$notification.success({
                  message: "密码修改成功",
                });
              }
            })
            .catch((error) => {
              this.$notification.error({
                message: "密码修改失败",
                description: error,
              });
              this.confirmLoading = false;
            });
        } else {
          this.confirmLoading = false;
        }
      });
    },
  },
};
</script>


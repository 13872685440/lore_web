<template>
  <a-spin :spinning="spinning">
    <a-card
      :body-style="{ padding: '24px 32px' }"
      :bordered="false"
      title="系统配置"
      class="card"
    >
      <a-form :form="form" class="form" @submit="handleSubmit">
        <a-form-item
          label="重载query"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 5 }, sm: { span: 12 } }"
        >
          <a-switch v-decorator="['reload', { valuePropName: 'checked' }]" />
        </a-form-item>
        <a-form-item
          label="重载namequery"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-switch
            v-decorator="['namequeryreload', { valuePropName: 'checked' }]"
          />
        </a-form-item>
        <a-form-item
          label="白名单"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-textarea
            v-decorator="['whitelist']"
            placeholder="请输入白名单"
            :auto-size="{ minRows: 3 }"
          />
        </a-form-item>
        <a-form-item
          label="选择通用流程可选角色"
          :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
          :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
        >
          <a-select
            mode="multiple"
            size="default"
            placeholder="请选择选择通用流程可选角色"
            style="width: 600px"
            v-decorator="[
              'roles',
              {
                rules: [
                  {
                    required: true,
                    type: 'array',
                    message: '请选择岗位关联角色',
                    whitespace: true,
                  },
                ],
              },
            ]"
          >
            <a-select-option
              v-for="type in ROLES"
              :key="type.name"
              :value="type.name"
              >{{ type.des }}</a-select-option
            >
          </a-select>
        </a-form-item>
        <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
          <a-button htmlType="submit" type="primary" v-action:SYS_ADMINISTRATOR
            >保存</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
  </a-spin>
</template>
<script>
import { queryService, saveService } from "@/api/manage";
import { MODEL_SYSTEM } from "@/store/mutation-types";
//import moment from "moment";

export default {
  name: "Cache_Form",
  data() {
    return {
      form: this.$form.createForm(this),
      spinning: true,
      path: {},
      ROLES: [],
    };
  },
  async mounted() {
    this.path.role_path = "/" + MODEL_SYSTEM + "/role/get";
    await queryService(this.path.role_path, { rtype: "RT002" }).then((res) => {
      if (res.code === "400") {
        this.$notification.error({
          message: "参数错误",
          description: "请求出现错误，请联系管理员",
        });
      } else {
        this.ROLES = res.result;
      }
    });
    this.path.edit_path = "/" + MODEL_SYSTEM + "/system/config/edit";
    this.path.save_path = "/" + MODEL_SYSTEM + "/system/config/save";
    await queryService(this.path.edit_path, {}).then((res) => {
      this.form.setFieldsValue(res.result);
      //  this.form.setFieldsValue({
      //   personal_enddate: moment(res.result.personal_enddate),
      // });
    });
    this.spinning = false;
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        // values.personal_enddate = moment(values.personal_enddate).format(
        // "YYYY-MM-DD"
        //  );
        if (!err) {
          saveService(this.path.save_path, values)
            .then(() => {
              this.$notification.success({
                message: "保存成功",
                description: "",
              });
              this.spinning = false;
            })
            .catch(() => {
              this.spinning = false;
            });
        } else {
          this.spinning = false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.card {
  margin-bottom: 24px;
}
</style>

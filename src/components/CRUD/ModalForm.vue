<template>
  <a-modal
    :title="init_params.title"
    :width="init_params.width"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :footer="init_params.readOnly ? null : 确定取消按钮"
    :key="key"
    ><a-form :form="form" class="form">
      <base-form
        :needId="init_params.needId"
        v-if="init_params.needBase"
        :hidden_datas="hidden_datas"
        :needProcess="init_params.needProcess"
      >
      </base-form>
      <span v-if="init_params.form_type === 'yform'">
        <template v-for="(item, i) in form_datas">
          <a-form-item
            :label="item.label"
            :labelCol="item.style_col != null ? item.style_col.labelCol : ''"
            :wrapperCol="
              item.style_col != null ? item.style_col.wrapperCol : ''
            "
            :key="item.prop"
            v-if="item.type === 'Slot'"
          >
            <slot :name="item.prop" :data="item" :form="form"></slot>
          </a-form-item>
          <r-form :item="item" :key="i" :readOnly="init_params.readOnly" v-else>
          </r-form>
        </template>
        <slot name="forms"></slot
      ></span>
      <span v-else>
        <template v-for="(items, i) in form_datas">
          <a-row class="form-row" :gutter="16" :key="i">
            <template v-for="(item, j) in items">
              <a-col
                :xl="item.styles.xl"
                :lg="item.styles.lg"
                :md="item.styles.md"
                :sm="item.styles.sm"
                :key="j"
                v-show="item.show == null ? true : item.show"
                ><a-form-item
                  :label="item.label"
                  :key="item.prop + j"
                  v-if="item.type === 'Slot'"
                >
                  <slot :name="item.prop" :data="item" :form="form"></slot>
                </a-form-item>
                <r-form
                  :item="item"
                  :key="j"
                  :readOnly="init_params.readOnly"
                  v-else
                >
                </r-form> </a-col
            ></template>
          </a-row>
        </template>

        <slot name="forms"></slot
      ></span>
    </a-form>
  </a-modal>
</template>
<script>
import BaseForm from "./BaseForm.vue";
import RForm from "./RForm.vue";
import { queryService, saveService } from "@/api/manage";
import moment from "moment";
export default {
  components: { BaseForm, RForm },
  name: "Modal_Form",
  props: {
    // 渲染服务路径
    edit_path: {
      type: String,
    },
    // 传递的form参数
    form_params: {
      type: Object,
    },
    // 初始化参数
    init_params: { type: Object },
    // 实体值
    entity_datas: {
      type: Object,
    },
    // 隐藏参数
    hidden_datas: {
      type: Array,
      default: function () {
        return [];
      },
    },
    // form表单参数
    form_datas: {
      type: Array,
    },
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      key: "",
      form: this.$form.createForm(this),
    };
  },
  methods: {
    async add(data) {
      this.visible = true;
      this.confirmLoading = true;
      if (data.id) {
        this.key = data.id;
      } else {
        const random = Math.random().toString(36).substring(2);
        this.key = random;
      }

      if (data.entity_datas != null) {
        setTimeout(() => {
          this.form.setFieldsValue(data.entity_datas);
        }, 0);
        this.confirmLoading = false;
      } else {
        await queryService(this.form_params.edit_path, { id: data.id }).then(
          (res) => {
            setTimeout(() => {
              this.form.setFieldsValue(res.result);
            }, 0);
            this.confirmLoading = false;
          }
        );
      }
    },
    handleSubmit() {
      this.form.validateFields((errors, values) => {
        if (!errors) {
          if (this.init_params.form_type == "yform") {
            this.form_datas.forEach((item) => {
              if (item.type == "Date") {
                if (values[item.prop]) {
                  values[item.prop] = moment(values[item.prop]).format(
                    item.format
                  );
                }
              }
            });
          } else {
            this.form_datas.forEach((items) => {
              items.forEach((item) => {
                if (item.type == "Date") {
                  if (values[item.prop]) {
                    values[item.prop] = moment(values[item.prop]).format(
                      item.format
                    );
                  }
                }
              });
            });
          }
          values.tmpId = this.key;

          saveService(this.form_params.save_path, values)
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
              this.visible = false;
              this.$emit("ok");
            })
            .catch(() => {
              // callback("2");
            });
        } else {
          // callback("2");
        }
      });
    },
    handleCancel() {
      this.visible = false;
    },
  },
};
</script>
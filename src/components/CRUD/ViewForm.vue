<template>
  <a-spin :spinning="spinning">
    <a-form :form="form" class="form" :key="tmpId">
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
                :tmpId="tmpId"
                :readOnly="true"
                v-else
              >
              </r-form> </a-col
          ></template>
        </a-row>
      </template>
      <slot name="forms" :form="form" :params="params"></slot>
    </a-form>
    <!-- <process-view
      v-if="open_task"
      :task_view_params="task_view_params"
      :key="form_params.query_params.id + task_view_params.current"
      ref="processview"
    ></process-view>-->
  </a-spin>
</template>
<script>
import { editForm } from "@/utils/mixin.js";
import { queryService } from "@/api/manage";
import RForm from "./RForm.vue";

export default {
  mixins: [editForm],
  components: { RForm },
  name: "Form_Base",
  props: {
    view_params: { type: Object },
    // form表单参数
    entity_datas: { type: Object },
    form_datas: {
      type: Array,
    },
  },
  data() {
    return { form: this.$form.createForm(this), tmpId: "" };
  },

  created() {
    // this.form = this.$form.createForm(this);
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      this.spinning = true;
      // 当传递实体值时，直接渲染实体值 最常见的使用方法是：直接通过list将实体值进行传递，这样可以避免去后台再去查询，节省效率
      // 否则，将会通过服务路径去后台进行查询
      // 服务路径传递时，取传递的路径，否则使用默认路径 默认路径为菜单的path+"/edit"

      if (this.entity_datas != null) {
        this.form.setFieldsValue(this.entity_datas);
        this.tmpId = this.entity_datas.id;
        //  alert(this.tmpId);
        this.spinning = false;
      } else {
        this.tmpId = this.view_params.params.id;
        if (this.view_params.edit_path != null) {
          this.path.edit_path = this.view_params.edit_path;
        } else {
          this.path.edit_path = this.get_path(this.$route.path, "/edit");
        }
        await queryService(this.path.edit_path, this.view_params.params).then(
          (res) => {
            this.form.setFieldsValue(res.result);
            this.spinning = false;
          }
        );
      }
    },
  },
};
</script>

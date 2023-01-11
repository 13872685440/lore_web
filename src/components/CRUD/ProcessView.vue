<template>
  <a-drawer
    width="45%"
    :title="task_view_params.title"
    placement="right"
    :closable="false"
    :visible="visible"
    @close="onClose"
    ><a-row>
      <a-col :span="16">
        <a-steps
          direction="vertical"
          :current="task_view_params.comment_current"
        >
          <a-step v-for="(item, j) in task_view_params.comments" :key="'a' + j">
            <template slot="title">
              <div style="width: 50%; float: left" v-if="item.level == '2'">
                {{ item.name }}
              </div>
              <div style="width: 50%; float: left" v-else>
                {{ item.name }}
              </div>
              <div
                style="width: 50%; float: left; text-align: right"
                v-if="item.time_out_type == '1'"
              >
                <a-badge
                  count="超时"
                  :number-style="{ backgroundColor: red }"
                />
              </div>
              <div
                style="width: 50%; float: left; text-align: right"
                v-else-if="item.time_out_type == '2'"
              >
                <a-badge
                  count="即将超时"
                  :number-style="{ backgroundColor: '#ff9900' }"
                />
              </div>
              <div style="width: 50%; float: left; text-align: right" v-else>
                {{ item.shjl }}
              </div></template
            >
            <template slot="description">
              <div>{{ item.shyj }}</div>
              <div style="width: 50%; float: left">
                {{ item.jbsj }}
              </div>
              <div style="width: 50%; float: right; text-align: right">
                {{ item.jbr }}
              </div>
            </template>
          </a-step>
        </a-steps> </a-col
      ><a-col :span="6" :offset="2">
        <a-steps direction="vertical" :current="task_view_params.current">
          <a-step
            v-for="(item, j) in task_view_params.prcocess_steps"
            :key="'b' + j"
          >
            <template slot="title">
              <div style="width: 100%; float: left">
                {{ item.name }}
              </div></template
            >
          </a-step>
        </a-steps></a-col
      ></a-row
    >
  </a-drawer>
</template>
<script>
export default {
  props: {
    task_view_params: {
      type: Object,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    showDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
  },
};
</script>
<style>
.ant-steps-item-title {
  padding-right: 0 !important;
  width: 100%;
}
</style>
<template>
  <div class="page-header-index-wide">
    <a-card
      :bordered="false"
      :bodyStyle="{ padding: '0 0', height: '100%' }"
      :style="{ height: '100%' }"
    >
      <div class="account-settings-info-main" :class="device">
        <div class="account-settings-info-left">
          <a-menu
            :mode="device == 'mobile' ? 'horizontal' : 'inline'"
            :style="{
              border: '0',
              padding: '0',
              width: device == 'mobile' ? '560px' : 'auto',
            }"
            :selectedKeys="selectedKeys"
            type="inner"
            @click="onClick"
          >
            <a-menu-item v-for="(item, i) in menuitems" :key="i">{{
              item
            }}</a-menu-item>
          </a-menu>
        </div>
        <div class="account-settings-info-right">
          <slot name="tables" :data="key"></slot>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script>
import { mixinDevice, editForm } from "@/utils/mixin.js";

export default {
  props: {
    menuitems: { type: Array },
  },
  mixins: [mixinDevice, editForm],
  data() {
    return {
      mode: "inline",

      selectedKeys: [0],

      key: 0,
    };
  },
  created() {},
  methods: {
    onClick(e) {
      this.selectedKeys = [e.key];
      this.key = e.key;
    },
  },
};
</script>

<style lang="less" scoped>
.account-settings-info-main {
  width: 100%;
  display: flex;
  height: 100%;
  overflow: auto;

  &.mobile {
    display: block;

    .account-settings-info-left {
      border-right: unset;
      border-bottom: 1px solid #e8e8e8;
      width: 100%;
      height: 50px;
      overflow-x: auto;
      overflow-y: scroll;
    }
    .account-settings-info-right {
      padding: 20px 40px;
    }
  }

  .account-settings-info-left {
    border-right: 1px solid #e8e8e8;
    width: 224px;
  }

  .account-settings-info-right {
    flex: 1 1;
    padding: 8px 40px;

    .account-settings-info-title {
      color: rgba(0, 0, 0, 0.85);
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-bottom: 12px;
    }
    .account-settings-info-view {
      padding-top: 12px;
    }
  }
}
</style>

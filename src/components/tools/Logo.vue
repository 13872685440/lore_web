<template>
  <div  >
   </div>
</template>

<script>
//import LogoSvg from "@/assets/logo.svg?inline";
import Vue from "vue";
import { SYSTEM_CONFIG } from "@/store/mutation-types";

export default {
  name: "Logo",
  //components: {
  //LogoSvg,
  //},
  props: {
    showTitle: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  data() {
    return {
      // title: Vue.ls.get(SYSTEM_CONFIG).system_name,
      title:"知识库",
    };
  },
};
</script>

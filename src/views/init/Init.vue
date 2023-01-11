<template>
  <div>
    <s-step1 v-if="currentTab === '1'" @edit="edit" />
    <s-step2 v-if="currentTab === '2'" @edit="edit" />
    <s-step3 v-if="currentTab === '3'" @edit="edit" />
  </div>
</template>

<script>
import SStep1 from "./Step1.vue";
import SStep2 from "./Step2.vue";
import SStep3 from "./Step3.vue";

export default {
  name: "Main_Init",
  components: {
    SStep1,
    SStep2,
    SStep3,
  },
  data() {
    return {
      currentTab: "1",
    };
  },
  created() {},
  methods: {
    edit(data) {
      this.currentTab = data.state;
    },
  },
};
</script>

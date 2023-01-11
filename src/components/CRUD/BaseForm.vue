<template>
  <a-form-item label="" v-show="false">
    <a-input :disabled="true" v-decorator="['version']" />{{ needId }}
    <a-input :disabled="true" v-decorator="['ct']" />
    <a-input :disabled="true" v-decorator="['crtUid']" />
    <a-input :disabled="true" v-decorator="['crtUname']" />
    <a-input :disabled="true" v-decorator="['lmt']" />
    <a-input :disabled="true" v-decorator="['lmUid']" /><a-input
      :disabled="true"
      v-decorator="['lmUname']"
    /><a-input :disabled="true" v-decorator="['invalidzt']" /><a-input
      :disabled="true"
      v-decorator="['dictionaryData']"
    /><a-input :disabled="true" v-decorator="['token']" />
    <a-input :disabled="true" v-decorator="['id']" v-if="needId" />
    <template v-if="needProcess"
      ><a-input :disabled="true" v-decorator="['step_id']" />111<a-input
        :disabled="true"
        v-decorator="['step']" /><a-input
        :disabled="true"
        v-decorator="['step_name']" /><a-input
        :disabled="true"
        v-decorator="['conclusion']"
    /></template>

    <template v-for="prop in hidden_datas">
      <a-input :disabled="true" v-decorator="[prop]" :key="prop" />
    </template>
    <slot></slot>
  </a-form-item>
</template>
<script>
export default {
  props: {
    needId: {
      type: Boolean,
      default: true,
    },
    needProcess: {
      type: Boolean,
      default: false,
    },
    hidden_datas: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
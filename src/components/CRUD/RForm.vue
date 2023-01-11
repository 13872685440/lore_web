
  <template>
  <a-form-item
    :label="item.label"
    :labelCol="item.style_col != null ? item.style_col.labelCol : {}"
    :wrapperCol="item.style_col != null ? item.style_col.wrapperCol : {}"
    v-if="item.type != 'Slot'"
  >
    <a-input
      v-if="item.type === 'Input'"
      :readOnly="item.readOnly != null ? item.readOnly : readOnly"
      :placeholder="item.placeholder"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    /><a-input-number
      v-if="item.type === 'Input_Number'"
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      :step="item.step == null ? 1 : item.step"
      :min="item.min == null ? 0 : item.min"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    /><a-input-password
      v-if="item.type === 'Input_Password'"
      :readOnly="item.readOnly != null ? item.readOnly : readOnly"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    /><a-textarea
      :rows="item.rows"
      v-if="item.type === 'Input_Textarea'"
      :readOnly="item.readOnly != null ? item.readOnly : readOnly"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    />
    <a-radio-group
      v-if="item.type === 'Radio'"
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    >
      <template v-for="type in item.datas">
        <a-radio :key="type.id" :value="type.id">{{ type.name }}</a-radio>
      </template>
    </a-radio-group>
    <a-switch
      v-if="item.type === 'Switch'"
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      :checked-children="
        item.switch_value != null ? item.switch_value.open : ''
      "
      :un-checked-children="
        item.switch_value != null ? item.switch_value.close : ''
      "
      v-decorator="[item.prop, { valuePropName: 'checked' }]"
    >
    </a-switch>
    <a-tree-select
      v-if="item.type === 'Tree_Multiple'"
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      :treeData="item.datas"
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      :placeholder="item.placeholder"
      allowClear
      treeNodeFilterProp="title"
      multiple
      treeDefaultExpandAll
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    ></a-tree-select
    ><a-tree-select
      v-if="item.type === 'Tree_Simple'"
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      :treeData="item.datas"
      :dropdownStyle="{ maxHeight: '300px', overflow: 'auto' }"
      :placeholder="item.placeholder"
      allowClear
      treeDefaultExpandAll
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    ></a-tree-select>
    <a-select
      v-if="item.type === 'Select'"
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      size="default"
      :allowClear="true"
      :mode="item.mode"
      :placeholder="item.placeholder != null ? item.placeholder : '请选择'"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    >
      <a-select-option
        v-for="type in item.datas"
        :key="type.id"
        :value="type.id"
        >{{ type.name }}</a-select-option
      >
    </a-select>
    <a-checkbox-group
      v-if="item.type === 'CheckboxGroup'"
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
      :options="item.datas"
    >
    </a-checkbox-group>
    <a-checkbox
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      v-if="item.type === 'Checkbox'"
      v-decorator="[item.prop, { valuePropName: 'checked' }]"
    >
    </a-checkbox>
    <a-date-picker
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      v-if="item.type === 'Date'"
      style="width: 100%"
      :format="item.format"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
    />
    <a-rate
      :disabled="item.readOnly != null ? item.readOnly : readOnly"
      v-decorator="[
        item.prop,
        {
          rules: item.rules,
        },
      ]"
      v-if="item.type === 'Rate'"
      :count="item.count != null ? item.count : 5"
      :allowHalf="item.allowHalf != null ? item.allowHalf : false"
    />
    <span v-if="item.type === 'UploadFile'">
      <a-input
        hidden
        v-decorator="[
          item.datas.sign,
          {
            rules: item.rules,
          },
        ]" />
      <upload-file
        :form="form"
        :multiple="item.mode"
        :file_data="item.datas"
        :length="
          (item.readOnly != null ? item.readOnly : readOnly)
            ? -1
            : item.datas.length
        "
        :tmpId="tmpId"
      ></upload-file
    ></span>
    <span v-if="item.type === 'UploadImg'">
      <a-input
        hidden
        v-decorator="[
          item.datas.sign,
          {
            rules: item.rules,
          },
        ]" />
      <upload-img
        :form="form"
        :multiple="item.mode"
        :file_data="item.datas"
        :length="
          (item.readOnly != null ? item.readOnly : readOnly)
            ? -1
            : item.datas.length
        "
        :tmpId="tmpId"
      ></upload-img
    ></span>
  </a-form-item>
</template>

<script>
import UploadFile from "@/components/File/UploadFile";
import UploadImg from "@/components/File/UploadImg";
export default {
  name: "Form_R",
  components: {
    UploadFile,
    UploadImg,
  },
  props: {
    form: {
      type: Object,
    },
    item: {
      type: Object,
      default: function () {
        return {};
      },
    },
    tmpId: { type: String },
    readOnly: { type: Boolean },
  },
  created() {},
};
</script>
<style>
/* you can make up upload button and sample style by using stylesheets */
.ant-input-number-disabled {
  background-color: white;
  color: black;
}
.ant-input-disabled {
  background-color: white;
  color: black;
}
.ant-select-disabled .ant-select-selection {
  background-color: white;
  color: black;
}
.ant-input[disabled] {
  background-color: white;
  color: black;
}
.ant-select-disabled
  .ant-select-selection--multiple
  .ant-select-selection__choice {
  color: black;
}
.ant-switch-loading,
.ant-switch-disabled {
  opacity: 1;
}
.ant-radio-disabled .ant-radio-inner {
  background-color: white;
  color: black;
}
.ant-radio-disabled .ant-radio-inner::after {
  color: black;
}
.ant-checkbox-disabled .ant-checkbox-inner {
  background-color: white;
}
.ant-checkbox-disabled.ant-checkbox-checked .ant-checkbox-inner::after {
  border-color: black;
}
.ant-checkbox-disabled + span {
  color: black;
}
.ant-radio-disabled + span {
  color: black;
}
</style>
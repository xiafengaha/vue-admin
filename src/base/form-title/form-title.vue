/**表单标题组件:用于静态内容展示 */
<template>
  <div class="form__title--container">
    <p class="form__title--item">
      <slot name="title"></slot>
    </p>
    <div>
      <slot name="btn"></slot>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "formTitle",
  props: {},
  data() {
    return {};
  },
  components: {},
  mounted() {},
  methods: {},
  computed: {}
};
</script>

<style  lang="scss" scoped>
@import "~styles/variable";
.form__title--container {
  width: 100%;
  border-bottom: 1px dashed #d4d9ee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  .form__title--item {
    font-size: 16px;
    color: $textColor;
    padding-top: 10px;
    padding-bottom: 16px;
    line-height: 16px;
    font-weight: $mediumFont;
    span {
      display: inline-block;
      padding-left: 12px;
      border-left: 4px solid $themeColor;
    }
  }
}
</style>

<template>
  <div class="panel">
    <cv-tile>
      <p>
        <slot></slot>
      </p>
    </cv-tile>
  </div>
</template>

<script>
export default {
  name: "Panel",
};
</script>

<style scoped lang="less">
.panel {
  width: 500px;
  margin: auto;
}
</style>
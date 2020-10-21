<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body, #app {
  height: 100%;
}

::-webkit-scrollbar {
  display: none;
}

.width-100 {
  width: 100%;
}

.width-50 {
  width: 50%;
}

.center {
  text-align: center;
}

.inline {
  display: inline;
}

.inline-block {
  display: inline-block;
}

.bx--loading-overlay {
  background-color: transparent !important;
}
</style>
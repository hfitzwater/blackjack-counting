<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
html, body, #app {
  height: 100%;
}

#app {
  color: #3c3c3c;
  background: rgb(107,107,107);
  background: linear-gradient(0deg, rgba(107,107,107,1) 0%, rgba(221,221,221,1) 54%);
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

.left {
  text-align: left;
}

.inline {
  display: inline;
}

.inline-block {
  display: inline-block;
}

.game-title {
  color: #3c3c3c;
  font-weight: 900;
  padding: 0.3em 0;
}

.status-line {
  margin: 0.5em 0;
}

.flat-button {
  background-color: #efefef;
  color: #0f62fe;
}

.bx--loading-overlay {
  background-color: transparent !important;
}

.bx--toast-notification__close-button {
  display: none !important;
}
</style>
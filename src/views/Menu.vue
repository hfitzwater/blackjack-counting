<template>
  <div class="menu">
    <Panel>
      <div>
        <router-link to="/play"> Play </router-link>
      </div>
      <br>
      <div>
       <router-link to="/options"> Options </router-link>
     </div>
    </Panel>
 </div>
</template>

<script>
import Panel from '../components/Panel';

export default {
  name: "Menu",
  components: {
    Panel
  },
  methods: {
  }
};
</script>

<style scoped lang="less">
  .menu {
    text-align: center;
    text-transform: uppercase;
  }
</style>

<template>
  <div class="app">
    <div>
      <Header />
    </div>
    <div class="app-body">
      <Sidebar />
      <router-view />
    </div>
  </div>
</template>

<script>
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  components: { Header, Sidebar },
};
</script>

<style>
.app-body {
  display: flex;
  flex-direction: row;
}
</style>

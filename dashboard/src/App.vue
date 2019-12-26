<template>
  <div class="app">
    <div>
      <MainHeader />
    </div>
    <div class="app-body">
      <MainSidebar />
      <router-view />
    </div>
  </div>
</template>

<script>
import MainHeader from '@/components/MainHeader.vue';
import MainSidebar from '@/components/MainSidebar.vue';

export default {
  name: 'app',
  components: { MainHeader, MainSidebar },
};
</script>

<style>
.app-body {
  display: flex;
  flex-direction: row;
}
</style>

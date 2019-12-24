<template>
  <b-collapse id="nav-collapse">
    <b-list-group flush>
      <b-list-group-item
        v-for="(item, index) in sidebar"
        :key="index"
        active-class="active"
        exact
        :to="item.link"
      >
        {{ item.title }}
      </b-list-group-item>
    </b-list-group>
  </b-collapse>
</template>

<script>
export default {
  name: 'sidebar',
  data() {
    return {
      sidebar: [
        { link: '/', title: 'Dashboard' },
        { link: '/download-files', title: 'Download Files' },
        { link: '/status', title: 'Sensor Status' },
        { link: '/power-model', title: 'Power Model Start/Stop' },
        { link: '/power-zone', title: 'Generate Power Map' },
        { link: '/power-calibration', title: 'Power Model Calibration' },
        { link: '/camera', title: 'Camera Settings' },
        { link: '/options', title: 'Options' },
      ],
    };
  },
};
</script>

<style scoped>

</style>

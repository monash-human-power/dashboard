<template>
  <div>
    <b-navbar toggleable type="dark" variant="dark">
      <span>
        <b-navbar-toggle target="nav-collapse" class="header-brand"></b-navbar-toggle>
        <b-navbar-brand to="/">MHP DAShboard</b-navbar-brand>
      </span>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'header',
};
</script>

<style scoped>
.header-brand {
  margin-right: 16px;
}
</style>

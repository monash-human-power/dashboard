<template>
  <b-collapse id="nav-collapse">
    <b-list-group flush>
      <b-list-group-item
        active-class="active"
        exact
        to="/"
      >
        Dashboard
      </b-list-group-item>
      <b-list-group-item
        active-class="active"
        to="/download-files"
      >
        Download Files
      </b-list-group-item>
      <b-list-group-item
        active-class="active"
        to="/status"
      >
        Sensor Status
      </b-list-group-item>
      <b-list-group-item
        active-class="active"
        to="/power-model"
      >
        Power Model Start/Stop
      </b-list-group-item>
      <b-list-group-item
        active-class="active"
        to="/power-zone"
      >
        Generate Power Map
      </b-list-group-item>
      <b-list-group-item
        active-class="active"
        to="/power-calibration"
      >
        Power Model Calibration
      </b-list-group-item>
      <b-list-group-item
        active-class="active"
        to="/camera"
      >
        Camera Settings
      </b-list-group-item>
      <b-list-group-item
        active-class="active"
        to="/options"
      >
        Options
      </b-list-group-item>
    </b-list-group>
  </b-collapse>
</template>

<script>
export default {

};
</script>

<style>

</style>

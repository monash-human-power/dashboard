class DAS {
  static data = 'data';
  static start = 'start';
  static stop = 'stop';
}

class BOOST {
  // Start/stop
  static start = 'boost/start';
  static stop = 'boost/stop';

  // BOOST output
  static recommended_sp = 'boost/recommended_sp';
  static predicted_max_speed = 'boost/predicted_max_speed';

  // Plan generation
  static generate = 'boost/generate';
  static generate_complete = 'boost/generate_complete';

  // Distance calibration
  static calibrate = 'boost/calibrate';
  static calibrate_reset = 'boost/calibrate/reset';
}

class Camera {
  // Getting/setting overlays
  static get_overlays = 'camera/get_overlays';
  static set_overlay = 'camera/set_overlay';
  static push_overlays = 'camera/push_overlays';

  // Error topic
  static errors = 'camera/errors';

  // Messages to be shown on DAShboard
  static overlay_message = 'camera/message';

  // Recording
  static recording = 'camera/recording/+';
  static recording_start = 'camera/recording/start';
  static recording_stop = 'camera/recording/stop';

  // Camera status
  static status_recording = 'status/camera/recording';
  static status_video_feed = 'status/camera/video_feed';
  static status_camera = 'status/camera';
}

class WirelessModule {
  static base = '/v3/wireless_module/';

  battery(module_id = '+') {
    return `${base}${module_id}/battery`;
  }

  static data(module_id = '+') {
    return `${WirelessModule.base}${module_id}/data`;
  }

  start(module_id = '+') {
    return `${base}${module_id}/start`;
  }

  stop(module_id = '+') {
    return `${base}${module_id}/stop`;
  }

  module(module_id = '+') {
    return `${base}${module_id}/#`;
  }
}

module.exports = {
  DAS,
  BOOST,
  Camera,
  WirelessModule,
};

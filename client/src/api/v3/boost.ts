import { emit } from 'api/common/socket';
import { BoostConfigType } from 'types/boost';

type action = 'upload' | 'delete';

/**
 * Send configuration status over MQTT on topic 'boost/configs/action'
 * 
 * @param actionType actionType represents whether the config is being uploaded or deleted
 * @param type type the type of the configuration being sent
 * @param configContent configuration content
 */
function sendConfig(actionType: action, type: BoostConfigType, configContent: string | null) {
  const topic = 'send-config';
  const payload = {
    action: actionType,
    configType: type,
    content: configContent,
  };
  // To check things work without needing the server started
  console.log(payload);
  emit(topic, JSON.stringify(payload));
}

/**
 * Read content from the given file and send it on `boost/configs/action` over MQTT. 
 * If the content contains more than config (i.e. `type` is 'all'), the content is
 * split into the different configurations.
 *
 * @param type the type of the configuration
 * @param configFile file containing content of the configuration
 */
export default function uploadConfig(
  type: BoostConfigType,
  configFile: File,
) {
  const reader = new FileReader();
  const possibleConfig = ['powerPlan', 'rider', 'track', 'bike'];

  // Called when FileReader has completed reading a file
  reader.onload = () => {
    if (type === 'all' && typeof reader.result === 'string') {
      const allConfigs = JSON.parse(reader.result);

      // For each config, send the config content over MQTT
      Object.keys(allConfigs).forEach((key) => {
        if (possibleConfig.includes(key)) {
          sendConfig('upload', key as BoostConfigType, allConfigs[key]);
          const i = possibleConfig.indexOf(key);
          possibleConfig.splice(i,1);
        }  
      });
      if (possibleConfig.length !== 0) {
        // TODO: Remove alert
        alert(`The config bundle uploaded does not contain the following configs: ${possibleConfig}`);
      }
    }
    else if (typeof reader.result === 'string') {
      sendConfig('upload', type, reader.result);
    };
  };

  reader.readAsText(configFile);
}

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
 * Send the content of the given configuration file on `boost/configs/action` over MQTT
 *
 * @param type the type of the configuration being sent
 * @param configFile file containing the configuration content
 */
export default function uploadConfig(
  type: BoostConfigType,
  configFile: File,
) {
  const reader = new FileReader();

  // Called when FileReader has completed reading a file
  reader.onload = () => {
    if (typeof reader.result === 'string' ) {
    sendConfig('upload', type, reader.result);
    }
  };

  reader.readAsText(configFile);
}

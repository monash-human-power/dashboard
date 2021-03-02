import { emit } from 'api/common/socket';
import { BoostConfigType } from 'types/boost';
import toast from 'react-hot-toast';

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
  displayErr: (message: string) => void,
  configExist: (type: BoostConfigType, name: string) => boolean,
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

          // Remove the uploaded config from the `possibleConfig` list
          const i = possibleConfig.indexOf(key);
          possibleConfig.splice(i,1);
        }  
      });

      if (possibleConfig.length === 4) {
        displayErr(`${configFile.name} is not a bundle (i.e. it does not contain the 4 configs)`);
      }
      else if (possibleConfig.length !== 0) {
        displayErr(`The bundle ${configFile.name} did not contain the followinng config/s: ${possibleConfig} (The other configs were successfully uploaded)`);
      }
      else {
        toast.success(`Bundle ${configFile.name} uploaded`);
      }
    }
    else if (typeof reader.result === 'string') {
      // Single config uploaded
      const config = JSON.parse(reader.result);
      if (configExist(type, config.name)) {
        displayErr(`${configFile.name} already exists for ${type}, please change name and re-upload`);
      }
      else {
        sendConfig('upload', type, reader.result);
        toast.success(`Uploaded ${configFile.name}!`);
      }
    };
  };

  reader.readAsText(configFile);
}

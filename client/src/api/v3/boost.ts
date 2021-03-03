import { emit } from 'api/common/socket';
import { BoostConfigType } from 'types/boost';
import toast from 'react-hot-toast';

type payloadAction = 'upload' | 'delete';

/**
 * Send configuration status over MQTT on topic 'boost/configs/action'
 * 
 * @param actionType represents whether the config is being uploaded or deleted
 * @param type the type of the configuration being sent
 * @param configContent configuration content
 */
function sendConfig(actionType: payloadAction, type: BoostConfigType, configContent: string | null) {
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
 * If the content contains more than one config (i.e. `type` is 'all'), the content is
 * split into the different configurations before sending.
 *
 * @param type the type of the configuration
 * @param configFile file containing content of the configuration
 * @param displayErr function to display error if uploaded config is not correct
 * @param configExist function to check if a given config name has already been used
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
    const fileContent = reader.result as string;
    if (type === 'all') {
      const allConfigs = JSON.parse(fileContent);

      // Check that no config is repeated and that all configs are present
      let repeatedConfigs = false;
      let countConfigs = 0;
      let errMessage = 'Rename the following repeated configs and re-upload: ';
      Object.keys(allConfigs).forEach((key) => {
        if (possibleConfig.includes(key)) {
          if (configExist(key as BoostConfigType, allConfigs[key].name)) {
            if (repeatedConfigs) {
              // Need to add a comma
              errMessage = errMessage.concat(`, '${allConfigs[key].name}' in ${key} configuration`);
            }
            else {
              errMessage = errMessage.concat(`'${allConfigs[key].name}' in ${key} configuration`);
            }
            repeatedConfigs = true;
          }
          // Remove the uploaded config from the `possibleConfig` list
          const i = possibleConfig.indexOf(key);
          possibleConfig.splice(i,1);

          countConfigs += 1;
        };
      });

      if (repeatedConfigs) {
        displayErr(errMessage);
      }
      else if (possibleConfig.length === 4) {
        displayErr(`${configFile.name} is not a bundle (i.e. it does not contain the 4 configs)`);
      }
      else if (possibleConfig.length !== 0) {
        displayErr(`The bundle ${configFile.name} did not contain the following config/s (please add them and re-upload): ${possibleConfig}`);
      }
      else if (countConfigs !== 4) {
        // Exactly 4 oconfigs not provided
        displayErr(`${configFile.name} contains too many or too few configs, please ensure there are 4 configs and re-upload`);
      }
      else {
        // For each config, send the config content over MQTT
        Object.keys(allConfigs).forEach((key) => {
          sendConfig('upload', key as BoostConfigType, allConfigs[key]);
        });
          toast.success(`Uploaded configs in ${configFile.name}`);
      }
    }
    else {
      // Single config uploaded
      const config = JSON.parse(fileContent);
      if (configExist(type, config.name)) {
        displayErr(`${configFile.name} already exists for ${type}, please change the name and re-upload`);
      }
      else {
        sendConfig('upload', type, fileContent);
        toast.success(`Uploaded ${configFile.name}!`);
      }
    };
  };

  reader.readAsText(configFile);
}

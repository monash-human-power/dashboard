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
function sendConfig(
  actionType: payloadAction,
  type: BoostConfigType,
  configContent: string | null,
) {
  const channel = 'send-config';
  const payload = {
    action: actionType,
    configType: type,
    content: configContent,
  };
  // To check things work without needing the server started
  console.log(payload);
  emit(channel, JSON.stringify(payload));
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
      let errMessage = `Please rename the following repeated configs inside ${configFile.name}: `;

      type configType = { name: string };
      Object.entries(allConfigs).forEach((configEntry) => {
        const config = configEntry[1] as configType;
        const configType = configEntry[0];
        if (possibleConfig.includes(configType)) {
          if (configExist(configType as BoostConfigType, config.name)) {
            if (repeatedConfigs) {
              console.log('Adding a comma');
              // Need to add a comma
              errMessage = errMessage.concat(', ');
            }
            errMessage = errMessage.concat(
              `'${config.name}' in ${configType} configuration`,
            );
            repeatedConfigs = true;
            console.log(errMessage);
          }
          // Remove the uploaded config from the `possibleConfig` list
          const i = possibleConfig.indexOf(configType);
          possibleConfig.splice(i, 1);

          countConfigs += 1;
        }
      });

      if (repeatedConfigs) {
        displayErr(errMessage);
      } else if (possibleConfig.length === 4) {
        displayErr(
          `${configFile.name} is not a bundle (i.e. it does not contain the 4 configs)`,
        );
      } else if (possibleConfig.length !== 0) {
        displayErr(
          `The bundle ${configFile.name} did not contain the following config/s (please add them): ${possibleConfig}`,
        );
      } else if (countConfigs !== 4) {
        // Exactly 4 configs not provided
        displayErr(
          `${configFile.name} contains too many or too few configs, please ensure there are exactly 4 configs`,
        );
      } else {
        // For each config, send the config content over MQTT
        Object.keys(allConfigs).forEach((key) => {
          sendConfig('upload', key as BoostConfigType, allConfigs[key]);
        });
        toast.success(`Uploaded configs in ${configFile.name}`);
      }
    } else {
      // Single config uploaded
      const config = JSON.parse(fileContent);
      if (configExist(type, config.name)) {
        displayErr(
          `${configFile.name} already exists for ${type}, please change the name`,
        );
      } else {
        sendConfig('upload', type, fileContent);
        toast.success(`Uploaded ${configFile.name}!`);
      }
    }
  };

  reader.readAsText(configFile);
}

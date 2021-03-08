import { emit } from 'api/common/socket';
import {
  BoostConfigType,
  configBundleT,
  configObjT,
  ConfigRunType,
} from 'types/boost';
import toast from 'react-hot-toast';
import { Runtype } from 'runtypes';

type payloadAction = 'upload' | 'delete';

/**
 * Check that the given content is of the type given
 *
 * @param content the content to check for it's type
 * @param typeRequired the type the content is expected to be
 *
 * @returns true if the content satisfies the given type else false
 */
function isCorrectContentType(content: any, typeRequired: Runtype) {
  try {
    if (typeRequired.check(content)) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
}

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
 * Split the given configurations object into inidvidual configs and then send them over MQTT
 *
 * @param configs dictionary containign the 4 config types (`powerPlan`, `rider`, `track` and `bike`)
 * @param fileName name of the file that contained all the configs
 * @param displayErr function to display error message
 * @param configExist function to check if a file of the same name exists
 */
function uploadMultipleConfigs(
  configs: configBundleT,
  fileName: string,
  displayErr: (message: string) => void,
  configExist: (type: BoostConfigType, name: string) => boolean,
) {
  // Check that no config is repeated
  let repeatedConfigs = false;
  let errMessage = `Please rename the following repeated configs inside ${fileName}: `;

  Object.entries(configs).forEach((configEntry) => {
    const configType = configEntry[0] as BoostConfigType;
    const config = configObjT.check(configEntry[1]);

    if (configExist(configType, config.name)) {
      if (repeatedConfigs) {
        errMessage = errMessage.concat(', ');
      }
      errMessage = errMessage.concat(
        `'${config.name}' in ${configType} configuration`,
      );
      repeatedConfigs = true;
    }
  });

  if (repeatedConfigs) {
    displayErr(errMessage);
  } else {
    // For each config, send the config content over MQTT
    Object.entries(configs).forEach((configEntry) => {
      const configType = configEntry[0] as BoostConfigType;
      const config = configObjT.check(configEntry[1]);

      sendConfig('upload', configType, JSON.stringify(config));
    });

    toast.success(`Uploaded configs in ${fileName}`);
  }
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

  // Called when FileReader has completed reading a file
  reader.onload = () => {
    const fileContent = reader.result as string;
    const configContent = JSON.parse(fileContent);

    if (!isCorrectContentType(configContent, getConfigRunType(type))) {
      displayErr(
        `${configFile.name} is not of the correct type for ${type} config`,
      );
    } else if (type === 'bundle') {
      uploadMultipleConfigs(
        configContent,
        configFile.name,
        displayErr,
        configExist,
      );
    } else if (configExist(type, configContent.name)) {
      displayErr(
        `${configFile.name} already exists for ${type}, please select it from the options provided`,
      );
    } else {
      // Single config uploaded
      sendConfig('upload', type, fileContent);
      toast.success(`Uploaded ${configFile.name}!`);
    }
  };

  reader.readAsText(configFile);
}

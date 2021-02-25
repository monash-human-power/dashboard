import { emit } from 'api/common/socket';
import { BoostConfigType } from 'types/boost';

/**
 * Send the content of the given configuration file on `boost/configs/action` over MQTT
 *
 * @param type the type of the configuration being sent
 * @param configFile list of files, only the first would be considered
 */
export default function uploadConfig(
  type: BoostConfigType,
  configFile: File,
) {
  const topic = 'send-config';
  const reader = new FileReader();

  // Called when FileReader has completed reading a file
  reader.onload = () => {
    console.log(reader.result);
    const payload = {
      action: 'upload',
      configType: type,
      configName: configFile.name,
      content: reader.result,
    };
    emit(topic, JSON.stringify(payload).replace(/\\n/g, ''));
  };

  reader.readAsText(configFile);
}

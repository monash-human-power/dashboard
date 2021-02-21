import { emit } from 'api/common/socket';
import { BoostConfigType } from 'types/boost';

/**
 * Sends the content of the given configuration file on 'boost/configs/action' over MQTT
 * 
 * @param configType the type of the configuration being sent
 * @param configFiles list of files, only the first would be considered
 */
export default function uploadConfig(configType: BoostConfigType, configFiles: FileList) {
    const topic = 'boost/configs/action';
    const reader = new FileReader();
    
    // Called when FileReader has completed reading a file
    reader.onload = () => {
        console.log(reader.result);
        const payload = {
            "action": "upload",
            "configType": configType,
            "configName": configFiles[0].name,
            "content": reader.result,
        };
        emit(topic, JSON.stringify(payload).replace(/\\n/g, ''));
    };

    reader.readAsText(configFiles[0]);
}

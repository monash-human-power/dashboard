import { emit } from 'api/common/socket';
import { BoostConfigType } from 'types/boost';

export default function uploadConfig(configType: BoostConfigType, configFiles: FileList) {
    const topic = 'boost/configs/action';
    const reader = new FileReader();
    
    reader.onload = () => {
        console.log(reader.result);
        const payload = {
            "action": "upload",
            "configType": configType,
            "content": reader.result,
        };
        emit(topic, JSON.stringify(payload));
    };

    reader.readAsText(configFiles[0]);
}

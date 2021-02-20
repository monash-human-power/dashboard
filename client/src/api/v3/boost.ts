// import { emit } from 'api/common/socket';
import { BoostConfigType } from 'types/boost';

export default function uploadConfig(configType: BoostConfigType, configFiles: FileList) {
    const reader = new FileReader();
    reader.onload = () => {
        console.log(reader.result);
    };

    reader.readAsText(configFiles[0]);

    // const topic = "boost/configs/action";
    // const payload = {
    //     "action": "upload",
    //     "configType": configType,
    //     "content": {
    //         // json file contents here
    //     },
    // };

    // emit('submit-calibration', payload);
}

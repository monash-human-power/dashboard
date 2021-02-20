import { useState } from "react";
import { Array, Record, Static, String, Unknown } from "runtypes";
import { useChannelShaped } from "./socket";

const ModuleData = Record({
    /** Sensor data */
    sensors: Array(Record({
        /** Type of data */
        type: String,
        /** Value */
        value: Unknown
    }))
});

type _ModuleData = Static<typeof ModuleData>;

export interface ModuleData extends _ModuleData {}

/**
 * Pass on incoming data from the wireless module channel
 *
 * @param id ID of module
 * @returns Data
 */
export function useModuleData(id: number): ModuleData {
    const [data, setData] = useState<ModuleData>({ sensors: [] });

    useChannelShaped(`module-${id}-data`, ModuleData, setData);

    return data;
}

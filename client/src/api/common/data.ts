import { useState } from "react";
import { Array, Record, Static, String, Unknown } from "runtypes";
import { useChannelShaped } from "./socket";

const ModuleDataT = Record({
    /** Sensor data */
    sensors: Array(Record({
        /** Type of data */
        type: String,
        /** Value */
        value: Unknown
    }))
});

type _ModuleDataT = Static<typeof ModuleDataT>;

export interface ModuleDataT extends _ModuleDataT {}

/**
 * Pass on incoming data from the wireless module channel
 *
 * @param id ID of module
 * @returns Data
 */
export function useModuleData(id: number): ModuleDataT {
    const [data, setData] = useState<ModuleDataT>({ sensors: [] });

    useChannelShaped(`module-${id}-data`, ModuleDataT, setData);

    return data;
}

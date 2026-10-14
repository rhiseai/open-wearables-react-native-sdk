import { ConfigPlugin } from "expo/config-plugins";
export interface OpenWearablesIOSPluginProps {
    healthShareUsage?: string;
    healthUpdateUsage?: string;
}
declare const withOpenWearablesIOS: ConfigPlugin<OpenWearablesIOSPluginProps>;
export default withOpenWearablesIOS;

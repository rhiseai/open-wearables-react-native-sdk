import { ConfigPlugin } from "expo/config-plugins";
import { OpenWearablesIOSPluginProps } from "./withOpenWearablesIOS";
export type OpenWearablesPluginProps = OpenWearablesIOSPluginProps;
declare const withOpenWearables: ConfigPlugin<OpenWearablesPluginProps>;
export default withOpenWearables;

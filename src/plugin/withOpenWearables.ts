import { ConfigPlugin } from "expo/config-plugins";

import withOpenWearablesAndroid from "./withOpenWearablesAndroid";
import withOpenWearablesIOS, {
  OpenWearablesIOSPluginProps,
} from "./withOpenWearablesIOS";

export type OpenWearablesPluginProps = OpenWearablesIOSPluginProps;

const withOpenWearables: ConfigPlugin<OpenWearablesPluginProps> = (
  config,
  options = {},
) => {
  config = withOpenWearablesIOS(config, options);
  config = withOpenWearablesAndroid(config);
  return config;
};

export default withOpenWearables;

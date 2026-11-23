import {
  ConfigPlugin,
  withEntitlementsPlist,
  withInfoPlist,
} from "expo/config-plugins";

export interface OpenWearablesIOSPluginProps {
  healthShareUsage?: string;
  healthUpdateUsage?: string;
}

const withOpenWearablesIOS: ConfigPlugin<OpenWearablesIOSPluginProps> = (
  config,
  options = {},
) => {
  const {
    healthShareUsage = "Allow access to your health data.",
    healthUpdateUsage = "Allow updates to your health data.",
  } = options;

  // Add HealthKit entitlements
  config = withEntitlementsPlist(config, (config) => {
    config.modResults["com.apple.developer.healthkit"] = true;
    config.modResults["com.apple.developer.healthkit.background-delivery"] =
      true;
    return config;
  });

  // Add Info.plist usage descriptions & BGTask identifiers. The two arrays are
  // merged into what the app and other plugins already declare (remote
  // notifications, audio, their own BGTask ids) instead of replacing it.
  config = withInfoPlist(config, (config) => {
    config.modResults["NSHealthShareUsageDescription"] = healthShareUsage;
    config.modResults["NSHealthUpdateUsageDescription"] = healthUpdateUsage;

    config.modResults["UIBackgroundModes"] = [
      ...new Set([
        ...(config.modResults["UIBackgroundModes"] ?? []),
        "fetch",
        "processing",
      ]),
    ];

    config.modResults["BGTaskSchedulerPermittedIdentifiers"] = [
      ...new Set([
        // Not one of the typed InfoPlist keys, so it reads as a JSON value.
        ...((config.modResults["BGTaskSchedulerPermittedIdentifiers"] as
          | string[]
          | undefined) ?? []),
        "com.openwearables.healthsdk.task.refresh",
        "com.openwearables.healthsdk.task.process",
      ]),
    ];

    return config;
  });

  return config;
};

export default withOpenWearablesIOS;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("expo/config-plugins");
const withOpenWearablesIOS = (config, options = {}) => {
    const { healthShareUsage = "Allow access to your health data.", healthUpdateUsage = "Allow updates to your health data.", } = options;
    // Add HealthKit entitlements
    config = (0, config_plugins_1.withEntitlementsPlist)(config, (config) => {
        config.modResults["com.apple.developer.healthkit"] = true;
        config.modResults["com.apple.developer.healthkit.background-delivery"] =
            true;
        return config;
    });
    // Add Info.plist usage descriptions & BGTask identifiers
    config = (0, config_plugins_1.withInfoPlist)(config, (config) => {
        config.modResults["NSHealthShareUsageDescription"] = healthShareUsage;
        config.modResults["NSHealthUpdateUsageDescription"] = healthUpdateUsage;
        config.modResults["UIBackgroundModes"] = ["fetch", "processing"];
        config.modResults["BGTaskSchedulerPermittedIdentifiers"] = [
            "com.openwearables.healthsdk.task.refresh",
            "com.openwearables.healthsdk.task.process",
        ];
        return config;
    });
    return config;
};
exports.default = withOpenWearablesIOS;

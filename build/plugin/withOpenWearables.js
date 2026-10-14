"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const withOpenWearablesAndroid_1 = __importDefault(require("./withOpenWearablesAndroid"));
const withOpenWearablesIOS_1 = __importDefault(require("./withOpenWearablesIOS"));
const withOpenWearables = (config, options = {}) => {
    config = (0, withOpenWearablesIOS_1.default)(config, options);
    config = (0, withOpenWearablesAndroid_1.default)(config);
    return config;
};
exports.default = withOpenWearables;

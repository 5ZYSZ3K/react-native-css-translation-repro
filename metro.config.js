const { getDefaultConfig } = require("expo/metro-config");
const { withNativewind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, { isCSSEnabled: true });

config.resolver.sourceExts = [...config.resolver.sourceExts, "css"];

module.exports = withNativewind(config);

const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push("cjs"); // ✅ Fix lỗi không load file .cjs

module.exports = config;

npx create-expo-app@latest -t tabs
npx expo install expo-dev-client react-native-reanimated react-native-gesture-handler

babel.config.js
```
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

npx expo prebuild
npx expo run:android

https://www.nativewind.dev/docs/getting-started/installation


const Reanimated = require('react-native-reanimated/mock');

// Mock the `call` function
Reanimated.default.call = () => {};

module.exports = Reanimated;

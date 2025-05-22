export default {
    preset: 'ts-jest',
    testEnvironment: 'node', // or 'jsdom' if needed
    transform: {
      '^.+\\.jsx?$': 'babel-jest', // For JavaScript files
      '^.+\\.ts$': 'ts-jest', // For TypeScript files
    },
    extensionsToTreatAsEsm: ['.ts'], // Include .js if necessary
  };
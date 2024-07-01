export default {
  files: ["test/network.test.ts"],
  extensions: {
    ts: "module"
  },
  nodeArguments: [
    "--loader=ts-node/esm",
    "--experimental-specifier-resolution=node"
  ],
  nonSemVerExperiments: {
    configurableModuleFormat: true
  },
  environmentVariables: {
    NODE_NO_WARNINGS: "1"
  },
  failFast: true,
  verbose: true,
};

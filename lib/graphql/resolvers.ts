interface ResolverConfig {
  type: string;
  field: string;
}

const resolvers: Array<ResolverConfig> = [
  {
    type: "Query",
    field: "maskedAddresses",
  },
  {
    type: "Mutation",
    field: "createMaskedAddress",
  }
];

export { resolvers as ResolverConfigs };

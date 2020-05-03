interface ResolverConfig {
  type: string;
  field: string;
}

const resolvers: Array<ResolverConfig> = [
  {
    type: "Query",
    field: "maskedEmailAddresses",
  },
  {
    type: "Mutation",
    field: "createMaskedEmailAddress",
  },
];

export { resolvers as ResolverConfigs };

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
  },
  {
    type: "Mutation",
    field: "changeMaskedAddressStatus",
  },
  {
    type: "Mutation",
    field: "createForwardingAddress",
  },
  // {
  //   type: "Mutation",
  //   field: "addForwardingAddress",
  // }
];

export { resolvers as ResolverConfigs };

import { App, Stack, StackProps, RemovalPolicy } from "@aws-cdk/core";
import { Table } from "@aws-cdk/aws-dynamodb";
import { resolve } from "path";
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";
import { DynamoDbDataSource, Resolver, MappingTemplate, GraphQLApi, BaseDataSource } from "@aws-cdk/aws-appsync";
import { Construct } from "@aws-cdk/core";
import { ResolverConfigs } from "./resolvers";

interface BackendStackProps extends StackProps {
  table: Table;
}

export class BackendStack extends Stack {
  graphQlApi: GraphQLApi;
  constructor(scope: App, id: string, props: BackendStackProps) {
    super(scope, id, props);

    this.graphQlApi = new GraphQLApi(this, "GraphQlApi", {
      name: "prod-privately",
      schemaDefinitionFile: resolve(__dirname, "schema.graphql"),
    });

    const tableAccessRole = new Role(this, "TableAccessRole", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
    });

    // TODO create custom restricted policy
    tableAccessRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));

    const ddbTableDataSource = new DynamoDbDataSource(this, "DdbTableDataSource", {
      table: props.table,
      api: this.graphQlApi,
      name: "dynamodb",
      serviceRole: tableAccessRole,
    });

    ResolverConfigs.forEach((resolver) => {
      createResolver(this, this.graphQlApi, ddbTableDataSource, resolver.type, resolver.field);
    });
  }
}

const createResolver = (
  construct: Construct,
  api: GraphQLApi,
  dataSource: BaseDataSource,
  typeName: string,
  fieldName: string
) => {
  return new Resolver(construct, `${typeName}.${fieldName} Resolver`, {
    api,
    dataSource,
    fieldName,
    typeName,
    requestMappingTemplate: MappingTemplate.fromFile(
      resolve(__dirname, "mappingTemplates/", `${typeName}.${fieldName}.request.vtl`)
    ),
    responseMappingTemplate: MappingTemplate.fromFile(
      resolve(__dirname, "mappingTemplates/", `${typeName}.${fieldName}.response.vtl`)
    ),
  });
};

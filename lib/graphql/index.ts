import { App, Stack, StackProps } from "@aws-cdk/core";
import { Table } from "@aws-cdk/aws-dynamodb";
import { resolve } from "path";
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";
import { GraphqlApi, AuthorizationType } from "@aws-cdk/aws-appsync";
import { ResolverConfigs } from "./resolvers";
import { Schema } from "@aws-cdk/aws-appsync/lib/schema";
import { BaseDataSource } from "@aws-cdk/aws-appsync/lib/data-source";
import { MappingTemplate } from "@aws-cdk/aws-appsync/lib/mapping-template";

interface BackendStackProps extends StackProps {
  table: Table;
}

export class BackendStack extends Stack {
  graphQlApi: GraphqlApi;
  constructor(scope: App, id: string, props: BackendStackProps) {
    super(scope, id, props);

    this.graphQlApi = new GraphqlApi(this, "GraphQlApi", {
      name: "prod-privately",
      schema: Schema.fromAsset(resolve(__dirname, "schema.graphql")),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      }
    });

    const tableAccessRole = new Role(this, "TableAccessRole", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
    });

    const dynamodbDataSource = this.graphQlApi.addDynamoDbDataSource("ddb", props.table);

    // TODO create custom restricted policy
    tableAccessRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess"));

    ResolverConfigs.forEach((resolver) => {
      createResolver(dynamodbDataSource, resolver.type, resolver.field);
    });
  }
}

const createResolver = (
  dataSource: BaseDataSource,
  typeName: string,
  fieldName: string
) => {
  return dataSource.createResolver({
    typeName,
    fieldName,
    requestMappingTemplate: MappingTemplate.fromFile(
      resolve(__dirname, "mappingTemplates/", `${typeName}.${fieldName}.request.vtl`)
    ),
    responseMappingTemplate: MappingTemplate.fromFile(
      resolve(__dirname, "mappingTemplates/", `${typeName}.${fieldName}.response.vtl`)
    ),
  })
}

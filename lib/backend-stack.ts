import * as cdk from "@aws-cdk/core";
import * as appsync from "@aws-cdk/aws-appsync";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { resolve } from "path";
import { Role, ServicePrincipal, ManagedPolicy } from "@aws-cdk/aws-iam";
import {
  DynamoDbDataSource,
  Resolver,
  MappingTemplate,
  GraphQLApi,
  BaseDataSource,
} from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { Construct } from "@aws-cdk/core";
import { create } from "domain";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const graphqlApi = new appsync.GraphQLApi(this, "GraphQlApi", {
      name: "prod-privately",
      schemaDefinitionFile: resolve(__dirname, "schema.graphql"),
    });

    const ddbTable = new Table(this, "Table", {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // TODO disable for production
      tableName: "prod-app-table",
      partitionKey: {
        name: "partitionKey",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "sortKey",
        type: AttributeType.STRING,
      },
      readCapacity: 5,
      writeCapacity: 5,
    });

    const tableAccessRole = new Role(this, "TableAccessRole", {
      assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
    });

    // TODO create custom restricted policy
    tableAccessRole.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    const ddbTableDataSource = new DynamoDbDataSource(
      this,
      "DdbTableDataSource",
      {
        table: ddbTable,
        api: graphqlApi,
        name: "dynamodb",
        serviceRole: tableAccessRole,
      }
    );

    const query_maskedEmailAddresses = createResolver(
      this,
      graphqlApi,
      ddbTableDataSource,
      "Query",
      "maskedEmailAddresses"
    );

    const mutation_createMaskedEmailAddress = createResolver(
      this,
      graphqlApi,
      ddbTableDataSource,
      "Mutation",
      "createMaskedEmailAddress"
    );
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
      resolve(
        __dirname,
        "mappingTemplates/",
        `${typeName}.${fieldName}.request.vtl`
      )
    ),
    responseMappingTemplate: MappingTemplate.fromFile(
      resolve(
        __dirname,
        "mappingTemplates/",
        `${typeName}.${fieldName}.response.vtl`
      )
    ),
  });
};

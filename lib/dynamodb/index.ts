import { App, Stack, StackProps, RemovalPolicy } from "@aws-cdk/core";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";

export class DynamodbStack extends Stack {
  table: Table;
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.table = new Table(this, "Table", {
      removalPolicy: RemovalPolicy.DESTROY, // TODO disable for production
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
  }
}

import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { BackendStack } from "../lib/graphql";
import { DynamodbStack } from "../lib/dynamodb";

test("AppSync GraphQl API Created", () => {
  const app = new App();
  // WHEN
  const ddbStack = new DynamodbStack(app, "MyTestDdbStack");
  const stack = new BackendStack(app, "MyTestStack", { table: ddbStack.table });
  // THEN
  expectCDK(stack).to(haveResource("AWS::AppSync::GraphQLApi"));
});

test("AppSync DynamoDb Data Source Created", () => {
  const app = new App();
  // WHEN
  const ddbStack = new DynamodbStack(app, "MyTestDdbStack");
  const stack = new BackendStack(app, "MyTestStack", { table: ddbStack.table });
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "AMAZON_DYNAMODB",
    })
  );
});

test("Query.maskedEmailAddresses Resolver Created", () => {
  const app = new App();
  // WHEN
  const ddbStack = new DynamodbStack(app, "MyTestDdbStack");
  const stack = new BackendStack(app, "MyTestStack", { table: ddbStack.table });
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::Resolver", {
      TypeName: "Query",
      FieldName: "maskedEmailAddresses",
    })
  );
});

test("Mutation.createMaskedEmailAddress Resolver Created", () => {
  const app = new App();
  // WHEN
  const ddbStack = new DynamodbStack(app, "MyTestDdbStack");
  const stack = new BackendStack(app, "MyTestStack", { table: ddbStack.table });
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::Resolver", {
      TypeName: "Mutation",
      FieldName: "createMaskedEmailAddress",
    })
  );
});

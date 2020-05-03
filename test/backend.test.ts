import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import * as Backend from "../lib/backend-stack";

test("AppSync GraphQl API Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Backend.BackendStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::AppSync::GraphQLApi"));
});

test("DynamoDb Table Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Backend.BackendStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
});

test("AppSync DynamoDb Data Source Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Backend.BackendStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::DataSource", {
      Type: "AMAZON_DYNAMODB",
    })
  );
});

test("Query.maskedEmailAddresses Resolver Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Backend.BackendStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::Resolver", {
      TypeName: "Query",
      FieldName: "maskedEmailAddresses",
    })
  );
});

test("Mutation.createMaskedEmailAddress Resolver Created", () => {
  const app = new cdk.App();
  // WHEN
  const stack = new Backend.BackendStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(
    haveResource("AWS::AppSync::Resolver", {
      TypeName: "Mutation",
      FieldName: "createMaskedEmailAddress",
    })
  );
});

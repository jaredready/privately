import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { DynamodbStack } from "../lib/dynamodb";

test("Dynamodb Table Created", () => {
  const app = new App();
  // WHEN
  const stack = new DynamodbStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
});

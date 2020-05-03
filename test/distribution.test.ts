import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { App, Stack } from "@aws-cdk/core";
import { DistributionStack } from "../lib/cloudfront";
import { WebClientStack } from "../lib/webClient";
import { BackendStack } from "../lib/graphql";
import { Table, AttributeType } from "@aws-cdk/aws-dynamodb";
import { GraphQLApi } from "@aws-cdk/aws-appsync";
import { Bucket } from "@aws-cdk/aws-s3";

test("AppSync GraphQl API Created", () => {
  const app = new App();
  const stack = new Stack(app, "TestPlaceholderStack");

  // WHEN

  const bucket = new Bucket(stack, "MyTestBucket");
  const graphQlApi = new GraphQLApi(stack, "MyTestGraphQlApi", {
    name: "test-graphql",
    schemaDefinition: `
      type Query {
        foo: Boolean
      }
    `,
  });
  const distributionStack = new DistributionStack(
    app,
    "MyTestDistributionStack",
    {
      webClientBucket: bucket,
      graphQlApi,
    }
  );

  // THEN

  expectCDK(distributionStack).to(
    haveResource("AWS::CloudFront::Distribution")
  );
});

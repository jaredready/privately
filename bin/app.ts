#!/usr/bin/env node
import { App } from "@aws-cdk/core";
import { BackendStack } from "../lib/graphql";
import { WebClientStack } from "../lib/webClient";
import { DistributionStack } from "../lib/cloudfront";
import { DynamodbStack } from "../lib/dynamodb";

const app = new App();
const ddbStack = new DynamodbStack(app, "DynamodbStack");
const backendStack = new BackendStack(app, "BackendStack", {
  table: ddbStack.table,
});
const webClientStack = new WebClientStack(app, "WebClientStack");
const distributionStack = new DistributionStack(app, "DistributionStack", {
  webClientBucket: webClientStack.bucket,
  graphQlApi: backendStack.graphQlApi,
});

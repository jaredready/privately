import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { WebClientStack } from "../lib/web-client-stack";

test("AppSync GraphQl API Created", () => {
  const app = new App();
  // WHEN
  const stack = new WebClientStack(app, "MyTestStack");
  // THEN
  expectCDK(stack).to(haveResource("AWS::S3::Bucket"));
});

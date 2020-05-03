import { expect as expectCDK, haveResource } from "@aws-cdk/assert";
import { App } from "@aws-cdk/core";
import { DistributionStack } from "../lib/distribution-stack";
import { WebClientStack } from "../lib/web-client-stack";

test("AppSync GraphQl API Created", () => {
  const app = new App();
  // WHEN
  const webClientStack = new WebClientStack(app, "MyTestWebClientStack");
  const stack = new DistributionStack(
    app,
    "MyTestDistributionStack",
    webClientStack.bucket
  );
  // THEN
  expectCDK(stack).to(haveResource("AWS::CloudFront::Distribution"));
});

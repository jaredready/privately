import { Stack, App, StackProps } from "@aws-cdk/core";
import { CloudFrontWebDistribution } from "@aws-cdk/aws-cloudfront";
import { Bucket } from "@aws-cdk/aws-s3";

export class DistributionStack extends Stack {
  constructor(
    scope: App,
    id: string,
    webClientBucket: Bucket,
    props?: StackProps
  ) {
    super(scope, id, props);

    const distribution = new CloudFrontWebDistribution(this, "Distribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: webClientBucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
    });
  }
}

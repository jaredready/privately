import { Stack, App, StackProps, Fn } from "@aws-cdk/core";
import {
  CloudFrontWebDistribution,
  CloudFrontAllowedMethods,
  OriginProtocolPolicy,
} from "@aws-cdk/aws-cloudfront";
import { Bucket } from "@aws-cdk/aws-s3";
import { GraphQLApi } from "@aws-cdk/aws-appsync";

interface DistributionStackProps extends StackProps {
  webClientBucket: Bucket;
  graphQlApi: GraphQLApi;
}

export class DistributionStack extends Stack {
  constructor(scope: App, id: string, props: DistributionStackProps) {
    super(scope, id, props);

    const distribution = new CloudFrontWebDistribution(this, "Distribution", {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: props.webClientBucket,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
        {
          customOriginSource: {
            // TODO make this better somehow...
            domainName: Fn.select(
              2,
              Fn.split("/", props.graphQlApi.graphQlUrl)
            ),
            originProtocolPolicy: OriginProtocolPolicy.HTTPS_ONLY,
          },
          behaviors: [
            {
              allowedMethods: CloudFrontAllowedMethods.ALL,
              pathPattern: "/graphql",
            },
          ],
        },
      ],
    });
  }
}

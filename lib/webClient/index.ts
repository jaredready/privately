import { Stack, App, StackProps, RemovalPolicy } from "@aws-cdk/core";
import { Bucket, BlockPublicAccess } from "@aws-cdk/aws-s3";
import { PolicyStatement, AnyPrincipal } from "@aws-cdk/aws-iam";

export class WebClientStack extends Stack {
  bucket: Bucket;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.bucket = new Bucket(this, "WebClientBucket", {
      removalPolicy: RemovalPolicy.DESTROY, // TODO remove this for prod
      blockPublicAccess: new BlockPublicAccess({ blockPublicPolicy: false }),
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html",
    });

    this.bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [`${this.bucket.bucketArn}/*`],
        principals: [new AnyPrincipal()],
      })
    );
  }
}

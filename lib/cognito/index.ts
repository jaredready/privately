import { App, Stack, StackProps, RemovalPolicy } from "@aws-cdk/core";
import { UserPool } from "@aws-cdk/aws-cognito"

export class CognitoStack extends Stack {
  userPool: UserPool;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.userPool = new UserPool(this, "UserPool", {
      userPoolName: "privately"
    })
  }
}

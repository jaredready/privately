import { App, Stack, StackProps, RemovalPolicy } from "@aws-cdk/core";
import { UserPool, VerificationEmailStyle } from "@aws-cdk/aws-cognito"

export class CognitoStack extends Stack {
  userPool: UserPool;

  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);

    this.userPool = new UserPool(this, "UserPool", {
      userPoolName: "privately",
      selfSignUpEnabled: true,
      signInAliases: {
        email: true
      },
      userVerification: {
        emailSubject: 'Verify your email for Privately!',
        emailBody: 'Thanks for signing up to Privately! Your verification code is {####}',
        emailStyle: VerificationEmailStyle.CODE,
      }
    })
  }
}

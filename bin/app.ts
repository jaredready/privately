#!/usr/bin/env node
import { App } from "@aws-cdk/core";
import { BackendStack } from "../lib/backend-stack";
import { WebClientStack } from "../lib/web-client-stack";
import { DistributionStack } from "../lib/distribution-stack";

const app = new App();
new BackendStack(app, "BackendStack");
const webClientStack = new WebClientStack(app, "WebClientStack");
new DistributionStack(app, "DistributionStack", webClientStack.bucket);

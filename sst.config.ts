import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import { HostedZone } from "aws-cdk-lib/aws-route53";

const hostedZoneDomainName = "robavo.net";
const domainName = "robavo.net";

export default {
  config(_input) {
    return {
      name: "t3-sst-example",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const hostedZone = HostedZone.fromLookup(stack, "HostedZone", {
        domainName: hostedZoneDomainName,
      });
      const certificate = new Certificate(stack, "ACM_Cert", {
        domainName,
        validation: CertificateValidation.fromDns(hostedZone),
      });
      const site = new NextjsSite(stack, "site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL ?? "",
        },
        cdk: {
          server: {
            logRetention: RetentionDays.ONE_MONTH,
          },
        },
        timeout: 30,
        memorySize: 2048,
        customDomain: {
          isExternalDomain: true,
          domainName: "robavo.net",
          cdk: {
            certificate,
          },
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

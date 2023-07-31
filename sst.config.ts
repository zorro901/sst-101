import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import { RetentionDays } from "aws-cdk-lib/aws-logs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

export default {
  config(_input) {
    return {
      name: "t3-sst-example",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL ?? "",
        },
        cdk: {
          server: {
            logRetention: RetentionDays.ONE_MONTH,
          },
        },
        customDomain: {
          isExternalDomain: true,
          domainName: "robavo.net",
          cdk: {
            certificate: Certificate.fromCertificateArn(
              stack,
              "Certificate",
              process.env.AWS_CERTIFICATE_ARN ?? ""
            ),
          },
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;

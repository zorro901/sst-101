import { type SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import * as acm from "aws-cdk-lib/aws-certificatemanager";

export default {
  config(_input) {
    return {
      name: "t3-sst",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const certificate = acm.Certificate.fromCertificateArn(
        stack,
        "Certificate",
        process.env.AWS_CERTIFICATE_ARN ?? "",
      );
      const site = new NextjsSite(stack, "site", {
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
        },
        customDomain: {
          isExternalDomain: true,
          domainName: "www.robavo.net",
          alternateNames: ["robavo.net"],
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
